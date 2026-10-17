import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/dashboard";
import { LandingPage } from "@/components/landing-page";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  const [view, setView] = useState<"landing" | "desk">("landing");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view") === "landing") {
        setView("landing");
        return;
      }
      if (params.get("view") === "desk" && user) {
        setView("desk");
        return;
      }
    }
    if (user) {
      setView("desk");
    } else {
      setView("landing");
    }
  }, [user]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-elevated" />
        <p className="text-sm text-muted">Loading WaBook…</p>
      </div>
    );
  }

  if (view === "desk" && user) {
    return (
      <div>
        <div className="bg-surface border-b border-border px-4 py-1.5 text-xs text-muted flex items-center justify-between">
          <span>
            Signed in as <strong>{user.displayName || user.primaryEmail || "Clinic Owner"}</strong>
          </span>
          <button
            onClick={() => setView("landing")}
            className="text-accent hover:underline font-medium cursor-pointer"
          >
            Preview Public Landing Page & Pricing Offers →
          </button>
        </div>
        <Dashboard />
      </div>
    );
  }

  return <LandingPage user={user} onOpenDesk={() => setView("desk")} />;
}
