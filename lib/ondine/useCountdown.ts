"use client";

import { useEffect, useState } from "react";
import { EVENT_END_MS, EVENT_START_MS, eventState, type EventState } from "./event";

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

const breakdown = (ms: number): Remaining => {
  const total = Math.max(0, ms);
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1_000) % 60),
    totalMs: total,
  };
};

/**
 * Ticks once a second on the client. Returns `null` on the server and on the
 * first paint, so the markup never mismatches during hydration — callers show
 * the static date label until the clock is live.
 */
export function useEventClock() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return null;

  const state: EventState = eventState(now);
  const target = state === "upcoming" ? EVENT_START_MS : EVENT_END_MS;

  return {
    state,
    now,
    remaining: breakdown(target - now),
    daysToEnd: breakdown(EVENT_END_MS - now).days,
  };
}
