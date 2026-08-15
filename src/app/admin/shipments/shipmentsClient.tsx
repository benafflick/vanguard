
"use client";

import { useEffect, useMemo, useState } from "react";

type Shipment = {
  id: string;
  trackingNumber: string;
  shipmentType: string;
  weight: number;
  status: string;
  origin: string;
  destination: string;
  currentLocation: string;
  estimatedDelivery: string;
  progress: number;
  createdAt: string;
};

export default function ShipmentsClient() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShipments() {
      try {
        const response = await fetch("/api/shipments", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load shipments.",
          );
        }

        setShipments(data.shipments);
      } catch (error) {
        console.error("LOAD SHIPMENTS ERROR:", error);

        setError(
          "Unable to load shipments. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadShipments();
  }, []);

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return shipments;
    }

    return shipments.filter((shipment) => {
      return (
        shipment.trackingNumber
          .toLowerCase()
          .includes(query) ||
        shipment.origin
          .toLowerCase()
          .includes(query) ||
        shipment.destination
          .toLowerCase()
          .includes(query) ||
        shipment.currentLocation
          .toLowerCase()
          .includes(query) ||
        shipment.status
          .toLowerCase()
          .includes(query)
      );
    });
  }, [shipments, search]);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  function getStatusClasses(status: string) {
    const normalized = status.toLowerCase();

    if (normalized === "delivered") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (
      normalized === "in transit" ||
      normalized === "in_transit"
    ) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (
      normalized === "processing" ||
      normalized === "at facility" ||
      normalized === "at_facility"
    ) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (
      normalized === "on hold" ||
      normalized === "on_hold" ||
      normalized === "delayed"
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (
      normalized === "out for delivery" ||
      normalized === "out_for_delivery"
    ) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    return "bg-gray-50 text-gray-700 border-gray-200";
  }

  function formatStatus(status: string) {
    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) =>
        character.toUpperCase(),
      );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111] text-sm font-bold text-white">
              VH
            </div>

            <div>
              <div className="text-sm font-semibold">
                Vanguard Haulers
              </div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Admin
              </div>
            </div>
          </a>

          <a
            href="/track"
            className="text-sm font-medium text-gray-600 transition hover:text-black"
          >
            Customer Tracking
          </a>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Page Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7626]">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shipments
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Manage and monitor all Vanguard Haulers Cargo
              shipments.
            </p>
          </div>

          <a
            href="/admin/shipments/new"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#111] px-6 text-sm font-medium text-white transition hover:bg-[#292929]"
          >
            + New Shipment
          </a>
        </div>

        {/* Search */}
        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search tracking number, origin, destination, location..."
            className="h-12 w-full rounded-xl border border-gray-200 bg-[#f7f7f5] px-4 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading shipments...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredShipments.length === 0 && (
            <div className="mt-8 rounded-2xl border border-black/10 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg">
                —
              </div>

              <h2 className="mt-4 font-semibold">
                No shipments found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try a different search term."
                  : "Create your first shipment to see it here."}
              </p>
            </div>
          )}

        {/* Desktop Table */}
        {!loading &&
          !error &&
          filteredShipments.length > 0 && (
            <div className="mt-8 hidden overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/10 bg-gray-50/70 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Tracking
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Route
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Weight
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Delivery
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Progress
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredShipments.map((shipment) => (
                      <tr
                        key={shipment.id}
                        className="border-b border-black/5 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <a
                            href={`/admin/shipments/${encodeURIComponent(
                              shipment.trackingNumber,
                            )}`}
                            className="font-semibold hover:underline"
                          >
                            {shipment.trackingNumber}
                          </a>

                          <p className="mt-1 text-xs text-gray-400">
                            {shipment.shipmentType}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                              shipment.status,
                            )}`}
                          >
                            {formatStatus(shipment.status)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium">
                            {shipment.origin}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            → {shipment.destination}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm">
                          {Number(shipment.weight).toFixed(2)} kg
                        </td>

                        <td className="px-6 py-5 text-sm">
                          {formatDate(
                            shipment.estimatedDelivery,
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-[#9a7626]"
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      shipment.progress,
                                      0,
                                    ),
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="text-xs font-medium">
                              {shipment.progress}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Mobile Cards */}
        {!loading &&
          !error &&
          filteredShipments.length > 0 && (
            <div className="mt-8 space-y-4 lg:hidden">
              {filteredShipments.map((shipment) => (
                <a
                  key={shipment.id}
                  href={`/admin/shipments/${encodeURIComponent(
                    shipment.trackingNumber,
                  )}`}
                  className="block rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-black/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {shipment.trackingNumber}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {shipment.shipmentType}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                        shipment.status,
                      )}`}
                    >
                      {formatStatus(shipment.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Route
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {shipment.origin}
                      </p>

                      <p className="text-xs text-gray-400">
                        → {shipment.destination}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Weight
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {Number(shipment.weight).toFixed(2)} kg
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Delivery
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {formatDate(
                          shipment.estimatedDelivery,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Progress
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {shipment.progress}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#9a7626]"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            shipment.progress,
                            0,
                          ),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </a>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}
