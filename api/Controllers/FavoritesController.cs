using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactProject.API.DTOs;
using ReactProject.API.Interfaces;

namespace ReactProject.API.Controllers;

[ApiController]
[Route("api/favorites")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var favorites = await _favoriteService.GetFavoritesAsync(userId);
        return Ok(favorites);
    }

    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] FavoriteDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        try
        {
            await _favoriteService.AddFavoriteAsync(userId, dto.MovieId);
            return Ok(new { message = "Movie added to favorites." });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{movieId:int}")]
    public async Task<IActionResult> RemoveFavorite(int movieId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        try
        {
            await _favoriteService.RemoveFavoriteAsync(userId, movieId);
            return Ok(new { message = "Movie removed from favorites." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("check/{movieId:int}")]
    public async Task<IActionResult> CheckFavorite(int movieId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _favoriteService.IsFavoriteAsync(userId, movieId);
        return Ok(result);
    }
}
