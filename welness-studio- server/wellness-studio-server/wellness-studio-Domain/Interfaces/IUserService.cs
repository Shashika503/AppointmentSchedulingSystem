using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Domain.Entities;


namespace wellness_studio_Domain.Interfaces
{
    public interface IUserService
    {
        Task<User> ValidateUserCredentialsAsync(string username, string password);
        Task<User> GetUserByIdAsync(int userId);
    }
}
