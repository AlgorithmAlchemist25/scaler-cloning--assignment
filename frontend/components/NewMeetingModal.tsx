"use client";

interface NewMeetingModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: () => void;
}

export default function NewMeetingModal({
  open,
  loading,
  onClose,
  onCreate,
}: NewMeetingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Start an instant meeting
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A new meeting link will be generated for you.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          Your meeting will be created immediately and you'll be
          redirected to the meeting room.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onCreate}
            disabled={loading}
            className="rounded-lg bg-[#2D8CFF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1677e8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Start Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}