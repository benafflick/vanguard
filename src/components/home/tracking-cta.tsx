
"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export default function TrackingCta() {
  const [trackingNumber, setTrackingNumber] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = trackingNumber.trim();

    if (!value) {
      return;
    }

    window.location.href = `/track?tracking=${encodeURIComponent(value)}`;
  }

  return (
    <section className="bg-[#111315] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#181a1c]">
          <div className="grid lg:grid-cols-[1fr_0.9fr]">
            {/* Copy */}
            <div className="p-7 sm:p-10 lg:p-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c8a45d]">
                Shipment tracking
              </p>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Know where your cargo is.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-neutral-400 sm:text-base">
                Enter your Vanguard Haulers Cargo tracking number
                to view your shipment status, current location,
                estimated delivery, and tracking history.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                  />

                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(event) =>
                      setTrackingNumber(event.target.value)
                    }
                    placeholder="Enter tracking number"
                    autoComplete="off"
                    spellCheck={false}
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-[#c8a45d] focus:bg-white/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!trackingNumber.trim()}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#c8a45d] px-6 text-sm font-semibold text-[#111315] transition hover:bg-[#d5b873] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Track shipment
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-5">
                <Link
                  href="/track"
                  className="text-xs font-medium text-neutral-500 transition hover:text-white"
                >
                  Open full tracking page →
                </Link>
              </div>
            </div>

            {/* Visual panel */}
            <div className="relative hidden min-h-[380px] overflow-hidden border-l border-white/10 lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(200,164,93,0.14),transparent_55%)]" />

              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-1/2 top-1/2 h-px w-[75%] -translate-x-1/2 bg-[#c8a45d]" />

                <div className="absolute left-1/2 top-1/2 h-[75%] w-px -translate-x-1/2 -translate-y-1/2 bg-[#c8a45d]" />
              </div>

              <div className="absolute left-[18%] top-[32%] flex h-3 w-3 items-center justify-center">
                <span className="absolute h-7 w-7 rounded-full border border-[#c8a45d]/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#c8a45d]" />
              </div>

              <div className="absolute right-[20%] bottom-[27%] flex h-3 w-3 items-center justify-center">
                <span className="absolute h-7 w-7 rounded-full border border-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>

              <div className="absolute left-[18%] top-[32%] h-px w-[58%] rotate-[18deg] origin-left bg-gradient-to-r from-[#c8a45d] to-transparent" />

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-600">
                  Vanguard
                </div>

                <div className="mt-2 text-xs text-neutral-500">
                  Cargo visibility
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

