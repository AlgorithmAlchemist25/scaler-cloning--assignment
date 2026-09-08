"use client";

import { SearchIcon } from "../icons";

/** The thin utility strip above the main Zoom nav bar (Support, Contact Sales, etc). */
export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-right">
        <span className="top-item search-item">
          <SearchIcon />
          Search
        </span>

        <span className="top-item">Support</span>

        <span className="top-item">0008000503335</span>

        <span className="top-divider" />

        <span className="top-item">Contact Sales</span>

        <span className="top-item">Request a Demo</span>
      </div>
    </div>
  );
}
