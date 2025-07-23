using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace wellness_studio_Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IAppointmentRepository AppointmentRepository { get; }
        IUserService UserService { get; }
        IRefreshTokenRepository RefreshTokenRepository { get; }

        ITimeSlotRepository TimeSlotRepository { get; }
        Task<int> SaveAsync();
    }

}
