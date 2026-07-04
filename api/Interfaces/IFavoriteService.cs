using ReactProject.API.DTOs;

namespace ReactProject.API.Interfaces;

public interface IFavoriteService
{
    Task<List<int>> GetFavoritesAsync(string userId);
    Task AddFavoriteAsync(string userId, int movieId);
    Task RemoveFavoriteAsync(string userId, int movieId);
    Task<FavoriteResponse> IsFavoriteAsync(string userId, int movieId);
}
