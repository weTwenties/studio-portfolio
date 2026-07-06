"use client";

import { FormEvent } from "react";

import type { SiteContent } from "@/types/messages";

type Site = SiteContent;

type Props = {
  site: Site;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ContactSection({ site, onSubmit }: Props) {
  const c = site.contact;
  const f = c.fields;

  return (
    <section className="cta" id={c.sectionId}>
      <div className="container reveal">
        <div>
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className='leading-[1.1]!'>{c.heading}</h2>
          <p>{c.lead}</p>
        </div>
        <form
          className="contact-form"
          id={c.formId}
          data-od-id="quick-contact-form"
          onSubmit={onSubmit}
        >
          <div className="contact-row">
            <div className="field">
              <label htmlFor={f.name.id}>{f.name.label}</label>
              <input
                className="magnet"
                id={f.name.id}
                name={f.name.name}
                type={f.name.type}
                autoComplete={f.name.autoComplete}
                placeholder={f.name.placeholder}
                required={f.name.required}
              />
            </div>
            <div className="field">
              <label htmlFor={f.email.id}>{f.email.label}</label>
              <input
                className="magnet"
                id={f.email.id}
                name={f.email.name}
                type={f.email.type}
                autoComplete={f.email.autoComplete}
                placeholder={f.email.placeholder}
                required={f.email.required}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor={f.project.id}>{f.project.label}</label>
            <select
              className="magnet"
              id={f.project.id}
              name={f.project.name}
              defaultValue={f.project.defaultOption}
            >
              {f.project.options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={f.brief.id}>{f.brief.label}</label>
            <textarea
              className="magnet"
              id={f.brief.id}
              name={f.brief.name}
              placeholder={f.brief.placeholder}
            />
          </div>
          <button className="btn magnet" type="submit">
            {c.submitLabel}
          </button>
          <p className="form-note">{c.formNote}</p>
        </form>
      </div>
    </section>
  );
}
