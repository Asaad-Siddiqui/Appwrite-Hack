"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getItem, getMember, listLoans, listReservations, borrowItem, reserveItem,
  type Item, type Member, type Loan, type Reservation,
} from "../../../lib/appwrite";
import MemberPicker, { useDemoMember } from "../../../components/MemberPicker";
import { EmptyState, ErrorBanner, catClass, catIcon } from "../../../components/Ui";

export default function ItemDetail({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Item | null>(null);
  const [owner, setOwner] = useState<Member | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const { memberId, members, pick } = useDemoMember();
  const load = async () => {
    try {
      const it = await getItem(params.id);
      setItem(it);
      setOwner(await getMember(it.ownerMemberId));
      setLoans((await listLoans()).filter((l) => l.itemId === it.$id));
      setReservations((await listReservations()).filter((r) => r.itemId === it.$id));
    } catch (e) { setErr(String((e as Error)?.message ?? e)); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (err) return (<><Link href="/items">← All tools</Link><ErrorBanner err={err} /></>);
  if (!item) return <p className="mut">Loading tool…</p>;
  const activeLoan = loans.find((l) => l.status === "active");
  const activeRes = reservations.find((r) => r.status === "active");
  const doBorrow = async () => {
    setErr(""); setMsg(""); setBusy(true);
    try {
      const loan = await borrowItem(item, memberId);
      setMsg(`Borrowed! Loan ${loan.$id} — due ${new Date(loan.dueAt).toLocaleDateString()}.`);
      await load();
    } catch (e) { setErr(String((e as Error)?.message ?? e)); }
    setBusy(false);
  };
  const doReserve = async () => {
    setErr(""); setMsg(""); setBusy(true);
    try {
      const r = await reserveItem(item, memberId);
      setMsg(`Reserved! Reservation ${r.$id}. You are next when it comes back.`);
      await load();
    } catch (e) { setErr(String((e as Error)?.message ?? e)); }
    setBusy(false);
  };
  return (
    <>
      <Link href="/items">← All tools</Link>
      <div className="detail">
        <div className={`card-head ${catClass(item.category)}`} style={{ borderRadius: 12 }}>
          {catIcon(item.category)}
          <small>{item.category}</small>
        </div>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <div className="detail-grid">
          <div><span>Condition</span><strong>{item.condition}</strong></div>
          <div><span>Owner</span><strong>{owner?.name ?? item.ownerMemberId}</strong><br /><span>{owner?.neighbourhood}</span></div>
          <div><span>Status</span><span className={`badge ${item.status}`}>{item.status}</span></div>
        </div>
        {activeLoan && <p>Currently on loan — due {new Date(activeLoan.dueAt).toLocaleDateString()}.</p>}
        {activeRes && <p>There is an active reservation for this tool.</p>}
        <MemberPicker memberId={memberId} members={members} pick={pick} />
        <div className="row">
          <button className="btn" disabled={busy || item.status !== "available" || !memberId} onClick={doBorrow}>
            {item.status === "available" ? "Borrow for 7 days" : "Not available to borrow"}
          </button>
          <button className="btn secondary" disabled={busy || !memberId || item.status === "available"} onClick={doReserve}>
            Reserve this tool
          </button>
        </div>
        {item.status === "available" && <p className="mut">Tip: Reserve is for tools that are borrowed or reserved — an available tool can be borrowed straight away.</p>}
        {msg && <p className="ok">{msg}</p>}
        <ErrorBanner err={err} />
      </div>
      <h2>Loan history for this tool</h2>
      {loans.length ? (
        <div className="tablewrap">
          <table><thead><tr><th>Borrower</th><th>Borrowed</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>{loans.map((l) => (
            <tr key={l.$id}><td>{l.borrowerMemberId}</td><td>{new Date(l.borrowedAt).toLocaleDateString()}</td><td>{new Date(l.dueAt).toLocaleDateString()}</td><td><span className={`badge ${l.status === "active" ? "borrowed" : ""}`}>{l.status}</span></td></tr>
          ))}</tbody></table>
        </div>
      ) : <EmptyState title="No loans yet" hint="Be the first neighbour to borrow this tool." />}
    </>
  );
}
