"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listItems, listLoans, listMembers, returnLoan, isOverdue, daysOverdue, daysLeft,
  memberName, itemName, type Item, type Loan, type Member,
} from "../../lib/appwrite";
import MemberPicker, { useDemoMember } from "../../components/MemberPicker";

export default function LoansPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const { memberId, members: pickerMembers, pick } = useDemoMember();
  const load = async () => {
    try {
      setItems(await listItems()); setLoans(await listLoans()); setMembers(await listMembers());
    } catch (e) { setErr(String((e as Error)?.message ?? e)); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const mine = loans.filter((l) => l.borrowerMemberId === memberId);
  const doReturn = async (loan: Loan) => {
    setErr(""); setMsg("");
    try { await returnLoan(loan); setMsg(`Returned ${itemName(items, loan.itemId)}. Thank you!`); await load(); }
    catch (e) { setErr(String((e as Error)?.message ?? e)); }
  };
  return (
    <>
      <h1>My loans</h1>
      <MemberPicker memberId={memberId} members={pickerMembers} pick={pick} />
      {msg && <p className="ok">{msg}</p>}
      {err && <p className="error">{err}</p>}
      <p className="mut">Showing loans for the selected demo member. Switch the member above to see someone else&apos;s loans.</p>
      {mine.length ? (
        <table><thead><tr><th>Tool</th><th>Borrowed</th><th>Due</th><th>Status</th><th></th></tr></thead>
        <tbody>{mine.map((l) => {
          const overdue = isOverdue(l);
          return (
            <tr key={l.$id}>
              <td><Link href={`/items/${l.itemId}`}>{itemName(items, l.itemId)}</Link></td>
              <td>{new Date(l.borrowedAt).toLocaleDateString()}</td>
              <td>{new Date(l.dueAt).toLocaleDateString()}</td>
              <td>
                {l.status === "returned" ? "Returned" : overdue ? <span className="badge overdue">{daysOverdue(l)} days overdue</span> : `Active · ${daysLeft(l)} days left`}
              </td>
              <td>{l.status === "active" && <button className="btn" onClick={() => doReturn(l)}>Return</button>}</td>
            </tr>
          );
        })}</tbody></table>
      ) : <p>No loans for this member yet. <Link href="/items">Browse tools</Link> and borrow one.</p>}
      <h2>All members, for reference</h2>
      <ul>{members.map((m) => <li key={m.$id}>{m.name} — {m.neighbourhood}</li>)}</ul>
      <p className="mut">Member IDs are shown in item loan history because TablesDB rows carry member IDs; names are joined in the app.</p>
      <p className="mut" style={{ display: "none" }}>{memberName(members, "")}</p>
    </>
  );
}
