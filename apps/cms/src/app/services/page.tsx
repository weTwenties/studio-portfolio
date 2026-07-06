export default function ServicesPage() {
  return (
    <section className="workspace">
      <div className="page-title">
        <div>
          <p className="kicker">Services CMS</p>
          <h1>Shape the three service cards.</h1>
          <p>Control service names, ordering, short descriptions, landing card labels, and related portfolio references.</p>
        </div>
        <button className="btn primary" type="button">Add service</button>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Service editor</h2>
            <p>Each service maps directly to one landing page card.</p>
          </div>
          <button className="btn" type="button">Reorder</button>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="service-title">Service title</label>
            <input id="service-title" defaultValue="Product Engineering" />
          </div>
          <div className="field">
            <label htmlFor="service-label">Card label</label>
            <input id="service-label" defaultValue="01 / Engineering" />
          </div>
          <div className="field">
            <label htmlFor="service-related">Related work</label>
            <select id="service-related" defaultValue="Atlas Commerce">
              <option>Atlas Commerce</option>
              <option>Northstar Dashboard</option>
              <option>Frame Studio</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="service-status">Status</label>
            <select id="service-status" defaultValue="Published">
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="service-description">Description</label>
            <textarea
              id="service-description"
              defaultValue="End-to-end implementation of modern web products with clear boundaries between CMS, data layer, and public experience."
            />
          </div>
        </div>
      </section>

      <div className="service-grid">
        <article className="mini-card">
          <span className="tag dark">Active</span>
          <h3>Product Engineering</h3>
          <p>Linked to Atlas Commerce case study.</p>
        </article>
        <article className="mini-card">
          <span className="tag">Active</span>
          <h3>Content Platforms</h3>
          <p>Linked to Frame Studio reference workflow.</p>
        </article>
        <article className="mini-card">
          <span className="tag">Active</span>
          <h3>Interactive Experiences</h3>
          <p>Linked to Northstar Dashboard analytics surface.</p>
        </article>
      </div>
    </section>
  );
}
