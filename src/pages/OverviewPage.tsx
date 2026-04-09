import { PageHero } from "../components/PageHero";

export function OverviewPage() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Milestone 01"
        title="The DSN dashboard starts as a real product shell."
        description="This first step removes the Vite starter and replaces it with the app frame we will grow into the NASA Deep Space Network dashboard. The next milestones will add domain types, XML fetching, parsing, and eventually the full live interface."
      />

      <section className="page-grid">
        <article className="panel">
          <h3>What changed</h3>
          <p>
            The repository now has route structure, persistent navigation, layout composition, and a deliberate visual system instead of template content.
          </p>
        </article>

        <article className="panel">
          <h3>Why start here</h3>
          <p>
            A strong shell gives the project believable product shape in Git history and makes later milestones easier to review, test, and explain.
          </p>
        </article>

        <article className="panel">
          <h3>What comes next</h3>
          <p>
            The next milestone will introduce the DSN domain model and the first real data plumbing from NASA&apos;s public XML feed.
          </p>
        </article>
      </section>
    </div>
  );
}
