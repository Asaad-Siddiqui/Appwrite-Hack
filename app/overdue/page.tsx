"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listItems, listLoans, listMembers, isOverdue, daysOverdue, memberName, itemName,
  type Item, type Loan, type Member,
} from "../../lib/appwrite";

export default function OverduePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    Promise.all([listItems(), listLoans(), listMembers()])
      .then(([i, l, m]) => { setItems(i); setLoans(l); setMembers(m); })
      .catch((e) => setErr(String((e as Error)?.message ?? e)));
  }, []);
  const overdue = loans
    .filter((l) => isOverdue(l))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  return (
    <>
      <h1>Overdue loans</h1>
      <p className="mut">
        Overdue is computed in the app: status is active AND due date is in the
        past. Nothing here is typed in as “overdue” by hand.
      </p>
      {err && <p className="error">{err}</p>}
      {overdue.length ? (
        <table><thead><tr><th>Tool</th><th>Borrower</th><th>Due</th><th>Days overdue</th></tr></thead>
        <tbody>{overdue.map((l) => (
          <tr key={l.$id}>
            <td><Link href={`/items/${l.itemId}`}>{itemName(items, l.itemId)}</Link></td>
            <td>{memberName(members, l.borrowerMemberId)}</td>
            <td>{new Date(l.dueAt).toLocaleDateString()}</td>
            <td><span className="badge overdue">{daysOverdue(l)} days</span></td>
          </tr>
        ))}</tbody></table>
      ) : <p>Nothing overdue right now. 🎉</p>}
    </>
  );
}
