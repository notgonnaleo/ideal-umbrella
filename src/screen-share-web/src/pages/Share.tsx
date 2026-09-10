import { useEffect, useRef, useState } from "react";
import {
  Room,
  LocalVideoTrack,
  LocalAudioTrack,
  Track,
} from "livekit-client";
import {
  initializeDiscord,
  type DiscordActivityContext,
} from "../services/discord";

const API_URL = import.meta.env.VITE_API_URL;

export default function SharePage() {
  const roomRef = useRef<Room | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    start();

    return () => {
      cleanup();
    };
  }, []);

  async function start() {
    try {
      setError(null);

      const context = await initializeDiscord();

      if (!context) {
        throw new Error(
          "This page must be opened inside Discord."
        );
      }

      if (!context.isFirstParticipant) {
        throw new Error(
          "This Activity is already running."
        );
      }

      const sessionResponse = await fetch(
        `${API_URL}/livekit/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instanceId: context.instanceId,
          }),
        }
      );

      if (!sessionResponse.ok) {
        throw new Error(
          "Failed to create screen sharing session."
        );
      }

      const session = await sessionResponse.json();

      /*
       * This must happen from the Activity's user activation.
       * The user sees the native browser screen picker here.
       */
      const stream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

      streamRef.current = stream;

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

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

      const {
        token,
        serverUrl,
      } = await tokenResponse.json();

      const room = new Room();

      await room.connect(serverUrl, token);

      const localVideoTrack =
        new LocalVideoTrack(videoTrack);

      await room.localParticipant.publishTrack(
        localVideoTrack,
        {
          source: Track.Source.ScreenShare,
        }
      );

      if (audioTrack) {
        const localAudioTrack =
          new LocalAudioTrack(audioTrack);

        await room.localParticipant.publishTrack(
          localAudioTrack,
          {
            source: Track.Source.ScreenShareAudio,
          }
        );
      }

      videoTrack.addEventListener(
        "ended",
        () => {
          stopSharing();
        }
      );

      roomRef.current = room;

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
      room.disconnect();
      roomRef.current = null;
    }

    const stream = streamRef.current;

    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }

      streamRef.current = null;
    }

    setSharing(false);
  }

  function cleanup() {
    const room = roomRef.current;

    if (room) {
      room.disconnect();
      roomRef.current = null;
    }

    const stream = streamRef.current;

    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }

      streamRef.current = null;
    }
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      {sharing ? (
        <p>Compartilhando sua tela.</p>
      ) : (
        <p>Escolha a tela que deseja compartilhar.</p>
      )}
    </main>
  );
}
