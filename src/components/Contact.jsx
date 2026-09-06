import React, { useState, memo } from "react";
import { Mail, Send, Phone, Facebook, Youtube, Instagram, Loader2, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { PageHeader } from "./common/Page";
import { SITE, FACTS } from "../config/site";

const TikTok = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const SOCIALS = [
  { href: SITE.social.facebook, title: "Facebook", Icon: Facebook },
  { href: SITE.social.instagram, title: "Instagram", Icon: Instagram },
  { href: SITE.social.tiktok, title: "TikTok", Icon: TikTok },
  { href: SITE.social.youtube, title: "YouTube", Icon: Youtube },
];

function ContactComponent() {
  const [formState, setFormState] = useState({ status: "idle", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setFormState({ status: "loading", message: "Sending your message…" });

    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xjgeywbg", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        form.reset();
        setFormState({
          status: "success",
          message: "Message sent. We usually reply within a working day — if it is urgent, call instead.",
        });
      } else {
        setFormState({
          status: "error",
          message: "That did not send. Please try again, or call us on " + SITE.phoneDisplay + ".",
        });
      }
    } catch {
      setFormState({
        status: "error",
        message: "No connection. Check your network and try again, or call " + SITE.phoneDisplay + ".",
      });
    }
  };

  const busy = formState.status === "loading";

  return (
    <>
      <PageHeader
        title="Get in touch"
        lead="Calling is the fastest way to reach us. If you would rather write, use the form and we will come back to you."
      />

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[20rem_minmax(0,1fr)] items-start">

          {/* Direct routes first — most farmers would rather call than type. */}
          <div className="space-y-6">
            <div>
              <h2 className="t-h3">Talk to us directly</h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={SITE.phoneHref} className="flex items-center gap-3 panel p-4 hover:border-field transition-colors">
                    <Phone className="w-5 h-5 text-field shrink-0" aria-hidden="true" />
                    <span>
                      <span className="block font-medium tnum">{SITE.phoneDisplay}</span>
                      <span className="block text-sm text-quiet">
                        {FACTS.hours || "Call or text"}
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 panel p-4 hover:border-field transition-colors">
                    <MessageCircle className="w-5 h-5 text-field shrink-0" aria-hidden="true" />
                    <span>
                      <span className="block font-medium">WhatsApp</span>
                      <span className="block text-sm text-quiet">Send photos of your crop</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={SITE.emailHref} className="flex items-center gap-3 panel p-4 hover:border-field transition-colors">
                    <Mail className="w-5 h-5 text-field shrink-0" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block font-medium break-all">{SITE.email}</span>
                      <span className="block text-sm text-quiet">For documents and quotes</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="t-h3">Follow the farm</h2>
              <div className="flex gap-2 mt-4">
                {SOCIALS.map(({ href, title, Icon }) => (
                  <a
                    key={title}
                    href={href}
                    title={title}
                    aria-label={title}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 grid place-items-center rounded-md border border-rule text-quiet hover:text-field hover:border-field transition-colors"
                  >
                    <Icon className="w-[1.15rem] h-[1.15rem]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="panel p-6 sm:p-8" noValidate={false}>
            <h2 className="t-h3">Send a message</h2>

            {formState.status !== "idle" && (
              <div
                role="status"
                aria-live="polite"
                className={`flex items-start gap-2.5 mt-5 p-3.5 rounded-md text-sm
                  ${formState.status === "success" ? "bg-field-tint text-field-dark"
                    : formState.status === "error" ? "bg-bulb-tint text-bulb"
                      : "bg-husk text-quiet"}`}
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin shrink-0 mt-px" />}
                {formState.status === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-px" />}
                {formState.status === "error" && <AlertCircle className="w-4 h-4 shrink-0 mt-px" />}
                <span>{formState.message}</span>
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="contact-name" className="field-label">Your name</label>
                <input id="contact-name" name="name" type="text" required disabled={busy}
                  autoComplete="name" className="field-input" />
              </div>

              <div>
                <label htmlFor="contact-email" className="field-label">Email</label>
                <input id="contact-email" name="email" type="email" required disabled={busy}
                  autoComplete="email" inputMode="email" className="field-input" />
              </div>

              <div>
                <label htmlFor="contact-phone" className="field-label">
                  Phone <span className="text-quiet font-normal">(optional, but faster)</span>
                </label>
                <input id="contact-phone" name="phone" type="tel" disabled={busy}
                  autoComplete="tel" inputMode="tel" placeholder="07xx xxx xxx" className="field-input" />
              </div>

              <div>
                <label htmlFor="contact-message" className="field-label">
                  What do you need help with?
                </label>
                <textarea id="contact-message" name="message" rows={5} required disabled={busy}
                  placeholder="Acreage, crop, water source, and where you are stuck."
                  className="field-input resize-y" />
              </div>

              <button type="submit" disabled={busy} className="btn btn-primary btn-block">
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending</> : <><Send className="w-4 h-4" /> Send message</>}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}

export default memo(ContactComponent);
