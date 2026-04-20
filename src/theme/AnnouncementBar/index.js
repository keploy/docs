import React, {useEffect, useRef, useState} from "react";
import Link from "@docusaurus/Link";
import {useThemeConfig} from "@docusaurus/theme-common";
import {useAnnouncementBar} from "@docusaurus/theme-common/internal";
import {ArrowRight, X} from "lucide-react";

const ANNOUNCEMENT = {
  eyebrow: "Event Live",
  href: "https://luma.com/lr79szro",
  ctaLabel: "Register Now",
};

function MarqueeTrack({paused, children, repeat = 10, duration, gap}) {
  return (
    <div
      className="group flex overflow-hidden [gap:var(--gap)]"
      style={{"--duration": duration, "--gap": gap}}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex shrink-0 animate-marquee flex-row justify-around [gap:var(--gap)] motion-reduce:animate-none"
            style={{animationPlayState: paused ? "paused" : "running"}}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function MarqueeContent({content}) {
  const items = [
    content,
    "Keploy is hosting a community meetup in San Francisco!",
    "Tickets are selling fast. Limited seats available, register now!",
  ];

  return (
    <>
      {items.map((item) => (
        <span
          key={item}
          style={{whiteSpace: "nowrap"}}
          className="inline-flex items-center gap-3 text-[12px] text-[#23120a] sm:text-[13px] lg:text-[14px]"
        >
          <span className="font-semibold">{item}</span>
          <span className="inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-[#23120a]/35" />
        </span>
      ))}
    </>
  );
}

const setBarHeight = (value) => {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(
      "--docusaurus-announcement-bar-height",
      value
    );
  }
};

export default function AnnouncementBar() {
  const {announcementBar} = useThemeConfig();
  const {isActive, close} = useAnnouncementBar();
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(null);
  const dragYRef = useRef(0);
  const dragFrameRef = useRef(null);
  const dismissTimeoutRef = useRef(null);
  const reduceMotionQueryRef = useRef(null);
  const marqueeContent = stripHtml(
    announcementBar?.content || "GitTogether SF • May 14, 2026 • San Francisco"
  );
  const isCloseable = announcementBar?.isCloseable !== false;

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      setBarHeight("0px");
      return;
    }

    const node = containerRef.current;
    const syncHeight = () => setBarHeight(`${node.offsetHeight}px`);

    syncHeight();

    const ro = new ResizeObserver(syncHeight);
    ro.observe(node);
    window.addEventListener("resize", syncHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [isActive]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    reduceMotionQueryRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    return () => {
      if (dismissTimeoutRef.current) {
        window.clearTimeout(dismissTimeoutRef.current);
      }
      if (dragFrameRef.current) {
        window.cancelAnimationFrame(dragFrameRef.current);
      }
    };
  }, []);

  const applyDragStyles = (offsetY, isExiting = false) => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    if (isExiting) {
      node.style.transform = "translateY(-110%)";
      node.style.opacity = "0";
      node.style.transition = "transform 0.22s ease, opacity 0.18s ease";
      return;
    }

    if (offsetY < 0) {
      node.style.transform = `translateY(${offsetY}px)`;
      node.style.opacity = String(Math.max(0.15, 1 + offsetY / 60));
      node.style.transition = "none";
      return;
    }

    node.style.transform = "";
    node.style.opacity = "";
    node.style.transition = "";
  };

  const resetDrag = () => {
    dragYRef.current = 0;
    applyDragStyles(0);
  };

  const finalizeDismiss = () => {
    dismissTimeoutRef.current = null;
    resetDrag();
    setDismissing(false);
    close();
  };

  const beginDismiss = () => {
    if (!isCloseable || dismissing) {
      return;
    }

    if (dismissTimeoutRef.current) {
      window.clearTimeout(dismissTimeoutRef.current);
    }

    setDismissing(true);
    applyDragStyles(0, true);

    if (reduceMotionQueryRef.current?.matches) {
      finalizeDismiss();
      return;
    }

    dismissTimeoutRef.current = window.setTimeout(finalizeDismiss, 220);
  };

  const handleTouchStart = (e) => {
    if (!isCloseable || dismissing) {
      return;
    }
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy >= 0) {
      return;
    }

    dragYRef.current = dy;

    if (dragFrameRef.current) {
      return;
    }

    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null;
      applyDragStyles(dragYRef.current);
    });
  };

  const handleTouchEnd = () => {
    if (dragYRef.current < -50) {
      beginDismiss();
    } else {
      resetDrag();
    }
    touchStartY.current = null;
  };

  if (!isActive) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      role="banner"
      aria-label="Event announcement"
      className="sticky top-0 z-[100] border-b border-white/40 bg-cover bg-center bg-no-repeat shadow-[0_12px_30px_rgba(234,88,12,0.16)] backdrop-blur"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        backgroundImage:
          "url('https://keploy-devrel.s3.us-west-2.amazonaws.com/landing/announcement-bar-bg.webp')",
        transform: dismissing ? "translateY(-110%)" : undefined,
        opacity: dismissing ? 0 : undefined,
        transition: dismissing
          ? "transform 0.22s ease, opacity 0.18s ease"
          : undefined,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white/10"
      />

      <div className="relative mx-auto max-w-[1440px] px-3 py-1 sm:px-5 sm:pr-12 lg:px-12 lg:py-1.5">
        {/* Mobile: single row with marquee, dismiss control, and compact CTA. */}
        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <div
            onMouseEnter={() => setIsMarqueePaused(true)}
            onMouseLeave={() => setIsMarqueePaused(false)}
            onPointerEnter={() => setIsMarqueePaused(true)}
            onPointerLeave={() => setIsMarqueePaused(false)}
            className="min-w-0 flex-1 overflow-hidden"
          >
            <MarqueeTrack
              paused={isMarqueePaused}
              repeat={10}
              duration="25s"
              gap="1.25rem"
            >
              <MarqueeContent content={marqueeContent} />
            </MarqueeTrack>
          </div>

          {isCloseable && (
            <button
              type="button"
              onClick={beginDismiss}
              aria-label="Dismiss announcement"
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#6f2b00]/15 bg-white/65 text-[#6f2b00] transition hover:bg-white/85"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <Link
            to={ANNOUNCEMENT.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-black/90 bg-black px-2.5 text-[10px] font-semibold text-white no-underline transition hover:bg-[#0a0a0a]"
            style={{textDecoration: "none"}}
          >
            <span className="transition-all group-hover:bg-gradient-to-r group-hover:from-[#39ff14] group-hover:to-[#00f5ff] group-hover:bg-clip-text group-hover:text-transparent">
              {ANNOUNCEMENT.ctaLabel}
            </span>
            <ArrowRight className="h-2.5 w-2.5 transition-colors group-hover:text-[#39ff14]" />
          </Link>
        </div>

        {/* Desktop layout */}
        <div className="hidden min-w-0 items-center gap-4 lg:flex">
          <span className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 bg-black px-4 text-[10px] font-extrabold leading-none tracking-[0.08em] text-white">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff87]/75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00ff87]" />
            </span>
            {ANNOUNCEMENT.eyebrow}
          </span>

          <div
            className="min-w-0 flex-1 overflow-hidden"
            onMouseEnter={() => setIsMarqueePaused(true)}
            onMouseLeave={() => setIsMarqueePaused(false)}
            onPointerEnter={() => setIsMarqueePaused(true)}
            onPointerLeave={() => setIsMarqueePaused(false)}
          >
            <MarqueeTrack
              paused={isMarqueePaused}
              repeat={10}
              duration="35s"
              gap="1.5rem"
            >
              <MarqueeContent content={marqueeContent} />
            </MarqueeTrack>
          </div>

          <Link
            to={ANNOUNCEMENT.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-black/90 bg-black px-4 text-[13px] font-semibold text-white no-underline shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#0a0a0a] hover:shadow-[0_16px_34px_rgba(0,0,0,0.36)]"
            style={{textDecoration: "none"}}
          >
            <span className="transition-all group-hover:bg-gradient-to-r group-hover:from-[#39ff14] group-hover:to-[#00f5ff] group-hover:bg-clip-text group-hover:text-transparent">
              {ANNOUNCEMENT.ctaLabel}
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-colors group-hover:text-[#39ff14]" />
          </Link>
        </div>
      </div>

      {isCloseable && (
        <button
          type="button"
          onClick={beginDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/75 bg-white/[0.18] text-[#6f2b00] transition hover:bg-white/30 lg:right-4 lg:inline-flex"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
