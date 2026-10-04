"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const target = new Date(wedding.dateISO).getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const parts = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-5">
      {parts.map((part) => (
        <div key={part.label} className="text-center">
          <p className="display text-[1.65rem] leading-none sm:text-5xl">
            {String(part.value).padStart(2, "0")}
          </p>
          <p className="mt-1.5 text-[9px] uppercase tracking-[0.14em] opacity-70 sm:text-xs sm:tracking-[0.2em]">
            {part.label}
          </p>
        </div>
      ))}
    </div>
  );
}
