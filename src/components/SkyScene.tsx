"use client";

import type { SkyPhase } from "@/lib/config";

/**
 * End-to-end sky story (matches ceremony order):
 * dawn → noon → afternoon → sunset → dusk → evening → midnight → after
 *
 * Sun travels left→right and sets fully before night.
 * Moon stays parked below until sunset, then rises on the same left→right night arc.
 * No cream “day” sky after pheras — night gently softens instead.
 */

type Orb = {
  left: string;
  top: string;
  size: string;
  opacity: number;
  glow?: string;
  fill?: string;
};

const skyStyles: Record<
  SkyPhase,
  { gradient: string; ground: string; text: "light" | "dark"; stars: number }
> = {
  dawn: {
    gradient:
      "linear-gradient(180deg, #f6d7b4 0%, #f8e8c9 36%, #d7e8f2 70%, #b9d4e6 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(90, 100, 80, 0.22))",
    text: "dark",
    stars: 0,
  },
  noon: {
    gradient:
      "linear-gradient(180deg, #6fc2e0 0%, #b6e3f2 30%, #ffe8a8 66%, #f4d06a 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(190, 150, 50, 0.22))",
    text: "dark",
    stars: 0,
  },
  afternoon: {
    gradient:
      "linear-gradient(180deg, #89b7c8 0%, #d5e3c4 42%, #c5d7a4 72%, #9bb878 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(80, 110, 70, 0.28))",
    text: "dark",
    stars: 0,
  },
  sunset: {
    gradient:
      "linear-gradient(180deg, #3a4c78 0%, #c26658 34%, #e89a58 60%, #f3c78a 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(40, 28, 24, 0.42))",
    text: "light",
    stars: 0.08,
  },
  dusk: {
    gradient:
      "linear-gradient(180deg, #1a2238 0%, #3d3560 38%, #7a5368 70%, #b87962 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(16, 14, 24, 0.55))",
    text: "light",
    stars: 0.4,
  },
  evening: {
    gradient:
      "linear-gradient(180deg, #0d1324 0%, #172038 42%, #24304f 78%, #2d3a58 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(8, 10, 18, 0.6))",
    text: "light",
    stars: 0.75,
  },
  midnight: {
    gradient:
      "linear-gradient(180deg, #050811 0%, #0d1426 40%, #162038 76%, #1c2944 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(4, 6, 12, 0.7))",
    text: "light",
    stars: 1,
  },
  after: {
    gradient:
      "linear-gradient(180deg, #101826 0%, #1a2436 45%, #243044 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(10, 12, 18, 0.45))",
    text: "light",
    stars: 0.35,
  },
};

/** Parked below-left until night; then one rising arc. */
const moonByPhase: Record<SkyPhase, Orb> = {
  dawn: { left: "14%", top: "128%", size: "3rem", opacity: 0 },
  noon: { left: "14%", top: "128%", size: "3rem", opacity: 0 },
  afternoon: { left: "14%", top: "128%", size: "3rem", opacity: 0 },
  sunset: { left: "14%", top: "128%", size: "3rem", opacity: 0 },
  dusk: { left: "18%", top: "72%", size: "3.1rem", opacity: 0.55 },
  evening: { left: "42%", top: "22%", size: "3.6rem", opacity: 0.95 },
  midnight: { left: "70%", top: "14%", size: "4.4rem", opacity: 1 },
  after: { left: "78%", top: "20%", size: "3.4rem", opacity: 0.45 },
};

