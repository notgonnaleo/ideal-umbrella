import { DiscordSDK } from "@discord/embedded-app-sdk";

let discordSdk: DiscordSDK | null = null;

export interface DiscordActivityContext {
  instanceId: string;
  isFirstParticipant: boolean;
}

export async function initializeDiscord(): Promise<DiscordActivityContext | null> {
  const params = new URLSearchParams(window.location.search);

  if (!params.has("frame_id")) {
    console.log("Running outside Discord");
    return null;
  }

  discordSdk = new DiscordSDK(
    import.meta.env.VITE_DISCORD_CLIENT_ID
  );

  await discordSdk.ready();

  const instanceId = discordSdk.instanceId;

  const result =
    await discordSdk.commands.getInstanceConnectedParticipants();

  const participants = result.participants ?? [];

  console.log("Discord instance:", instanceId);
  console.log("Discord participants:", participants);

  return {
    instanceId,
    isFirstParticipant: participants.length <= 1,
  };
}

export function getDiscordSdk(): DiscordSDK | null {
  return discordSdk;
}
