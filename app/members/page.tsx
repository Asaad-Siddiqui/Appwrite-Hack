"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listItems, listMembers, type Item, type Member } from "../../lib/appwrite";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    Promise.all([listMembers(), listItems()])
      .then(([m, i]) => { setMembers(m); setItems(i); })
      .catch((e) => setErr(String((e as Error)?.message ?? e)));
  }, []);
  return (
    <>
      <h1>Members</h1>
      <p className="mut">Fictional demo neighbours only. Phone numbers below are clearly fake demo numbers.</p>
      {err && <p className="error">{err}</p>}
      <div className="grid">
        {members.map((m) => {
          const mine = items.filter((i) => i.ownerMemberId === m.$id);
          return (
            <div className="card" key={m.$id}>
              <h3>{m.name}</h3>
              <p className="mut">{m.neighbourhood}{m.phone ? ` · ${m.phone}` : ""}</p>
              <p>{mine.length} tool{mine.length === 1 ? "" : "s"} listed:</p>
              <ul>{mine.map((i) => (
                <li key={i.$id}><Link href={`/items/${i.$id}`}>{i.name}</Link> — {i.status}</li>
              ))}</ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
