import { DiscordSDK } from "@discord/embedded-app-sdk";

let discordSdk: DiscordSDK | null = null;

export async function initializeDiscord() {
  const params = new URLSearchParams(window.location.search);

  if (!params.has("frame_id")) {
    console.log("🌐 Rodando fora do Discord");
    return null;
  }

  console.log("1️⃣ frame_id encontrado");

  discordSdk = new DiscordSDK(
    import.meta.env.VITE_DISCORD_CLIENT_ID
  );

  console.log("2️⃣ DiscordSDK criado");

  await discordSdk.ready();

  console.log("3️⃣ Discord SDK ready");

  console.log("📦 Instance ID:", discordSdk.instanceId);

  return discordSdk;
}