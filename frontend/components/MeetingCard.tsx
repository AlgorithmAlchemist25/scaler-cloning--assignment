"use client";

import { Meeting } from "../lib/types";

interface MeetingCardProps {
  meeting: Meeting;
  onJoin: (meetingId: string) => void;
}

export default function MeetingCard({
  meeting,
  onJoin,
}: MeetingCardProps) {
  const date = meeting.scheduled_at
    ? new Date(meeting.scheduled_at)
    : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-800">
            {meeting.title || "Instant Meeting"}
          </h3>

          {meeting.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {meeting.description}
            </p>
          )}
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          Meeting
        </span>
      </div>

      {date && (
        <div className="mb-4 text-sm text-slate-500">
          <div>
            {date.toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>

          <div className="mt-1 font-medium text-slate-700">
            {date.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}

            {meeting.duration_minutes
              ? ` • ${meeting.duration_minutes} min`
              : ""}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-400">
          ID: {meeting.meeting_id.slice(0, 8)}...
        </span>

        <button
          onClick={() => onJoin(meeting.meeting_id)}
          className="rounded-lg bg-[#2D8CFF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1677e8]"
        >
          Join
        </button>
      </div>
    </div>
  );
}