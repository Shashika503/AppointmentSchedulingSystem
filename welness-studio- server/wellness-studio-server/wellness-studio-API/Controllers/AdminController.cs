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
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IValidator<TimeSlotDto> _timeSlotDtoValidator;  // Inject the validator

        public AdminController(IUnitOfWork unitOfWork, IMapper mapper, IValidator<TimeSlotDto> timeSlotDtoValidator)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _timeSlotDtoValidator = timeSlotDtoValidator;  // Initialize the validator
        }

        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots()
        {
            var availableSlots = await _unitOfWork.TimeSlotRepository.GetAvailableTimeSlots(); // Get future available time slots
            // Use AutoMapper to map the TimeSlot entities to TimeSlotDto
            var timeSlotDtos = _mapper.Map<IEnumerable<TimeSlotDto>>(availableSlots);
            return Ok(timeSlotDtos); // Return the mapped DTOs
        }

        // 1. Add a new time slot
        [HttpPost("add-time-slot")]
        public async Task<IActionResult> AddTimeSlot([FromBody] TimeSlotDto timeSlotDto)
        {
            // Validate the TimeSlotDto using FluentValidation
            var validationResult = await _timeSlotDtoValidator.ValidateAsync(timeSlotDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);  // Return validation errors
            }

            timeSlotDto.Date = timeSlotDto.StartTime;
            // Map TimeSlotDto to TimeSlot entity using AutoMapper
            var timeSlot = _mapper.Map<TimeSlot>(timeSlotDto);

            // Add the time slot to the repository and save to the database
            await _unitOfWork.TimeSlotRepository.AddTimeSlot(timeSlot);
            await _unitOfWork.SaveAsync();

            // Return the added TimeSlot entity as part of the response
            return Ok(new
            {
                message = "Time slot added successfully.",
                timeSlot = timeSlot // Return the added TimeSlot entity
            });
        }


        // 2. Edit an existing time slot
        [HttpPut("edit-time-slot/{id}")]
        public async Task<IActionResult> EditTimeSlot(int id, [FromBody] TimeSlotDto timeSlotDto)
        {
            // Validate the TimeSlotDto using FluentValidation
            var validationResult = await _timeSlotDtoValidator.ValidateAsync(timeSlotDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);  // Return validation errors
            }

            var timeSlot = await _unitOfWork.TimeSlotRepository.GetTimeSlotById(id);
            if (timeSlot == null)
            {
                return NotFound("Time slot not found.");
            }

            timeSlotDto.TimeSlotId = id;

            // Map TimeSlotDto to existing TimeSlot entity using AutoMapper
            _mapper.Map(timeSlotDto, timeSlot);


            await _unitOfWork.TimeSlotRepository.UpdateTimeSlot(timeSlot);
            await _unitOfWork.SaveAsync();
            return Ok("Time slot updated successfully.");
        }

        // 3. Delete a time slot
        [HttpDelete("delete-time-slot/{id}")]
        public async Task<IActionResult> DeleteTimeSlot(int id)
        {
            var timeSlot = await _unitOfWork.TimeSlotRepository.GetTimeSlotById(id);
            if (timeSlot == null)
            {
                return NotFound("Time slot not found.");
            }

            _unitOfWork.TimeSlotRepository.DeleteTimeSlot(timeSlot);
            await _unitOfWork.SaveAsync();
            return Ok("Time slot deleted successfully.");
        }

        // 4. View all booked appointments
        [HttpGet("booked-appointments")]
        public async Task<IActionResult> GetAllBookedAppointments()
        {
            var appointments = await _unitOfWork.AppointmentRepository.GetAllAsync();

            // Map appointments to AppointmentDto using AutoMapper
            var appointmentDtos = _mapper.Map<IEnumerable<AppointmentDto>>(appointments);

            return Ok(appointmentDtos);
        }

        // 5. Cancel an appointment
        [HttpDelete("cancel-appointment/{id}")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var appointment = await _unitOfWork.AppointmentRepository.GetByIdAsync(id);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            var timeSlot = await _unitOfWork.TimeSlotRepository.GetTimeSlotById(appointment.TimeSlotId);
            if (timeSlot != null)
            {
                timeSlot.IsAvailable = true;  // Mark time slot as available again
            }

            _unitOfWork.AppointmentRepository.DeleteAsync(appointment);
            await _unitOfWork.SaveAsync();
            return Ok("Appointment canceled successfully.");
        }
    }
}
