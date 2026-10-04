"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ceremonies,
  wedding,
  type Ceremony,
  type SkyPhase,
} from "@/lib/config";
import Countdown from "@/components/Countdown";
import InviteGate from "@/components/InviteGate";
import MusicPlayer from "@/components/MusicPlayer";
import RSVPForm from "@/components/RSVPForm";
import SkyScene, { skyTextTone } from "@/components/SkyScene";

const pageOrder = [
  "intro",
  "haldi",
  "mehendi",
  "sangeet",
  "wedding",
  "jai-mala",
  "phere",
  "venue",
  "rsvp",
] as const;

const pageSky: Record<(typeof pageOrder)[number], SkyPhase> = {
  intro: "dusk",
  haldi: "noon",
  mehendi: "afternoon",
  sangeet: "sunset",
  wedding: "dusk",
  "jai-mala": "midnight",
  phere: "midnight",
  venue: "soft",
  rsvp: "soft",
};

function ScrollHint({
  light,
  onClick,
}: {
  light?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`scroll-hint ${light ? "text-paper/70" : "text-ink/45"}`}
      aria-label="Go to next page"
    >
      <span className="scroll-chevron text-xl leading-none">↓</span>
    </button>
  );
}

function CeremonyPage({
  ceremony,
  onNext,
}: {
  ceremony: Ceremony;
  onNext?: () => void;
}) {
  const isNight =
    ceremony.sky === "midnight" ||
    ceremony.sky === "dusk" ||
    ceremony.sky === "sunset";

  return (
    <section
      data-page={ceremony.id}
      className="story-page relative items-center text-center"
    >
      <p
        className={`text-[10px] uppercase tracking-[0.2em] sm:text-xs sm:tracking-[0.28em] ${
          isNight ? "text-paper/65" : "text-ink/55"
        }`}
      >
        <span className="block sm:inline">{ceremony.day}</span>
        <span className="hidden sm:inline"> · </span>
        <span className="mt-1 block sm:mt-0 sm:inline">{ceremony.time}</span>
      </p>
      <div
        className="mx-auto mb-3 mt-4 h-1 w-12 rounded-full sm:mb-5 sm:w-14"
        style={{ background: ceremony.accent }}
      />
      <h2
        className={`display text-[clamp(2.5rem,11vw,4.5rem)] ${
          isNight ? "text-paper" : "text-ink"
        }`}
      >
        {ceremony.title}
      </h2>
      <p
        className={`mt-1 text-lg sm:mt-2 sm:text-xl ${
          isNight ? "text-paper/75" : "text-ink/65"
        }`}
      >
        {ceremony.titleHi}
      </p>
      <p
        className={`mt-4 max-w-md px-1 text-sm leading-relaxed sm:mt-6 sm:max-w-lg sm:text-lg ${
          isNight ? "text-paper/85" : "text-ink/75"
        }`}
      >
        {ceremony.description}
      </p>
      {ceremony.dressCode && (
        <p
          className={`mt-6 max-w-[90%] rounded-full px-4 py-2.5 text-[10px] uppercase leading-snug tracking-[0.14em] sm:mt-8 sm:px-5 sm:text-xs sm:tracking-[0.18em] ${
            isNight ? "bg-paper/12 text-paper" : "bg-ink/8 text-ink"
          }`}
        >
          Dress code · {ceremony.dressCode}
        </p>
      )}
      {ceremony.id === "phere" && (
        <p className="script mt-6 text-2xl text-gold-soft sm:mt-8 sm:text-4xl">
          under the stars and moon
        </p>
      )}
      <ScrollHint light={isNight} onClick={onNext} />
    </section>
  );
}

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [sky, setSky] = useState<SkyPhase>("dawn");
  const [activePage, setActivePage] = useState("intro");
  const scrollerRef = useRef<HTMLElement | null>(null);

  const goToNextPage = () => {
    const root = scrollerRef.current;
    if (!root) return;
    const pages = Array.from(root.querySelectorAll<HTMLElement>("[data-page]"));
    const index = pages.findIndex(
      (page) => page.getAttribute("data-page") === activePage,
    );
    const next = pages[index < 0 ? 0 : index + 1];
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!opened) return;

    const root = scrollerRef.current;
    if (!root) return;

    const pages = Array.from(root.querySelectorAll<HTMLElement>("[data-page]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const page = visible.target.getAttribute("data-page");
        if (!page) return;
        setActivePage(page);
        setSky(pageSky[page as keyof typeof pageSky] ?? "soft");
      },
      {
        root,
        threshold: [0.2, 0.4, 0.55],
      },
    );

    pages.forEach((page) => observer.observe(page));
    return () => observer.disconnect();
  }, [opened]);

  // Higher scroll sensitivity: small wheel/swipe jumps to the next page.
  useEffect(() => {
    if (!opened) return;
    const root = scrollerRef.current;
    if (!root) return;

    const getPages = () =>
      Array.from(root.querySelectorAll<HTMLElement>("[data-page]"));

    const currentIndex = () => {
      const pages = getPages();
      const mid = root.scrollTop + root.clientHeight * 0.35;
      let best = 0;
      let bestDist = Infinity;
      pages.forEach((page, index) => {
        const dist = Math.abs(page.offsetTop - mid + page.offsetHeight * 0.2);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      return best;
    };

    let locked = false;
    let wheelDelta = 0;
    let touchStartY = 0;

    const goTo = (index: number) => {
      const pages = getPages();
      const target = pages[Math.max(0, Math.min(pages.length - 1, index))];
      if (!target || locked) return;
      locked = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        locked = false;
        wheelDelta = 0;
      }, 420);
    };

    const isFormTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "input, textarea, select, button, a, label, [data-page='rsvp'] form",
        ),
      );
    };

    const onWheel = (event: WheelEvent) => {
      if (isFormTarget(event.target)) return;
      if (Math.abs(event.deltaY) < 2) return;
      event.preventDefault();
      wheelDelta += event.deltaY;
      if (wheelDelta > 28) goTo(currentIndex() + 1);
      else if (wheelDelta < -28) goTo(currentIndex() - 1);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (isFormTarget(event.target)) {
        touchStartY = 0;
        return;
      }
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!touchStartY || isFormTarget(event.target)) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - endY;
      if (Math.abs(delta) < 28) return;
      if (delta > 0) goTo(currentIndex() + 1);
      else goTo(currentIndex() - 1);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
    };
  }, [opened]);

  const tone = skyTextTone(sky);
  const light = tone === "light";

  if (!opened) {
    return <InviteGate onOpen={() => setOpened(true)} />;
  }

  return (
    <>
      <MusicPlayer enabled />
      <SkyScene phase={sky} />

      <div
        className={`page-dots ${light ? "text-paper" : "text-ink"}`}
        aria-label="Page progress"
      >
        {pageOrder.map((id) => (
          <button
            key={id}
            type="button"
            aria-label={`Go to ${id}`}
            aria-current={activePage === id}
            onClick={() => {
              scrollerRef.current
                ?.querySelector(`[data-page="${id}"]`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`h-1.5 w-1.5 rounded-full transition-all sm:h-2 sm:w-2 ${
              activePage === id
                ? light
                  ? "scale-125 bg-paper"
                  : "scale-125 bg-ink"
                : light
                  ? "bg-paper/35"
                  : "bg-ink/25"
            }`}
          />
        ))}
      </div>

      <main
        id="top"
        ref={scrollerRef}
        className="story-scroller fade-in relative h-[100svh] overflow-y-auto"
      >
        <section
          data-page="intro"
          className="story-page relative items-center text-center"
        >
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/photos/web/couple-2.jpg"
              alt=""
              fill
              priority
              className="object-cover object-[center_20%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,18,0.35)_0%,rgba(18,20,18,0.28)_40%,rgba(18,20,18,0.78)_100%)]" />
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-1 text-paper">
            <p className="text-[11px] tracking-[0.22em] text-paper/80 sm:text-sm sm:tracking-[0.28em]">
              {wedding.blessing}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gold-soft sm:mt-5 sm:text-xs sm:tracking-[0.35em]">
              {wedding.monogram}
            </p>
            <h1 className="display mt-2 flex flex-col items-center gap-0.5 text-[clamp(3rem,13vw,5.5rem)] leading-[0.92] text-paper sm:mt-3 sm:block sm:text-8xl">
              <span>{wedding.bride}</span>
              <span className="script text-[clamp(2.2rem,9vw,3.5rem)] text-gold-soft sm:mx-3 sm:inline sm:text-6xl">
                &
              </span>
              <span>{wedding.groom}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/85 sm:mt-4 sm:text-lg">
              {wedding.inviteLine}
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-paper/70 sm:text-sm sm:tracking-[0.2em]">
              {wedding.dateLabel}
              <span className="mt-1 block sm:mt-0 sm:inline">
                <span className="hidden sm:inline"> · </span>
                {wedding.city}
              </span>
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-paper/55 sm:mt-8 sm:text-xs">
              Counting down to the celebrations
            </p>
            <div className="mt-3 w-full max-w-md text-paper">
              <Countdown />
            </div>
          </div>
          <ScrollHint light onClick={goToNextPage} />
        </section>

        {ceremonies.map((ceremony) => (
          <CeremonyPage
            key={ceremony.id}
            ceremony={ceremony}
            onNext={goToNextPage}
          />
        ))}

        <section
          data-page="venue"
          id="venue"
          className="story-page relative items-center text-center"
        >
          <div className="mx-auto flex w-full max-w-lg flex-col items-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/50 sm:text-xs sm:tracking-[0.22em]">
              Travel & stay
            </p>
            <h2 className="display mt-1.5 text-[1.75rem] leading-tight text-ink sm:mt-3 sm:text-6xl">
              Where to find us
            </h2>
            <p className="mt-0.5 text-sm text-ink/60 sm:mt-2">स्थान</p>

            <figure className="relative mx-auto mt-3 w-full max-w-[14rem] sm:mt-8 sm:max-w-md">
              <Image
                src={wedding.venueImage}
                alt={wedding.venueName}
                width={720}
                height={900}
                className="h-auto w-full"
                sizes="(max-width: 768px) 56vw, 448px"
              />
            </figure>

            <h3 className="display mt-3 text-lg leading-snug text-ink sm:mt-6 sm:text-3xl">
              {wedding.venueName}, {wedding.venueAddress}
            </h3>
            <a
              href={wedding.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 w-full max-w-xs items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.16em] transition active:scale-[0.98] sm:mt-8 sm:min-h-12 sm:w-auto sm:text-sm sm:tracking-[0.18em]"
              style={{ backgroundColor: "#1f2420", color: "#faf7f1" }}
            >
              Open in Google Maps
            </a>
          </div>
          <ScrollHint onClick={goToNextPage} />
        </section>

        <section
          data-page="rsvp"
          id="rsvp"
          className="story-page story-page--form relative"
        >
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
            <div className="mb-4 text-center sm:mb-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink/50 sm:text-xs sm:tracking-[0.22em]">
                Kindly respond
              </p>
              <h2 className="display mt-1.5 text-3xl text-ink sm:mt-2 sm:text-5xl">
                RSVP
              </h2>
              <p className="mt-1 text-sm text-ink/60">
                आपकी उपस्थिति की पुष्टि करें
              </p>
            </div>
            <RSVPForm />
          </div>
        </section>

      </main>
    </>
  );
}
