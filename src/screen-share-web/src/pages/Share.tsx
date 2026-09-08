import { useEffect, useRef, useState } from "react";
import {
  createLocalScreenTracks,
  Room,
  Track,
  type LocalTrack,
} from "livekit-client";

const API_URL = import.meta.env.VITE_API_URL;

export default function SharePage() {
  const [sharing, setSharing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const roomRef = useRef<Room | null>(null);
  const tracksRef = useRef<LocalTrack[]>([]);
  const roomNameRef = useRef<string | null>(null);

  async function stopSharing(): Promise<void> {
    const room = roomRef.current;
    const tracks = [...tracksRef.current];
    const roomName = roomNameRef.current;

    roomRef.current = null;
    tracksRef.current = [];
    roomNameRef.current = null;

    for (const track of tracks) {
      try {
        if (room) {
          await room.localParticipant.unpublishTrack(track);
        }
      } catch (err) {
        console.warn("Failed to unpublish screen track:", err);
      }

      track.stop();
    }

    if (room) {
      try {
        await room.disconnect();
      } catch (err) {
        console.warn("Failed to disconnect LiveKit room:", err);
      }
    }

    if (roomName) {
      try {
        await fetch(`${API_URL}/livekit/session/stop`, {
          method: "POST",
        });
      } catch (err) {
        console.warn("Failed to stop screen share session:", err);
      }
    }

    setSharing(false);
  }

  async function startSharing(): Promise<void> {
    try {
      setError("");

      const sessionResponse = await fetch(
        `${API_URL}/livekit/session/start`,
        {
          method: "POST",
        }
      );

      if (!sessionResponse.ok) {
        throw new Error(
          `Session API ${sessionResponse.status}: ${await sessionResponse.text()}`
        );
      }

      const sessionData: {
        roomName: string;
      } = await sessionResponse.json();

      roomNameRef.current = sessionData.roomName;

      const tokenResponse = await fetch(`${API_URL}/livekit/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: sessionData.roomName,
          identity: `screen-share-${crypto.randomUUID()}`,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(
          `Token API ${tokenResponse.status}: ${await tokenResponse.text()}`
        );
      }

      const data: {
        serverUrl: string;
        token: string;
      } = await tokenResponse.json();

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
            track.kind === Track.Kind.Video
              ? Track.Source.ScreenShare
              : Track.Source.ScreenShareAudio,
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

      {!sharing ? (
        <button
          onClick={() => void startSharing()}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          Compartilhar tela
        </button>
      ) : (
        <>
          <p>
            Tela sendo compartilhada.
          </p>

          <button
            onClick={() => void stopSharing()}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Parar compartilhamento
          </button>
        </>
      )}

      {error && (
        <pre
          style={{
            color: "red",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </pre>
      )}
    </div>
  );
}