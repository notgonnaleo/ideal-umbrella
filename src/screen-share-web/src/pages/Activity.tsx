import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
} from "@livekit/components-react";
import {
  isTrackReference,
} from "@livekit/components-core";
import { Track } from "livekit-client";
import {
  initializeDiscord,
} from "../services/discord";

const API_URL = import.meta.env.VITE_API_URL;

function ScreenShares() {
  const tracks = useTracks([
    {
      source: Track.Source.ScreenShare,
      withPlaceholder: false,
    },
  ]);

  const screenShares = tracks.filter(
    isTrackReference
  );

  if (screenShares.length === 0) {
    return (
      <p>Ninguém está compartilhando a tela.</p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px",
        width: "100%",
        height: "100%",
      }}
    >
      {screenShares.map((track) => (
        <VideoTrack
          key={track.publication.trackSid}
          trackRef={track}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      ))}
    </div>
  );
}

export default function ActivityPage() {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      try {
        setError(null);

        const context = await initializeDiscord();

        if (!context) {
          throw new Error(
            "This page must be opened inside Discord."
          );
        }

        /*
         * The first participant is the sharer.
         * Everyone else is a viewer.
         */
        if (context.isFirstParticipant) {
          return;
        }

        const response = await fetch(
          `${API_URL}/livekit/session?instanceId=${encodeURIComponent(
            context.instanceId
          )}`
        );

        if (response.status === 404) {
          throw new Error(
            "No screen sharing session exists."
          );
        }

        if (!response.ok) {
          throw new Error(
            "Failed to get screen sharing session."
          );
        }

        const session = await response.json();

        const tokenResponse = await fetch(
          `${API_URL}/livekit/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomName: session.roomName,
              identity: `viewer-${crypto.randomUUID()}`,
            }),
          }
        );

        if (!tokenResponse.ok) {
          throw new Error(
            "Failed to create LiveKit token."
          );
        }

        const data = await tokenResponse.json();

        if (cancelled) {
          return;
        }

        setToken(data.token);
        setServerUrl(data.serverUrl);
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to connect."
          );
        }
      }
    }

    connect();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main>
        <p>{error}</p>
      </main>
    );
  }

  if (!token || !serverUrl) {
    return (
      <main>
        <p>Conectando...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect
        audio={false}
        video={false}
      >
        <ScreenShares />
      </LiveKitRoom>
    </main>
  );
}
