namespace ScreenShare.Api.Models;

public class Room
{
    public Guid Id { get; set; }
    public required string GuildId { get; set; }
    public required string ChannelId { get; set; }
}
