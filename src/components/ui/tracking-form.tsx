"use client";

import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackingForm() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = trackingNumber.trim();

    if (!value) return;

    router.push(`/track?number=${encodeURIComponent(value)}`);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-neutral-300 bg-white p-2 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.25)]"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Enter your tracking number"
            className="h-14 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            aria-label="Tracking number"
          />

          <button
            type="submit"
            className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-[#111315] px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Track Shipment

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </form>

      <p className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c8a45d]" />
        Enter the tracking number provided with your shipment.
      </p>
    </>
  );
}