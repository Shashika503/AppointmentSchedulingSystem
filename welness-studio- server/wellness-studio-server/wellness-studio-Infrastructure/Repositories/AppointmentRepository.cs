using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Domain.Entities;
using wellness_studio_Domain.Interfaces;
using wellness_studio_Infrastructure.Data;

namespace wellness_studio_Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AppDbContext _context;

        public AppointmentRepository(AppDbContext context)
        {
            _context = context;
        }

        // Add a new appointment
        public async Task AddAsync(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
        }

        // Get an appointment by its ID
        public async Task<Appointment> GetByIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.TimeSlot) // Include related time slot
                .SingleOrDefaultAsync(a => a.AppointmentId == id);
        }

        // Get appointments by client email
        public async Task<IEnumerable<Appointment>> GetAppointmentsByUserIdAsync(int userId)
        {
            return await _context.Appointments
                .Where(a => a.UserId == userId)
                .Include(a => a.TimeSlot)
                .ToListAsync();
        }

        // Get all appointments for the Admin
        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            return await _context.Appointments
                .Include(a => a.TimeSlot)
                .ToListAsync();
        }

        // Delete an appointment
        public async Task DeleteAsync(Appointment appointment)
        {
            _context.Appointments.Remove(appointment);
        }
    }

}
