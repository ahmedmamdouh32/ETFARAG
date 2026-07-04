using Microsoft.EntityFrameworkCore;
using ReactProject.API.Data;
using ReactProject.API.DTOs;
using ReactProject.API.Interfaces;
using ReactProject.API.Models;

namespace ReactProject.API.Services;

public class FavoriteService : IFavoriteService
{
    private readonly ApplicationDbContext _context;

    public FavoriteService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<int>> GetFavoritesAsync(string userId)
    {
        return await _context.Favorites
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => f.MovieId)
            .ToListAsync();
    }

    public async Task AddFavoriteAsync(string userId, int movieId)
    {
        var exists = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.MovieId == movieId);

        if (exists)
        {
            throw new InvalidOperationException("Movie is already in favorites.");
        }

        var favorite = new Favorite
        {
            UserId = userId,
            MovieId = movieId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveFavoriteAsync(string userId, int movieId)
    {
        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.MovieId == movieId);

        if (favorite == null)
        {
            throw new KeyNotFoundException("Favorite not found.");
        }

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
    }

    public async Task<FavoriteResponse> IsFavoriteAsync(string userId, int movieId)
    {
        var isFavorite = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.MovieId == movieId);

        return new FavoriteResponse
        {
            MovieId = movieId,
            IsFavorite = isFavorite
        };
    }
}
