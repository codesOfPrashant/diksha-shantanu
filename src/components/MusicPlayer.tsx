"use client";

import { useEffect, useRef, useState } from "react";
import { playlist } from "@/lib/config";

type MusicPlayerProps = {
  enabled: boolean;
};

export default function MusicPlayer({ enabled }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wantPlayingRef = useRef(true);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const track = playlist[trackIndex];

  useEffect(() => {
    if (!enabled) return;

    const audio = new Audio(track.src);
    audio.loop = false;
    audio.preload = "auto";
    audioRef.current = audio;

    const onEnded = () => {
      setTrackIndex((current) => (current + 1) % playlist.length);
    };

    audio.addEventListener("ended", onEnded);

    if (wantPlayingRef.current) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }

    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [enabled, track.src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      wantPlayingRef.current = false;
      audio.pause();
      setPlaying(false);
      return;
    }

    wantPlayingRef.current = true;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const selectTrack = (index: number) => {
    wantPlayingRef.current = true;
    setTrackIndex(index);
    setOpen(false);
    setPlaying(true);
  };

  if (!enabled) return null;

  return (
    <div className="music-dock">
      {open && (
        <div className="fade-up w-[min(92vw,20rem)] overflow-hidden rounded-2xl border border-white/40 bg-[rgba(250,247,241,0.96)] shadow-[0_18px_50px_var(--shadow)] backdrop-blur-md">
          <div className="flex items-start justify-between gap-3 border-b border-ink/8 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">
                Our playlist
              </p>
              <p className="display mt-1 truncate text-lg text-ink sm:text-xl">
                {track.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/5 text-lg text-ink"
              aria-label="Close playlist"
            >
              ×
            </button>
          </div>
          <ul className="max-h-[40vh] overflow-auto overscroll-contain py-1 sm:max-h-64">
            {playlist.map((item, index) => {
              const active = index === trackIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectTrack(index)}
                    className={`flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${
                      active
                        ? "bg-blush/12 text-blush-deep"
                        : "active:bg-sage/10"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {item.title}
                      </span>
                      <span className="block truncate text-xs text-ink-soft/70">
                        {item.artist}
                      </span>
                    </span>
                    {active && playing && (
                      <span className="flex h-4 items-end gap-[3px]" aria-hidden>
                        <span className="eq-bar inline-block h-3 w-[3px] rounded-full bg-blush-deep" />
                        <span className="eq-bar inline-block h-4 w-[3px] rounded-full bg-blush-deep" />
                        <span className="eq-bar inline-block h-2.5 w-[3px] rounded-full bg-blush-deep" />
                        <span className="eq-bar inline-block h-3.5 w-[3px] rounded-full bg-blush-deep" />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="music-float flex items-center gap-1 rounded-full border border-white/50 bg-[rgba(250,247,241,0.94)] p-1.5 shadow-[0_12px_40px_var(--shadow)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-full text-ink transition active:scale-95 active:bg-ink/5"
          aria-expanded={open}
          aria-label={open ? "Close playlist" : "Open playlist"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper transition active:scale-95"
          aria-label={playing ? "Pause music" : "Play music"}
          style={{ color: "#faf7f1", backgroundColor: "#1f2420" }}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="3.5" height="12" rx="1" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2.5v11l9-5.5-9-5.5z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
