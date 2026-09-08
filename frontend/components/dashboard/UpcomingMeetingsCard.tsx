"use client";

import { Meeting } from "../../lib/types";

interface UpcomingMeetingsCardProps {
  loading: boolean;
  upcomingMeetings: Meeting[];
  onSelectMeeting: (meetingId: string) => void;
}

/** Lists up to 3 soonest scheduled meetings, or an empty/loading state. */
export default function UpcomingMeetingsCard({
  loading,
  upcomingMeetings,
  onSelectMeeting,
}: UpcomingMeetingsCardProps) {
  return (
    <section className="meetings-card">
      <div className="meetings-heading">
        <h2>Meetings</h2>
        <button>Visit Meetings</button>
      </div>

      {loading ? (
        <div className="upcoming-box">Loading meetings...</div>
      ) : upcomingMeetings.length === 0 ? (
        <div className="upcoming-box">No Upcoming Meetings</div>
      ) : (
        <div className="upcoming-list">
          {upcomingMeetings.slice(0, 3).map((meeting) => (
            <button
              key={meeting.id}
              className="upcoming-meeting"
              onClick={() => onSelectMeeting(meeting.meeting_id)}
            >
              <strong>{meeting.title || "Scheduled Meeting"}</strong>

              <span>
                {meeting.scheduled_at
                  ? new Date(meeting.scheduled_at).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : ""}
              </span>
            </button>
          ))}
        </div>
      )}

      <button className="test-audio">Test Audio and Video</button>
    </section>
  );
}
