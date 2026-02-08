import { useEffect, useMemo, useState } from "react";
import { pages, sections } from "./content/docs";

function getSectionFromHash(hash: string): string {
  const clean = hash.replace("#", "").trim();
  return clean || "overview";
}

export function App() {
  const [active, setActive] = useState<string>(() => getSectionFromHash(window.location.hash));
  const [query, setQuery] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    const onHashChange = () => setActive(getSectionFromHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const current = useMemo(
    () => sections.find((section) => section.id === active) ?? sections[0],
    [active]
  );
  const currentPage = current.page;
  const visibleSections = sections.filter((section) => section.page === currentPage);
  const filteredSections = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return visibleSections;
    }
    return visibleSections.filter((section) => {
      const haystack = [
        section.title,
        ...section.body,
        ...(section.bullets ?? []),
        section.code ?? "",
        ...(section.apiRows ?? []).map((row) => `${row.method} ${row.params} ${row.returns} ${row.notes}`)
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [query, visibleSections]);

  const switchPage = (page: string) => {
    const first = sections.find((section) => section.page === page);
    if (first) {
      window.location.hash = `#${first.id}`;
    }
  };

  const copyCode = async () => {
    if (!current.code) {
      return;
    }
    try {
      await navigator.clipboard.writeText(current.code);
      setCopyState("ok");
    } catch {
      setCopyState("fail");
    }
    setTimeout(() => setCopyState("idle"), 1200);
  };

  return (
    <div className="page">
      <header className="hero">
        <p className="chip">@oxog/seo</p>
        <h1>Technical Documentation</h1>
        <p className="lead">
          Enterprise on-page SEO scoring engine with deterministic rules and optional AI enhancement.
        </p>
        <div className="links">
          <a href="https://github.com/ersinkoc/seo" target="_blank" rel="noreferrer">
            Repository
          </a>
          <a href="https://www.npmjs.com/package/@oxog/seo" target="_blank" rel="noreferrer">
            npm
          </a>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <h2>Pages</h2>
          <div className="page-switcher">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                className={page.id === currentPage ? "active" : ""}
                onClick={() => switchPage(page.id)}
              >
                {page.label}
              </button>
            ))}
          </div>

          <h2>Docs</h2>
          <input
            className="search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search current page..."
          />
          <nav>
            {filteredSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={section.id === current.id ? "active" : ""}
              >
                {section.title}
              </a>
            ))}
            {filteredSections.length === 0 ? <p className="no-match">No matches</p> : null}
          </nav>
        </aside>

        <section className="content card">
          <h2>{current.title}</h2>
          {current.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {current.bullets ? (
            <ul>
              {current.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {current.apiRows ? (
            <div className="api-table-wrap">
              <table className="api-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Params</th>
                    <th>Returns</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {current.apiRows.map((row) => (
                    <tr key={row.method}>
                      <td>
                        <code>{row.method}</code>
                      </td>
                      <td>
                        <code>{row.params}</code>
                      </td>
                      <td>
                        <code>{row.returns}</code>
                      </td>
                      <td>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {current.apiDetails ? (
            <div className="api-details">
              {current.apiDetails.map((item) => (
                <article key={item.method} className="api-card">
                  <h3>
                    <code>{item.method}</code>
                  </h3>
                  <p>{item.purpose}</p>
                  <div className="api-card-grid">
                    <div>
                      <h4>Example</h4>
                      <pre>
                        <code>{item.example}</code>
                      </pre>
                    </div>
                    <div>
                      <h4>Edge Case</h4>
                      <p>{item.edgeCase}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
          {current.code ? (
            <div className="code-wrap">
              <div className="code-tools">
                <button type="button" onClick={copyCode}>
                  {copyState === "idle" ? "Copy" : copyState === "ok" ? "Copied" : "Failed"}
                </button>
              </div>
              <pre>
                <code>{current.code}</code>
              </pre>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="footer">
        <p>Copyright 2026 @oxog/seo</p>
      </footer>
    </div>
  );
}
