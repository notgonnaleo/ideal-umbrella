import { useState } from "react";
import {
  createLocalScreenTracks,
  Room,
  Track,
} from "livekit-client";

const API_URL = "http://localhost:5000";

const LIVEKIT_URL =
  "wss://screenshare-0z0hwpo4.livekit.cloud";

export default function SharePage() {
  const [room] = useState(() => new Room());
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");

  async function startSharing() {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/livekit/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: "screen-share",
            identity: `screen-share-${crypto.randomUUID()}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Token API ${response.status}: ${await response.text()}`
        );
      }

      const data = await response.json();

      await room.connect(
        LIVEKIT_URL,
        data.token
      );

      const tracks =
        await createLocalScreenTracks({
          audio: false,
        });

      for (const track of tracks) {
        await room.localParticipant.publishTrack(
          track,
          {
            source: Track.Source.ScreenShare,
          }
        );
      }

      setSharing(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );
    }
  }

  async function stopSharing() {
    for (
      const publication of
      room.localParticipant.trackPublications.values()
    ) {
      if (publication.track) {
        await room.localParticipant.unpublishTrack(
          publication.track
        );

        publication.track.stop();
      }
    }

    await room.disconnect();

    setSharing(false);
  }

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: 40,
      }}
    >
      <h1>Screen Share</h1>

      {!sharing ? (
        <button
          onClick={startSharing}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          🖥️ Compartilhar tela
        </button>
      ) : (
        <button
          onClick={stopSharing}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          ⛔ Parar compartilhamento
        </button>
      )}

      {sharing && (
        <p>🟢 Tela sendo compartilhada</p>
      )}

      {error && (
        <pre
          style={{
            color: "red",
            whiteSpace: "pre-wrap",
          }}
        >
          ❌ {error}
        </pre>
      )}
    </div>
  );
}
