
import {
  ArrowRight,
  ClipboardCheck,
  MapPinned,
  PackageCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Book your shipment",
    description:
      "Provide your shipment details and let our team coordinate the right logistics solution for your cargo.",
  },
  {
    number: "02",
    icon: MapPinned,
    title: "We move your cargo",
    description:
      "Your shipment moves through our logistics network with its progress recorded throughout the journey.",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Track & receive",
    description:
      "Follow your shipment online and stay informed from departure through arrival at its destination.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-black/10 bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7626]">
            How it works
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111] sm:text-4xl">
            From pickup to destination,
            <br className="hidden sm:block" />
            we keep things moving.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            A straightforward logistics process designed to give you
            confidence at every stage of your shipment.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid gap-0 border-y border-black/10 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className={`relative py-8 lg:px-8 lg:py-10 ${
                  index !== steps.length - 1
                    ? "border-b border-black/10 lg:border-b-0 lg:border-r"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f3ef]">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className="text-[#9a7626]"
                    />
                  </div>

                  <span className="font-mono text-[10px] text-gray-300">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-10 text-lg font-semibold tracking-tight text-[#111]">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                  {step.description}
                </p>

                {index !== steps.length - 1 && (
                  <div className="mt-8 hidden lg:block">
                    <ArrowRight
                      size={17}
                      className="text-gray-300"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom message */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[#111315] px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-semibold text-white">
              Know where your shipment is.
            </p>

            <p className="mt-1 text-xs leading-5 text-neutral-400">
              Your tracking number gives you access to the latest
              shipment status and movement.
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
            <MapPinned
              size={17}
              className="text-[#c8a45d]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
