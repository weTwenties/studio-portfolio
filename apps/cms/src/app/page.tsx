export default function CmsHome() {
  return (
    <section className="workspace">
      <div className="hero-panel">
        <div className="summary">
          <p className="kicker">Structured CMS</p>
          <h1>Manage the story without touching code.</h1>
          <p>Edit portfolio case studies, team character cards, service copy, CTA behavior, and SEO metadata from one focused workspace.</p>
        </div>

        <div className="health">
          <div className="health-card">
            <span>SEO readiness</span>
            <strong>82%</strong>
            <span>Title, description, and OG image staged</span>
          </div>
          <div className="health-card">
            <span>Published version</span>
            <strong>v12</strong>
            <span>Last published 2 hours ago</span>
          </div>
          <div className="health-card">
            <span>Portfolio items</span>
            <strong>03</strong>
            <span>All have modal case studies</span>
          </div>
          <div className="health-card">
            <span>Team cards</span>
            <strong>04</strong>
            <span>2 cards need CV links</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="stack">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Portfolio content</h2>
                <p>Selected works, tags, cover image, case-study modal, and demo link.</p>
              </div>
              <button className="btn" type="button">Add project</button>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Tags</th>
                    <th>Case study</th>
                    <th>Demo</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="row-title">
                        <span className="thumb" />
                        <div>
                          <strong>Atlas Commerce</strong>
                          <span>E-commerce platform with optimized checkout</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="tags">
                        <span className="tag dark">Web</span>
                        <span className="tag">E-commerce</span>
                      </div>
                    </td>
                    <td><span className="tag">Complete</span></td>
                    <td><span className="tag">Embed ready</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" type="button">E</button>
                        <button className="icon-btn" type="button">P</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="row-title">
                        <span className="thumb" />
                        <div>
                          <strong>Northstar Dashboard</strong>
                          <span>Real-time analytics dashboard</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="tags">
                        <span className="tag dark">Dashboard</span>
                        <span className="tag">Analytics</span>
                      </div>
                    </td>
                    <td><span className="tag">Needs result</span></td>
                    <td><span className="tag">URL added</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" type="button">E</button>
                        <button className="icon-btn" type="button">P</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="row-title">
                        <span className="thumb" />
                        <div>
                          <strong>Frame Studio</strong>
                          <span>Portfolio builder for creative studios</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="tags">
                        <span className="tag dark">CMS</span>
                        <span className="tag">Portfolio</span>
                      </div>
                    </td>
                    <td><span className="tag">Complete</span></td>
                    <td><span className="tag">Embed ready</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" type="button">E</button>
                        <button className="icon-btn" type="button">P</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Services</h2>
                <p>Short, scannable copy for the landing service cards.</p>
              </div>
              <button className="btn" type="button">Reorder</button>
            </div>
            <div className="card-grid">
              <article className="mini-card">
                <span className="tag">01 / Engineering</span>
                <h3>Product Engineering</h3>
                <p>End-to-end implementation of modern web products.</p>
              </article>
              <article className="mini-card">
                <span className="tag">02 / Platform</span>
                <h3>Content Platforms</h3>
                <p>Public experiences paired with lightweight CMS workflows.</p>
              </article>
              <article className="mini-card">
                <span className="tag">03 / Frontend</span>
                <h3>Interactive Experiences</h3>
                <p>Responsive, high-engagement interfaces beyond conventional dashboards.</p>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>SEO and metadata</h2>
                <p>Search title, meta description, OG image, and share preview readiness.</p>
              </div>
              <button className="btn" type="button">Run check</button>
            </div>
            <div className="card-grid">
              <article className="mini-card">
                <span className="tag">Title</span>
                <h3>Studio Portfolio</h3>
                <p>92% ready</p>
              </article>
              <article className="mini-card">
                <span className="tag">Description</span>
                <h3>Dual-surface portfolio platform with CMS and snapshot publishing.</h3>
                <p>78% ready</p>
              </article>
              <article className="mini-card">
                <span className="tag">OG image</span>
                <h3>Monochrome marble hero preview</h3>
                <p>68% ready</p>
              </article>
            </div>
          </section>
        </div>

        <aside className="stack">
          <section className="editor">
            <div className="editor-head">
              <div>
                <h2>Edit selected project</h2>
                <p>Atlas Commerce</p>
              </div>
              <span className="tag dark">Draft</span>
            </div>
            <form className="form">
              <div className="field">
                <label htmlFor="project-title">Project title</label>
                <input id="project-title" defaultValue="Atlas Commerce" />
              </div>
              <div className="field">
                <label>Cover image</label>
                <div className="media-drop">
                  <div>
                    <strong>Drop cover image</strong>
                    <br />
                    <span>PNG, JPG, or animated preview</span>
                  </div>
                </div>
              </div>
              <div className="split">
                <div className="field">
                  <label htmlFor="tags">Tags</label>
                  <input id="tags" defaultValue="Web, E-commerce" />
                </div>
                <div className="field">
                  <label htmlFor="demo-link">Demo link / embed</label>
                  <input id="demo-link" defaultValue="https://example.com/projects/atlas-commerce" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="short-description">Short description</label>
                <textarea id="short-description" defaultValue="E-commerce platform with an optimized checkout flow and mobile-first purchase path." />
              </div>
              <div className="tabs">
                <button className="tab is-active" type="button">Problem</button>
                <button className="tab" type="button">Solution</button>
                <button className="tab" type="button">Result</button>
              </div>
              <div className="field">
                <label htmlFor="case-study">Case study copy</label>
                <textarea id="case-study" defaultValue="Low mobile conversion required a redesigned checkout flow with fewer steps and clearer state." />
              </div>
            </form>
            <div className="editor-foot">
              <button className="btn" type="button">Save draft</button>
              <button className="btn primary" type="button">Preview</button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Team content</h2>
                <p>Character cards, skills, project references, and CV links.</p>
              </div>
            </div>
            <div className="activity">
              <div className="activity-item">
                <span className="activity-dot">D</span>
                <div><strong>Design Lead</strong><span>Bio ready. Needs project references.</span></div>
              </div>
              <div className="activity-item">
                <span className="activity-dot">C</span>
                <div><strong>Creative Developer</strong><span>Skills and CV link complete.</span></div>
              </div>
              <div className="activity-item">
                <span className="activity-dot">T</span>
                <div><strong>Technologist</strong><span>Avatar uploaded. Bio in draft.</span></div>
              </div>
              <div className="activity-item">
                <span className="activity-dot">P</span>
                <div><strong>Producer</strong><span>Ready to publish.</span></div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>CTA config</h2>
                <p>Final conversion block and contact destination.</p>
              </div>
            </div>
            <form className="form">
              <div className="field">
                <label htmlFor="button-text">Button text</label>
                <input id="button-text" defaultValue="Start a project" />
              </div>
              <div className="field">
                <label htmlFor="contact-email">Contact email</label>
                <input id="contact-email" defaultValue="hello@example.com" />
              </div>
              <div className="field">
                <label htmlFor="form-config">Form config</label>
                <select id="form-config" defaultValue="Mailto pre-fill">
                  <option>Mailto pre-fill</option>
                  <option>Webhook endpoint</option>
                  <option>CRM handoff</option>
                </select>
              </div>
            </form>
          </section>
        </aside>
      </div>
    </section>
  );
}
