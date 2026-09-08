"use client";

export default function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2D8CFF] text-lg font-bold text-white">
          Z
        </div>

        <span className="text-xl font-semibold tracking-tight text-slate-800">
          Zoom
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden text-sm text-slate-600 hover:text-slate-900 sm:block">
          Settings
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
          J
        </div>
      </div>
    </nav>
  );
}