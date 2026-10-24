"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listItems, listLoans, listMembers, isOverdue, daysOverdue, memberName, itemName,
  type Item, type Loan, type Member,
} from "../../lib/appwrite";
import { EmptyState, ErrorBanner, SkeletonCards } from "../../components/Ui";

export default function OverduePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([listItems(), listLoans(), listMembers()])
      .then(([i, l, m]) => { setItems(i); setLoans(l); setMembers(m); })
      .catch((e) => setErr(String((e as Error)?.message ?? e)))
      .finally(() => setLoading(false));
  }, []);
  const overdue = loans
    .filter((l) => isOverdue(l))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  return (
    <>
      <p className="eyebrow">⏰ Needs chasing</p>
      <h1>Overdue loans</h1>
      <p className="mut">
        Overdue is computed in the app: status is active AND due date is in the
        past. Nothing here is typed in as “overdue” by hand.
      </p>
      <ErrorBanner err={err} />
      {loading ? (
        <><p className="mut">Loading overdue loans…</p><SkeletonCards /></>
      ) : overdue.length ? (
        <div className="tablewrap">
          <table><thead><tr><th>Tool</th><th>Borrower</th><th>Due</th><th>Days overdue</th></tr></thead>
          <tbody>{overdue.map((l) => (
            <tr key={l.$id} className="overdue-row">
              <td><Link href={`/items/${l.itemId}`}>{itemName(items, l.itemId)}</Link></td>
              <td>{memberName(members, l.borrowerMemberId)}</td>
              <td>{new Date(l.dueAt).toLocaleDateString()}</td>
              <td><span className="badge overdue">{daysOverdue(l)} days overdue</span></td>
            </tr>
          ))}</tbody></table>
        </div>
      ) : !err ? (
        <EmptyState title="Nothing overdue right now 🎉" hint="All active loans are still within their 7-day window." ctaLabel="Browse tools" ctaHref="/items" />
      ) : null}
    </>
  );
}
