"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ceremonies,
  families,
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
  "family",
] as const;

const pageSky: Record<(typeof pageOrder)[number], SkyPhase> = {
  intro: "dawn",
  haldi: "noon",
  mehendi: "afternoon",
  sangeet: "sunset",
  wedding: "goldenhour",
  "jai-mala": "evening",
  phere: "midnight",
  venue: "after",
  rsvp: "after",
  family: "after",
};

function ScrollHint({ light }: { light?: boolean }) {
  return (
    <div
      className={`scroll-hint ${light ? "text-paper/70" : "text-ink/45"}`}
      aria-hidden
    >
      <span className="scroll-chevron text-xl leading-none">↓</span>
    </div>
  );
}

function CeremonyPage({ ceremony }: { ceremony: Ceremony }) {
  const isNight =
    ceremony.sky === "midnight" ||
    ceremony.sky === "evening" ||
    ceremony.sky === "dusk" ||
    ceremony.sky === "sunset" ||
    ceremony.sky === "goldenhour";

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
      <ScrollHint light={isNight} />
    </section>
  );
}

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [sky, setSky] = useState<SkyPhase>("dawn");
  const [activePage, setActivePage] = useState("intro");
  const scrollerRef = useRef<HTMLElement | null>(null);
  const scrollLockRef = useRef(false);

  const goToPage = (id: string) => {
    const root = scrollerRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(`[data-page="${id}"]`);
    if (!target) return;

    scrollLockRef.current = true;
    setActivePage(id);
    setSky(pageSky[id as keyof typeof pageSky] ?? "after");
    // scrollTo on the story scroller (not scrollIntoView) — reliable with snap.
    root.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    window.setTimeout(() => {
      scrollLockRef.current = false;
    }, 700);
  };

  useEffect(() => {
    if (!opened) return;

    const root = scrollerRef.current;
    if (!root) return;

    const pages = Array.from(root.querySelectorAll<HTMLElement>("[data-page]"));
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollLockRef.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const page = visible.target.getAttribute("data-page");
        if (!page) return;
        setActivePage(page);
        setSky(pageSky[page as keyof typeof pageSky] ?? "after");
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

    let wheelDelta = 0;
    let touchStartY = 0;

    const goToIndex = (index: number) => {
      if (scrollLockRef.current) return;
      const pages = getPages();
      const target = pages[Math.max(0, Math.min(pages.length - 1, index))];
      const id = target?.getAttribute("data-page");
      if (!id) return;
      wheelDelta = 0;
      goToPage(id);
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
      if (wheelDelta > 28) goToIndex(currentIndex() + 1);
      else if (wheelDelta < -28) goToIndex(currentIndex() - 1);
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
      if (delta > 0) goToIndex(currentIndex() + 1);
      else goToIndex(currentIndex() - 1);
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
            onClick={() => goToPage(id)}
            className="grid h-7 w-7 place-items-center sm:h-6 sm:w-6"
          >
            <span
              className={`block h-1.5 w-1.5 rounded-full transition-all sm:h-2 sm:w-2 ${
                activePage === id
                  ? light
                    ? "scale-125 bg-paper"
                    : "scale-125 bg-ink"
                  : light
                    ? "bg-paper/35"
                    : "bg-ink/25"
              }`}
            />
          </button>
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
            <div className="photo-blur-fill absolute inset-0 max-md:hidden" aria-hidden>
              <Image
                src="/photos/web/couple-2.png"
                alt=""
                fill
                className="photo-blur-fill__img"
                sizes="100vw"
              />
            </div>
            <div className="photo-stage absolute inset-0 overflow-hidden">
              <Image
                src="/photos/web/couple-2.png"
                alt=""
                fill
                priority
                className="photo-stage__media"
                sizes="(max-width: 768px) 100vw, 576px"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,18,0.35)_0%,rgba(18,20,18,0.28)_40%,rgba(18,20,18,0.78)_100%)] md:bg-[linear-gradient(180deg,rgba(18,20,18,0.32)_0%,rgba(18,20,18,0.18)_42%,rgba(18,20,18,0.72)_100%)]" />
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-1 text-paper">
            <p className="script text-3xl sm:text-4xl" aria-label={wedding.coupleShort}>
              <span className="text-[color:var(--sha)]">Sha</span>
              <span className="text-[color:var(--di)]">Di</span>
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-paper/80 sm:mt-5 sm:text-sm sm:tracking-[0.22em]">
              {wedding.dateLabel}
              <span className="mt-1.5 block sm:mt-0 sm:inline">
                <span className="hidden sm:inline"> · </span>
                {wedding.city}
              </span>
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/85 sm:mt-6 sm:text-lg">
              {wedding.inviteLine}
            </p>
            <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-paper/55 sm:mt-10 sm:text-xs">
              Counting down to the celebrations
            </p>
            <div className="mt-3 w-full max-w-md text-paper">
              <Countdown />
            </div>
          </div>
          <ScrollHint light />
        </section>

        {ceremonies.map((ceremony) => (
          <CeremonyPage key={ceremony.id} ceremony={ceremony} />
        ))}

        <section
          data-page="venue"
          id="venue"
          className="story-page story-page--venue relative items-center text-center"
        >
          <div className="venue-page mx-auto flex w-full max-w-lg flex-col items-center pb-4 text-paper">
            <p className="text-[10px] uppercase tracking-[0.2em] text-paper/60 sm:text-xs sm:tracking-[0.22em]">
              Travel & stay
            </p>
            <h2 className="display mt-1.5 text-[1.75rem] leading-tight text-paper sm:mt-2 md:text-4xl lg:text-5xl">
              Where to find us
            </h2>
            <p className="mt-0.5 text-sm text-paper/70">स्थान</p>

            <figure className="venue-page__figure relative mx-auto mt-3 w-full max-w-[14rem] sm:mt-5 sm:max-w-[11rem] md:mt-4 md:max-w-[13rem] lg:max-w-[15rem]">
              <Image
                src={wedding.venueImage}
                alt={wedding.venueName}
                width={720}
                height={900}
                className="venue-page__img h-auto w-full"
                sizes="(max-width: 768px) 56vw, 240px"
              />
            </figure>

            <h3 className="display mt-3 text-lg leading-snug text-paper md:mt-4 md:text-2xl">
              {wedding.venueName}, {wedding.venueAddress}
            </h3>
            <a
              href={wedding.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 w-full max-w-xs items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.16em] transition active:scale-[0.98] md:mt-5 sm:min-h-12 sm:w-auto sm:text-sm sm:tracking-[0.18em]"
              style={{ backgroundColor: "#faf7f1", color: "#1f2420" }}
            >
              Open in Google Maps
            </a>
          </div>
          <ScrollHint light />
        </section>

        <section
          data-page="rsvp"
          id="rsvp"
          className="story-page story-page--form relative"
        >
          <div className="rsvp-card mx-auto w-full max-w-[19rem] rounded-xl bg-[rgba(250,247,241,0.92)] px-3.5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-md sm:max-w-[21rem] sm:px-4 sm:py-5 md:max-w-[22rem]">
            <div className="mb-3 text-center sm:mb-4">
              <p className="text-[9px] uppercase tracking-[0.18em] text-ink/50 sm:text-[10px]">
                Kindly respond
              </p>
              <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
                RSVP
              </h2>
              <p className="mt-0.5 text-xs text-ink/60">
                आपकी उपस्थिति की पुष्टि करें
              </p>
            </div>
            <RSVPForm />
          </div>
          <ScrollHint light />
        </section>

        <section
          data-page="family"
          id="family"
          className="story-page relative items-center text-center"
        >
          <div className="mx-auto flex w-full max-w-xl flex-col items-center text-paper">
            <p className="text-[9px] uppercase tracking-[0.2em] text-paper/60 sm:text-[10px]">
              With love
            </p>
            <h2 className="display mt-1 text-2xl leading-tight text-paper sm:mt-2 sm:text-4xl">
              Our families
            </h2>
            <p className="mt-0.5 text-xs text-paper/70">परिवार</p>

            <div className="mt-5 grid w-full grid-cols-2 gap-4 sm:mt-8 sm:gap-8">
              {families.map((side) => (
                <div key={side.id} className="min-w-0 text-center">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-gold-soft sm:text-[10px] sm:tracking-[0.18em]">
                    {side.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-paper/50">{side.labelHi}</p>
                  <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                    {side.members.map((member) => (
                      <li key={`${side.id}-${member.role}-${member.name}`}>
                        <p className="text-[8px] uppercase tracking-[0.12em] text-paper/40 sm:text-[9px]">
                          {member.role}
                        </p>
                        <p className="display mt-0.5 text-sm leading-snug text-paper sm:text-base">
                          {member.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
