namespace ScreenShare.Api.Models;

public record TokenRequest(
    string RoomName,
    string Identity,
    string? Name = null,
    string? Role = null);