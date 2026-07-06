export default function VersionsPage() {
  return (
    <section className="workspace">
      <div className="page-title">
        <div>
          <p className="kicker">Version history</p>
          <h1>Compare, restore, and audit publishes.</h1>
          <p>Keep a clear publishing trail for client review and internal rollback.</p>
        </div>
        <button className="btn primary" type="button">Create snapshot</button>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Recent versions</h2>
            <p>Published and draft snapshots for the landing page.</p>
          </div>
        </div>
        <div className="version-list">
          <article className="version-card">
            <span className="tag dark">v13 draft</span>
            <div>
              <strong>CMS pages added</strong>
              <span>Portfolio, team, services, CTA, SEO, preview queue, and history screens.</span>
            </div>
            <button className="btn" type="button">Preview</button>
          </article>
          <article className="version-card">
            <span className="tag">v12</span>
            <div>
              <strong>Quick contact form added</strong>
              <span>CTA mailto form and always-visible cursor update.</span>
            </div>
            <button className="btn" type="button">Restore</button>
          </article>
          <article className="version-card">
            <span className="tag">v11</span>
            <div>
              <strong>Hero marble background</strong>
              <span>Grey marble hero with glassmorphism stat cards.</span>
            </div>
            <button className="btn" type="button">Restore</button>
          </article>
          <article className="version-card">
            <span className="tag">v10</span>
            <div>
              <strong>Glassmorphism direction</strong>
              <span>Landing shifted from flat monochrome to frosted layered surfaces.</span>
            </div>
            <button className="btn" type="button">Restore</button>
          </article>
        </div>
      </section>
    </section>
  );
}
