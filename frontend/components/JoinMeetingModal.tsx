"use client";

import { FormEvent, useState } from "react";

interface JoinMeetingModalProps {
  open: boolean;
  error: string;
  onClose: () => void;
  onJoin: (meetingId: string) => void;
}

export default function JoinMeetingModal({
  open,
  error,
  onClose,
  onJoin,
}: JoinMeetingModalProps) {
  const [meetingId, setMeetingId] = useState("");

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!meetingId.trim()) {
      return;
    }

    onJoin(meetingId.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-xl font-semibold text-slate-900">
          Join a meeting
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the meeting ID or invite link below.
        </p>

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Meeting ID or invite link
          </label>

          <input
            autoFocus
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            placeholder="Enter meeting ID"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#2D8CFF] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-[#2D8CFF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1677e8]"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}