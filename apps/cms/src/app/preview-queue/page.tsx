export default function PreviewQueuePage() {
  return (
    <section className="workspace">
      <div className="page-title">
        <div>
          <p className="kicker">Preview queue</p>
          <h1>Review staged changes before publish.</h1>
          <p>Track edited modules, QA notes, approval state, and preview links for the current draft.</p>
        </div>
        <button className="btn primary" type="button">Open full preview</button>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Draft pipeline</h2>
            <p>What changed, what needs review, and what is ready.</p>
          </div>
        </div>
        <div className="kanban">
          <div className="kanban-column">
            <h3>Edited</h3>
            <div className="queue-card">
              <strong>Portfolio result copy</strong>
              <span>Product launch case study needs final result.</span>
            </div>
            <div className="queue-card">
              <strong>Team CV links</strong>
              <span>2 profiles still missing CV URLs.</span>
            </div>
          </div>
          <div className="kanban-column">
            <h3>Needs preview</h3>
            <div className="queue-card">
              <strong>CTA form config</strong>
              <span>Mailto pre-fill changed to four required fields.</span>
            </div>
            <div className="queue-card">
              <strong>OG image</strong>
              <span>Awaiting final social preview upload.</span>
            </div>
          </div>
          <div className="kanban-column">
            <h3>Ready</h3>
            <div className="queue-card">
              <strong>Services cards</strong>
              <span>All three service cards are publish-ready.</span>
            </div>
            <div className="queue-card">
              <strong>Frame Studio case study</strong>
              <span>Problem, solution, and result complete.</span>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
