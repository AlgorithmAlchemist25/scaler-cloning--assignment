import { Meeting } from "./types";

/**
 * Scheduled meetings that haven't started yet, soonest first.
 * Instant (unscheduled) meetings have no `scheduled_at` and are excluded.
 */
export function getUpcomingMeetings(meetings: Meeting[]): Meeting[] {
  return meetings
    .filter(
      (meeting) =>
        meeting.scheduled_at !== null &&
        new Date(meeting.scheduled_at) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at as string).getTime() -
        new Date(b.scheduled_at as string).getTime()
    );
}

/**
 * The Join dialog accepts either a bare meeting ID or a full invite
 * link like ".../meeting/<id>". This pulls the ID out of either form.
 */
export function extractMeetingId(input: string): string {
  const trimmed = input.trim();

  if (trimmed.includes("/meeting/")) {
    return trimmed.split("/meeting/")[1].split("/")[0];
  }

  return trimmed;
}
