using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace wellness_studio_Domain.Entities
{


    public class User
    {
       
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }  // Username for login
        public string Password { get; set; }  // Plaintext password (consider using hashed password in production)
        public string Role { get; set; }  // Role of the user (e.g., Admin, Client)
    }


}
