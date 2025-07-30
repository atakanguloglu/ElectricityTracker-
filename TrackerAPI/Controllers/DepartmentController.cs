using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Models;
using ElectricityTrackerAPI.DTOs;
using ElectricityTrackerAPI.Data;

namespace ElectricityTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : BaseController
    {
        public DepartmentController(ApplicationDbContext context, ILogger<DepartmentController> logger) 
            : base(context, logger)
        {
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> CreateDepartment([FromBody] DepartmentCreateDto createDto)
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var department = new Department
            {
                Name = createDto.Name,
                Description = createDto.Description,
                ManagerName = createDto.ManagerName,
                ManagerEmail = createDto.ManagerEmail,
                TenantId = tenantId.Value,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Department created successfully", 
                departmentId = department.Id 
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var departments = await _context.Departments
                .Where(d => d.TenantId == tenantId.Value && d.IsActive)
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Description,
                    d.ManagerName,
                    d.ManagerEmail,
                    UserCount = d.Users.Count,
                    FacilityCount = d.Facilities.Count,
                    d.CreatedAt
                })
                .ToListAsync();

            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var department = await _context.Departments
                .Include(d => d.Users)
                .Include(d => d.Facilities)
                .FirstOrDefaultAsync(d => d.Id == id && d.TenantId == tenantId.Value && d.IsActive);

            if (department == null)
            {
                return NotFound(new { message = "Department not found" });
            }

            var departmentInfo = new
            {
                department.Id,
                department.Name,
                department.Description,
                department.ManagerName,
                department.ManagerEmail,
                Users = department.Users.Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.Role,
                    u.IsActive
                }),
                Facilities = department.Facilities.Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Address,
                    f.Type,
                    f.IsActive
                }),
                department.CreatedAt
            };

            return Ok(departmentInfo);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] DepartmentUpdateDto updateDto)
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == id && d.TenantId == tenantId.Value);

            if (department == null)
            {
                return NotFound(new { message = "Department not found" });
            }

            if (!string.IsNullOrEmpty(updateDto.Name))
                department.Name = updateDto.Name;
            
            if (updateDto.Description != null)
                department.Description = updateDto.Description;
            
            if (!string.IsNullOrEmpty(updateDto.ManagerName))
                department.ManagerName = updateDto.ManagerName;
            
            if (!string.IsNullOrEmpty(updateDto.ManagerEmail))
                department.ManagerEmail = updateDto.ManagerEmail;

            department.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Department updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var department = await _context.Departments
                .Include(d => d.Users)
                .Include(d => d.Facilities)
                .FirstOrDefaultAsync(d => d.Id == id && d.TenantId == tenantId.Value);

            if (department == null)
            {
                return NotFound(new { message = "Department not found" });
            }

            // Check if department has users or facilities
            if (department.Users.Any() || department.Facilities.Any())
            {
                return BadRequest(new { message = "Cannot delete department with users or facilities" });
            }

            department.IsActive = false;
            department.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Department deleted successfully" });
        }

        [HttpPost("{id}/users/{userId}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> AssignUserToDepartment(int id, int userId)
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == id && d.TenantId == tenantId.Value && d.IsActive);

            if (department == null)
            {
                return NotFound(new { message = "Department not found" });
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.TenantId == tenantId.Value && u.IsActive);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.DepartmentId = id;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "User assigned to department successfully" });
        }

        [HttpDelete("{id}/users/{userId}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> RemoveUserFromDepartment(int id, int userId)
        {
            var tenantId = GetCurrentTenantId();
            
            if (!tenantId.HasValue)
            {
                return TenantNotFound();
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.TenantId == tenantId.Value && u.DepartmentId == id);

            if (user == null)
            {
                return NotFound(new { message = "User not found in department" });
            }

            user.DepartmentId = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "User removed from department successfully" });
        }
    }
} 