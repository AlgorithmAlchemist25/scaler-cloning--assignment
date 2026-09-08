/** Converts a 12-hour clock reading (1-12 + AM/PM) to 24-hour form (0-23). */
export function to24Hour(hour12: number, ampm: "AM" | "PM"): number {
  if (ampm === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }

  return hour12 === 12 ? 12 : hour12 + 12;
}

/** Builds a `YYYY-MM-DDTHH:mm` string for the API from separate date/time parts. */
export function toScheduledAt(
  date: string,
  hour12: number,
  minute: number,
  ampm: "AM" | "PM"
): string {
  const hour24 = to24Hour(hour12, ampm);

  return `${date}T${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
