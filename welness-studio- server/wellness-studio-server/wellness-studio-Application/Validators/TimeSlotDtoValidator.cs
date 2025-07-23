using FluentValidation;
using System;
using wellness_studio_Application.DTOs;

namespace wellness_studio_Application.Validators
{
    public class TimeSlotDtoValidator : AbstractValidator<TimeSlotDto>
    {
        public TimeSlotDtoValidator()
        {
            RuleFor(x => x.StartTime).NotEmpty().GreaterThan(DateTime.Now); // StartTime must be in the future
            RuleFor(x => x.EndTime).NotEmpty().GreaterThan(x => x.StartTime); // EndTime must be after StartTime
            RuleFor(x => x.IsAvailable).NotNull();  // Ensure IsAvailable is not null
        }
    }
}
