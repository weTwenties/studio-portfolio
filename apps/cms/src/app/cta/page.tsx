export default function CtaPage() {
  return (
    <section className="workspace">
      <div className="page-title">
        <div>
          <p className="kicker">CTA CMS</p>
          <h1>Configure the final conversion block.</h1>
          <p>Edit CTA copy, button text, contact destination, form fields, and submission behavior for the landing page.</p>
        </div>
        <button className="btn primary" type="button">Preview CTA</button>
      </div>

      <div className="module-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>CTA content</h2>
              <p>Final pitch and action text.</p>
            </div>
          </div>
          <form className="form">
            <div className="field">
              <label htmlFor="cta-headline">Headline</label>
              <textarea
                id="cta-headline"
                defaultValue="Tell us about your next product."
              />
            </div>
            <div className="field">
              <label htmlFor="cta-supporting">Supporting copy</label>
              <textarea
                id="cta-supporting"
                defaultValue="Share what you are building, the scope you have in mind, and your timeline. We will help shape the approach and delivery path."
              />
            </div>
            <div className="split">
              <div className="field">
                <label htmlFor="cta-button-text">Button text</label>
                <input id="cta-button-text" defaultValue="Get in touch" />
              </div>
              <div className="field">
                <label htmlFor="cta-contact-email">Contact email</label>
                <input id="cta-contact-email" defaultValue="hello@example.com" />
              </div>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Form config</h2>
              <p>Submission mode and required fields.</p>
            </div>
          </div>
          <form className="form">
            <div className="field">
              <label htmlFor="cta-mode">Submission mode</label>
              <select id="cta-mode" defaultValue="Mailto pre-fill">
                <option>Mailto pre-fill</option>
                <option>Webhook endpoint</option>
                <option>CRM handoff</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cta-required">Required fields</label>
              <input
                id="cta-required"
                defaultValue="Name, email, project type, quick brief"
              />
            </div>
            <div className="field">
              <label htmlFor="cta-success">Success message</label>
              <input
                id="cta-success"
                defaultValue="Your brief is ready in your email app."
              />
            </div>
          </form>
        </section>
      </div>
    </section>
  );
}
