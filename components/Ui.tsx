"use client";
import Link from "next/link";

export function catIcon(cat: string): string {
  const c = (cat || "").toLowerCase();
  if (c.includes("power") || c.includes("tool")) return "🔧";
  if (c.includes("garden")) return "🌿";
  if (c.includes("craft") || c.includes("sew")) return "🧵";
  if (c.includes("home") || c.includes("kitchen")) return "🏠";
  if (c.includes("outdoor") || c.includes("camp")) return "⛺";
  return "🧰";
}

export function catClass(cat: string): string {
  const c = (cat || "").toLowerCase();
  if (c.includes("power") || c.includes("tool")) return "cat-power";
  if (c.includes("garden")) return "cat-garden";
  if (c.includes("craft") || c.includes("sew")) return "cat-craft";
  if (c.includes("home") || c.includes("kitchen")) return "cat-home";
  return "cat-other";
}

export function ErrorBanner({ err }: { err: string }) {
  if (!err) return null;
  const isOrigin =
    err.toLowerCase().includes("invalid origin") ||
    err.toLowerCase().includes("origin") ||
    err.includes("403");
  return (
    <div className="error" role="alert">
      <strong>⚠️ Couldn&apos;t load data from Appwrite</strong>
      <div>{err}</div>
      {isOrigin && (
        <p style={{ margin: "10px 0 0" }}>
          Fix: register this site&apos;s hostname as a Web platform in the
          Appwrite Console for this project (Project → Platforms → Add
          platform → Web), then reload this page. Do not change any code —
          the data is there, Appwrite is blocking this hostname.
        </p>
      )}
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="grid" aria-label="Loading tools">
      {[0, 1, 2, 3].map((i) => (
        <div className="sk-card" key={i}>
          <div className="skeleton" style={{ height: 64 }} />
          <div className="skeleton" style={{ width: "70%" }} />
          <div className="skeleton" style={{ width: "90%" }} />
          <div className="skeleton" style={{ width: "50%" }} />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  hint: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      <p style={{ margin: "6px 0 14px" }}>{hint}</p>
      {ctaLabel && ctaHref && (
        <Link className="btn" href={ctaHref}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
