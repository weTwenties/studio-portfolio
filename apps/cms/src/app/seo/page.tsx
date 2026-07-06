export default function SeoPage() {
  return (
    <section className="workspace">
      <div className="page-title">
        <div>
          <p className="kicker">SEO metadata</p>
          <h1>Control search and social previews.</h1>
          <p>Manage page title, meta description, OG image, canonical URL, share preview copy, and index readiness.</p>
        </div>
        <button className="btn primary" type="button">Run SEO check</button>
      </div>

      <div className="module-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Metadata fields</h2>
              <p>Core tags for search and sharing.</p>
            </div>
          </div>
          <form className="form">
            <div className="field">
              <label htmlFor="seo-title">Page title</label>
              <input id="seo-title" defaultValue="Studio Portfolio" />
            </div>
            <div className="field">
              <label htmlFor="seo-description">Meta description</label>
              <textarea
                id="seo-description"
                defaultValue="A dual-surface portfolio platform with a public website, lightweight CMS, and snapshot-based publishing workflow."
              />
            </div>
            <div className="field">
              <label htmlFor="seo-canonical">Canonical URL</label>
              <input id="seo-canonical" defaultValue="https://example.com/" />
            </div>
            <div className="field">
              <label>OG image</label>
              <div className="media-drop">
                <div>
                  <strong>Upload OG image</strong>
                  <span>Recommended 1200x630</span>
                </div>
              </div>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Readiness</h2>
              <p>Quick checks before publish.</p>
            </div>
          </div>
          <div className="seo-grid" style={{ gridTemplateColumns: "1fr" }}>
            <article className="mini-card seo-card">
              <h3>Title length</h3>
              <p>Good for search snippets.</p>
              <div className="progress" style={{ ["--value" as string]: "92%" }}>
                <span />
              </div>
            </article>
            <article className="mini-card seo-card">
              <h3>Description clarity</h3>
              <p>Specific offer and audience included.</p>
              <div className="progress" style={{ ["--value" as string]: "84%" }}>
                <span />
              </div>
            </article>
            <article className="mini-card seo-card">
              <h3>OG image</h3>
              <p>Needs final upload before publish.</p>
              <div className="progress" style={{ ["--value" as string]: "52%" }}>
                <span />
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}
