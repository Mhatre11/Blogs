using System.ComponentModel.DataAnnotations;

namespace BlogApi.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public required string Password { get; set; }

        public string Role { get; set; } = "user"; // Default role is user
    }
}