import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { Field, inputCls } from "@/components/pf/ui";
import { leafHead } from "@/lib/meta";

export const Route = createFileRoute("/contact")({
  head: leafHead(
    "/contact",
    "Contact PromptForge — questions, ideas, partnerships",
    "Reach the PromptForge team by email at saintpaulek@gmail.com, on WhatsApp, by phone on +2347069573528, or with the contact form.",
  ),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl sm:text-4xl">CONTACT US</h1>
      <p className="mt-4 text-base leading-relaxed text-[color:var(--color-cream-dim)]">
        Have a question, suggestion, or partnership idea? We'd love to hear from you.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <a
          href="mailto:saintpaulek@gmail.com"
          className="flex min-h-11 items-center gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5 shadow-sm transition hover:border-[color:var(--color-gold)]"
        >
          <Mail className="shrink-0 text-[color:var(--color-ember)]" size={20} />
          <div className="min-w-0">
            <div className="text-xs tracking-wider text-[color:var(--color-gold)] uppercase">Email</div>
            <div className="truncate text-sm font-semibold text-[color:var(--color-cream)]">saintpaulek@gmail.com</div>
          </div>
        </a>
        <a
          href="tel:+2347069573528"
          className="flex min-h-11 items-center gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5 shadow-sm transition hover:border-[color:var(--color-gold)]"
        >
          <Phone className="shrink-0 text-[color:var(--color-ember)]" size={20} />
          <div className="min-w-0">
            <div className="text-xs tracking-wider text-[color:var(--color-gold)] uppercase">Phone</div>
            <div className="truncate text-sm font-semibold text-[color:var(--color-cream)]">+2347069573528</div>
          </div>
        </a>
        <a
          href="https://wa.me/2347069573528"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5 shadow-sm transition hover:border-[color:var(--color-gold)]"
        >
          <MessageCircle className="shrink-0 text-[color:var(--color-ember)]" size={20} />
          <div className="min-w-0">
            <div className="text-xs tracking-wider text-[color:var(--color-gold)] uppercase">WhatsApp</div>
            <div className="truncate text-sm font-semibold text-[color:var(--color-cream)]">Chat with us</div>
          </div>
        </a>
      </div>

      <section className="mt-8 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6 shadow-sm">
        <h2 className="font-display text-2xl">SEND A MESSAGE</h2>

        {sent ? (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] p-4">
            <CheckCircle2 className="shrink-0 text-[color:var(--color-gold)]" size={18} />
            <div className="text-sm text-[color:var(--color-cream)]">Thank you! Your message has been sent.</div>
          </div>
        ) : (
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setName(""); setEmail(""); setMessage("");
            }}
          >
            <Field label="Name">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
            </Field>
            <Field label="Email">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} />
            </Field>
            <Field label="Message">
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className={`${inputCls} min-h-32`}
              />
            </Field>
            <button
              type="submit"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--color-ember)] px-4 py-3 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110 sm:w-auto"
            >
              <Send size={15} /> Submit
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
