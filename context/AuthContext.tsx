"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";

interface User {
  _id: string;
  accountId?: string;
  clerkId?: string;
  name: string;
  username: string;
  email: string;
  picture: string;
  reputation?: number;
}

interface AuthContextType {
  user: User | null;
  userId: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  isLoaded: false,
  isSignedIn: false,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoaded, setIsLoaded] = useState<boolean>(initialUser !== null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!initialUser) {
      fetchUser();
    } else {
      setIsLoaded(true);
    }
  }, [initialUser]);

  const logout = async () => {
    await signOut();
    setUser(null);
    window.location.href = "/sign-in";
  };

  const userId = user ? (user.clerkId || user.accountId || user._id) : null;
  const isSignedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        isLoaded,
        isSignedIn,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    userId: context.userId,
    user: context.user,
    signOut: context.logout,
  };
}

export function useUser() {
  const context = useContext(AuthContext);
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    user: context.user,
  };
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded || !isSignedIn) return null;
  return <>{children}</>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (isSignedIn) return null;
  return <>{children}</>;
}

export function UserButton({
  afterSignOutUrl = "/",
  appearance,
}: {
  afterSignOutUrl?: string;
  appearance?: any;
}) {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = afterSignOutUrl || "/";
  };

  const avatarUrl = user.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username || "dev"}`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full focus:outline-none ring-2 ring-primary-500/20"
        aria-label="User profile menu"
      >
        <Image
          src={avatarUrl}
          alt={user.name || "User Avatar"}
          width={36}
          height={36}
          className="rounded-full object-cover h-9 w-9"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-light-700 bg-white p-3 shadow-lg dark:border-dark-400 dark:bg-dark-200 z-50">
            <div className="flex items-center gap-3 border-b border-light-700 pb-3 dark:border-dark-400">
              <Image
                src={avatarUrl}
                alt={user.name || "User"}
                width={40}
                height={40}
                className="rounded-full object-cover h-10 w-10"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="body-semibold text-dark-100 dark:text-light-900 truncate">
                  {user.name}
                </span>
                <span className="small-regular text-dark-400 dark:text-light-700 truncate">
                  @{user.username}
                </span>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <Link
                href={`/profile/${user.clerkId || user.accountId || user._id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-dark-300 hover:bg-light-800 dark:text-light-800 dark:hover:bg-dark-300 small-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 small-medium w-full text-left"
              >
                Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
