using Livekit.Server.Sdk.Dotnet;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://screenshareapp.duckdns.org/")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();

app.MapGet("/ping", () => { return Results.Ok("pong"); });

app.MapPost("/livekit/token", (TokenRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.RoomName))
        return Results.BadRequest("RoomName is required.");

    if (string.IsNullOrWhiteSpace(request.Identity))
        return Results.BadRequest("Identity is required.");

    var apiKey = builder.Configuration["LIVEKIT_API_KEY"];
    var apiSecret = builder.Configuration["LIVEKIT_API_SECRET"];
    var serverUrl = builder.Configuration["LIVEKIT_URL"];

    if (string.IsNullOrWhiteSpace(apiKey) ||
        string.IsNullOrWhiteSpace(apiSecret) ||
        string.IsNullOrWhiteSpace(serverUrl))
    {
        return Results.Problem("LiveKit credentials are not configured.");
    }

    var token = new AccessToken(apiKey, apiSecret)
        .WithIdentity(request.Identity)
        .WithGrants(new VideoGrants
        {
            RoomJoin = true,
            Room = request.RoomName
        })
        .WithTtl(TimeSpan.FromHours(1));

    return Results.Ok(new
    {
        token = token.ToJwt(),
        serverUrl
    });
});

app.Run();

public record TokenRequest(
    string RoomName,
    string Identity
);