using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Domain.Entities;

namespace wellness_studio_Domain.Interfaces
{
    public interface IAppointmentRepository
    {
        Task AddAsync(Appointment appointment);
        Task<Appointment> GetByIdAsync(int id);
        Task<IEnumerable<Appointment>> GetAppointmentsByUserIdAsync(int userId);
        Task<IEnumerable<Appointment>> GetAllAsync(); // To get all appointments (for Admin)
        Task DeleteAsync(Appointment appointment);
    }

}
