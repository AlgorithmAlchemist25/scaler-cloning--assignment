"use client";

interface JoinScreenProps {
  meetingTitle: string | null;
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  joining: boolean;
  error: string;
  onJoin: () => void;
  onCancel: () => void;
}

/** Asks for a display name before letting someone into the call. */
export default function JoinScreen({
  meetingTitle,
  displayName,
  onDisplayNameChange,
  joining,
  error,
  onJoin,
  onCancel,
}: JoinScreenProps) {
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
            {meetingTitle || "Instant Meeting"}
          </p>
        </div>

        <div className="mt-8">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Your display name
          </label>

          <input
            autoFocus
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onJoin();
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
          onClick={onJoin}
          disabled={joining}
          className="mt-6 w-full rounded-lg bg-[#2D8CFF] py-3 font-semibold text-white hover:bg-[#1677e8] disabled:opacity-60"
        >
          {joining ? "Joining..." : "Join Meeting"}
        </button>

        <button
          onClick={onCancel}
          className="mt-3 w-full py-2 text-sm text-slate-500 hover:text-slate-800"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}
