"use client";

import * as React from "react";
import { Chevron } from "../icons";

interface MainNavProps {
  onScheduleClick: () => void;
  onJoinClick: () => void;
  onHostClick: () => void;
}

/** The main "zoom" logo + Schedule/Join/Host nav bar. */
export default function MainNav({
  onScheduleClick,
  onJoinClick,
  onHostClick,
}: MainNavProps) {
  return React.createElement(
    "header",
    { className: "main-nav" },
    React.createElement("div", { className: "zoom-logo" }, "zoom"),
    React.createElement(
      "nav",
      { className: "main-links" },
      React.createElement("span", null, "Products"),
      React.createElement("span", null, "Solutions"),
      React.createElement("span", null, "Resources"),
      React.createElement("span", null, "Plans & Pricing")
    ),
    React.createElement(
      "nav",
      { className: "right-links" },
      React.createElement(
        "button",
        { onClick: onScheduleClick },
        "Schedule"
      ),
      React.createElement("button", { onClick: onJoinClick }, "Join"),
      React.createElement(
        "button",
        { onClick: onHostClick, className: "nav-dropdown" },
        "Host",
        React.createElement(Chevron, { direction: "down" })
      ),
      React.createElement(
        "button",
        { className: "nav-dropdown" },
        "Web App",
        React.createElement(Chevron, { direction: "down" })
      ),
      React.createElement("div", { className: "user-avatar" }, "J")
    )
  );
}
