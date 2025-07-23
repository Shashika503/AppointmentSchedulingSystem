using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wellness_studio_Domain.Interfaces;
using wellness_studio_Infrastructure.Data;
using wellness_studio_Infrastructure.Repositories;
using wellness_studio_Infrastructure.Services;

namespace wellness_studio_Infrastructure.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IUserService _userService;
        private readonly IConfiguration _configuration;
        private IAppointmentRepository _appointmentRepository;
        private IRefreshTokenRepository _refreshTokenRepository;
        private ITimeSlotRepository _timeSlotRepository;

        public UnitOfWork(AppDbContext context, IUserService userService , IConfiguration configuration)
        {
            _context = context;
            _userService = userService;
            _configuration = configuration;

        }

        public ITimeSlotRepository TimeSlotRepository
        {
            get
            {
                return _timeSlotRepository ??= new TimeSlotRepository(_context);  // Lazy load the TimeSlotRepository
            }
        }

        public IUserService UserService => _userService ??= new UserService(_context);  // Lazy load the UserService
        public IRefreshTokenRepository RefreshTokenRepository =>
            _refreshTokenRepository ??= new RefreshTokenRepository(_context , _configuration);

        public IAppointmentRepository AppointmentRepository => _appointmentRepository ??= new AppointmentRepository(_context);

        public async Task<int> SaveAsync() => await _context.SaveChangesAsync();

        public void Dispose() => _context.Dispose();
    }

}
