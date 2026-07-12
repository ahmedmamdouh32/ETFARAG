using System.ComponentModel.DataAnnotations;

namespace ReactProject.API.DTOs;

public class UpdateProfileRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;
}
