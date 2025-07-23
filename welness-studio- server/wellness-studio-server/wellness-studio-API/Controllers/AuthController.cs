using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using wellness_studio_Application.DTOs;
using wellness_studio_Domain.Entities;
using wellness_studio_Domain.Interfaces;

namespace wellness_studio_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            _configuration = configuration;
            _unitOfWork = unitOfWork;  // Inject IUnitOfWork
            _passwordHasher = new PasswordHasher<User>();
        }

    

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Validate user credentials (check against database using UserService)
            var user = await _unitOfWork.UserService.ValidateUserCredentialsAsync(loginDto.Username, loginDto.Password);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            // Verify if the entered password matches the stored hash
            //var result = _passwordHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

            //if (result == PasswordVerificationResult.Failed)
            //{
            //    return Unauthorized("Invalid username or password");
            //}


            var now = DateTime.UtcNow;
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                 new Claim(JwtRegisteredClaimNames.Iat, EpochTime.GetIntDate(now).ToString(), ClaimValueTypes.Integer64)  // Correctly add 'iat' claim
            };

            var key = _configuration["Jwt:Key"];
            var creds = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha512);
            var accessToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpirationMinutes"])),
                signingCredentials: creds
            );

            var refreshToken = GenerateRefreshToken();
            await _unitOfWork.RefreshTokenRepository.SaveRefreshTokenAsync(user.UserId, refreshToken);  // Save refresh token to DB

            var tokenString = new JwtSecurityTokenHandler().WriteToken(accessToken);
            await _unitOfWork.SaveAsync();  // Commit changes

            return Ok(new
            {
                Role = user.Role,
                AccessToken = tokenString,
                RefreshToken = refreshToken,
                UserId = user.UserId,
               
            });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            var storedRefreshToken = await _unitOfWork.RefreshTokenRepository.GetRefreshTokenAsync(refreshTokenDto.RefreshToken);

            if (storedRefreshToken == null || storedRefreshToken.ExpiryDate <= DateTime.Now)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var user = await _unitOfWork.UserService.GetUserByIdAsync(storedRefreshToken.UserId);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var newAccessToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpirationMinutes"])),
                signingCredentials: creds
            );

            var newRefreshToken = GenerateRefreshToken();
            await _unitOfWork.RefreshTokenRepository.SaveRefreshTokenAsync(user.UserId, newRefreshToken);  // Save new refresh token to DB

            var newTokenString = new JwtSecurityTokenHandler().WriteToken(newAccessToken);
            await _unitOfWork.SaveAsync();  // Commit changes

            return Ok(new
            {
                AccessToken = newTokenString,
                RefreshToken = newRefreshToken
            });
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];  // Generates a secure random token
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }
    }
}
