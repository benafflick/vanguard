
"use client";

import { FormEvent, useEffect, useState } from "react";
import DestinationImages from "@/components/DestinationImages";

type TrackingEvent = {
  id: string;
  title: string;
  location: string;
  description: string | null;
  timestamp: string;
};

type Shipment = {
  trackingNumber: string;
  shipmentType: string;
  weight: number;
  status: string;
  origin: string;
  destination: string;
  currentLocation: string;
  estimatedDelivery: string;
  progress: number;
  trackingEvents: TrackingEvent[];
};

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tracking = params.get("tracking");

    if (tracking) {
      setTrackingNumber(tracking);
      void loadShipment(tracking);
    }
  }, []);

  async function loadShipment(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("Please enter a tracking number.");
      setShipment(null);
      return;
    }

    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const response = await fetch(
        `/api/shipments/${encodeURIComponent(trimmedValue)}`,
        { cache: "no-store" }
      );

      const text = await response.text();

      let data: {
        success?: boolean;
        message?: string;
        shipment?: Shipment;
      } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }
      }

      if (!response.ok || !data.success || !data.shipment) {
        throw new Error(
          data.message ||
            "We couldn't find a shipment with that tracking number."
        );
      }

      setShipment(data.shipment);

      const newUrl =
        `/track?tracking=${encodeURIComponent(trimmedValue)}`;

      window.history.replaceState({}, "", newUrl);
    } catch (caught) {
      console.error("TRACKING ERROR:", caught);

      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to retrieve shipment information. Please try again."
      );

      setShipment(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    await loadShipment(trackingNumber);
  }

  function formatDate(date: string) {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Unavailable";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(value);
  }

  function formatDateTime(date: string) {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Unavailable";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(value);
  }

  function getProgress() {
    if (!shipment) return 0;

    return Math.min(
      Math.max(Number(shipment.progress) || 0, 0),
      100
    );
  }

  function getStatusClasses() {
    if (!shipment) return "";

    const status = shipment.status.toLowerCase();

    if (status === "delivered") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "in transit") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "processing" || status === "at facility") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    if (status === "on hold") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-gray-200 bg-gray-50 text-gray-700";
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111] text-sm font-bold text-white">
              VH
            </div>

            <div>
              <div className="text-sm font-semibold tracking-tight">
                Vanguard Haulers
              </div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Cargo
              </div>
            </div>
          </a>

          <a
            href="/"
            className="text-sm font-medium text-gray-600 transition hover:text-black"
          >
            Back to Home
          </a>
        </div>
      </header>

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7626]">
            Shipment Tracking
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Track your shipment
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Enter your Vanguard Haulers Cargo tracking number
            to view the latest status and movement of your
            shipment.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={trackingNumber}
              onChange={(event) =>
                setTrackingNumber(event.target.value)
              }
              placeholder="Enter tracking number"
              autoComplete="off"
              spellCheck={false}
              className="h-14 flex-1 rounded-xl border border-gray-200 bg-[#f7f7f5] px-5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#9a7626] focus:bg-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 rounded-xl bg-[#111] px-8 text-sm font-medium text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Tracking..." : "Track Shipment"}
            </button>
          </form>

          {error && (
            <div
              role="alert"
              className="mx-auto mt-5 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-left text-sm text-red-700"
            >
              {error}
            </div>
          )}
        </div>
      </section>

      {shipment && (
        <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Tracking Number
                </p>

                <h2 className="mt-2 break-all text-2xl font-semibold tracking-tight sm:text-3xl">
                  {shipment.trackingNumber}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {shipment.shipmentType}
                </p>
              </div>

              <div
                className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium ${getStatusClasses()}`}
              >
                {shipment.status}
              </div>
            </div>

            <div className="mt-8 grid gap-4 border-t border-black/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Package Weight
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {Number(shipment.weight).toFixed(2)} kg
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Current Location
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {shipment.currentLocation}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Estimated Delivery
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {formatDate(shipment.estimatedDelivery)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Progress
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {getProgress()}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Shipment Route
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Current journey
              </h3>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Origin
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {shipment.origin}
                </p>
              </div>

              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#9a7626]" />
                  <div className="h-px w-24 bg-gray-300 lg:w-40" />
                  <span className="h-2 w-2 rounded-full bg-[#111]" />
                </div>
              </div>

              <div className="md:text-right">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Destination
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {shipment.destination}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-[#f7f7f5] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Currently at
              </p>

              <p className="mt-2 font-semibold">
                {shipment.currentLocation}
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Shipment progress
                </span>

                <span className="font-medium">
                  {getProgress()}%
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-gray-100"
                aria-label={`Shipment progress ${getProgress()} percent`}
              >
                <div
                  className="h-full rounded-full bg-[#9a7626] transition-all duration-500"
                  style={{
                    width: `${getProgress()}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <DestinationImages
            trackingNumber={shipment.trackingNumber}
            destination={shipment.destination}
          />

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Tracking History
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Shipment activity
              </h3>
            </div>

            {shipment.trackingEvents.length === 0 ? (
              <div className="rounded-xl bg-[#f7f7f5] p-5">
                <p className="text-sm text-gray-500">
                  No tracking events are available yet.
                </p>
              </div>
            ) : (
              <div>
                {shipment.trackingEvents.map(
                  (trackingEvent, index) => (
                    <div
                      key={trackingEvent.id}
                      className="relative flex gap-5 pb-8 last:pb-0"
                    >
                      <div className="relative flex w-5 shrink-0 justify-center">
                        {index !==
                          shipment.trackingEvents.length - 1 && (
                          <div className="absolute top-5 h-full w-px bg-gray-200" />
                        )}

                        <div
                          className={`relative z-10 mt-1 h-3 w-3 rounded-full border-2 ${
                            index === 0
                              ? "border-[#9a7626] bg-[#9a7626]"
                              : "border-gray-300 bg-white"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row">
                          <div>
                            <h4 className="font-semibold">
                              {trackingEvent.title}
                            </h4>

                            <p className="mt-1 text-sm text-gray-500">
                              {trackingEvent.location}
                            </p>
                          </div>

                          <p className="text-xs text-gray-400">
                            {formatDateTime(
                              trackingEvent.timestamp
                            )}
                          </p>
                        </div>

                        {trackingEvent.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                            {trackingEvent.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-[#e5d8b7] bg-[#fbf7ed] p-6">
            <div className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eadcb9] text-sm font-semibold text-[#76581c]">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-[#5f4818]">
                  Secure shipment monitoring
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#806a3c]">
                  Shipment information is updated as your
                  package moves through the Vanguard Haulers
                  Cargo network.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {!shipment && !loading && !error && (
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            →
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            Enter your tracking number
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Your shipment status, location, estimated delivery,
            weight, destination photographs, and tracking
            history will appear here.
          </p>
        </section>
      )}

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Vanguard Haulers
            Cargo. Secure logistics and shipment tracking.
          </p>
        </div>
      </footer>
    </main>
  );
}
