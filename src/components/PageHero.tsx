import type { PropsWithChildren } from "react";

interface PageHeroProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <span className="page-hero__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  );
}
