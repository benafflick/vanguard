"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to log out.");
      }

      window.location.href = "/admin/login";
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoggingOut(false);
      alert("Unable to log out. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loggingOut ? "Signing out..." : "Log out"}
    </button>
  );
}