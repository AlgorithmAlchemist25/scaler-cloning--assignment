"use client";

import { useEffect, useRef } from "react";

interface CallRoomProps {
  meetingTitle: string | null;
  meetingId: string;
  displayName: string;

  muted: boolean;
  videoOff: boolean;

  // Actual browser camera/microphone stream
  cameraStream: MediaStream | null;

  // Error shown if camera/microphone permission
  // was denied or unavailable.
  cameraError: string;

  onToggleMuted: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}


/**
 * The in-call meeting view.
 *
 * The local camera is provided through the browser's
 * MediaDevices API in page.tsx.
 *
 * This component takes that MediaStream and attaches
 * it to the <video> element using srcObject.
 */
export default function CallRoom({
  meetingTitle,
  meetingId,
  displayName,
  muted,
  videoOff,
  cameraStream,
  cameraError,
  onToggleMuted,
  onToggleVideo,
  onLeave,
}: CallRoomProps) {

  /*
   * Reference to the HTML video element.
   *
   * We need this because MediaStream objects are
   * assigned using:
   *
   * videoElement.srcObject = cameraStream
   */
  const videoRef =
    useRef<HTMLVideoElement>(null);


  const initial =
    displayName.charAt(0).toUpperCase();


  /*
   * Whenever cameraStream changes, attach it
   * to the video element.
   */
  useEffect(() => {

    if (
      videoRef.current &&
      cameraStream
    ) {
      videoRef.current.srcObject =
        cameraStream;
    }

  }, [cameraStream]);


  return (
    <main className="flex min-h-screen flex-col bg-[#171717] text-white">

      {/* ================================================== */}
      {/* Meeting Header */}
      {/* ================================================== */}

      <header className="flex h-16 items-center justify-between border-b border-white/10 px-5">

        <div>

          <h1 className="font-medium">
            {meetingTitle || "Instant Meeting"}
          </h1>

          <p className="text-xs text-white/50">
            Meeting ID: {meetingId}
          </p>

        </div>


        <button
          onClick={onLeave}
          className="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          Leave
        </button>

      </header>


      {/* ================================================== */}
      {/* Video Area */}
      {/* ================================================== */}

      <section className="flex flex-1 items-center justify-center p-6">

        <div className="grid w-full max-w-5xl gap-3 md:grid-cols-2">


          {/* ================================================== */}
          {/* Local Participant */}
          {/* ================================================== */}

          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#242424]">

            {/*
             * If camera is off or we don't have a camera
             * stream, show the user's avatar.
             */}

            {videoOff || !cameraStream ? (

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2D8CFF] text-2xl font-semibold">
                {initial}
              </div>

            ) : (

              /*
               * Actual camera preview.
               *
               * `autoPlay` starts playback automatically.
               *
               * `playsInline` prevents mobile browsers from
               * forcing the video into fullscreen.
               *
               * `muted` prevents your own microphone from
               * being played back through your speakers.
               */

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />

            )}


            {/* Camera error */}

            {cameraError && (
              <div className="absolute left-3 top-3 rounded-md bg-black/60 px-3 py-2 text-xs text-white">
                {cameraError}
              </div>
            )}


            {/* Participant name */}

            <div className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs">
              {displayName}{" "}
              {muted ? "(muted)" : ""}
            </div>

          </div>


          {/* ================================================== */}
          {/* Placeholder Participant */}
          {/* ================================================== */}

          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#242424]">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-600 text-2xl font-semibold">
              Z
            </div>

            <div className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs">
              Waiting for participants
            </div>

          </div>

        </div>

      </section>


      {/* ================================================== */}
      {/* Meeting Controls */}
      {/* ================================================== */}

      <footer className="flex h-24 items-center justify-center border-t border-white/10 bg-[#171717]">

        <div className="flex items-center gap-3">


          {/* ================================================== */}
          {/* Microphone */}
          {/* ================================================== */}

          <button
            onClick={onToggleMuted}
            aria-label={
              muted
                ? "Unmute"
                : "Mute"
            }
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              muted
                ? "bg-red-500"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >

            {muted ? "🔇" : "🎙"}

          </button>


          {/* ================================================== */}
          {/* Camera */}
          {/* ================================================== */}

          <button
            onClick={onToggleVideo}
            aria-label={
              videoOff
                ? "Turn camera on"
                : "Turn camera off"
            }
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              videoOff
                ? "bg-red-500"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >

            {videoOff
              ? "🚫"
              : "🎥"}

          </button>


          {/* ================================================== */}
          {/* Leave Meeting */}
          {/* ================================================== */}

          <button
            onClick={onLeave}
            className="ml-4 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold hover:bg-red-600"
          >
            Leave Meeting
          </button>

        </div>

      </footer>

    </main>
  );
}