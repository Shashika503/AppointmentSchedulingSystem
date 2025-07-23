using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Application.DTOs;
using wellness_studio_Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace wellness_studio_Application.MappingProfiles
{
    public class AppointmentProfile : Profile
    {
        public AppointmentProfile()
        {
            CreateMap<Appointment, AppointmentDto>(); // Map from Appointment entity to AppointmentDto
            CreateMap<AppointmentDto, Appointment>(); // Map from AppointmentDto to Appointment entity

            CreateMap<TimeSlot, TimeSlotDto>(); // Map from TimeSlot entity to TimeSlotDto
            CreateMap<TimeSlotDto, TimeSlot>(); // Map from TimeSlotDto to TimeSlot entity
        }
    }
}
