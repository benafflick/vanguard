
import {
  Eye,
  LockKeyhole,
  Route,
  ShieldCheck,
} from "lucide-react";

const advantages = [
  {
    icon: Eye,
    title: "Shipment visibility",
    description:
      "Stay informed with clear shipment status and tracking information throughout the journey.",
  },
  {
    icon: ShieldCheck,
    title: "Cargo focused",
    description:
      "Every shipment is handled with attention to security, organization, and dependable movement.",
  },
  {
    icon: Route,
    title: "Coordinated logistics",
    description:
      "We keep the movement of your cargo organized from its point of origin to its final destination.",
  },
  {
    icon: LockKeyhole,
    title: "Secure information",
    description:
      "Your shipment details remain accessible through a straightforward and secure tracking experience.",
  },
];

export default function WhyVanguard() {
  return (
    <section className="bg-[#f7f7f5] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Intro */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7626]">
              Why Vanguard
            </p>

            <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight text-[#111] sm:text-4xl">
              Logistics with clarity from start to finish.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
              Moving cargo is more than getting from one location
              to another. It is about knowing where your shipment
              is, what is happening next, and having confidence in
              the process.
            </p>

            <div className="mt-8 h-px w-16 bg-[#c8a45d]" />
          </div>

          {/* Advantages */}
          <div className="grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2">
            {advantages.map((advantage) => {
              const Icon = advantage.icon;

              return (
                <div
                  key={advantage.title}
                  className="bg-white p-7 sm:p-8"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f3ef]">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className="text-[#9a7626]"
                    />
                  </div>

                  <h3 className="mt-7 text-base font-semibold tracking-tight text-[#111]">
                    {advantage.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {advantage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

