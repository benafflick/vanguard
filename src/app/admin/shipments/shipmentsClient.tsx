"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  isActive: boolean;
  createdAt: string;
};

export default function ShipmentsClient() {
  const [shipments, setShipments] =
    useState<Shipment[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionMessage, setActionMessage] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [
    processingTrackingNumber,
    setProcessingTrackingNumber,
  ] = useState<string | null>(null);

  /* -------------------------------- */
  /* Load Shipments */
  /* -------------------------------- */

  useEffect(() => {
    async function loadShipments() {
      try {
        setError("");

        const response = await fetch(
          "/api/shipments",
          {
            cache: "no-store",
          },
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load shipments.",
          );
        }

        setShipments(
          Array.isArray(data.shipments)
            ? data.shipments
            : [],
        );
      } catch (error) {
        console.error(
          "LOAD SHIPMENTS ERROR:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load shipments. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadShipments();
  }, []);

  /* -------------------------------- */
  /* Filter Shipments */
  /* -------------------------------- */

  const filteredShipments =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return shipments;
      }

      return shipments.filter(
        (shipment) => {
          const availability =
            shipment.isActive
              ? "active"
              : "inactive";

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
              .includes(query) ||
            shipment.shipmentType
              .toLowerCase()
              .includes(query) ||
            availability.includes(
              query,
            )
          );
        },
      );
    }, [shipments, search]);

  /* -------------------------------- */
  /* Format Date */
  /* -------------------------------- */

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    ).format(new Date(date));
  }

  /* -------------------------------- */
  /* Status Classes */
  /* -------------------------------- */

  function getStatusClasses(
    status: string,
  ) {
    const normalized =
      status.toLowerCase();

    if (
      normalized === "delivered"
    ) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (
      normalized ===
        "in transit" ||
      normalized ===
        "in_transit"
    ) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (
      normalized ===
        "processing" ||
      normalized ===
        "at facility" ||
      normalized ===
        "at_facility"
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
      normalized ===
        "out for delivery" ||
      normalized ===
        "out_for_delivery"
    ) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    return "bg-gray-50 text-gray-700 border-gray-200";
  }

  /* -------------------------------- */
  /* Format Status */
  /* -------------------------------- */

  function formatStatus(
    status: string,
  ) {
    return status
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (character) =>
          character.toUpperCase(),
      );
  }

  /* -------------------------------- */
  /* Deactivate / Reactivate */
  /* -------------------------------- */

  async function handleToggleActive(
    shipment: Shipment,
  ) {
    if (
      processingTrackingNumber
    ) {
      return;
    }

    const nextActiveState =
      !shipment.isActive;

    if (!nextActiveState) {
      const confirmed =
        window.confirm(
          `Deactivate ${shipment.trackingNumber}?\n\nCustomers will no longer be able to track this shipment until you reactivate it.`,
        );

      if (!confirmed) {
        return;
      }
    }

    setActionMessage("");
    setActionError("");

    setProcessingTrackingNumber(
      shipment.trackingNumber,
    );

    try {
      const response = await fetch(
        `/api/shipments/${encodeURIComponent(
          shipment.trackingNumber,
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            isActive:
              nextActiveState,
          }),
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update shipment.",
        );
      }

      setShipments(
        (currentShipments) =>
          currentShipments.map(
            (currentShipment) =>
              currentShipment.id ===
              shipment.id
                ? {
                    ...currentShipment,
                    isActive:
                      nextActiveState,
                  }
                : currentShipment,
          ),
      );

      setActionMessage(
        nextActiveState
          ? `${shipment.trackingNumber} has been reactivated successfully.`
          : `${shipment.trackingNumber} has been deactivated successfully.`,
      );
    } catch (error) {
      console.error(
        "TOGGLE SHIPMENT ERROR:",
        error,
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update shipment.",
      );
    } finally {
      setProcessingTrackingNumber(
        null,
      );
    }
  }

  /* -------------------------------- */
  /* Delete Shipment */
  /* -------------------------------- */

  async function handleDelete(
    shipment: Shipment,
  ) {
    if (
      processingTrackingNumber
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Permanently delete ${shipment.trackingNumber}?\n\nThis will permanently remove the shipment and all of its tracking history.\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    setActionMessage("");
    setActionError("");

    setProcessingTrackingNumber(
      shipment.trackingNumber,
    );

    try {
      const response = await fetch(
        `/api/shipments/${encodeURIComponent(
          shipment.trackingNumber,
        )}`,
        {
          method: "DELETE",
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to delete shipment.",
        );
      }

      setShipments(
        (currentShipments) =>
          currentShipments.filter(
            (currentShipment) =>
              currentShipment.id !==
              shipment.id,
          ),
      );

      setActionMessage(
        `${shipment.trackingNumber} was permanently deleted.`,
      );
    } catch (error) {
      console.error(
        "DELETE SHIPMENT ERROR:",
        error,
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete shipment.",
      );
    } finally {
      setProcessingTrackingNumber(
        null,
      );
    }
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
              Manage and monitor all
              Vanguard Haulers Cargo
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
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search tracking number, origin, destination, location..."
            className="h-12 w-full rounded-xl border border-gray-200 bg-[#f7f7f5] px-4 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
          />
        </div>

        {/* Success Message */}

        {actionMessage && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {actionMessage}
          </div>
        )}

        {/* Action Error */}

        {actionError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {/* Loading Error */}

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
          filteredShipments.length ===
            0 && (
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
          filteredShipments.length >
            0 && (
            <div className="mt-8 hidden overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm lg:block">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-black/10 bg-gray-50/70 text-left">
                    <th className="w-[18%] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Tracking
                    </th>

                    <th className="w-[14%] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Status
                    </th>

                    <th className="w-[22%] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Route
                    </th>

                    <th className="w-[10%] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Weight
                    </th>

                    <th className="w-[13%] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Delivery
                    </th>

                    <th className="w-[11%] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Progress
                    </th>

                    <th className="w-[12%] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredShipments.map(
                    (shipment) => {
                      const processing =
                        processingTrackingNumber ===
                        shipment.trackingNumber;

                      return (
                        <tr
                          key={
                            shipment.id
                          }
                          className={`border-b border-black/5 last:border-0 ${
                            !shipment.isActive
                              ? "bg-gray-50/70"
                              : ""
                          }`}
                        >
                          {/* Tracking */}

                          <td className="px-4 py-5 align-top">
                            <a
                              href={`/admin/shipments/${encodeURIComponent(
                                shipment.trackingNumber,
                              )}`}
                              className="block truncate text-sm font-semibold hover:underline"
                              title={
                                shipment.trackingNumber
                              }
                            >
                              {
                                shipment.trackingNumber
                              }
                            </a>

                            <p className="mt-1 truncate text-xs text-gray-400">
                              {
                                shipment.shipmentType
                              }
                            </p>

                            <div className="mt-2">
                              {shipment.isActive ? (
                                <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                  Inactive
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}

                          <td className="px-4 py-5 align-top">
                            <span
                              className={`inline-flex max-w-full rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                                shipment.status,
                              )}`}
                            >
                              <span className="truncate">
                                {formatStatus(
                                  shipment.status,
                                )}
                              </span>
                            </span>
                          </td>

                          {/* Route */}

                          <td className="px-4 py-5 align-top">
                            <p
                              className="truncate text-sm font-medium"
                              title={
                                shipment.origin
                              }
                            >
                              {
                                shipment.origin
                              }
                            </p>

                            <p
                              className="mt-1 truncate text-xs text-gray-400"
                              title={
                                shipment.destination
                              }
                            >
                              →{" "}
                              {
                                shipment.destination
                              }
                            </p>
                          </td>

                          {/* Weight */}

                          <td className="px-4 py-5 align-top text-sm">
                            {Number(
                              shipment.weight,
                            ).toFixed(
                              2,
                            )}{" "}
                            kg
                          </td>

                          {/* Delivery */}

                          <td className="px-4 py-5 align-top text-sm">
                            {formatDate(
                              shipment.estimatedDelivery,
                            )}
                          </td>

                          {/* Progress */}

                          <td className="px-4 py-5 align-top">
                            <div className="flex flex-col gap-2">
                              <span className="text-xs font-medium">
                                {
                                  shipment.progress
                                }
                                %
                              </span>

                              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
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
                            </div>
                          </td>

                          {/* Actions */}

                          <td className="px-4 py-5 align-top">
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                disabled={
                                  processing
                                }
                                onClick={() =>
                                  handleToggleActive(
                                    shipment,
                                  )
                                }
                                className={`inline-flex min-h-9 w-full items-center justify-center rounded-lg border px-2 py-2 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  shipment.isActive
                                    ? "border-[#9a7626]/30 bg-[#9a7626]/5 text-[#9a7626] hover:bg-[#9a7626]/10"
                                    : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                }`}
                              >
                                {processing
                                  ? "Working..."
                                  : shipment.isActive
                                    ? "Deactivate"
                                    : "Reactivate"}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  processing
                                }
                                onClick={() =>
                                  handleDelete(
                                    shipment,
                                  )
                                }
                                className="inline-flex min-h-9 w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}

        {/* Mobile Cards */}

        {!loading &&
          !error &&
          filteredShipments.length >
            0 && (
            <div className="mt-8 space-y-4 lg:hidden">
              {filteredShipments.map(
                (shipment) => {
                  const processing =
                    processingTrackingNumber ===
                    shipment.trackingNumber;

                  return (
                    <div
                      key={shipment.id}
                      className={`rounded-2xl border bg-white p-5 shadow-sm ${
                        shipment.isActive
                          ? "border-black/10"
                          : "border-gray-300 bg-gray-50/60"
                      }`}
                    >
                      {/* Clickable Shipment Details */}

                      <a
                        href={`/admin/shipments/${encodeURIComponent(
                          shipment.trackingNumber,
                        )}`}
                        className="block"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {
                                shipment.trackingNumber
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {
                                shipment.shipmentType
                              }
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                              shipment.status,
                            )}`}
                          >
                            {formatStatus(
                              shipment.status,
                            )}
                          </span>
                        </div>

                        {/* Active / Inactive */}

                        <div className="mt-3">
                          {shipment.isActive ? (
                            <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-semibold text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-600">
                              Inactive
                            </span>
                          )}
                        </div>

                        {/* Details */}

                        <div className="mt-5 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">
                              Route
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {
                                shipment.origin
                              }
                            </p>

                            <p className="text-xs text-gray-400">
                              →{" "}
                              {
                                shipment.destination
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">
                              Weight
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {Number(
                                shipment.weight,
                              ).toFixed(
                                2,
                              )}{" "}
                              kg
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
                              {
                                shipment.progress
                              }
                              %
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}

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

                      {/* Mobile Actions */}

                      <div className="mt-5 border-t border-black/10 pt-5">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                          Actions
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            disabled={
                              processing
                            }
                            onClick={() =>
                              handleToggleActive(
                                shipment,
                              )
                            }
                            className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-3 py-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              shipment.isActive
                                ? "border-[#9a7626]/30 bg-[#9a7626]/5 text-[#9a7626] hover:bg-[#9a7626]/10"
                                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {processing
                              ? "Working..."
                              : shipment.isActive
                                ? "Deactivate"
                                : "Reactivate"}
                          </button>

                          <button
                            type="button"
                            disabled={
                              processing
                            }
                            onClick={() =>
                              handleDelete(
                                shipment,
                              )
                            }
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
      </section>
    </main>
  );
}