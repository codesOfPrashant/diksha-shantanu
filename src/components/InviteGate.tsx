"use client";

import type { CSSProperties } from "react";
import { wedding } from "@/lib/config";

type InviteGateProps = {
  onOpen: () => void;
};

export default function InviteGate({ onOpen }: InviteGateProps) {
  return (
    <section className="relative flex min-h-[100dvh] min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div
        className="gate-photo-stack absolute inset-0 max-md:hidden"
        style={
          {
            "--gate-photo": "url('/photos/web/couple-1.jpeg')",
          } as CSSProperties
        }
        aria-hidden
      />
      <div
        className="gate-photo-layer absolute inset-0"
        style={{ backgroundImage: "url('/photos/web/couple-1.jpeg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,21,0.55)_0%,rgba(20,24,21,0.35)_45%,rgba(20,24,21,0.78)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-1 text-center text-paper">
        <p className="fade-in text-[11px] tracking-normal text-paper/80 sm:text-sm">
          {wedding.blessing}
        </p>
        <p className="fade-up mt-6 text-[10px] uppercase tracking-[0.32em] text-gold-soft sm:mt-8 sm:text-xs sm:tracking-[0.35em]">
          {wedding.monogram}
        </p>
        <h1 className="display fade-up mt-3 mx-auto flex w-max max-w-full flex-col items-stretch text-center text-[clamp(2.5rem,11vw,4.5rem)] leading-none sm:mt-4 sm:block sm:w-auto sm:text-7xl">
          <span className="block w-full text-center">{wedding.bride}</span>
          <span className="script my-2 flex h-[1.1em] w-full items-center justify-center text-[0.72em] leading-none text-gold-soft sm:mx-3 sm:my-0 sm:inline sm:h-auto sm:w-auto sm:text-5xl">
            &
          </span>
          <span className="block w-full text-center">{wedding.groom}</span>
        </h1>
        <p className="fade-up mt-5 text-sm text-paper/85 sm:mt-6 sm:text-lg">
          You are invited
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="gate-cta fade-up mt-8 min-h-12 w-full max-w-xs rounded-full bg-paper px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-ink shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition active:scale-[0.98] sm:mt-10 sm:w-auto sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
        >
          Open the invitation
        </button>
        <p className="fade-up mt-3 text-[10px] tracking-[0.16em] text-paper/65 sm:mt-4 sm:text-xs sm:tracking-[0.18em]">
          ♪ music starts when you open it
        </p>
      </div>
    </section>
  );
}
