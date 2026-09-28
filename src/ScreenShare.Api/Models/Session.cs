namespace ScreenShare.Api.Models;

public class Session
{
    public Guid Id { get; set; }

    public required string RoomId { get; set; }

    public required string SharerId { get; set; }

    public SessionStatus Status { get; set; }
}

public enum SessionStatus
{
    Active = 1,
    Ended = 2,
}