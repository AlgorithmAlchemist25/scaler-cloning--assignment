"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createMeeting,
  getMeetings,
  joinMeeting,
  scheduleMeeting,
} from "../lib/api";

import { Meeting } from "../lib/types";

import NewMeetingModal from "../components/NewMeetingModal";
import JoinMeetingModal from "../components/JoinMeetingModal";
import ScheduleMeetingModal from "../components/ScheduleMeetingModal";


function SearchIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}


function ExternalIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" />
    </svg>
  );
}


function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}


function CalendarIcon() {
  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M8 2v4M16 2v4M3 9h18" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
    </svg>
  );
}


function PlusIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}


function VideoIcon() {
  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
    >
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </svg>
  );
}


function CopyIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}


export default function Home() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const [joinMeetingOpen, setJoinMeetingOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    loadMeetings();
  }, []);


  async function loadMeetings() {
    try {
      setLoading(true);

      const data = await getMeetings();

      setMeetings(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load meetings.");
    } finally {
      setLoading(false);
    }
  }


  async function handleNewMeeting() {
    try {
      setActionLoading(true);
      setError("");

      const meeting = await createMeeting();

      setNewMeetingOpen(false);

      router.push(`/meeting/${meeting.meeting_id}`);
    } catch (err) {
      console.error(err);
      setError("Unable to create meeting.");
    } finally {
      setActionLoading(false);
    }
  }


  async function handleJoinMeeting(
    meetingId: string,
    displayName: string
  ) {
    try {
      setActionLoading(true);
      setError("");

      let actualMeetingId = meetingId.trim();

      if (actualMeetingId.includes("/meeting/")) {
        actualMeetingId =
          actualMeetingId.split("/meeting/")[1].split("/")[0];
      }

      await joinMeeting(actualMeetingId, displayName);

      setJoinMeetingOpen(false);

      router.push(`/meeting/${actualMeetingId}`);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to join meeting."
      );
    } finally {
      setActionLoading(false);
    }
  }


  async function handleScheduleMeeting(
    title: string,
    description: string,
    scheduledAt: string,
    duration: number
  ) {
    try {
      setActionLoading(true);
      setError("");

      await scheduleMeeting({
        title,
        description,
        scheduled_at: scheduledAt,
        duration_minutes: duration,
      });

      setScheduleMeetingOpen(false);

      await loadMeetings();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to schedule meeting."
      );
    } finally {
      setActionLoading(false);
    }
  }


  const upcomingMeetings = meetings
    .filter(
      (meeting) =>
        meeting.scheduled_at &&
        new Date(meeting.scheduled_at) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at!).getTime() -
        new Date(b.scheduled_at!).getTime()
    );


  const personalMeetingId =
    meetings.length > 0
      ? meetings[0].meeting_id
      : "7694598135";


  return (
    <div className="zoom-page">

      {/* TOP UTILITY BAR */}
      <div className="top-bar">

        <div className="top-bar-right">

          <span className="top-item search-item">
            <SearchIcon />
            Search
          </span>

          <span className="top-item">
            Support
          </span>

          <span className="top-item">
            0008000503335
          </span>

          <span className="top-divider" />

          <span className="top-item">
            Contact Sales
          </span>

          <span className="top-item">
            Request a Demo
          </span>

        </div>

      </div>


      {/* MAIN NAVIGATION */}
      <header className="main-nav">

        <div className="zoom-logo">
          zoom
        </div>


        <nav className="main-links">

          <span>Products</span>
          <span>Solutions</span>
          <span>Resources</span>
          <span>Plans & Pricing</span>

        </nav>


        <nav className="right-links">

          <button
            onClick={() => setScheduleMeetingOpen(true)}
          >
            Schedule
          </button>

          <button
            onClick={() => setJoinMeetingOpen(true)}
          >
            Join
          </button>

          <button
            onClick={() => setNewMeetingOpen(true)}
            className="nav-dropdown"
          >
            Host
            <ChevronDown />
          </button>

          <button className="nav-dropdown">
            Web App
            <ChevronDown />
          </button>

          <div className="user-avatar">
            J
          </div>

        </nav>

      </header>


      <div className="body-layout">


        {/* SIDEBAR */}
        <aside className="sidebar">

          <div className="sidebar-home active">
            Home
          </div>


          <div className="sidebar-section-title">
            My Products
          </div>


          <SidebarItem
            name="AI"
            external
            badge="New"
          />

          <SidebarItem name="Meetings" />

          <SidebarItem name="Recordings" />

          <SidebarItem name="Summaries" />

          <SidebarItem
            name="Hub"
            external
            badge="New"
          />

          <SidebarItem
            name="Whiteboards"
            external
          />

          <SidebarItem name="Notes" />

          <SidebarItem
            name="Clips"
            external
          />

          <SidebarItem name="Canvas" external />

          <SidebarItem name="Paper" external />

          <SidebarItem name="Sheets" external />

          <SidebarItem name="Slides" external />

          <SidebarItem name="Tasks" external />

          <SidebarItem name="Scheduler" external />


          <div className="discover-products">
            Discover More Products
          </div>


          <div className="sidebar-bottom">

            <SidebarExpandable name="My Account" />

            <SidebarExpandable name="Admin" />

            <SidebarExpandable name="Support" />

          </div>

        </aside>


        {/* MAIN CONTENT */}
        <main className="dashboard">

          {/* TOP GRID */}
          <div className="dashboard-grid">


            {/* PROFILE CARD */}
            <section className="profile-card">

              <div className="profile-left">

                <div className="large-avatar">
                  J
                </div>

                <div>

                  <h1>
                    Janavi Arora
                  </h1>

                  <p>
                    Plan: <strong>Workplace Basic</strong>
                  </p>

                </div>

              </div>


              <div className="profile-actions">

                <button className="manage-plan">
                  Manage Plan
                </button>

                <button className="plan-details">
                  View Plan Details
                </button>

              </div>

            </section>


            {/* QUICK ACTIONS / PERSONAL ID */}
            <section className="quick-card">

              <div className="quick-actions">

                <QuickAction
                  icon={<CalendarIcon />}
                  label="Schedule"
                  onClick={() =>
                    setScheduleMeetingOpen(true)
                  }
                />

                <QuickAction
                  icon={<PlusIcon />}
                  label="Join"
                  onClick={() =>
                    setJoinMeetingOpen(true)
                  }
                />

                <QuickAction
                  icon={<VideoIcon />}
                  label="Host"
                  onClick={() =>
                    setNewMeetingOpen(true)
                  }
                  orange
                />

              </div>


              <div className="personal-id">

                <h3>
                  Personal Meeting ID
                </h3>

                <div className="meeting-id-value">

                  <span>
                    {personalMeetingId}
                  </span>

                  <button
                    title="Copy meeting ID"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        personalMeetingId
                      );
                    }}
                  >
                    <CopyIcon />
                  </button>

                </div>

              </div>

            </section>


            {/* RECENT ACTIVITY */}
            <section className="recent-card">

              <h2>
                Recent activity
              </h2>

              <div className="recent-line" />

              {loading ? (
                <div className="recent-empty">
                  Loading...
                </div>
              ) : (
                <div className="recent-empty">

                  <div className="empty-box">

                    <div className="box-top">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="box-body">
                      <span />
                      <span />
                    </div>

                  </div>

                  <h3>
                    No recent activity
                  </h3>

                </div>
              )}

            </section>


            {/* MEETINGS CARD */}
            <section className="meetings-card">

              <div className="meetings-heading">

                <h2>
                  Meetings
                </h2>

                <button>
                  Visit Meetings
                </button>

              </div>


              {loading ? (
                <div className="upcoming-box">
                  Loading meetings...
                </div>
              ) : upcomingMeetings.length === 0 ? (
                <div className="upcoming-box">
                  No Upcoming Meetings
                </div>
              ) : (
                <div className="upcoming-list">

                  {upcomingMeetings
                    .slice(0, 3)
                    .map((meeting) => (
                      <button
                        key={meeting.id}
                        className="upcoming-meeting"
                        onClick={() =>
                          router.push(
                            `/meeting/${meeting.meeting_id}`
                          )
                        }
                      >
                        <strong>
                          {meeting.title ||
                            "Scheduled Meeting"}
                        </strong>

                        <span>
                          {meeting.scheduled_at
                            ? new Date(
                                meeting.scheduled_at
                              ).toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : ""}
                        </span>
                      </button>
                    ))}

                </div>
              )}


              <button className="test-audio">
                Test Audio and Video
              </button>

            </section>

          </div>

        </main>

      </div>


      {/* ERROR */}
      {error && (
        <div className="error-toast">

          <span>
            {error}
          </span>

          <button
            onClick={() => setError("")}
          >
            ×
          </button>

        </div>
      )}


      {/* FLOATING HELP */}
      <button className="help-button">
        ◡
      </button>


      {/* MODALS */}
      <NewMeetingModal
        open={newMeetingOpen}
        loading={actionLoading}
        onClose={() => setNewMeetingOpen(false)}
        onCreate={handleNewMeeting}
      />

      <JoinMeetingModal
        open={joinMeetingOpen}
        loading={actionLoading}
        error={error}
        onClose={() => {
          setJoinMeetingOpen(false);
          setError("");
        }}
        onJoin={handleJoinMeeting}
      />

      <ScheduleMeetingModal
        open={scheduleMeetingOpen}
        loading={actionLoading}
        error={error}
        onClose={() => {
          setScheduleMeetingOpen(false);
          setError("");
        }}
        onSchedule={handleScheduleMeeting}
      />

    </div>
  );
}


/* SIDEBAR ITEM */

function SidebarItem({
  name,
  external = false,
  badge,
}: {
  name: string;
  external?: boolean;
  badge?: string;
}) {
  return (
    <div className="sidebar-item">

      <span>
        {name}
      </span>

      <div className="sidebar-item-right">

        {badge && (
          <span className="new-badge">
            {badge}
          </span>
        )}

        {external && <ExternalIcon />}

      </div>

    </div>
  );
}


/* EXPANDABLE SIDEBAR ITEM */

function SidebarExpandable({
  name,
}: {
  name: string;
}) {
  return (
    <div className="sidebar-expandable">

      <ChevronRight />

      <span>
        {name}
      </span>

    </div>
  );
}


function ChevronRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}


/* QUICK ACTION */

function QuickAction({
  icon,
  label,
  onClick,
  orange = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  orange?: boolean;
}) {
  return (
    <button
      className="quick-action"
      onClick={onClick}
    >

      <div
        className={`quick-icon ${
          orange ? "orange" : ""
        }`}
      >
        {icon}
      </div>

      <span>
        {label}
      </span>

    </button>
  );
}