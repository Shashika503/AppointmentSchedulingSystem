using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Domain.Entities;

namespace wellness_studio_Domain.Interfaces
{
    public interface ITimeSlotRepository
    {
        Task<IEnumerable<TimeSlot>> GetAvailableTimeSlots();  // Get all available time slots
        Task<TimeSlot> GetTimeSlotById(int id);  // Get time slot by Id
        Task AddTimeSlot(TimeSlot timeSlot);  // Add a new time slot
        Task UpdateTimeSlot(TimeSlot timeSlot);  // Update an existing time slot
        Task DeleteTimeSlot(TimeSlot timeSlot);  // Delete a time slot
    }
}
