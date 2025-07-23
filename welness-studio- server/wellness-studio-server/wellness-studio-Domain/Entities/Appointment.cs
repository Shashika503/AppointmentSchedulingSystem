namespace wellness_studio_Domain.Entities
{
    public class Appointment
    {
        public int AppointmentId { get; set; }
        public int UserId { get; set; }  // Foreign key for User (Client)
        public int TimeSlotId { get; set; }  // Foreign key for TimeSlot
        public DateTime AppointmentDate { get; set; }
        public string ClientName { get; set; }
        public string ClientEmail { get; set; }
        public string Status { get; set; }  // "Booked" or "Cancelled"

        public User User { get; set; }
        public TimeSlot TimeSlot { get; set; }
    }
}
