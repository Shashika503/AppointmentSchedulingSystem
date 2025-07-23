using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;  // Add this import to use IConfiguration
using System;
using wellness_studio_Domain.Entities;
using wellness_studio_Domain.Interfaces;
using wellness_studio_Infrastructure.Data;

namespace wellness_studio_Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;  // Declare a field for IConfiguration

        public RefreshTokenRepository(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;  // Initialize the configuration field
        }

        public async Task SaveRefreshTokenAsync(int userId, string refreshToken)
        {
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                ExpiryDate = DateTime.Now.AddDays(7),  // Example: 7 days expiry
                UserId = userId
            };

            // Add the refresh token to the DbContext
            await _context.RefreshTokens.AddAsync(refreshTokenEntity);
            await _context.SaveChangesAsync();  // Save changes asynchronously
        }

        // Get refresh token asynchronously
        public async Task<RefreshToken> GetRefreshTokenAsync(string refreshToken)
        {
            return await _context.RefreshTokens
                .SingleOrDefaultAsync(rt => rt.Token == refreshToken);  // Get token asynchronously
        }
    }
}
