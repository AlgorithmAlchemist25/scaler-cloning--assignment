"use client";

interface RecentActivityCardProps {
  loading: boolean;
}

/**
 * NOTE: there is currently no concept of a "past"/completed meeting in
 * the data model (Meeting only has an optional `scheduled_at`), so this
 * always shows the empty state once loading finishes. Wiring this up to
 * real history would mean recording when a meeting actually happened
 * (e.g. from Participant.joined_at) and querying for it here.
 */
export default function RecentActivityCard({ loading }: RecentActivityCardProps) {
  return (
    <section className="recent-card">
      <h2>Recent activity</h2>

      <div className="recent-line" />

      {loading ? (
        <div className="recent-empty">Loading...</div>
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

          <h3>No recent activity</h3>
        </div>
      )}
    </section>
  );
}
