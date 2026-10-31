"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Map, X, ArrowUpRight, Play, Pause } from "lucide-react";
import { sections } from "@/content/world";
import styles from "./Navigation.module.css";

function getInitialMotion(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("motion");
  if (stored === "paused") return false;
  return true;
}

function subscribeMotion(callback: () => void) {
  window.addEventListener("motion-change", callback);
  return () => {
    window.removeEventListener("motion-change", callback);
  };
}

function getMotionSnapshot(): boolean {
  return getInitialMotion();
}

function getMotionServerSnapshot(): boolean {
  return true;
}

export function Navigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState("spawn");
  const animated = useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot,
  );

  const toggleMotion = () => {
    const next = !animated;
    localStorage.setItem("motion", next ? "running" : "paused");
    window.dispatchEvent(new CustomEvent("motion-change", { detail: next }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -45% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((s) => observer.observe(s));
    const visibility = () =>
      document.documentElement.toggleAttribute("data-hidden", document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const location =
    sections.find((section) => section.id === active) ?? sections[0];
  return (
    <>
      <header className={styles.header}>
        <a href="#spawn" className={styles.brand}>
          <span>
            rao<span className={styles.brandDot}>.</span>
            <small>THE WANDERING LOG</small>
          </span>
        </a>
        <nav className={styles.links} aria-label="Main navigation">
          <a href="#journal">The traveller</a>
          <a href="#quests">Quests</a>
          <a href="#campfire">
            Say hello <ArrowUpRight size={13} />
          </a>
        </nav>
        <div className={styles.actions}>
          <button
            className={styles.motion}
            aria-label={animated ? "Pause animation" : "Resume animation"}
            onClick={toggleMotion}
          >
            {animated ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            className={styles.mapButton}
            aria-label="Open world map"
            onClick={() => dialog.current?.showModal()}
          >
            <Map size={16} />
            <span>World map</span>
          </button>
        </div>
      </header>
      <aside className={styles.location} aria-label="Current location">
        <span>{location.icon}</span>
        <div>
          <strong>{location.title.toUpperCase()}</strong>
          <small>THE KNOWN TRAIL</small>
        </div>
      </aside>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="map-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className={styles.dialogTop}>
          <span className="eyebrow">A POCKET GUIDE TO THE JOURNEY</span>
          <button
            aria-label="Close world map"
            onClick={() => dialog.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        <h2 id="map-title">Pick a path.</h2>
        <p>Every good adventure allows a little wandering.</p>
        <nav aria-label="World map" className={styles.destinations}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              onClick={() => dialog.current?.close()}
            >
              <span>{s.icon}</span>
              <div>
                <strong>{s.title}</strong>
                <small>
                  {s.label}
                  {active === s.id ? " · You are here" : ""}
                </small>
              </div>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
        <p className={styles.mapNote}>No fast-travel fee. You’re welcome.</p>
      </dialog>
    </>
  );
}
