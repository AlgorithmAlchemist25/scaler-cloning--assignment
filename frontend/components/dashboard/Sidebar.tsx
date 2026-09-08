"use client";

import { Chevron, ExternalIcon } from "../icons";

/** A single product row in the sidebar, e.g. "Meetings" or "Whiteboards". */
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
      <span>{name}</span>

      <div className="sidebar-item-right">
        {badge && <span className="new-badge">{badge}</span>}
        {external && <ExternalIcon />}
      </div>
    </div>
  );
}

/** A collapsible row at the bottom of the sidebar, e.g. "My Account". */
function SidebarExpandable({ name }: { name: string }) {
  return (
    <div className="sidebar-expandable">
      <Chevron direction="right" />
      <span>{name}</span>
    </div>
  );
}

/** The "My Products" list on the left of the dashboard. Static/decorative. */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-home active">Home</div>

      <div className="sidebar-section-title">My Products</div>

      <SidebarItem name="AI" external badge="New" />
      <SidebarItem name="Meetings" />
      <SidebarItem name="Recordings" />
      <SidebarItem name="Summaries" />
      <SidebarItem name="Hub" external badge="New" />
      <SidebarItem name="Whiteboards" external />
      <SidebarItem name="Notes" />
      <SidebarItem name="Clips" external />
      <SidebarItem name="Canvas" external />
      <SidebarItem name="Paper" external />
      <SidebarItem name="Sheets" external />
      <SidebarItem name="Slides" external />
      <SidebarItem name="Tasks" external />
      <SidebarItem name="Scheduler" external />

      <div className="discover-products">Discover More Products</div>

      <div className="sidebar-bottom">
        <SidebarExpandable name="My Account" />
        <SidebarExpandable name="Admin" />
        <SidebarExpandable name="Support" />
      </div>
    </aside>
  );
}
