
export default function TrustStrip() {
  const items = [
    {
      value: "24/7",
      label: "Shipment visibility",
    },
    {
      value: "Global",
      label: "Logistics network",
    },
    {
      value: "Secure",
      label: "Cargo handling",
    },
    {
      value: "Real-time",
      label: "Tracking updates",
    },
  ];

  return (
    <section className="border-y border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid divide-y divide-black/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-black/10">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 px-2 py-7 sm:px-8 lg:py-8"
            >
              <div className="h-8 w-px bg-[#b08c42]" />

              <div>
                <p className="text-sm font-semibold tracking-tight text-[#111]">
                  {item.value}
                </p>

                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
