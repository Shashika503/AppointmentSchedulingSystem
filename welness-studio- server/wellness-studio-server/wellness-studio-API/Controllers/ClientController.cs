using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using wellness_studio_Application.DTOs;
using wellness_studio_Application.Validators;
using wellness_studio_Domain.Entities;
using wellness_studio_Domain.Interfaces;

namespace wellness_studio_API.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Client")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;  // Inject IMapper to use AutoMapper
          
        public ClientController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;  // Initialize AutoMapper
        }

        // 1. View available appointment slots (future slots only)
        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots()
        {
            var availableSlots = await _unitOfWork.TimeSlotRepository.GetAvailableTimeSlots(); // Get future available time slots
            // Use AutoMapper to map the TimeSlot entities to TimeSlotDto
            var timeSlotDtos = _mapper.Map<IEnumerable<TimeSlotDto>>(availableSlots);
            return Ok(timeSlotDtos); // Return the mapped DTOs
        }

        // 2. Book an appointment
        [HttpPost("book-appointment")]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentDto appointmentDto)
        {
            // Validate the incoming model (appointmentDto)
            var validator = new AppointmentCreateDtoValidator();
            var validationResult = await validator.ValidateAsync(appointmentDto);  // Validate using FluentValidation

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);  // Return validation errors if any
            }

            // Fetch the TimeSlot by ID
            var timeSlot = await _unitOfWork.TimeSlotRepository.GetTimeSlotById(appointmentDto.TimeSlotId);

            if (timeSlot == null || !timeSlot.IsAvailable)
            {
                return BadRequest("The selected time slot is not available.");
            }

            // Map the AppointmentDto to the Appointment entity using AutoMapper
            var appointment = _mapper.Map<Appointment>(appointmentDto);
            appointment.TimeSlot = timeSlot;

            // Add the appointment to the repository and save it
            await _unitOfWork.AppointmentRepository.AddAsync(appointment);
            timeSlot.IsAvailable = false;  // Mark the time slot as unavailable
            await _unitOfWork.SaveAsync();

            // Return the appointment details as part of the response
            var appointmentResponse = _mapper.Map<AppointmentDto>(appointment);  // Convert the entity back to a DTO

            return Ok(new
            {
                message = "Appointment successfully booked.",
                appointment = appointmentResponse  // Return the created appointment data
            });
        }


        // 3. View booked appointments
        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetMyAppointments([FromQuery] int userId)
        {
            var appointments = await _unitOfWork.AppointmentRepository
                .GetAppointmentsByUserIdAsync(userId); // Fetch by client email

            // Use AutoMapper to map the Appointment entities to AppointmentDto
            var appointmentDtos = _mapper.Map<IEnumerable<AppointmentDto>>(appointments);

            return Ok(appointmentDtos); // Return the mapped DTOs
        }
    }
}
