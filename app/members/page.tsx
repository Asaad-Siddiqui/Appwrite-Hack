"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listItems, listMembers, type Item, type Member } from "../../lib/appwrite";
import { EmptyState, ErrorBanner, SkeletonCards } from "../../components/Ui";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([listMembers(), listItems()])
      .then(([m, i]) => { setMembers(m); setItems(i); })
      .catch((e) => setErr(String((e as Error)?.message ?? e)))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <p className="eyebrow">👥 The neighbours</p>
      <h1>Members</h1>
      <p className="mut">Fictional demo neighbours only. Phone numbers below are clearly fake demo numbers.</p>
      <ErrorBanner err={err} />
      {loading ? (
        <><p className="mut">Loading members…</p><SkeletonCards /></>
      ) : members.length ? (
        <div className="grid">
          {members.map((m) => {
            const mine = items.filter((i) => i.ownerMemberId === m.$id);
            return (
              <div className="card" key={m.$id}>
                <div className="row">
                  <span className="avatar">{m.name.charAt(0)}</span>
                  <div><h3 style={{ margin: 0 }}>{m.name}</h3><p className="mut" style={{ margin: 0 }}>{m.neighbourhood}{m.phone ? ` · ${m.phone}` : ""}</p></div>
                </div>
                <p><strong>{mine.length}</strong> tool{mine.length === 1 ? "" : "s"} listed:</p>
                <ul>{mine.map((i) => (
                  <li key={i.$id}><Link href={`/items/${i.$id}`}>{i.name}</Link> — <span className={`badge ${i.status}`}>{i.status}</span></li>
                ))}</ul>
              </div>
            );
          })}
        </div>
      ) : !err ? (
        <EmptyState title="No members yet" hint="Members are seeded from Appwrite TablesDB — if this is empty, check the connection banner above." />
      ) : null}
    </>
  );
}
