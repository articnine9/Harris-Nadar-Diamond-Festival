"use client";

import { EVENT } from "@/lib/ondine/event";
import { useEventClock } from "@/lib/ondine/useCountdown";
import { useOffer } from "./offerContext";
import styles from "./Ondine.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

type Variant = "bar" | "inline";

/** Compact clock for the announcement bar and the popup. */
export function FestivalCountdown({ variant = "bar", compact = false }: { variant?: Variant; compact?: boolean }) {
  const clock = useEventClock();

  // Before hydration (and on the server) show the static dates.
  if (!clock) {
    return <span className={styles.clockPending}>{EVENT.shortDate}</span>;
  }

  const { state, remaining, daysToEnd } = clock;

  if (compact) {
    if (state === "upcoming") {
      return <span className={styles.clockText}>{remaining.days}d {pad(remaining.hours)}h</span>;
    }
    if (state === "live") {
      return <span className={styles.clockText}>{daysToEnd < 1 ? "Final day" : `${Math.max(1, daysToEnd)}d left`}</span>;
    }
    return <span className={styles.clockText}>Closed</span>;
  }

  if (variant === "inline") {
    if (state === "upcoming") {
      return <span>{remaining.days < 1 ? "Opens today" : `Opens in ${remaining.days} days`}</span>;
    }
    if (state === "live") {
      return <span>{daysToEnd < 1 ? "Final day" : `${Math.max(1, daysToEnd)} days left`}</span>;
    }
    return <span>Festival closed</span>;
  }

  if (state === "upcoming") {
    return (
      <span className={styles.clockText}>
        Opens in {pad(remaining.days)}d {pad(remaining.hours)}h {pad(remaining.minutes)}m
      </span>
    );
  }
  if (state === "live") {
    return (
      <span className={styles.clockText}>
        Live now · {daysToEnd < 1 ? "final day" : `${Math.max(1, daysToEnd)} days left`}
      </span>
    );
  }
  return <span className={styles.clockText}>This festival has closed</span>;
}

/** Full-width countdown band between the story and the offers. */
export function CountdownBand() {
  const clock = useEventClock();
  const { openOffer } = useOffer();
  const state = clock?.state ?? "upcoming";
  const remaining = clock?.remaining;
  const daysToEnd = clock?.daysToEnd ?? 0;

  const heading =
    state === "upcoming"
      ? "Doors open in"
      : state === "live"
        ? daysToEnd < 1
          ? "The final day is here"
          : `The festival is live · ${Math.max(1, daysToEnd)} days left`
        : "This festival has closed";

  const cells: [label: string, value: number][] = [
    ["Days", remaining?.days ?? 0],
    ["Hours", remaining?.hours ?? 0],
    ["Minutes", remaining?.minutes ?? 0],
    ["Seconds", remaining?.seconds ?? 0],
  ];

  return (
    <section className={styles.countdownBand} aria-label="Festival countdown">
      <div className={`${styles.wrap} ${styles.countdownInner}`}>
        <div className={styles.countdownCopy}>
          <span className={styles.eyebrow}>{EVENT.name} {EVENT.year}</span>
          <h2>{heading}</h2>
          <p>
            {EVENT.dateLabel} · {EVENT.hours}
          </p>
          <p className={styles.countdownCap}>
            Only {EVENT.dailyCap} showroom visits a day — reserve a slot before you travel.
            {" "}{EVENT.sundays}.
          </p>
          {state === "ended" ? (
            EVENT.phoneHref ? (
              <a className={styles.primary} href={EVENT.phoneHref}>
                Call the showroom
              </a>
            ) : (
              <a className={styles.primary} href="#collection">
                See the collection
              </a>
            )
          ) : (
            <button className={styles.primary} type="button" onClick={openOffer}>
              Reserve your visit
            </button>
          )}
        </div>

        <div
          className={styles.clock}
          role="timer"
          aria-live="off"
          aria-label={
            state === "upcoming"
              ? `Opening in ${remaining?.days ?? 0} days ${remaining?.hours ?? 0} hours`
              : `Closes in ${remaining?.days ?? 0} days ${remaining?.hours ?? 0} hours`
          }
        >
          {state === "ended"
            ? null
            : cells.map(([label, value]) => (
                <div className={styles.clockCell} key={label} aria-hidden="true">
                  <strong>{pad(value)}</strong>
                  <span>{label}</span>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
