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
    public class TimeSlotRepository : ITimeSlotRepository
    {
        private readonly AppDbContext _context;

        public TimeSlotRepository(AppDbContext context)
        {
            _context = context;
        }

        // Get all available time slots (future slots with IsAvailable = true)
        public async Task<IEnumerable<TimeSlot>> GetAvailableTimeSlots()
        {
            return await _context.TimeSlots
                .Where(ts => ts.IsAvailable && ts.Date >= DateTime.Now)  // Compare with only the date part of today
                .OrderBy(ts => ts.Date)
                .ToListAsync();
        }


        // Get time slot by its ID
        public async Task<TimeSlot> GetTimeSlotById(int id)
        {
            return await _context.TimeSlots
                .FirstOrDefaultAsync(ts => ts.TimeSlotId == id);
        }

        // Add a new time slot
        public async Task AddTimeSlot(TimeSlot timeSlot)
        {
            _context.TimeSlots.Add(timeSlot);
           
        }

        // Update an existing time slot
        public async Task UpdateTimeSlot(TimeSlot timeSlot)
        {
            _context.TimeSlots.Update(timeSlot);
            
        }

        // Delete a time slot
        public async Task DeleteTimeSlot(TimeSlot timeSlot)
        {
            _context.TimeSlots.Remove(timeSlot);
            
        }
    }
}
