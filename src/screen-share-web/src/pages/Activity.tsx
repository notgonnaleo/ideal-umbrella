import { useState } from "react";
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

function mapServerUrl(rawServerUrl: string) {
  if (rawServerUrl.includes(LIVEKIT_URL)) {
    return `wss://${window.location.host}${LIVEKIT_MAPPED_PATH}`;
  }
  return rawServerUrl;
}

export default function ActivityPage() {
  const [roomInput, setRoomInput] = useState("");
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  function log(msg: string) {
    setDebugLog((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);
  }

  async function joinRoom() {
    try {
      setError("");
      log(`Solicitando token para sala "${roomInput.trim()}"...`);

      const response = await fetch(`${API_URL}/livekit/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: roomInput.trim(),
          identity: `viewer-${crypto.randomUUID()}`,
        }),
      });

      log(`Resposta do token: status ${response.status}`);

      if (!response.ok) {
        throw new Error(`Token API ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      log(`serverUrl original: ${data.serverUrl}`);

      const mapped = mapServerUrl(data.serverUrl);
      log(`serverUrl usado: ${mapped}`);

      setToken(data.token);
      setServerUrl(mapped);
      setJoined(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      log(`ERRO: ${message}`);
    }
  }

  return (
    <div
      style={{
      width: "100%",
      height: "100dvh",
      minWidth: 0,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "#111",
      color: "white",
      fontFamily: "sans-serif",
      boxSizing: "border-box",
    }}
    >
      {!joined ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <input
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Código da sala"
            style={{ padding: 10, fontSize: 16 }}
          />
          <button onClick={joinRoom} disabled={!roomInput.trim()} style={{ padding: "10px 20px" }}>
            Entrar
          </button>
        </div>
      ) : (
        <div style={{ padding: 8, fontSize: 13, background: "#222" }}>
          Sala: <strong>{roomInput.trim()}</strong> — server: {serverUrl}
        </div>
      )}

      {joined && (
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            connect
            audio={false}
            video={false}
            style={{ width: "100%", height: "100%" }}
            onDisconnected={(reason) => log(`Desconectado: ${reason ?? "sem motivo"}`)}
            onError={(err) => log(`LiveKitRoom erro: ${err.message}`)}
          >
            <ScreenShares />
          </LiveKitRoom>
        </div>
      )}

      {error && (
        <pre
          style={{
            color: "#f66",
            whiteSpace: "pre-wrap",
            fontSize: 12,
            padding: 8,
            background: "#300",
            margin: 0,
          }}
        >
          ❌ {error}
        </pre>
      )}

      <details style={{ fontSize: 11, background: "#000" }}>
        <summary style={{ cursor: "pointer", padding: 6, color: "#888" }}>
          Debug ({debugLog.length})
        </summary>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            color: "#0f0",
            padding: 8,
            maxHeight: 150,
            overflowY: "auto",
            margin: 0,
          }}
        >
          {debugLog.join("\n") || "Nenhum evento ainda."}
        </pre>
      </details>
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