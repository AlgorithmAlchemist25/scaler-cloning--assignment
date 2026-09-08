"use client";

/** The "Janavi Arora / Workplace Basic" card at the top of the dashboard. */
export default function ProfileCard() {
  return (
    <section className="profile-card">
      <div className="profile-left">
        <div className="large-avatar">J</div>

        <div>
          <h1>Janavi Arora</h1>
          <p>
            Plan: <strong>Workplace Basic</strong>
          </p>
        </div>
      </div>

      <div className="profile-actions">
        <button className="manage-plan">Manage Plan</button>
        <button className="plan-details">View Plan Details</button>
      </div>
    </section>
  );
}
