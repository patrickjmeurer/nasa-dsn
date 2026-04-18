import { PageHero } from "../components/PageHero";
import { SnapshotStat } from "../components/SnapshotStat";
import { useDsnSnapshot } from "../hooks/useDsnSnapshot";
import { STATION_META } from "../types/dsn";

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "Awaiting source timestamp";
  return new Date(timestamp).toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export function OverviewPage() {
  const { data, error, isLoading } = useDsnSnapshot();
  const totalStations = data?.stations.length || 0;
  const totalDishes =
    data?.stations.reduce((count, station) => count + station.dishes.length, 0) || 0;
  const liveDishes =
    data?.stations.reduce(
      (count, station) =>
        count + station.dishes.filter((dish) => dish.status === "active").length,
      0,
    ) || 0;

  return (
    <div className="page">
      <PageHero
        eyebrow="Milestone 02"
        title="The app now talks to NASA's public DSN XML feed."
        description="This stage introduces the first real data layer: domain types, polling, and an initial parser that turns the public XML into station and dish snapshot data. It is intentionally narrow, but it proves the product is connected to a live source instead of static placeholder content."
      />

      <section className="page-grid">
        <SnapshotStat
          label="Complexes detected"
          value={isLoading ? "…" : totalStations}
          helper="Current DSN station roots parsed from the live XML."
        />
        <SnapshotStat
          label="Dishes in snapshot"
          value={isLoading ? "…" : totalDishes}
          helper="All dishes attached to stations using root document order."
        />
        <SnapshotStat
          label="Live dishes"
          value={isLoading ? "…" : liveDishes}
          helper="Active dishes based on live up/down signal presence."
        />
      </section>

      <section className="page-grid page-grid--wide">
        <article className="panel">
          <h3>Feed status</h3>
          <div className="stack">
            <p>
              <strong>Status:</strong>{" "}
              {isLoading ? "Connecting to NASA feed..." : error ? "Connected with last error" : "Live snapshot loaded"}
            </p>
            <p>
              <strong>Source:</strong> <span className="font-mono">https://eyes.nasa.gov/dsn/data/dsn.xml</span>
            </p>
            <p>
              <strong>Source timestamp:</strong> {formatTimestamp(data?.sourceTimestamp || 0)}
            </p>
            <p>
              <strong>Frontend fetch:</strong> {formatTimestamp(data?.fetchedAt || 0)}
            </p>
            {error ? <p><strong>Last error:</strong> {error.message}</p> : null}
          </div>
        </article>

        <article className="panel">
          <h3>What this milestone proves</h3>
          <ul className="stack">
            <li>The app can poll NASA&apos;s public DSN XML on an interval.</li>
            <li>The parser already respects the real DSN structure where stations and dishes are siblings at the XML root.</li>
            <li>The UI can render basic operational truth before we introduce the richer selector layer.</li>
          </ul>
        </article>
      </section>

      <section className="page-grid page-grid--wide">
        {data?.stations.map((station) => {
          const meta = STATION_META[station.name];
          const liveCount = station.dishes.filter((dish) => dish.status === "active").length;

          return (
            <article className="panel" key={station.name}>
              <div className="station-card__header">
                <div>
                  <p className="station-card__eyebrow">{meta?.flag || station.name.toUpperCase()}</p>
                  <h3>{station.friendlyName || meta?.name || station.name}</h3>
                </div>
                <span className={`station-card__status${liveCount > 0 ? " station-card__status--live" : ""}`}>
                  {liveCount} live
                </span>
              </div>

              <p className="station-card__meta">
                {meta?.location || "Location metadata will be enriched in a later milestone."}
              </p>

              <div className="station-card__metrics">
                <div>
                  <span className="station-card__label">Total dishes</span>
                  <strong className="font-mono">{station.dishes.length}</strong>
                </div>
                <div>
                  <span className="station-card__label">Maintenance</span>
                  <strong className="font-mono">
                    {station.dishes.filter((dish) => dish.status === "maintenance").length}
                  </strong>
                </div>
                <div>
                  <span className="station-card__label">Idle</span>
                  <strong className="font-mono">
                    {station.dishes.filter((dish) => dish.status === "idle").length}
                  </strong>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
