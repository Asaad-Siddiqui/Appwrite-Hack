"use client";
import { useEffect, useState } from "react";
import { listMembers, type Member } from "../lib/appwrite";

export function useDemoMember() {
  const [memberId, setMemberId] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("lendloop-member") || "";
    listMembers()
      .then((m) => {
        setMembers(m);
        setMemberId(saved && m.some((x) => x.$id === saved) ? saved : m[0]?.$id ?? "");
      })
      .catch(() => {});
  }, []);
  const pick = (id: string) => {
    setMemberId(id);
    localStorage.setItem("lendloop-member", id);
  };
  return { memberId, members, pick };
}

export default function MemberPicker({
  memberId,
  members,
  pick,
}: {
  memberId: string;
  members: Member[];
  pick: (id: string) => void;
}) {
  if (!members.length) return <p className="mut">Loading demo members…</p>;
  return (
    <div className="picker">
      <label className="row" style={{ margin: 0 }}>
        <span><strong>👤 Demo member:</strong> (not real login — pick a fictional neighbour to borrow as)</span>
        <select value={memberId} onChange={(e) => pick(e.target.value)} aria-label="Demo member">
          {members.map((m) => (
            <option key={m.$id} value={m.$id}>
              {m.name} — {m.neighbourhood}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
