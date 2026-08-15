
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Package,
  Plus,
  Truck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminPage() {
  /*
   * ADMIN AUTHENTICATION
   *
   * The dashboard is only accessible when the login page
   * has created the "vanguard_admin" authentication cookie.
   */
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("vanguard_admin")?.value;

  if (adminCookie !== "authenticated") {
    redirect("/admin/login");
  }

  /*
   * DASHBOARD DATA
   *
   * Load live shipment data directly from Prisma.
   */
  const shipments = await prisma.shipment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  /*
   * DASHBOARD STATISTICS
   *
   * Status values are normalized so this works whether
   * the database stores values such as:
   *
   * "in_transit"
   * "In Transit"
   * "delivered"
   * "Delivered"
   */
  const normalizedStatus = (status: string) =>
    status
      .trim()
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll("-", "_");

  const totalShipments = shipments.length;

  const inTransit = shipments.filter(
    (shipment) =>
      normalizedStatus(shipment.status) === "in_transit",
  ).length;

  const delivered = shipments.filter(
    (shipment) =>
      normalizedStatus(shipment.status) === "delivered",
  ).length;

  const delayed = shipments.filter(
    (shipment) =>
      normalizedStatus(shipment.status) === "delayed",
  ).length;

  const activeShipments = shipments.filter(
    (shipment) =>
      normalizedStatus(shipment.status) !== "delivered",
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f5f2]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-200 bg-[#111315] lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-[76px] items-center border-b border-white/10 px-6">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c8a45d]">
                <span className="text-xs font-bold text-[#111315]">
                  VH
                </span>
              </div>

              <div className="leading-none">
                <div className="text-[13px] font-bold tracking-[0.14em] text-white">
                  VANGUARD
                </div>

                <div className="mt-1 text-[7px] font-medium tracking-[0.28em] text-neutral-400">
                  HAULERS CARGO
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Operations
            </p>

            <div className="mt-3 space-y-1">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-medium text-white"
              >
                <Activity size={17} />
                Dashboard
              </Link>

              <Link
                href="/admin/shipments"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-white"
              >
                <Package size={17} />
                Shipments
              </Link>
            </div>

            <p className="mt-8 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              System
            </p>

            <div className="mt-3 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowUpRight size={17} />
                View website
              </Link>
            </div>
          </nav>

          {/* Admin profile + Logout */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c8a45d] text-xs font-bold text-[#111315]">
                AD
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  Administrator
                </p>

                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Operations
                </p>
              </div>
            </div>

            <div className="mt-3">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-neutral-200 bg-[#f5f5f2]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b08c42]">
              Operations
            </p>

            <h1 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/shipments/new"
              className="hidden items-center gap-2 rounded-xl bg-[#111315] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 sm:flex"
            >
              <Plus size={15} />
              New shipment
            </Link>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <section className="p-5 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                Good evening, Administrator.
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Here&apos;s what&apos;s happening across your shipments today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total shipments"
                value={totalShipments}
                description="All shipments"
                icon={Package}
              />

              <StatCard
                label="In transit"
                value={inTransit}
                description="Currently moving"
                icon={Truck}
              />

              <StatCard
                label="Delivered"
                value={delivered}
                description="Successfully delivered"
                icon={CheckCircle2}
              />

              <StatCard
                label="Delayed"
                value={delayed}
                description="Requires attention"
                icon={AlertTriangle}
                alert
              />
            </div>

            {/* Main grid */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
              {/* Recent shipments */}
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-950">
                      Recent shipments
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500">
                      Latest shipment activity
                    </p>
                  </div>

                  <Link
                    href="/admin/shipments"
                    className="text-xs font-semibold text-[#9b7838] hover:text-[#806127]"
                  >
                    View all
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px]">
                    <thead>
                      <tr className="border-b border-neutral-100 text-left">
                        <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                          Tracking
                        </th>

                        <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                          Route
                        </th>

                        <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                          Weight
                        </th>

                        <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {shipments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center"
                          >
                            <Package
                              size={24}
                              className="mx-auto text-neutral-300"
                            />

                            <p className="mt-3 text-sm font-medium text-neutral-700">
                              No shipments yet
                            </p>

                            <p className="mt-1 text-xs text-neutral-400">
                              Create your first shipment to see it here.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        shipments.map((shipment) => (
                          <tr
                            key={shipment.trackingNumber}
                            className="border-b border-neutral-100 last:border-0"
                          >
                            <td className="px-6 py-4">
                              <p className="font-mono text-xs font-semibold text-neutral-900">
                                {shipment.trackingNumber}
                              </p>

                              <p className="mt-1 text-[10px] text-neutral-400">
                                {shipment.shipmentType}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <p className="text-xs font-medium text-neutral-800">
                                {shipment.origin}
                              </p>

                              <p className="mt-1 text-[10px] text-neutral-400">
                                → {shipment.destination}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-xs font-medium text-neutral-700">
                                {Number(shipment.weight).toFixed(2)} kg
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <StatusBadge
                                status={shipment.status}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Operations summary */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-950">
                      Operations overview
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500">
                      Current shipment activity
                    </p>
                  </div>

                  <Activity
                    size={18}
                    className="text-[#b08c42]"
                  />
                </div>

                <div className="mt-8 space-y-5">
                  <OperationRow
                    label="Active shipments"
                    value={activeShipments}
                  />

                  <OperationRow
                    label="In transit"
                    value={inTransit}
                  />

                  <OperationRow
                    label="Delivered"
                    value={delivered}
                  />

                  <OperationRow
                    label="Delayed"
                    value={delayed}
                    alert
                  />
                </div>

                <div className="mt-8 rounded-xl bg-neutral-50 p-4">
                  <div className="flex gap-3">
                    <Clock3
                      size={17}
                      className="mt-0.5 shrink-0 text-neutral-500"
                    />

                    <div>
                      <p className="text-xs font-semibold text-neutral-800">
                        Tracking system
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                        Shipment tracking is currently operating normally.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6">
              <h3 className="mb-4 text-sm font-semibold text-neutral-950">
                Quick actions
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <QuickAction
                  href="/admin/shipments"
                  icon={Package}
                  title="Manage shipments"
                  description="View and update shipment records."
                />

                <QuickAction
                  href="/admin/shipments/new"
                  icon={Plus}
                  title="Create shipment"
                  description="Add a new shipment to the system."
                />

                <QuickAction
                  href="/"
                  icon={ArrowUpRight}
                  title="View customer site"
                  description="Open the public Vanguard website."
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Stat Card */
/* -------------------------------- */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  alert = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-400">
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-semibold tracking-tight ${
              alert
                ? "text-red-600"
                : "text-neutral-950"
            }`}
          >
            {value}
          </p>

          <p className="mt-1 text-[10px] text-neutral-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            alert
              ? "bg-red-50"
              : "bg-neutral-100"
          }`}
        >
          <Icon
            size={18}
            className={
              alert
                ? "text-red-500"
                : "text-neutral-700"
            }
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Status Badge */
/* -------------------------------- */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalizedStatus = status
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");

  const styles: Record<
    string,
    {
      wrapper: string;
      text: string;
      dot: string;
    }
  > = {
    delivered: {
      wrapper:
        "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },

    in_transit: {
      wrapper:
        "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },

    out_for_delivery: {
      wrapper:
        "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },

    at_facility: {
      wrapper:
        "bg-neutral-100 border-neutral-200",
      text: "text-neutral-600",
      dot: "bg-neutral-500",
    },

    processing: {
      wrapper:
        "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },

    on_hold: {
      wrapper:
        "bg-red-50 border-red-200",
      text: "text-red-700",
      dot: "bg-red-500",
    },

    delayed: {
      wrapper:
        "bg-red-50 border-red-200",
      text: "text-red-700",
      dot: "bg-red-500",
    },
  };

  const style =
    styles[normalizedStatus] ?? {
      wrapper:
        "bg-neutral-100 border-neutral-200",
      text: "text-neutral-600",
      dot: "bg-neutral-500",
    };

  const label = status
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 ${style.wrapper}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
      />

      <span
        className={`text-[9px] font-bold tracking-[0.05em] ${style.text}`}
      >
        {label}
      </span>
    </span>
  );
}

/* -------------------------------- */
/* Operation Row */
/* -------------------------------- */

function OperationRow({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: number;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-500">
        {label}
      </span>

      <span
        className={`text-sm font-semibold ${
          alert
            ? "text-red-600"
            : "text-neutral-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* -------------------------------- */
/* Quick Action */
/* -------------------------------- */

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
          <Icon
            size={18}
            className="text-neutral-700"
          />
        </div>

        <ArrowUpRight
          size={16}
          className="text-neutral-300 transition group-hover:text-neutral-700"
        />
      </div>

      <h4 className="mt-5 text-sm font-semibold text-neutral-900">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-neutral-500">
        {description}
      </p>
    </Link>
  );
}
