"use client";

export default function MeetingNotFound({
  onBackToDashboard,
}: {
  onBackToDashboard: () => void;
}) {
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
          This meeting may not exist or the meeting ID may be invalid.
        </p>

        <button
          onClick={onBackToDashboard}
          className="mt-6 rounded-lg bg-[#2D8CFF] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to dashboard
        </button>
      </div>
    </main>
  );
}
