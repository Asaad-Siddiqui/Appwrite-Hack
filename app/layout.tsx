import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "LendLoop — Neighbourhood Tool Library",
  description:
    "Borrow tools from neighbours, return them on time, and see overdues at a glance. Built on Appwrite TablesDB.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">🔧 LendLoop</Link>
          <nav>
            <Link href="/items">Browse tools</Link>
            <Link href="/loans">My loans</Link>
            <Link href="/overdue">Overdue</Link>
            <Link href="/members">Members</Link>
          </nav>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">
          Demo data only — fictional neighbours, no real people, no payments.
          Built on Appwrite TablesDB (database: lendloop).
        </footer>
      </body>
    </html>
  );
}
