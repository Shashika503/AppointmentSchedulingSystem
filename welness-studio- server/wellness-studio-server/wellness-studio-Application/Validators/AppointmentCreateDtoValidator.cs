using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Application.DTOs;

namespace wellness_studio_Application.Validators
{
    public class AppointmentCreateDtoValidator : AbstractValidator<AppointmentDto>
    {
        public AppointmentCreateDtoValidator()
        {
            RuleFor(x => x.ClientName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.ClientEmail).NotEmpty().EmailAddress();
            RuleFor(x => x.AppointmentDate).GreaterThan(DateTime.Today);
            RuleFor(x => x.TimeSlotId).GreaterThan(0);
        }
    }

}
