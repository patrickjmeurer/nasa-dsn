import { PageHero } from "../components/PageHero";

export function AboutPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Reserved Surface"
        title="This rebuild will keep NASA attribution front and center."
        description="The About page will document the project motivation, explain the XML normalization approach, and credit NASA&apos;s Deep Space Network, DSN Now, and the public data sources used by the frontend."
      />

      <div className="panel">
        <h3>Planned scope</h3>
        <ul className="stack">
          <li>Credits and public-source references</li>
          <li>Portfolio-oriented technical summary</li>
          <li>Links to GitHub, LinkedIn, and the original NASA resources</li>
        </ul>
      </div>
    </div>
  );
}
