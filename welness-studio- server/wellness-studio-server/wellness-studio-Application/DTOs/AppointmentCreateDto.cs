using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace wellness_studio_Application.DTOs
{
    public class AppointmentCreateDto
    {
        public string ClientName { get; set; }
        public string ClientEmail { get; set; }
        public DateTime AppointmentDate { get; set; }
        public int TimeSlotId { get; set; }
    }

}
