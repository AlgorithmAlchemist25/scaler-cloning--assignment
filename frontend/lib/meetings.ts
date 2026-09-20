export function extractMeetingId(input: string): string {
  const trimmed = input.trim();

  if (trimmed.includes("/meeting/")) {
    return trimmed.split("/meeting/")[1].split("/")[0];
  }

  return trimmed;
}
