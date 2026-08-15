import {
  ArrowUpRight,
  Globe2,
  MapPin,
  Navigation,
} from "lucide-react";

const coverageAreas = [
  {
    region: "International Freight",
    description:
      "Reliable cargo movement across established international trade routes and major commercial destinations.",
    locations: [
      "Europe",
      "North America",
      "Middle East",
      "Asia",
    ],
  },
  {
    region: "Global Logistics",
    description:
      "Flexible logistics support for businesses moving cargo between markets, distribution hubs, and international destinations.",
    locations: [
      "United Kingdom",
      "United States",
      "Canada",
      "United Arab Emirates",
      "Germany",
      "France",
    ],
  },
];

export default function Coverage() {
  return (
    <section
      id="coverage"
      className="border-t border-black/10 bg-[#f7f7f5] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7626]">
              Coverage
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              Connecting cargo to destinations worldwide.
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
              Vanguard Haulers Cargo supports international
              freight movement across major markets and
              commercial routes, helping businesses move
              cargo with greater confidence.
            </p>
          </div>
        </div>

        {/* Coverage visual + regions */}
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Network visual */}
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-[#111315]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.08]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
            </div>

            {/* Glow */}
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c8a45d]/10 blur-3xl" />

            {/* Route lines */}
            <div className="absolute left-[18%] top-[38%] h-px w-[62%] rotate-[17deg] origin-left bg-gradient-to-r from-[#c8a45d] via-[#c8a45d]/50 to-transparent" />

            <div className="absolute left-[28%] top-[62%] h-px w-[52%] -rotate-[15deg] origin-left bg-gradient-to-r from-white/30 via-white/10 to-transparent" />

            {/* Origin point */}
            <div className="absolute left-[17%] top-[35%]">
              <span className="absolute -inset-3 animate-pulse rounded-full border border-[#c8a45d]/30" />

              <span className="relative flex h-3 w-3 rounded-full bg-[#c8a45d]" />
            </div>

            {/* Middle point */}
            <div className="absolute left-[51%] top-[51%]">
              <span className="relative flex h-2.5 w-2.5 rounded-full bg-white/70" />
            </div>

            {/* Destination point */}
            <div className="absolute right-[17%] bottom-[30%]">
              <span className="absolute -inset-3 rounded-full border border-white/20" />

              <span className="relative flex h-3 w-3 rounded-full bg-white" />
            </div>

            {/* Labels */}
            <div className="absolute left-7 top-7">
              <div className="flex items-center gap-2">
                <Globe2
                  size={16}
                  className="text-[#c8a45d]"
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                  Global logistics network
                </span>
              </div>
            </div>

            <div className="absolute bottom-7 left-7">
              <p className="text-2xl font-semibold tracking-tight text-white">
                Local expertise. Global reach.
              </p>

              <p className="mt-2 max-w-sm text-xs leading-5 text-neutral-500">
                Strategic international routes designed
                around the movement of your cargo.
              </p>
            </div>

            <div className="absolute right-7 top-7 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Worldwide
              </span>
            </div>
          </div>

          {/* Regions */}
          <div className="grid gap-5">
            {coverageAreas.map((area) => (
              <div
                key={area.region}
                className="group rounded-3xl border border-black/10 bg-white p-7 transition hover:border-black/20 hover:shadow-sm sm:p-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3eee2]">
                    <Navigation
                      size={18}
                      className="text-[#8f6d27]"
                    />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-neutral-300 transition group-hover:text-neutral-700"
                  />
                </div>

                <h3 className="mt-7 text-xl font-semibold tracking-tight text-neutral-950">
                  {area.region}
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {area.description}
                </p>

                <div className="mt-6 border-t border-black/10 pt-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Key destinations
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {area.locations.map((location) => (
                      <span
                        key={location}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f7f5] px-3 py-1.5 text-[10px] font-medium text-neutral-600"
                      >
                        <MapPin
                          size={11}
                          className="text-[#9a7626]"
                        />

                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-6 rounded-2xl border border-[#e5d8b7] bg-[#fbf7ed] px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[#5f4818]">
              Have a destination that isn&apos;t listed?
            </p>

            <p className="text-xs leading-5 text-[#806a3c]">
              Contact our logistics team to discuss your
              international shipping requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}