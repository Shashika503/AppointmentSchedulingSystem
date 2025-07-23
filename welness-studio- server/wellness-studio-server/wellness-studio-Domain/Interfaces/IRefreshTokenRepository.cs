using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Domain.Entities;

namespace wellness_studio_Domain.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task SaveRefreshTokenAsync(int userId, string refreshToken);  // Async method
        Task<RefreshToken> GetRefreshTokenAsync(string refreshToken);   // Async method
    }

}
