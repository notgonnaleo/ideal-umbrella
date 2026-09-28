CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discord_guild_id VARCHAR(64) NOT NULL,
    discord_channel_id VARCHAR(64) NOT NULL,
);