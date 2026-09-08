"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getMeeting, joinMeeting } from "../../../lib/api";
import { Meeting } from "../../../lib/types";


export default function MeetingRoom() {
  const params = useParams();
  const router = useRouter();

  const meetingId = params.meetingId as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);


  useEffect(() => {
    const loadMeeting = async () => {
      try {
        const data = await getMeeting(meetingId);

        setMeeting(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Meeting not found."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [meetingId]);


  const handleJoin = async () => {
    if (!displayName.trim()) {
      setError("Please enter your display name.");
      return;
    }

    try {
      setJoining(true);
      setError("");

      await joinMeeting(
        meetingId,
        displayName.trim()
      );

      setJoined(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to join meeting."
      );
    } finally {
      setJoining(false);
    }
  };


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <p className="text-slate-500">
          Loading meeting...
        </p>
      </main>
    );
  }


  if (!meeting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
            !
          </div>

          <h1 className="mt-5 text-xl font-semibold text-slate-900">
            Meeting not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This meeting may not exist or the meeting ID may be
            invalid.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-[#2D8CFF] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }


  if (!joined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-[#2D8CFF]">
              Z
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-slate-900">
              Join Meeting
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {meeting.title || "Instant Meeting"}
            </p>
          </div>


          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Your display name
            </label>

            <input
              autoFocus
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJoin();
                }
              }}
              placeholder="Enter your name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2D8CFF] focus:ring-2 focus:ring-blue-100"
            />
          </div>


          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          <button
            onClick={handleJoin}
            disabled={joining}
            className="mt-6 w-full rounded-lg bg-[#2D8CFF] py-3 font-semibold text-white hover:bg-[#1677e8] disabled:opacity-60"
          >
            {joining ? "Joining..." : "Join Meeting"}
          </button>


          <button
            onClick={() => router.push("/")}
            className="mt-3 w-full py-2 text-sm text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>

        </div>

      </main>
    );
  }


  return (
    <main className="flex min-h-screen flex-col bg-[#171717] text-white">

      {/* Meeting header */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-5">

        <div>
          <h1 className="font-medium">
            {meeting.title || "Instant Meeting"}
          </h1>

          <p className="text-xs text-white/50">
            Meeting ID: {meetingId}
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
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

            {videoOff ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2D8CFF] text-2xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="text-center text-white/40">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2D8CFF] text-2xl font-semibold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                <p className="mt-3 text-sm">
                  Camera preview
                </p>
              </div>
            )}

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
            onClick={() => setMuted(!muted)}
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              muted
                ? "bg-red-500"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {muted ? "🔇" : "🎙"}
          </button>


          <button
            onClick={() => setVideoOff(!videoOff)}
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              videoOff
                ? "bg-red-500"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {videoOff ? "▣" : "▣"}
          </button>


          <button
            onClick={() => router.push("/")}
            className="ml-4 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold hover:bg-red-600"
          >
            Leave Meeting
          </button>

        </div>

      </footer>

    </main>
  );
}