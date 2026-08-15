import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import TrackingForm from "../ui/tracking-form";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-180px] top-[-120px] h-[520px] w-[520px] rounded-full bg-[#c8a45d]/10 blur-3xl" />

        <div className="absolute left-[-200px] bottom-[-200px] h-[450px] w-[450px] rounded-full bg-neutral-300/20 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#111315 1px, transparent 1px), linear-gradient(90deg, #111315 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        {/* Left side */}
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-2 backdrop-blur">
            <ShieldCheck
              size={15}
              strokeWidth={1.8}
              className="text-[#b08c42]"
            />

            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
              Secure Logistics & Visibility
            </span>
          </div>

          <h1 className="max-w-4xl text-[clamp(3.4rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[#111315]">
            Every shipment.
            <br />

            <span className="text-neutral-400">
              Every step.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            Follow your shipment from origin to destination with secure,
            reliable tracking information at every stage of its journey.
          </p>

          {/* Tracking form */}
          <div className="mt-9 max-w-2xl">
            <TrackingForm />
          </div>
        </div>

        {/* Right side — shipment card */}
        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
          <div className="absolute -inset-6 rounded-[40px] bg-[#c8a45d]/5 blur-2xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-neutral-200 bg-[#111315] p-3 shadow-[0_40px_100px_-35px_rgba(0,0,0,0.5)]">
            <div className="rounded-[21px] border border-white/[0.07] bg-[#181a1c] p-6 sm:p-8">

              {/* Card header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Shipment
                  </p>

                  <p className="mt-2 font-mono text-sm text-white">
                    VH-8492-0183
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[10px] font-medium text-emerald-300">
                    IN TRANSIT
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="my-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                      Origin
                    </p>

                    <p className="mt-2 text-lg font-medium text-white">
                      New York
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      NY, USA
                    </p>
                  </div>

                  <div className="mx-5 flex flex-1 items-center">
                    <div className="h-px flex-1 bg-gradient-to-r from-[#c8a45d] to-neutral-700" />

                    <Truck
                      size={18}
                      strokeWidth={1.6}
                      className="mx-3 text-[#c8a45d]"
                    />

                    <div className="h-px flex-1 bg-neutral-700" />
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                      Destination
                    </p>

                    <p className="mt-2 text-lg font-medium text-white">
                      Los Angeles
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      CA, USA
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    Shipment progress
                  </span>

                  <span className="font-mono text-xs text-[#d9bd7c]">
                    64%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="h-full w-[64%] rounded-full bg-[#c8a45d]" />
                </div>

                <div className="mt-5 flex justify-between text-[10px] text-neutral-500">
                  <span>Picked up</span>
                  <span>In transit</span>
                  <span>Delivery</span>
                </div>
              </div>

              {/* Delivery */}
              <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Estimated delivery
                  </p>

                  <p className="mt-2 text-sm font-medium text-white">
                    August 18, 2026
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a45d]/20 bg-[#c8a45d]/10">
                  <ShieldCheck
                    size={17}
                    className="text-[#c8a45d]"
                    strokeWidth={1.6}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}