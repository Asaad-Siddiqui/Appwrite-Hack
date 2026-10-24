"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listItems, listMembers, memberName, type Item, type Member } from "../../lib/appwrite";
import { EmptyState, ErrorBanner, SkeletonCards, catClass, catIcon } from "../../components/Ui";

const STATUSES = ["all", "available", "borrowed", "reserved"] as const;

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([listItems(), listMembers()])
      .then(([i, m]) => { setItems(i); setMembers(m); })
      .catch((e) => setErr(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, []);
  const cats = useMemo(() => ["all", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const filtered = items.filter((i) =>
    (cat === "all" || i.category === cat) &&
    (status === "all" || i.status === status) &&
    (q === "" || i.name.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <>
      <p className="eyebrow">🧰 The shared shed</p>
      <h1>Browse tools</h1>
      <p className="mut">Real tools, listed by real neighbours. Borrow one for 7 days, return it on time.</p>
      <ErrorBanner err={err} />
      <div className="row">
        <input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tools" />
      </div>
      <div className="pills" role="group" aria-label="Filter by category">
        {cats.map((c) => (
          <button key={c} className={`pill ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
            {c === "all" ? "All categories" : c}
          </button>
        ))}
      </div>
      <div className="pills" role="group" aria-label="Filter by status">
        {STATUSES.map((s) => (
          <button key={s} className={`pill ${status === s ? "active" : ""}`} onClick={() => setStatus(s)}>
            {s === "all" ? "Any status" : s}
          </button>
        ))}
      </div>
      {loading ? (
        <>
          <p className="mut">Loading tools…</p>
          <SkeletonCards />
        </>
      ) : (
        <>
          <p className="mut">{filtered.length} of {items.length} tools</p>
          <div className="grid">
            {filtered.map((i) => (
              <div className="card" key={i.$id}>
                <div className={`card-head ${catClass(i.category)}`}>
                  {catIcon(i.category)}
                  <small>{i.category}</small>
                </div>
                <h3><Link href={`/items/${i.$id}`}>{i.name}</Link></h3>
                <p className="mut">Owner: {memberName(members, i.ownerMemberId)}</p>
                <p>{i.description}</p>
                <div className="row">
                  <span className="badge condition">{i.condition}</span>
                  <span className={`badge ${i.status}`}>{i.status}</span>
                </div>
                <Link className="btn small" href={`/items/${i.$id}`}>
                  {i.status === "available" ? "Borrow this tool →" : "View details →"}
                </Link>
              </div>
            ))}
          </div>
          {!filtered.length && !err && (
            <EmptyState title="No tools match that filter" hint="Try clearing the search, or pick another category or status." />
          )}
        </>
      )}
    </>
  );
}
