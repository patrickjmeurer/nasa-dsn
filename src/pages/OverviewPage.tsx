import { PageHero } from "../components/PageHero";
import { SnapshotStat } from "../components/SnapshotStat";
import { DSN_CONFIG_URL, DSN_XML_URL, useDsnSnapshot } from "../hooks/useDsnSnapshot";
import { STATION_META } from "../types/dsn";

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "Awaiting source timestamp";
  return new Date(timestamp).toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export function OverviewPage() {
  const { data, error, isLoading } = useDsnSnapshot();
  const totalStations = data?.stations.length || 0;
  const missionAliases = Object.keys(data?.spacecraftMap || {}).length;
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
        eyebrow="Milestone 03"
        title="The live snapshot is now enriched by NASA's site config."
        description="This stage keeps the real-time polling from dsn.xml, but merges it with config.xml so the app starts to look like the official DSN site inventory. That gives us the missing dishes, station coordinates, and the spacecraft aliases we will need for mission names and thumbnails in the next milestones."
      />

      <section className="page-grid">
        <SnapshotStat
          label="Complexes detected"
          value={isLoading ? "…" : totalStations}
          helper="Current DSN complexes after live snapshot and config inventory merge."
        />
        <SnapshotStat
          label="Dishes in inventory"
          value={isLoading ? "…" : totalDishes}
          helper="Official station inventory from NASA config.xml layered over live telemetry."
        />
        <SnapshotStat
          label="Mission aliases"
          value={isLoading ? "…" : missionAliases}
          helper="Friendly mission metadata now available for names, acronyms, and thumbnails."
        />
      </section>

      <section className="page-grid page-grid--wide">
        <article className="panel">
          <h3>Source status</h3>
          <div className="stack">
            <p>
              <strong>Status:</strong>{" "}
              {isLoading ? "Connecting to NASA sources..." : error ? "Connected with last error" : "Live snapshot + config loaded"}
            </p>
            <p>
              <strong>Live XML:</strong> <span className="font-mono">{DSN_XML_URL}</span>
            </p>
            <p>
              <strong>Config XML:</strong> <span className="font-mono">{DSN_CONFIG_URL}</span>
            </p>
            <p>
              <strong>Source timestamp:</strong> {formatTimestamp(data?.sourceTimestamp || 0)}
            </p>
            <p>
              <strong>Frontend fetch:</strong> {formatTimestamp(data?.fetchedAt || 0)}
            </p>
            <p>
              <strong>Live dishes now visible:</strong> {liveDishes}
            </p>
            {error ? <p><strong>Last error:</strong> {error.message}</p> : null}
          </div>
        </article>

        <article className="panel">
          <h3>What this milestone proves</h3>
          <ul className="stack">
            <li>The app can merge real-time telemetry with NASA&apos;s static DSN site inventory.</li>
            <li>Missing dishes from the official website, such as DSS 65 and DSS 25, can now exist in the UI even without live telemetry.</li>
            <li>Mission aliases like EM2 to Artemis II are now available for later mission and thumbnail views.</li>
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
                  <span className="station-card__label">Live dishes</span>
                  <strong className="font-mono">{liveCount}</strong>
                </div>
                <div>
                  <span className="station-card__label">Maintenance</span>
                  <strong className="font-mono">
                    {station.dishes.filter((dish) => dish.status === "maintenance").length}
                  </strong>
                </div>
              </div>

              <p className="station-card__inventory">
                <strong>Inventory:</strong>{" "}
                {station.dishes.map((dish) => dish.friendlyName || dish.name).join(" · ")}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
