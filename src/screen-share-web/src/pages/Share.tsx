import { useEffect, useRef, useState } from "react";
import {
  createLocalScreenTracks,
  Room,
  Track,
  type LocalTrack,
} from "livekit-client";

const API_URL = import.meta.env.VITE_API_URL;

function generateRoomCode(): string {
  return crypto.randomUUID().slice(0, 8);
}

export default function SharePage() {
  const [roomName] = useState<string>(generateRoomCode);
  const [sharing, setSharing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const roomRef = useRef<Room | null>(null);
  const tracksRef = useRef<LocalTrack[]>([]);

  async function stopSharing(): Promise<void> {
    const room = roomRef.current;
    const tracks = [...tracksRef.current];

    roomRef.current = null;
    tracksRef.current = [];

    for (const track of tracks) {
      try {
        if (room) {
          await room.localParticipant.unpublishTrack(track);
        }
      } catch {
        console.warn("Failed to unpublish screen track:", error);
      }

      track.stop();
    }

    if (room) {
      try {
        await room.disconnect();
      } catch {
        console.warn("Failed to stop screen track:", error);
      }
    }

    setSharing(false);
  }

  async function startSharing(): Promise<void> {
    try {
      setError("");

      const response = await fetch(`${API_URL}/livekit/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
          identity: `screen-share-${crypto.randomUUID()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Token API ${response.status}: ${await response.text()}`
        );
      }

      const data: {
        serverUrl: string;
        token: string;
      } = await response.json();

      const room = new Room();
      roomRef.current = room;

      await room.connect(data.serverUrl, data.token);

      const tracks = await createLocalScreenTracks({
        audio: true,
      });

      tracksRef.current = tracks;

      for (const track of tracks) {
        await room.localParticipant.publishTrack(track, {
          source:
            track.kind === Track.Kind.Video ? Track.Source.ScreenShare : Track.Source.ScreenShareAudio,
        });
      }

      setSharing(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );

      await stopSharing();
    }
  }

  useEffect(() => {
    return () => {
      void stopSharing();
    };
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 40 }}>
      <h1>Screen Share</h1>

      <p>
        Room code: <strong>{roomName}</strong>
      </p>

      {!sharing ? (
        <button
          onClick={() => void startSharing()}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          🖥️ Compartilhar tela
        </button>
      ) : (
        <button
          onClick={() => void stopSharing()}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          ⛔ Parar compartilhamento
        </button>
      )}

      {sharing && (
        <p>
          🟢 Tela sendo compartilhada — passe o código acima para quem for
          assistir
        </p>
      )}

      {error && (
        <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>
          ❌ {error}
        </pre>
      )}
    </div>
  );
}
