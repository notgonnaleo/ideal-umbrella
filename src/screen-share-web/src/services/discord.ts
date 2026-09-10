import { DiscordSDK } from "@discord/embedded-app-sdk";

let discordSdk: DiscordSDK | null = null;

export async function initializeDiscord(): Promise<DiscordSDK | null> {
  const params = new URLSearchParams(window.location.search);

  if (!params.has("frame_id")) {
    console.log("Running outside Discord");
    return null;
  }

  discordSdk = new DiscordSDK(
    import.meta.env.VITE_DISCORD_CLIENT_ID
  );

  await discordSdk.ready();

  console.log("Discord SDK ready");
  console.log("Instance ID:", discordSdk.instanceId);

  return discordSdk;
}

export function getDiscordInstanceId(): string | null {
  return discordSdk?.instanceId ?? null;
}
