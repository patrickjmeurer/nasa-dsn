import { PageHero } from "../components/PageHero";

export function MissionsPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Reserved Surface"
        title="Mission cards will grow from the DSN feed."
        description="Once the parser and selectors are in place, this page will present active missions first and keep offline entries available for context."
      />

      <div className="panel">
        <h3>Planned scope</h3>
        <ul className="stack">
          <li>Live-first mission ordering</li>
          <li>Official aliases and thumbnails from NASA config data</li>
          <li>Mission-specific DSN contact summaries</li>
        </ul>
      </div>
    </div>
  );
}
