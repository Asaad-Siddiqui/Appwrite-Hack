"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listItems, listLoans, isOverdue, type Item, type Loan,
} from "../lib/appwrite";
import { ErrorBanner, SkeletonCards, catClass, catIcon } from "../components/Ui";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([listItems(), listLoans()])
      .then(([i, l]) => { setItems(i); setLoans(l); })
      .catch((e) => setErr(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, []);
  const available = items.filter((i) => i.status === "available");
  const active = loans.filter((l) => l.status === "active").length;
  const overdue = loans.filter((l) => isOverdue(l)).length;
  return (
    <>
      <section className="hero">
        <span className="eyebrow">🏘️ Neighbourhood tool library</span>
        <h1>Borrow a drill from next door. Return it on time.</h1>
        <p>
          LendLoop is a shared shed for one neighbourhood: neighbours list tools
          they own, other neighbours borrow them for 7 days, and everyone can
          see what is overdue — no buying a tool you will use twice.
        </p>
        <div className="row">
          <Link className="btn" href="/items">Browse tools →</Link>
          <Link className="btn secondary" href="/overdue">See overdue</Link>
        </div>
        <div className="hero-band">
          <span>✓ Real Appwrite TablesDB data</span>
          <span>✓ 7-day loans</span>
          <span>✓ Overdue computed, not typed in</span>
        </div>
      </section>

      <ErrorBanner err={err} />
      {loading ? (
        <>
          <p className="mut">Loading tools…</p>
          <SkeletonCards />
        </>
      ) : (
        <>
          <div className="stats">
            <div className="stat"><b>{items.length}</b><span>🧰 Tools listed</span></div>
            <div className="stat"><b>{available.length}</b><span>✅ Available now</span></div>
            <div className="stat"><b>{active}</b><span>📦 Active loans</span></div>
            <div className={`stat ${overdue ? "warn" : ""}`}><b>{overdue}</b><span>⏰ Overdue</span></div>
          </div>

          <h2>Available right now</h2>
          {available.length ? (
            <div className="grid">
              {available.slice(0, 4).map((i) => (
                <div className="card" key={i.$id}>
                  <div className={`card-head ${catClass(i.category)}`}>
                    {catIcon(i.category)}
                    <small>{i.category}</small>
                  </div>
                  <h3><Link href={`/items/${i.$id}`}>{i.name}</Link></h3>
                  <p className="mut">{i.condition} · {i.description}</p>
                  <span className="badge">available</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mut">No tools available at the moment — check back, or see what is borrowed.</p>
          )}
          <div className="row">
            <Link className="btn" href="/items">Browse all tools</Link>
          </div>
        </>
      )}

      <h2>How it works</h2>
      <div className="steps">
        <div className="step"><b>1</b><h3>Browse tools</h3><p>Filter by category or status, search by name.</p></div>
        <div className="step"><b>2</b><h3>Borrow for 7 days</h3><p>Pick a demo member, borrow a tool — the due date is set automatically.</p></div>
        <div className="step"><b>3</b><h3>Return it</h3><p>Return from My loans. If someone reserved it, it goes to them next.</p></div>
        <div className="step"><b>4</b><h3>Overdue, honestly</h3><p>An active loan past its due date is overdue — computed, never typed in.</p></div>
      </div>
      <p className="mut">
        Every number on this page comes from real rows in Appwrite TablesDB
        (database <code>lendloop</code>), not from mock data in the app.
      </p>
    </>
  );
}
