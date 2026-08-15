import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";

const companyLinks = [
  {
    label: "About us",
    href: "#why-vanguard",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Coverage",
    href: "#coverage",
  },
  {
    label: "Track shipment",
    href: "/track",
  },
];

const serviceLinks = [
  "Freight forwarding",
  "Cargo transportation",
  "Warehousing",
  "Last-mile delivery",
];

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#111315] text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c8a45d]">
                <span className="text-xs font-bold text-[#111315]">
                  VH
                </span>
              </div>

              <div className="leading-none">
                <div className="text-sm font-bold tracking-[0.14em] text-white">
                  VANGUARD
                </div>

                <div className="mt-1 text-[8px] font-medium tracking-[0.28em] text-neutral-500">
                  HAULERS CARGO
                </div>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-6 text-neutral-500">
              Reliable logistics and cargo solutions built to
              keep your business moving.
            </p>

            <Link
              href="/track"
              className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-[#c8a45d] transition hover:text-[#dec17b]"
            >
              Track your shipment
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Company
            </h3>

            <nav className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-neutral-400 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Services
            </h3>

            <div className="mt-5 space-y-3">
              {serviceLinks.map((service) => (
                <p
                  key={service}
                  className="text-sm text-neutral-400"
                >
                  {service}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-neutral-600">
            © {new Date().getFullYear()} Vanguard Haulers Cargo.
            All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-[11px] text-neutral-600 transition hover:text-neutral-300"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-[11px] text-neutral-600 transition hover:text-neutral-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}