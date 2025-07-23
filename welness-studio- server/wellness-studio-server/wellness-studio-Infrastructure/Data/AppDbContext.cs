using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using wellness_studio_Domain.Entities;

namespace wellness_studio_Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        private readonly PasswordHasher<User> _passwordHasher;
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            _passwordHasher = new PasswordHasher<User>();

        }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the UserId as auto-increment (identity column)
            modelBuilder.Entity<User>()
                .Property(u => u.UserId)
                .ValueGeneratedOnAdd()  // Auto increment
                .UseIdentityColumn();  // Ensures it behaves as an identity column

            // Foreign Key Relationship for Appointment and User
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.TimeSlot)
                .WithMany()
                .HasForeignKey(a => a.TimeSlotId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed initial Users (Admin and Client)
            //modelBuilder.Entity<User>().HasData(
            //    new User
            //    {
            //        UserId = 1,
            //        Username = "admin",
            //        Email = "admin@wellness.com",
            //        Password = "admin123", // Make sure to hash the password in production!
            //        Role = "Admin"
            //    },
            //    new User
            //    {
            //        UserId = 2,
            //        Username = "client1",
            //        Email = "client@gmail.com",
            //        Password = "client123",  // Again, hash the password in production!
            //        Role = "Client"
            //    }
            //);
        }
    }
}
