import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
} from "@livekit/components-react";
import { isTrackReference } from "@livekit/components-core";
import { Track } from "livekit-client";

const API_URL = import.meta.env.VITE_MAPPED_API_URL;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const LIVEKIT_MAPPED_PATH = import.meta.env.VITE_MAPPED_LIVEKIT_URL;

function mapServerUrl(rawServerUrl: string): string {
  if (rawServerUrl.includes(LIVEKIT_URL)) {
    return `wss://${window.location.host}${LIVEKIT_MAPPED_PATH}`;
  }

  return rawServerUrl;
}

export default function ActivityPage() {
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function connectToActiveSession(): Promise<void> {
      try {
        setError("");

        const sessionResponse = await fetch(
          `${API_URL}/livekit/session`
        );

        if (sessionResponse.status === 404) {
          if (!cancelled) {
            setError("Nenhuma tela está sendo compartilhada.");
          }

          return;
        }

        if (!sessionResponse.ok) {
          throw new Error(
            `Session API ${sessionResponse.status}: ${await sessionResponse.text()}`
          );
        }

        const sessionData: {
          roomName: string;
        } = await sessionResponse.json();

        const tokenResponse = await fetch(
          `${API_URL}/livekit/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomName: sessionData.roomName,
              identity: `viewer-${crypto.randomUUID()}`,
            }),
          }
        );

        if (!tokenResponse.ok) {
          throw new Error(
            `Token API ${tokenResponse.status}: ${await tokenResponse.text()}`
          );
        }

        const data: {
          token: string;
          serverUrl: string;
        } = await tokenResponse.json();

        if (cancelled) {
          return;
        }

        setToken(data.token);
        setServerUrl(mapServerUrl(data.serverUrl));
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : String(err)
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void connectToActiveSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
          color: "#aaa",
          fontFamily: "sans-serif",
        }}
      >
        Conectando...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
          color: "#aaa",
          fontFamily: "sans-serif",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        background: "#111",
      }}
    >
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect
        audio={false}
        video={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ScreenShares />
      </LiveKitRoom>
    </div>
  );
}

function ScreenShares() {
  const tracks = useTracks([
    {
      source: Track.Source.ScreenShare,
      withPlaceholder: false,
    },
  ]);

  const screenShares = tracks.filter(isTrackReference);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        background: "#111",
        display: "grid",
        gridTemplateColumns:
          screenShares.length <= 1
            ? "minmax(0, 1fr)"
            : "repeat(2, minmax(0, 1fr))",
        gridAutoRows: "minmax(0, 1fr)",
        gap: 8,
        padding: 8,
        boxSizing: "border-box",
      }}
    >
      {screenShares.length === 0 ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            fontFamily: "sans-serif",
          }}
        >
          Aguardando compartilhamento de tela...
        </div>
      ) : (
        screenShares.map((track) => (
          <div
            key={`${track.participant.identity}-${track.publication?.trackSid}`}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
              background: "#000",
              borderRadius: 8,
            }}
          >
            <VideoTrack
              trackRef={track}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: 10,
                bottom: 10,
                padding: "5px 8px",
                background: "rgba(0,0,0,0.7)",
                color: "white",
                borderRadius: 5,
                fontSize: 13,
                fontFamily: "sans-serif",
              }}
            >
              {track.participant.name || track.participant.identity}
            </div>
          </div>
        ))
      )}
    </div>
  );
}