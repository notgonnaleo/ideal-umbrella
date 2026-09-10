import { useEffect, useRef, useState } from "react";
import {
  createLocalScreenTracks,
  LocalTrack,
  Room,
  Track,
} from "livekit-client";
import {
  getDiscordInstanceId,
  initializeDiscord,
} from "../services/discord";

const API_URL = import.meta.env.VITE_API_URL;

export default function SharePage() {
  const roomRef = useRef<Room | null>(null);
  const tracksRef = useRef<LocalTrack[]>([]);

  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDiscord().catch((err) => {
      console.error(err);
      setError("Failed to initialize Discord.");
    });

    return () => {
      stopSharing();
    };
  }, []);

  async function startSharing() {
    try {
      setError(null);

      const instanceId = getDiscordInstanceId();

      if (!instanceId) {
        throw new Error(
          "Discord Activity instance ID was not found."
        );
      }

      const sessionResponse = await fetch(
        `${API_URL}/livekit/session/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instanceId,
          }),
        }
      );

      if (!sessionResponse.ok) {
        throw new Error(
          "Failed to create screen sharing session."
        );
      }

      const session = await sessionResponse.json();

      const tokenResponse = await fetch(
        `${API_URL}/livekit/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: session.roomName,
            identity: `screen-share-${crypto.randomUUID()}`,
          }),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error(
          "Failed to create LiveKit token."
        );
      }

      const { token, serverUrl } =
        await tokenResponse.json();

      const room = new Room();

      await room.connect(serverUrl, token);

      const tracks = await createLocalScreenTracks({
        audio: true,
      });

      for (const track of tracks) {
        await room.localParticipant.publishTrack(track, {
          source:
            track.kind === "video"
              ? Track.Source.ScreenShare
              : Track.Source.ScreenShareAudio,
        });
      }

      roomRef.current = room;
      tracksRef.current = tracks;

      setSharing(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to start screen sharing."
      );
    }
  }

  async function stopSharing() {
    const room = roomRef.current;

    if (room) {
      for (const track of tracksRef.current) {
        try {
          room.localParticipant.unpublishTrack(track);
        } catch {
          // Ignore already unpublished tracks.
        }

        track.stop();
      }

      tracksRef.current = [];

      room.disconnect();

      roomRef.current = null;
    }

    setSharing(false);
  }

  return (
    <main>
      <h1>Screen Share</h1>

      {error && (
        <p>
          {error}
        </p>
      )}

      {!sharing ? (
        <button onClick={startSharing}>
          Compartilhar tela
        </button>
      ) : (
        <button onClick={stopSharing}>
          Parar compartilhamento
        </button>
      )}
    </main>
  );
}
