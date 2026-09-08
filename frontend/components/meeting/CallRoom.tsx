"use client";

interface CallRoomProps {
  meetingTitle: string | null;
  meetingId: string;
  displayName: string;
  muted: boolean;
  videoOff: boolean;
  onToggleMuted: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}

/**
 * The in-call view. There's no real camera/mic capture here (that
 * would need actual WebRTC), so this renders an avatar placeholder that
 * reacts to the mute/video-off toggles for visual feedback only.
 */
export default function CallRoom({
  meetingTitle,
  meetingId,
  displayName,
  muted,
  videoOff,
  onToggleMuted,
  onToggleVideo,
  onLeave,
}: CallRoomProps) {
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="flex min-h-screen flex-col bg-[#171717] text-white">
      {/* Meeting header */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <div>
          <h1 className="font-medium">{meetingTitle || "Instant Meeting"}</h1>
          <p className="text-xs text-white/50">Meeting ID: {meetingId}</p>
        </div>

        <button
          onClick={onLeave}
          className="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          Leave
        </button>
      </header>

      {/* Video area */}
      <section className="flex flex-1 items-center justify-center p-6">
        <div className="grid w-full max-w-5xl gap-3 md:grid-cols-2">
          {/* Current participant */}
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#242424]">
            <div className="text-center text-white/40">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2D8CFF] text-2xl font-semibold text-white">
                {initial}
              </div>

              <p className="mt-3 text-sm">
                {videoOff ? "Camera is off" : "Camera preview"}
              </p>
            </div>

            <div className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs">
              {displayName} {muted ? "(muted)" : ""}
            </div>
          </div>

          {/* Placeholder participant */}
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

      {/* Controls */}
      <footer className="flex h-24 items-center justify-center border-t border-white/10 bg-[#171717]">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMuted}
            aria-label={muted ? "Unmute" : "Mute"}
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              muted ? "bg-red-500" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {muted ? "🔇" : "🎙"}
          </button>

          <button
            onClick={onToggleVideo}
            aria-label={videoOff ? "Turn camera on" : "Turn camera off"}
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              videoOff ? "bg-red-500" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {/* NOTE: previously showed the same glyph in both states */}
            {videoOff ? "🚫" : "🎥"}
          </button>

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
