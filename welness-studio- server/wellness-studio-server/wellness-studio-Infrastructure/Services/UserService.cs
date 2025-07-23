using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Domain.Entities;
using wellness_studio_Domain.Interfaces;
using wellness_studio_Infrastructure.Data;

namespace wellness_studio_Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public UserService(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            
        }

        // Validate user credentials (username and password)
        public async Task<User> ValidateUserCredentialsAsync(string username, string password)
        {
            // Replace this with proper password hashing mechanism
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Username == username && u.Password == password);
            return user;
        }

        // Get user by their ID
        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .SingleOrDefaultAsync(u => u.UserId == userId);
        }

        //public bool VerifyPassword(User user, string enteredPassword)
        //{
        //    var result = _passwordHasher.VerifyHashedPassword(user, user.Password, enteredPassword);

        //    // VerifyHashedPassword returns:
        //    // - PasswordVerificationResult.Success if the password is correct
        //    // - PasswordVerificationResult.Failed if the password is incorrect
        //    return result == PasswordVerificationResult.Success;
        //}
    }
}
