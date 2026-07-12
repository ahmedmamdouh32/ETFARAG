using System.ComponentModel.DataAnnotations;

namespace ReactProject.API.DTOs;

public class GoogleAuthRequest
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
}
