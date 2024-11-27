using BlogApi.Data;
using BlogApi.Dto;
using BlogApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IRepository<Blog> _repository;

        public BlogController(IRepository<Blog> repository)
        {
            _repository = repository;
        }

        //  Get all blogs 
        [HttpGet]
        public async Task<IActionResult> GetAllBlogs()

        {
            try
            {
                var blogs = await _repository.GetAllAsync();
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Get blog by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            try
            {
                var blog = await _repository.GetByIdAsync(id);
                if (blog == null) return NotFound();
                return Ok(blog);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Add blog

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddBlog([FromBody] BlogDto blogDto)
        {
            try
            {
                var blog = new Blog()
                {
                    CategoryId = blogDto.CategoryId,
                    IsFeatured = blogDto.IsFeatured,
                    Content = blogDto.Content,
                    Title = blogDto.Title,
                    Description = blogDto.Description,
                    Image = blogDto.Image
                };
                var newBlog = await _repository.AddAsync(blog);
                return CreatedAtAction(nameof(GetBlogById), new { id = newBlog.BlogId }, newBlog);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Update blog

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromBody] BlogDto blog)
        {
            try
            {
                var existingBlog = await _repository.GetByIdAsync(id);
                if (existingBlog == null) return Problem(title: "Blog not found", statusCode: 404, detail: "Blog not found", type: "error");
                existingBlog.Title = blog.Title;
                existingBlog.Description = blog.Description;
                existingBlog.Content = blog.Content;
                existingBlog.Image = blog.Image;
                existingBlog.IsFeatured = blog.IsFeatured;

                var updatedBlog = await _repository.UpdateAsync(existingBlog);
                await _repository.SaveChangesAsync();
                return Ok(updatedBlog);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Delete blog
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _repository.GetByIdAsync(id);
            if (blog == null) return NotFound();
            await _repository.DeleteAsync(id);
            await _repository.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedBlogs()
        {
            try
            {
                var blogs = await _repository.GetAllAsync(x => x.IsFeatured == true);
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                // return BadRequest(ex.Message);
                return Problem(title: ex.Message, statusCode: 500, detail: ex.StackTrace, type: "error");
            }
        }

    }
}