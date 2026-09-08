import { CreateMeetingData, Meeting, Participant } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";


async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}


export async function getMeetings(): Promise<Meeting[]> {
  const response = await fetch(`${API_URL}/meetings/`, {
    cache: "no-store",
  });

  return handleResponse<Meeting[]>(response);
}


export async function getMeeting(
  meetingId: string
): Promise<Meeting> {
  const response = await fetch(
    `${API_URL}/meetings/${meetingId}`,
    {
      cache: "no-store",
    }
  );

  return handleResponse<Meeting>(response);
}


export async function createMeeting(
  data: CreateMeetingData = {}
): Promise<Meeting> {
  const response = await fetch(`${API_URL}/meetings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Meeting>(response);
}


export async function scheduleMeeting(
  data: CreateMeetingData
): Promise<Meeting> {
  const response = await fetch(`${API_URL}/meetings/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Meeting>(response);
}


export async function joinMeeting(
  meetingId: string,
  displayName: string
): Promise<Participant> {
  const response = await fetch(
    `${API_URL}/meetings/${meetingId}/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        display_name: displayName,
      }),
    }
  );

  return handleResponse<Participant>(response);
}