/** Clear daytime arc; fully gone once night begins. */
const sunByPhase: Record<SkyPhase, Orb> = {
  dawn: {
    left: "20%",
    top: "56%",
    size: "clamp(3.5rem, 14vw, 5.5rem)",
    opacity: 1,
    glow: "0 0 55px rgba(255, 180, 90, 0.45)",
    fill: "radial-gradient(circle at 35% 35%, #fff4d6, #ffc978 58%, #f0a35a 100%)",
  },
  noon: {
    left: "50%",
    top: "13%",
    size: "clamp(4.6rem, 18vw, 7.4rem)",
    opacity: 1,
    glow: "0 0 88px rgba(255, 214, 92, 0.7)",
    fill: "radial-gradient(circle at 35% 35%, #fff8d0, #ffd65c 55%, #f0b429 100%)",
  },
  afternoon: {
    left: "68%",
    top: "26%",
    size: "clamp(4rem, 16vw, 6.4rem)",
    opacity: 1,
    glow: "0 0 68px rgba(255, 190, 90, 0.5)",
    fill: "radial-gradient(circle at 35% 35%, #fff4d6, #ffc978 55%, #f0a35a 100%)",
  },
  sunset: {
    left: "80%",
    top: "66%",
    size: "clamp(4.8rem, 19vw, 7.6rem)",
    opacity: 1,
    glow: "0 0 90px rgba(255, 120, 70, 0.55)",
    fill: "radial-gradient(circle at 35% 35%, #ffe0b0, #ff8f5a 55%, #d4553a 100%)",
  },
  dusk: {
    left: "88%",
    top: "118%",
    size: "clamp(3.8rem, 15vw, 6rem)",
    opacity: 0,
    glow: "0 0 0 transparent",
    fill: "radial-gradient(circle at 35% 35%, #ffb080, #e06040 55%, #a04030 100%)",
  },
  evening: {
    left: "90%",
    top: "128%",
    size: "3.5rem",
    opacity: 0,
    glow: "0 0 0 transparent",
    fill: "radial-gradient(circle at 35% 35%, #ffb080, #e06040 55%, #a04030 100%)",
  },
  midnight: {
    left: "90%",
    top: "128%",
    size: "3.5rem",
    opacity: 0,
    glow: "0 0 0 transparent",
    fill: "radial-gradient(circle at 35% 35%, #ffb080, #e06040 55%, #a04030 100%)",
  },
  after: {
    left: "90%",
    top: "128%",
    size: "3.5rem",
    opacity: 0,
    glow: "0 0 0 transparent",
    fill: "radial-gradient(circle at 35% 35%, #ffb080, #e06040 55%, #a04030 100%)",
  },
};

const stars = Array.from({ length: 52 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 68}%`,
  size: 1 + (i % 3),
  delay: `${(i % 10) * 0.35}s`,
}));

const ease =
  "left 1.5s cubic-bezier(0.4, 0, 0.2, 1), top 1.5s cubic-bezier(0.4, 0, 0.2, 1), width 1.5s ease, height 1.5s ease, opacity 1s ease, box-shadow 1.5s ease, background 1.5s ease";

type SkySceneProps = {
  phase: SkyPhase;
};

export default function SkyScene({ phase }: SkySceneProps) {
  const style = skyStyles[phase];
  const sun = sunByPhase[phase];
  const moon = moonByPhase[phase];
  const showParticles = phase === "noon" || phase === "afternoon";

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-[background] duration-[1500ms] ease-in-out"
      style={{ background: style.gradient }}
      aria-hidden
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[40%] transition-[background] duration-[1500ms] ease-in-out"
        style={{ background: style.ground }}
      />

      {/* Sun — day arc only */}
      <div
        className="sky-orb absolute rounded-full"
        style={{
          background: sun.fill,
          width: sun.size,
          height: sun.size,
          left: sun.left,
          top: sun.top,
          opacity: sun.opacity,
          transform: "translate(-50%, -50%)",
          boxShadow: sun.glow,
          transition: ease,
        }}
      />

      {/* Moon — night arc only */}
      <div
        className="sky-orb absolute rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #f7f2e4, #d9d2c0 58%, #b7b0a0 100%)",
          width: moon.size,
          height: moon.size,
          left: moon.left,
          top: moon.top,
          opacity: moon.opacity,
          transform: "translate(-50%, -50%)",
          boxShadow:
            moon.opacity > 0 ? "0 0 46px rgba(220, 230, 255, 0.35)" : "none",
          transition: ease,
        }}
      />

      <div
        className="absolute inset-0"
        style={{ opacity: style.stars, transition: "opacity 1s ease" }}
      >
        {stars.map((star) => (
          <span
            key={star.id}
            className="star absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          opacity: showParticles ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="particle absolute rounded-full"
            style={{
              left: `${10 + i * 8}%`,
              bottom: `${12 + (i % 4) * 8}%`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              background:
                phase === "afternoon"
                  ? "rgba(160, 200, 120, 0.4)"
                  : "rgba(255, 220, 120, 0.5)",
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function skyTextTone(phase: SkyPhase): "light" | "dark" {
  return skyStyles[phase].text;
}
