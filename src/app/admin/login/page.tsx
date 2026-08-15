"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Invalid username or password.",
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#111] text-sm font-bold text-white">
            VH
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Vanguard Haulers
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Administrator sign in
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                autoComplete="username"
                className="h-12 w-full rounded-xl border border-gray-200 bg-[#f7f7f5] px-4 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                placeholder="Admin username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-gray-200 bg-[#f7f7f5] px-4 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                placeholder="Admin password"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#111] text-sm font-medium text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-500 transition hover:text-black"
          >
            ← Back to Vanguard Haulers
          </a>
        </div>
      </div>
    </main>
  );
}