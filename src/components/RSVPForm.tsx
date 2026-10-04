"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

type RsvpPayload = {
  name: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
  submittedAt: string;
};

async function submitRsvp(payload: RsvpPayload) {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim();

  if (!scriptUrl) {
    throw new Error(
      "RSVP endpoint is not configured. Add NEXT_PUBLIC_GOOGLE_SCRIPT_URL.",
    );
  }

  // GET + no-cors is the most reliable way to hit Apps Script from the browser.
  // The web app must be deployed with "Who has access: Anyone".
  const params = new URLSearchParams({
    name: payload.name,
    phone: payload.phone,
    attending: payload.attending,
    guests: String(payload.guests),
    message: payload.message,
    submittedAt: payload.submittedAt,
  });

  await fetch(`${scriptUrl}?${params.toString()}`, {
    method: "GET",
    mode: "no-cors",
    cache: "no-store",
  });
}

const fieldClass =
  "w-full rounded-xl border border-ink/12 bg-white/80 px-4 py-3 text-base outline-none ring-blush/30 transition focus:ring-2";

const btnPrimary =
  "min-h-11 flex-1 rounded-full bg-ink px-5 py-3 text-xs uppercase tracking-[0.14em] text-paper transition active:scale-[0.98] hover:bg-blush-deep disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-12 sm:text-sm sm:tracking-[0.18em]";

const btnGhost =
  "min-h-11 flex-1 rounded-full border border-ink/15 px-5 py-3 text-xs uppercase tracking-[0.14em] transition active:scale-[0.98] sm:min-h-12 sm:text-sm sm:tracking-[0.18em]";

export default function RSVPForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const reset = () => {
    setStep(1);
    setName("");
    setPhone("");
    setAttending(null);
    setGuests(2);
    setMessage("");
    setStatus("idle");
    setError("");
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!attending) return;

    setStatus("loading");
    setError("");

    try {
      await submitRsvp({
        name: name.trim(),
        phone: phone.trim(),
        attending,
        guests: attending === "yes" ? guests : 0,
        message: message.trim(),
        submittedAt: new Date().toISOString(),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="fade-up mx-auto max-w-lg text-center">
        <p className="script text-3xl text-blush-deep sm:text-4xl">Thank you</p>
        <h3 className="display mt-3 text-2xl text-ink sm:text-4xl">धन्यवाद</h3>
        <p className="mt-4 text-sm text-ink-soft sm:text-base">
          Your response has been noted. We cannot wait to celebrate with you.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 min-h-11 text-xs uppercase tracking-[0.16em] text-sage underline-offset-4 hover:underline sm:text-sm sm:tracking-[0.18em]"
        >
          Amend response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg">
      <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft/70 sm:text-xs sm:tracking-[0.22em]">
        Step {step} of 3
      </p>

      {step === 1 && (
        <div className="fade-up mt-2 space-y-3 sm:mt-4 sm:space-y-5">
          <h3 className="display text-xl text-ink sm:text-4xl">
            Your name and number
          </h3>
          <label className="block">
            <span className="mb-1.5 block text-sm text-ink-soft">Full name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-ink-soft">Phone</span>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
              placeholder="+91 ..."
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
          <fieldset>
            <legend className="mb-2 text-sm text-ink-soft">Can you come?</legend>
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
              {[
                { value: "yes" as const, label: "Yes, I'll be there" },
                { value: "no" as const, label: "Sorry, I can't" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAttending(option.value)}
                  className={`min-h-11 rounded-xl border px-4 py-3 text-left text-sm transition active:scale-[0.99] sm:min-h-12 sm:py-3.5 ${
                    attending === option.value
                      ? "border-blush-deep bg-blush/12 text-blush-deep"
                      : "border-ink/12 bg-white/70"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            type="button"
            disabled={!name.trim() || !phone.trim() || !attending}
            onClick={() => setStep(attending === "no" ? 3 : 2)}
            className={`w-full ${btnPrimary}`}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="fade-up mt-3 space-y-6 sm:mt-4">
          <h3 className="display text-2xl text-ink sm:text-4xl">
            How many of you, {name.split(" ")[0] || "friend"}?
          </h3>
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => setGuests((value) => Math.max(1, value - 1))}
              className="grid h-14 w-14 place-items-center rounded-full border border-ink/15 text-2xl active:scale-95"
              aria-label="Decrease guests"
            >
              −
            </button>
            <span className="display text-5xl text-ink sm:text-6xl">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((value) => Math.min(20, value + 1))}
              className="grid h-14 w-14 place-items-center rounded-full border border-ink/15 text-2xl active:scale-95"
              aria-label="Increase guests"
            >
              +
            </button>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className={btnGhost}>
              Back
            </button>
            <button type="button" onClick={() => setStep(3)} className={btnPrimary}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fade-up mt-3 space-y-4 sm:mt-4 sm:space-y-5">
          <h3 className="display text-2xl text-ink sm:text-4xl">
            Anything for the couple?
          </h3>
          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">
              A note (optional)
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className={`${fieldClass} resize-none`}
              placeholder="Wishes, travel plans, or a little memory..."
            />
          </label>
          {error && <p className="text-sm text-blush-deep">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(attending === "no" ? 1 : 2)}
              className={btnGhost}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className={btnPrimary}
            >
              {status === "loading" ? "Sending..." : "Send RSVP"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
