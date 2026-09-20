import { Meeting } from "./types";


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


export function extractMeetingId(input: string): string {
  const trimmed = input.trim();

  if (trimmed.includes("/meeting/")) {
    return trimmed.split("/meeting/")[1].split("/")[0];
  }

  return trimmed;
}
