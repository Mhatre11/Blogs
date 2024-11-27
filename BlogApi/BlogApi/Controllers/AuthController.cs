using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BlogApi.Data;
using BlogApi.Dto;
using BlogApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> _repository;
        private readonly IConfiguration _configuration;

        public AuthController(IRepository<User> repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = (await _repository.GetAllAsync(x => x.Email == loginDto.Email)).FirstOrDefault();
            if (user != null && user.Password == loginDto.Password)
            {
                var claims = new List<Claim>
                {
                    new(ClaimTypes.Email, user.Email),
                    new(ClaimTypes.Role, user.Role),
                    new("userId", user.UserId.ToString()),
                    new("name", user.Name)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpiryInDays"])),
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                var response = new
                {
                    accessToken = tokenString,
                    user = new
                    {
                        id = user.UserId,
                        email = user.Email,
                        name = user.Name,
                        role = user.Role
                    }
                };

                return Ok(response);
            }
            else
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }
        }

        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] LoginDto loginDto)
        {
            try
            {
                // Check if any admin exists
                var existingAdmin = await _repository.GetAllAsync(x => x.Role == "admin");
                if (existingAdmin.Any())
                {
                    return BadRequest("Admin user already exists");
                }

                var adminUser = new User
                {
                    Email = loginDto.Email,
                    Password = loginDto.Password, // In production, this should be hashed
                    Name = "Admin",
                    Role = "admin"
                };

                await _repository.AddAsync(adminUser);
                return Ok("Admin user created successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}