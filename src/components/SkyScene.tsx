"use client";

import type { SkyPhase } from "@/lib/config";

const skyStyles: Record<
  SkyPhase,
  { gradient: string; ground: string; text: "light" | "dark" }
> = {
  dawn: {
    gradient:
      "linear-gradient(180deg, #f3d5b5 0%, #f7e6c8 38%, #d9e7ef 72%, #b7cfe0 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(72, 86, 70, 0.35))",
    text: "dark",
  },
  noon: {
    gradient:
      "linear-gradient(180deg, #7ec8e3 0%, #b7e0ef 28%, #ffe7a0 68%, #f6d26a 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(180, 140, 40, 0.28))",
    text: "dark",
  },
  afternoon: {
    gradient:
      "linear-gradient(180deg, #8eb8c9 0%, #d7e4c7 40%, #c8d9a8 70%, #9cb87a 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(70, 100, 60, 0.35))",
    text: "dark",
  },
  sunset: {
    gradient:
      "linear-gradient(180deg, #3d4f7a 0%, #c06a5a 35%, #e8a05a 62%, #f2c98a 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(40, 28, 24, 0.45))",
    text: "light",
  },
  dusk: {
    gradient:
      "linear-gradient(180deg, #1f2740 0%, #4a3f6b 40%, #8a5a6a 72%, #c48a6a 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(18, 16, 28, 0.55))",
    text: "light",
  },
  midnight: {
    gradient:
      "linear-gradient(180deg, #070b16 0%, #121a2e 45%, #1c2744 78%, #243052 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(4, 8, 16, 0.65))",
    text: "light",
  },
  soft: {
    gradient:
      "linear-gradient(180deg, #efe6d8 0%, #f7f1e6 45%, #e8dfd0 100%)",
    ground: "linear-gradient(180deg, transparent, rgba(80, 70, 55, 0.12))",
    text: "dark",
  },
};

/** Continuous sun path — moves below the horizon instead of vanishing. */
const sunPose: Record<
  SkyPhase,
  { left: string; top: string; size: string; glow: string; fill: string }
> = {
  dawn: {
    left: "18%",
    top: "58%",
    size: "clamp(3.75rem, 15vw, 6rem)",
    glow: "0 0 60px rgba(255, 180, 90, 0.45)",
    fill: "radial-gradient(circle at 35% 35%, #fff4d6, #ffc978 60%, #f0a35a 100%)",
  },
  noon: {
    left: "50%",
    top: "14%",
    size: "clamp(4.5rem, 18vw, 7.5rem)",
    glow: "0 0 80px rgba(255, 214, 92, 0.65)",
    fill: "radial-gradient(circle at 35% 35%, #fff7c8, #ffd65c 55%, #f0b429 100%)",
  },
  afternoon: {
    left: "72%",
    top: "28%",
    size: "clamp(4rem, 16vw, 6.5rem)",
    glow: "0 0 70px rgba(255, 190, 90, 0.5)",
    fill: "radial-gradient(circle at 35% 35%, #fff4d6, #ffc978 55%, #f0a35a 100%)",
  },
  sunset: {
    left: "78%",
    top: "68%",
    size: "clamp(5rem, 20vw, 8rem)",
    glow: "0 0 90px rgba(255, 120, 70, 0.55)",
    fill: "radial-gradient(circle at 35% 35%, #ffe0b0, #ff8f5a 55%, #d4553a 100%)",
  },
  dusk: {
    left: "86%",
    top: "96%",
    size: "clamp(4.5rem, 18vw, 7rem)",
    glow: "0 0 60px rgba(255, 100, 60, 0.35)",
    fill: "radial-gradient(circle at 35% 35%, #ffb080, #e06040 55%, #a04030 100%)",
  },
  midnight: {
    left: "92%",
    top: "118%",
    size: "clamp(3.5rem, 14vw, 5.5rem)",
    glow: "0 0 0 transparent",
    fill: "radial-gradient(circle at 35% 35%, #ffb080, #e06040 55%, #a04030 100%)",
  },
  soft: {
    left: "70%",
    top: "110%",
    size: "clamp(3.5rem, 14vw, 5.5rem)",
    glow: "0 0 0 transparent",
    fill: "radial-gradient(circle at 35% 35%, #fff4d6, #ffc978 60%, #f0a35a 100%)",
  },
};

