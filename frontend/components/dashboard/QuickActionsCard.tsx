"use client";

import { ReactNode } from "react";
import { CalendarIcon, CopyIcon, PlusIcon, VideoIcon } from "../icons";

function QuickAction({
  icon,
  label,
  onClick,
  orange = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  orange?: boolean;
}) {
  return (
    <button className="quick-action" onClick={onClick}>
      <div className={`quick-icon ${orange ? "orange" : ""}`}>{icon}</div>
      <span>{label}</span>
    </button>
  );
}

interface QuickActionsCardProps {
  personalMeetingId: string;
  onScheduleClick: () => void;
  onJoinClick: () => void;
  onHostClick: () => void;
}

/** Schedule/Join/Host quick-action buttons plus the personal meeting ID. */
export default function QuickActionsCard({
  personalMeetingId,
  onScheduleClick,
  onJoinClick,
  onHostClick,
}: QuickActionsCardProps) {
  return (
    <section className="quick-card">
      <div className="quick-actions">
        <QuickAction icon={<CalendarIcon />} label="Schedule" onClick={onScheduleClick} />
        <QuickAction icon={<PlusIcon />} label="Join" onClick={onJoinClick} />
        <QuickAction icon={<VideoIcon />} label="Host" onClick={onHostClick} orange />
      </div>

      <div className="personal-id">
        <h3>Personal Meeting ID</h3>

        <div className="meeting-id-value">
          <span>{personalMeetingId}</span>

          <button
            title="Copy meeting ID"
            onClick={() => navigator.clipboard.writeText(personalMeetingId)}
          >
            <CopyIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
