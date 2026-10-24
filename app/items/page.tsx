"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listItems, listMembers, memberName, type Item, type Member } from "../../lib/appwrite";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [err, setErr] = useState("");
  useEffect(() => {
    Promise.all([listItems(), listMembers()])
      .then(([i, m]) => { setItems(i); setMembers(m); })
      .catch((e) => setErr(String(e?.message ?? e)));
  }, []);
  const cats = useMemo(() => ["all", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const filtered = items.filter((i) =>
    (cat === "all" || i.category === cat) &&
    (status === "all" || i.status === status) &&
    (q === "" || i.name.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <>
      <h1>Browse tools</h1>
      {err && <p className="error">{err}</p>}
      <div className="row">
        <input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Any status</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>
      <p className="mut">{filtered.length} of {items.length} tools</p>
      <div className="grid">
        {filtered.map((i) => (
          <div className="card" key={i.$id}>
            <h3><Link href={`/items/${i.$id}`}>{i.name}</Link></h3>
            <p className="mut">{i.category} · {i.condition} · Owner: {memberName(members, i.ownerMemberId)}</p>
            <p>{i.description}</p>
            <span className={`badge ${i.status}`}>{i.status}</span>
          </div>
        ))}
      </div>
      {!filtered.length && !err && <p>No tools match that filter.</p>}
    </>
  );
}
