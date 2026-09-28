import { useEffect, useMemo, useRef, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
} from "@livekit/components-react";
import { isTrackReference } from "@livekit/components-core";
import type { TrackReference } from "@livekit/components-core";
import { RemoteTrackPublication, Track } from "livekit-client";

const API_URL = import.meta.env.VITE_MAPPED_API_URL;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const LIVEKIT_MAPPED_PATH = import.meta.env.VITE_MAPPED_LIVEKIT_URL;
// Public URL of the external share page (opened outside Discord)
const SHARE_PAGE_URL = import.meta.env.VITE_SHARE_PAGE_URL;

function mapServerUrl(rawServerUrl: string) {
  if (rawServerUrl.includes(LIVEKIT_URL)) {
    return `wss://${window.location.host}${LIVEKIT_MAPPED_PATH}`;
  }
  return rawServerUrl;
}

type Props = {
  userName?: string;
  // Wire this to discordSdk.commands.openExternalLink({ url }) inside the Activity.
  openExternalLink?: (url: string) => Promise<unknown> | void;
};

export default function ActivityPage({ userName, openExternalLink }: Props) {
  const [roomInput, setRoomInput] = useState("");
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  // Stable id for this Activity instance; the external share page derives the
  // sharer identity from it so we can recognise "my" share and auto-select it.
  const sessionId = useRef(crypto.randomUUID()).current;
  const myShareIdentity = `sharer-${sessionId}`;

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
          identity: `viewer-${sessionId}`,
          name: userName,
          role: "viewer",
        }),
      });

      log(`Resposta do token: status ${response.status}`);
      if (!response.ok) {
        throw new Error(`Token API ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
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

  async function startSharing() {
    const params = new URLSearchParams({
      room: roomInput.trim(),
      identity: myShareIdentity,
      name: userName ?? "Usuário",
    });
    const url = `${SHARE_PAGE_URL}?${params.toString()}`;
    log(`Abrindo página de compartilhamento: ${url}`);
    try {
      if (openExternalLink) await openExternalLink(url);
      else window.open(url, "_blank", "noopener");
    } catch (err) {
      log(`ERRO ao abrir link externo: ${String(err)}`);
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
        <div
          style={{
            padding: 8,
            fontSize: 13,
            background: "#222",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span>
            Sala: <strong>{roomInput.trim()}</strong>
          </span>
          <button onClick={startSharing} style={{ padding: "6px 12px" }}>
            Compartilhar minha tela
          </button>
        </div>
      )}

      {joined && (
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden" }}>
          <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            connect
            audio={false}
            video={false}
            // Subscribe manually so we only pull the stream being watched.
            options={{ adaptiveStream: true, dynacast: true }}
            connectOptions={{ autoSubscribe: false }}
            style={{ width: "100%", height: "100%" }}
            onDisconnected={(reason) => log(`Desconectado: ${reason ?? "sem motivo"}`)}
            onError={(err) => log(`LiveKitRoom erro: ${err.message}`)}
          >
            <ScreenShares myShareIdentity={myShareIdentity} />
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

function shareKey(t: TrackReference) {
  return `${t.participant.identity}:${t.publication.trackSid}`;
}

function ScreenShares({ myShareIdentity }: { myShareIdentity: string }) {
  // onlySubscribed:false => we also see shares we haven't subscribed to yet
  const tracks = useTracks([{ source: Track.Source.ScreenShare, withPlaceholder: false }], {
    onlySubscribed: false,
  });

  const shares = useMemo(() => tracks.filter(isTrackReference), [tracks]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const seen = useRef<Set<string>>(new Set());

  // Keep the selection valid, and auto-select useful shares:
  //  - my own share as soon as it appears (sharer returns to Discord and sees it)
  //  - the first available share if nothing is selected
  //  - the first remaining share if the selected one ended
  useEffect(() => {
    const keys = shares.map(shareKey);
    const mine = shares.find((s) => s.participant.identity === myShareIdentity);

    if (mine && !seen.current.has(shareKey(mine))) {
      seen.current.add(shareKey(mine));
      setSelectedKey(shareKey(mine));
      return;
    }
    if (selectedKey && keys.includes(selectedKey)) return;
    setSelectedKey(keys[0] ?? null);
  }, [shares, selectedKey, myShareIdentity]);

  // Subscribe only to the selected share; unsubscribe from the others.
  useEffect(() => {
    for (const s of shares) {
      const pub = s.publication as RemoteTrackPublication;
      if (typeof pub.setSubscribed !== "function") continue; // local publication
      const wanted = shareKey(s) === selectedKey;
      if (pub.isSubscribed !== wanted) pub.setSubscribed(wanted);
    }
  }, [shares, selectedKey]);

  const selected = shares.find((s) => shareKey(s) === selectedKey);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        background: "#111",
      }}
    >
      {shares.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: 8,
            overflowX: "auto",
            background: "#181818",
            flexShrink: 0,
          }}
        >
          {shares.map((s) => {
            const key = shareKey(s);
            const active = key === selectedKey;
            return (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: active ? "2px solid #5865f2" : "2px solid transparent",
                  background: active ? "#2b2f5e" : "#2a2a2a",
                  color: "white",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                🖥️ {s.participant.name || s.participant.identity}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, minHeight: 0, padding: 8, boxSizing: "border-box" }}>
        {!selected ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
            }}
          >
            Aguardando compartilhamento de tela...
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              background: "#000",
              borderRadius: 8,
            }}
          >
            {selected.publication.track ? (
              <VideoTrack
                key={shareKey(selected)}
                trackRef={selected}
                style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                }}
              >
                Conectando à tela...
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: 10,
                bottom: 10,
                padding: "5px 8px",
                background: "rgba(0,0,0,0.7)",
                borderRadius: 5,
                fontSize: 13,
              }}
            >
              {selected.participant.name || selected.participant.identity}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}