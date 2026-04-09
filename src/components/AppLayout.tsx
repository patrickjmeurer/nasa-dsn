import type { PropsWithChildren } from "react";
import { AppNav } from "./AppNav";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__inner">
          <div className="app-brand">
            <span className="app-brand__eyebrow">
              <span className="app-brand__dot" />
              public build log
            </span>
            <h1>NASA DSN</h1>
            <p>
              Fresh rebuild of the dashboard from a clean Vite baseline, one milestone at a time.
            </p>
          </div>
          <AppNav />
        </div>

        <div className="app-sidebar__footer">
          <p>Milestone 01</p>
          <span>App shell, routes, navigation, and first product framing.</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div className="app-header__status">Project bootstrap complete</div>
          <div className="app-header__meta">React + TypeScript + Vite</div>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
