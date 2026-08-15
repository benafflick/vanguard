import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-[#f7f7f5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111315]">
            <span className="text-sm font-bold tracking-tight text-[#c8a45d]">
              VH
            </span>
          </div>

          <div className="leading-none">
            <div className="text-[14px] font-bold tracking-[0.16em] text-[#111315]">
              VANGUARD
            </div>

            <div className="mt-1 text-[8px] font-medium tracking-[0.32em] text-neutral-500">
              HAULERS CARGO
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/track"
            className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
          >
            Track Shipment
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
          >
            About
          </Link>

          <Link
            href="/support"
            className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
          >
            Support
          </Link>

          <Link
            href="/track"
            className="group flex items-center gap-2 rounded-full bg-[#111315] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Track Shipment

            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Open navigation menu"
          className="rounded-xl p-2.5 text-neutral-800 transition hover:bg-neutral-200 md:hidden"
        >
          <Menu size={22} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}