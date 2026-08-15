
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function FinalCta() {
  return (
    <section className="bg-[#111315] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#181a1c] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          {/* Decorative elements */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c8a45d]/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/[0.03] blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Content */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c8a45d]">
                Move with confidence
              </p>

              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your cargo deserves a logistics partner you can trust.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
                Whether you're moving a single shipment or managing
                ongoing cargo operations, Vanguard Haulers Cargo is
                ready to keep your goods moving with care,
                visibility, and dependable service.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#c8a45d] px-6 text-sm font-semibold text-[#111315] transition hover:bg-[#d5b76f]"
                >
                  Get started
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/track"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Track a shipment
                </Link>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                The Vanguard standard
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c8a45d]/10">
                    <ShieldCheck
                      size={18}
                      className="text-[#c8a45d]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Secure handling
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Cargo handled with attention from collection
                      through delivery.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c8a45d]/10">
                    <Truck
                      size={18}
                      className="text-[#c8a45d]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Reliable movement
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Practical logistics solutions built around
                      your shipment requirements.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c8a45d]/10">
                    <CheckCircle2
                      size={18}
                      className="text-[#c8a45d]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Shipment visibility
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Track your shipment and stay informed as it
                      moves through the network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
