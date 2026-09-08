export interface Meeting {
  id: number;
  meeting_id: string;
  title: string | null;
  description: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  created_at: string;
  invite_link: string;
}

export interface CreateMeetingData {
  title?: string;
  description?: string;
  scheduled_at?: string;
  duration_minutes?: number;
}

export interface Participant {
  id: number;
  meeting_id: string;
  display_name: string;
  joined_at: string;
}