/** Moon rises from below as evening comes, stays through midnight. */
const moonPose: Record<
  SkyPhase,
  { left: string; top: string; size: string; opacity: number }
> = {
  dawn: { left: "80%", top: "120%", size: "clamp(2.5rem, 10vw, 3.5rem)", opacity: 0 },
  noon: { left: "78%", top: "118%", size: "clamp(2.5rem, 10vw, 3.5rem)", opacity: 0 },
  afternoon: { left: "76%", top: "112%", size: "clamp(2.5rem, 10vw, 3.5rem)", opacity: 0 },
  sunset: { left: "18%", top: "88%", size: "clamp(2.5rem, 10vw, 3.5rem)", opacity: 0.35 },
  dusk: { left: "22%", top: "18%", size: "clamp(2.75rem, 11vw, 3.75rem)", opacity: 0.85 },
  midnight: { left: "68%", top: "16%", size: "clamp(3.5rem, 14vw, 5.5rem)", opacity: 1 },
  soft: { left: "72%", top: "108%", size: "clamp(2.5rem, 10vw, 3.5rem)", opacity: 0 },
};

const stars = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 70}%`,
  size: 1 + (i % 3),
  delay: `${(i % 10) * 0.35}s`,
}));

type SkySceneProps = {
  phase: SkyPhase;
};

export default function SkyScene({ phase }: SkySceneProps) {
  const style = skyStyles[phase];
  const sun = sunPose[phase];
  const moon = moonPose[phase];
  const starOpacity =
    phase === "midnight" ? 1 : phase === "dusk" ? 0.55 : phase === "sunset" ? 0.15 : 0;
  const particleOpacity = phase === "noon" || phase === "afternoon" ? 1 : 0;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-[background] duration-[1600ms] ease-in-out"
      style={{ background: style.gradient }}
      aria-hidden
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[42%] transition-[background] duration-[1600ms] ease-in-out"
        style={{ background: style.ground }}
      />

      {/* Single sun that arcs across the sky, then sets below the horizon */}
      <div
        className="sky-orb absolute rounded-full will-change-transform"
        style={{
          background: sun.fill,
          width: sun.size,
          height: sun.size,
          left: sun.left,
          top: sun.top,
          transform: "translate(-50%, -50%)",
          boxShadow: sun.glow,
          opacity: phase === "midnight" || phase === "soft" ? 0 : 1,
          transition:
            "left 1.6s cubic-bezier(0.4, 0, 0.2, 1), top 1.6s cubic-bezier(0.4, 0, 0.2, 1), width 1.6s ease, height 1.6s ease, opacity 1.2s ease, box-shadow 1.6s ease, background 1.6s ease",
        }}
      />

      {/* Moon rises from below as the sun sets */}
      <div
        className="sky-orb absolute rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #f7f2e4, #d9d2c0 60%, #b7b0a0 100%)",
          width: moon.size,
          height: moon.size,
          left: moon.left,
          top: moon.top,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 50px rgba(220, 230, 255, 0.35)",
          opacity: moon.opacity,
          transition:
            "left 1.6s cubic-bezier(0.4, 0, 0.2, 1), top 1.6s cubic-bezier(0.4, 0, 0.2, 1), width 1.6s ease, height 1.6s ease, opacity 1.4s ease",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: starOpacity,
          transition: "opacity 1.6s ease",
        }}
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
          opacity: particleOpacity,
          transition: "opacity 1.2s ease",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="particle absolute rounded-full"
            style={{
              left: `${8 + i * 7}%`,
              bottom: `${10 + (i % 5) * 8}%`,
              width: 4 + (i % 3),
              height: 4 + (i % 3),
              background:
                phase === "afternoon"
                  ? "rgba(160, 200, 120, 0.45)"
                  : "rgba(255, 220, 120, 0.55)",
              animationDelay: `${i * 0.4}s`,
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
