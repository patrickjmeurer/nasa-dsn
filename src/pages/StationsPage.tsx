import { PageHero } from "../components/PageHero";

export function StationsPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Reserved Surface"
        title="The global station view comes next."
        description="Goldstone, Madrid, and Canberra will eventually be mapped here with live dish counts and coverage context."
      />

      <div className="panel">
        <h3>Planned scope</h3>
        <ul className="stack">
          <li>Interactive world map anchored by the three DSN complexes</li>
          <li>Station-level live dish summaries</li>
          <li>Mission target visibility by complex</li>
        </ul>
      </div>
    </div>
  );
}
