import { PageHero } from "../components/PageHero";

export function AntennasPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Reserved Surface"
        title="Antenna inventory will live here."
        description="This page is already routed and shaped so we can add dish cards, uplink/downlink details, and mission links as soon as the DSN data layer lands."
      />

      <div className="panel">
        <h3>Planned scope</h3>
        <ul className="stack">
          <li>Dish status cards per station complex</li>
          <li>Mission links from each active antenna</li>
          <li>Expanded uplink/downlink detail panels</li>
        </ul>
      </div>
    </div>
  );
}
