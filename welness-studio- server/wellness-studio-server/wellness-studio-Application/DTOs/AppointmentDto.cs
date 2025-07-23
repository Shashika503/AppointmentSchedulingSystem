namespace wellness_studio_Application.DTOs
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }

        public int UserId { get; set; }
        public string ClientName { get; set; }
        public string ClientEmail { get; set; }
        public DateTime AppointmentDate { get; set; }
        

        public int TimeSlotId { get; set; }
        public string Status { get; set; }
    }


}
