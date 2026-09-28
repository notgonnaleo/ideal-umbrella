import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";

const API_URL = import.meta.env.VITE_API_URL; // public API (this page runs outside Discord)

type Status = "idle" | "connecting" | "sharing" | "stopped" | "error";

// Opened in the external browser by the Activity:
//   /share?room=ROOM&identity=sharer-<sessionId>&name=Alice
export default function SharePage() {
  const params = new URLSearchParams(window.location.search);
  const roomName = params.get("room") ?? "";
  const identity = params.get("identity") ?? `sharer-${crypto.randomUUID()}`;
  const name = params.get("name") ?? "Usuário";

  const roomRef = useRef<Room | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function start() {
    try {
      setError("");
      setStatus("connecting");

      const res = await fetch(`${API_URL}/livekit/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, identity, name, role: "sharer" }),
      });
      if (!res.ok) throw new Error(`Token API ${res.status}: ${await res.text()}`);
      const { token, serverUrl } = await res.json();

      const room = new Room();
      roomRef.current = room;
      room.on(RoomEvent.Disconnected, () => setStatus("stopped"));
      room.on(RoomEvent.LocalTrackUnpublished, (pub) => {
        // User clicked the browser's "Stop sharing" button
        if (pub.source === Track.Source.ScreenShare) room.disconnect();
      });

      await room.connect(serverUrl, token);
      // Opens the browser's screen picker; the share is now visible to every viewer
      await room.localParticipant.setScreenShareEnabled(true, { audio: true });
      setStatus("sharing");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
      roomRef.current?.disconnect();
    }
  }

  function stop() {
    roomRef.current?.disconnect();
  }

  useEffect(() => () => void roomRef.current?.disconnect(), []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "#111",
        color: "white",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: 16,
      }}
    >
      <h2>Compartilhar tela — sala {roomName}</h2>

      {(status === "idle" || status === "error" || status === "stopped") && (
        <button onClick={start} style={{ padding: "12px 24px", fontSize: 16 }}>
          {status === "stopped" ? "Compartilhar novamente" : "Selecionar tela"}
        </button>
      )}
      {status === "connecting" && <p>Conectando...</p>}
      {status === "sharing" && (
        <>
          <p>✅ Sua tela está sendo compartilhada. Volte ao Discord para vê-la na Activity.</p>
          <button onClick={stop} style={{ padding: "10px 20px" }}>
            Parar compartilhamento
          </button>
        </>
      )}
      {status === "stopped" && <p>Compartilhamento encerrado.</p>}
      {error && <pre style={{ color: "#f66", whiteSpace: "pre-wrap" }}>❌ {error}</pre>}
    </div>
  );
}