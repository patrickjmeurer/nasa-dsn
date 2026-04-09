import { NavLink } from "react-router-dom";

const items = [
  {
    to: "/",
    title: "Overview",
    description: "Product framing, roadmap, and current build status.",
  },
  {
    to: "/antennas",
    title: "Antennas",
    description: "Reserved for live dish inventory and signal surfaces.",
  },
  {
    to: "/stations",
    title: "Stations",
    description: "Reserved for Goldstone, Madrid, and Canberra coverage.",
  },
  {
    to: "/missions",
    title: "Missions",
    description: "Reserved for spacecraft cards and active contact summaries.",
  },
  {
    to: "/metrics",
    title: "Metrics",
    description: "Reserved for rates, signal totals, and operational charts.",
  },
  {
    to: "/about",
    title: "About",
    description: "Reserved for credits, NASA sources, and portfolio framing.",
  },
];

export function AppNav() {
  return (
    <nav className="app-nav" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `app-nav__link${isActive ? " app-nav__link--active" : ""}`
          }
        >
          <span className="app-nav__title">{item.title}</span>
          <span className="app-nav__description">{item.description}</span>
        </NavLink>
      ))}
    </nav>
  );
}
