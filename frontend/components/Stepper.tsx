"use client";

interface StepperProps {
  value: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

/**
 * An up/down value control. Used for both the hour and minute fields
 * in ScheduleMeetingModal, which previously repeated this same
 * up-arrow/value/down-arrow markup twice with only the field differing.
 */
export default function Stepper({ value, onIncrement, onDecrement }: StepperProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onIncrement}
        className="px-3 py-1 text-slate-500 hover:text-[#2D8CFF]"
      >
        ▲
      </button>

      <div className="rounded-lg border border-slate-300 px-5 py-2 text-lg font-medium">
        {value}
      </div>

      <button
        type="button"
        onClick={onDecrement}
        className="px-3 py-1 text-slate-500 hover:text-[#2D8CFF]"
      >
        ▼
      </button>
    </div>
  );
}
