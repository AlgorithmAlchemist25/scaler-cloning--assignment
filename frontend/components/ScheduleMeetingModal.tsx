"use client";

import { FormEvent, useState } from "react";

interface ScheduleMeetingModalProps {
  open: boolean;
  loading: boolean;
  error: string;
  onClose: () => void;
  onSchedule: (
    title: string,
    description: string,
    scheduledAt: string,
    duration: number
  ) => void;
}

export default function ScheduleMeetingModal({
  open,
  loading,
  error,
  onClose,
  onSchedule,
}: ScheduleMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState("AM");
  const [duration, setDuration] = useState("60");

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !date ||
      Number(duration) <= 0
    ) {
      return;
    }

    let hour24 = hour;

    if (ampm === "PM" && hour !== 12) {
      hour24 += 12;
    }

    if (ampm === "AM" && hour === 12) {
      hour24 = 0;
    }

    const scheduledAt = `${date}T${String(hour24).padStart(
      2,
      "0"
    )}:${String(minute).padStart(2, "0")}`;

    onSchedule(
      title.trim(),
      description.trim(),
      scheduledAt,
      Number(duration)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-xl font-semibold text-slate-900">
          Schedule a meeting
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Plan a meeting and share the generated invite link.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project discussion"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#2D8CFF] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this meeting about?"
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#2D8CFF] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Date
            </label>

            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#2D8CFF] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Time
            </label>

            <div className="flex items-center gap-3">

              {/* Hour */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() =>
                    setHour(hour === 12 ? 1 : hour + 1)
                  }
                  className="px-3 py-1 text-slate-500 hover:text-[#2D8CFF]"
                >
                  ▲
                </button>

                <div className="rounded-lg border border-slate-300 px-5 py-2 text-lg font-medium">
                  {hour}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setHour(hour === 1 ? 12 : hour - 1)
                  }
                  className="px-3 py-1 text-slate-500 hover:text-[#2D8CFF]"
                >
                  ▼
                </button>
              </div>

              <span className="text-xl font-semibold">
                :
              </span>

              {/* Minute */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() =>
                    setMinute((minute + 5) % 60)
                  }
                  className="px-3 py-1 text-slate-500 hover:text-[#2D8CFF]"
                >
                  ▲
                </button>

                <div className="rounded-lg border border-slate-300 px-5 py-2 text-lg font-medium">
                  {String(minute).padStart(2, "0")}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMinute((minute - 5 + 60) % 60)
                  }
                  className="px-3 py-1 text-slate-500 hover:text-[#2D8CFF]"
                >
                  ▼
                </button>
              </div>
              {/* AM/PM */}
              <div className="flex flex-col items-center gap-1">
                <button
                   type="button"
                  onClick={() => setAmpm("AM")}
                  className={`px-3 py-1 text-lg ${
                    ampm === "AM"
                    ? "font-medium text-[#2D8CFF]"
                    : "text-slate-400"
                  }`}
                >
                AM
              </button>

              <button
                type="button"
                onClick={() => setAmpm("PM")}
                className={`px-3 py-1 text-lg ${
                  ampm === "PM"
                    ? "font-medium text-[#2D8CFF]"
                    : "text-slate-400"
                }`}
              >
                PM
              </button>
            </div>

            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Duration
            </label>

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#2D8CFF] focus:ring-2 focus:ring-blue-100"
            >
              <option value="15">
                15 minutes
              </option>

              <option value="30">
                30 minutes
              </option>

              <option value="45">
                45 minutes
              </option>

              <option value="60">
                1 hour
              </option>

              <option value="90">
                1 hour 30 minutes
              </option>

              <option value="120">
                2 hours
              </option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

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
            disabled={loading}
            className="rounded-lg bg-[#2D8CFF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1677e8] disabled:opacity-60"
          >
            {loading
              ? "Scheduling..."
              : "Schedule Meeting"}
          </button>
        </div>
      </form>
    </div>
  );
}