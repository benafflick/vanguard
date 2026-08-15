
import {
  ArrowUpRight,
  Boxes,
  Globe2,
  Truck,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    number: "01",
    icon: Truck,
    title: "Freight Transportation",
    description:
      "Reliable transportation for commercial cargo, freight, and time-sensitive shipments across our logistics network.",
  },
  {
    number: "02",
    icon: Globe2,
    title: "International Logistics",
    description:
      "Coordinated international shipping with clear movement visibility from origin through final destination.",
  },
  {
    number: "03",
    icon: Boxes,
    title: "Cargo Handling",
    description:
      "Careful handling and movement of shipments with a focus on security, organization, and dependable delivery.",
  },
];

export default function Services() {
  return (
    <section className="bg-[#f7f7f5] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7626]">
              What we do
            </p>

            <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-[#111] sm:text-4xl">
              Logistics built around your cargo.
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-sm leading-7 text-gray-500 sm:text-base">
              From local freight movement to international cargo
              coordination, Vanguard Haulers Cargo provides a
              straightforward logistics experience with visibility
              throughout the journey.
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.number}
                className="group bg-white p-7 transition hover:bg-[#111]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f3ef] transition group-hover:bg-white/10">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className="text-[#111] transition group-hover:text-[#c8a45d]"
                    />
                  </div>

                  <span className="font-mono text-[10px] text-gray-300 transition group-hover:text-white/30">
                    {service.number}
                  </span>
                </div>

                <h3 className="mt-12 text-lg font-semibold tracking-tight text-[#111] transition group-hover:text-white">
                  {service.title}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-500 transition group-hover:text-neutral-400">
                  {service.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#9a7626] transition group-hover:text-[#c8a45d]">
                  <span>Learn more</span>

                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Supporting CTA */}
        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="text-sm font-semibold text-[#111]">
              Already have a shipment on the way?
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Use your tracking number to see the latest movement
              and delivery information.
            </p>
          </div>

          <Link
            href="/track"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#111] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#292929]"
          >
            Track a shipment
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
