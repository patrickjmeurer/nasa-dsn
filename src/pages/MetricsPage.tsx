import { PageHero } from "../components/PageHero";

export function MetricsPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Reserved Surface"
        title="Metrics will turn the feed into operational readouts."
        description="The charting and signal totals page will be added after the selectors are extracting reliable active communication summaries."
      />

      <div className="panel">
        <h3>Planned scope</h3>
        <ul className="stack">
          <li>Live uplink and downlink totals</li>
          <li>Station distribution summaries</li>
          <li>Communication tables and chart-based telemetry views</li>
        </ul>
      </div>
    </div>
  );
}
