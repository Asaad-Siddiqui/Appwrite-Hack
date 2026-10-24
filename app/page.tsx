"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listItems, listLoans, isOverdue, type Item, type Loan,
} from "../lib/appwrite";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    Promise.all([listItems(), listLoans()])
      .then(([i, l]) => { setItems(i); setLoans(l); })
      .catch((e) => setErr(String(e?.message ?? e)));
  }, []);
  const available = items.filter((i) => i.status === "available").length;
  const active = loans.filter((l) => l.status === "active").length;
  const overdue = loans.filter((l) => isOverdue(l)).length;
  return (
    <>
      <p className="mut">Neighbourhood tool library</p>
      <h1>Borrow a drill from next door. Return it on time.</h1>
      <p>
        LendLoop is a shared shed for one neighbourhood: neighbours list tools
        they own, other neighbours borrow them for 7 days, and everyone can
        see what is overdue — no buying a tool you will use twice.
      </p>
      {err && <p className="error">{err}</p>}
      <div className="stats">
        <div className="stat"><b>{items.length}</b><span>Tools listed</span></div>
        <div className="stat"><b>{available}</b><span>Available now</span></div>
        <div className="stat"><b>{active}</b><span>Active loans</span></div>
        <div className="stat"><b>{overdue}</b><span>Overdue</span></div>
      </div>
      <div className="row">
        <Link className="btn" href="/items">Browse tools</Link>
        <Link className="btn secondary" href="/overdue">See overdue →</Link>
      </div>
      <h2>How it works</h2>
      <ol>
        <li>Browse tools and filter by category or status.</li>
        <li>Pick a demo member, borrow a tool — due date is 7 days later, set automatically.</li>
        <li>Return it from My loans. If someone reserved it, it goes to them next.</li>
        <li>Overdue is computed, not typed in: an active loan past its due date is overdue.</li>
      </ol>
      <p className="mut">
        Every number on this page comes from real rows in Appwrite TablesDB
        (database <code>lendloop</code>), not from mock data in the app.
      </p>
    </>
  );
}
