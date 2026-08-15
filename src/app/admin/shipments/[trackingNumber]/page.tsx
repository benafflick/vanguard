"use client";

import { useEffect, useState } from "react";

type TrackingEvent = {
  id: string;
  title: string;
  location: string;
  description: string | null;
  timestamp: string;
};

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
  trackingEvents: TrackingEvent[];
};

export default function ShipmentManagementPage({
  params,
}: {
  params: Promise<{ trackingNumber: string }>;
}) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingEvent, setAddingEvent] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [formData, setFormData] = useState({
    status: "",
    currentLocation: "",
    progress: "0",
    estimatedDelivery: "",
  });

  const [eventData, setEventData] = useState({
    title: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    async function loadShipment() {
      try {
        const resolvedParams = await params;

        const number = decodeURIComponent(
          resolvedParams.trackingNumber,
        );

        setTrackingNumber(number);

        const response = await fetch(
          `/api/shipments/${encodeURIComponent(number)}`,
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Shipment not found.",
          );
        }

        const loadedShipment = data.shipment;

        setShipment(loadedShipment);

        setFormData({
          status: loadedShipment.status,
          currentLocation:
            loadedShipment.currentLocation,
          progress: String(loadedShipment.progress),
          estimatedDelivery: formatForDateTimeLocal(
            loadedShipment.estimatedDelivery,
          ),
        });
      } catch (error) {
        console.error(
          "LOAD SHIPMENT ERROR:",
          error,
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load shipment.",
        );

        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    loadShipment();
  }, [params]);

  function formatForDateTimeLocal(date: string) {
    const value = new Date(date);

    const year = value.getFullYear();
    const month = String(
      value.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(value.getDate()).padStart(
      2,
      "0",
    );
    const hours = String(
      value.getHours(),
    ).padStart(2, "0");
    const minutes = String(
      value.getMinutes(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  function formatDateTime(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function handleShipmentChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEventChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setEventData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function saveShipment(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `/api/shipments/${encodeURIComponent(
          trackingNumber,
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: formData.status,
            currentLocation:
              formData.currentLocation,
            progress: Number(formData.progress),
            estimatedDelivery:
              formData.estimatedDelivery,
          }),
        },
      );

      const text = await response.text();

      const data = text
        ? JSON.parse(text)
        : {
            success: false,
            message: "The server returned an empty response.",
          };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update shipment.",
        );
      }

      setShipment(data.shipment);

      setMessage(
        "Shipment updated successfully.",
      );
      setMessageType("success");
    } catch (error) {
      console.error(
        "UPDATE SHIPMENT ERROR:",
        error,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update shipment.",
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function addTrackingEvent(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!eventData.title.trim()) {
      setMessage("Please enter an event title.");
      setMessageType("error");
      return;
    }

    if (!eventData.location.trim()) {
      setMessage("Please enter an event location.");
      setMessageType("error");
      return;
    }

    setAddingEvent(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `/api/shipments/${encodeURIComponent(
          trackingNumber,
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: eventData.title,
            location: eventData.location,
            description:
              eventData.description,
          }),
        },
      );

      const text = await response.text();

      const data = text
        ? JSON.parse(text)
        : {
            success: false,
            message: "The server returned an empty response.",
          };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to add tracking event.",
        );
      }

      setShipment(data.shipment);

      setEventData({
        title: "",
        location: "",
        description: "",
      });

      setMessage(
        "Tracking event added successfully.",
      );
      setMessageType("success");
    } catch (error) {
      console.error(
        "ADD EVENT ERROR:",
        error,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add tracking event.",
      );

      setMessageType("error");
    } finally {
      setAddingEvent(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] p-6">
        <div className="mx-auto max-w-6xl py-20 text-center">
          <p className="text-sm text-gray-500">
            Loading shipment...
          </p>
        </div>
      </main>
    );
  }

  if (!shipment) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] p-6">
        <div className="mx-auto max-w-2xl py-20 text-center">
          <h1 className="text-2xl font-semibold">
            Shipment not found
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {message ||
              "We couldn't find this shipment."}
          </p>

          <a
            href="/admin/shipments"
            className="mt-6 inline-flex rounded-xl bg-[#111] px-6 py-3 text-sm font-medium text-white"
          >
            Back to Shipments
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/admin/shipments"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Shipments
          </a>

          <a
            href={`/track?tracking=${encodeURIComponent(
              shipment.trackingNumber,
            )}`}
            className="text-sm font-medium text-[#76581c] hover:underline"
          >
            Customer Tracking →
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {/* Heading */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7626]">
            Shipment Management
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {shipment.trackingNumber}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {shipment.shipmentType}
              </p>
            </div>

            <div className="rounded-full bg-[#f3ead4] px-4 py-2 text-sm font-medium text-[#76581c]">
              {shipment.status}
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 rounded-xl border px-5 py-4 text-sm ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Shipment Overview */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Weight
            </p>

            <p className="mt-2 text-xl font-semibold">
              {shipment.weight.toFixed(2)} kg
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Origin
            </p>

            <p className="mt-2 text-xl font-semibold">
              {shipment.origin}
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Destination
            </p>

            <p className="mt-2 text-xl font-semibold">
              {shipment.destination}
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Progress
            </p>

            <p className="mt-2 text-xl font-semibold">
              {shipment.progress}%
            </p>
          </div>
        </div>

        {/* Update Shipment */}
        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Update Shipment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the current status and location
              shown to the customer.
            </p>
          </div>

          <form
            onSubmit={saveShipment}
            className="grid gap-6 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleShipmentChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
              >
                <option value="Processing">
                  Processing
                </option>
                <option value="In Transit">
                  In Transit
                </option>
                <option value="At Facility">
                  At Facility
                </option>
                <option value="Out for Delivery">
                  Out for Delivery
                </option>
                <option value="Delivered">
                  Delivered
                </option>
                <option value="On Hold">
                  On Hold
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="currentLocation"
                className="mb-2 block text-sm font-medium"
              >
                Current Location
              </label>

              <input
                id="currentLocation"
                name="currentLocation"
                value={
                  formData.currentLocation
                }
                onChange={handleShipmentChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="estimatedDelivery"
                className="mb-2 block text-sm font-medium"
              >
                Estimated Delivery
              </label>

              <input
                id="estimatedDelivery"
                name="estimatedDelivery"
                type="datetime-local"
                value={
                  formData.estimatedDelivery
                }
                onChange={handleShipmentChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="progress"
                className="mb-2 block text-sm font-medium"
              >
                Progress
              </label>

              <div className="flex items-center gap-4">
                <input
                  id="progress"
                  name="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleShipmentChange}
                  className="w-full accent-[#9a7626]"
                />

                <span className="w-12 text-right text-sm font-medium">
                  {formData.progress}%
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#111] px-7 py-3.5 text-sm font-medium text-white hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Add Tracking Event */}
        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Add Tracking Event
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new update to the customer's tracking
              timeline.
            </p>
          </div>

          <form
            onSubmit={addTrackingEvent}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="event-title"
                  className="mb-2 block text-sm font-medium"
                >
                  Event Title
                </label>

                <input
                  id="event-title"
                  name="title"
                  value={eventData.title}
                  onChange={handleEventChange}
                  placeholder="Shipment departed facility"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="event-location"
                  className="mb-2 block text-sm font-medium"
                >
                  Location
                </label>

                <input
                  id="event-location"
                  name="location"
                  value={eventData.location}
                  onChange={handleEventChange}
                  placeholder="Dallas Secure Facility"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="event-description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="event-description"
                name="description"
                value={
                  eventData.description
                }
                onChange={handleEventChange}
                rows={4}
                placeholder="Shipment has departed the secure facility and is currently in transit."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={addingEvent}
              className="rounded-xl border border-black/10 bg-white px-7 py-3.5 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addingEvent
                ? "Adding Event..."
                : "Add Tracking Event"}
            </button>
          </form>
        </section>

        {/* Tracking History */}
        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold">
              Tracking History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All events recorded for this shipment.
            </p>
          </div>

          {shipment.trackingEvents.length ===
          0 ? (
            <p className="text-sm text-gray-500">
              No tracking events yet.
            </p>
          ) : (
            <div className="space-y-6">
              {shipment.trackingEvents.map(
                (trackingEvent, index) => (
                  <div
                    key={trackingEvent.id}
                    className="relative flex gap-5"
                  >
                    <div className="relative flex w-4 shrink-0 justify-center">
                      {index !==
                        shipment.trackingEvents
                          .length -
                          1 && (
                        <div className="absolute top-3 h-[calc(100%+1.5rem)] w-px bg-gray-200" />
                      )}

                      <div className="relative z-10 mt-1 h-3 w-3 rounded-full bg-[#9a7626]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                          <h3 className="font-semibold">
                            {trackingEvent.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {trackingEvent.location}
                          </p>
                        </div>

                        <span className="text-xs text-gray-400">
                          {formatDateTime(
                            trackingEvent.timestamp,
                          )}
                        </span>
                      </div>

                      {trackingEvent.description && (
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                          {
                            trackingEvent.description
                          }
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        <div className="py-10 text-center">
          <p className="text-xs text-gray-400">
            Shipment created{" "}
            {formatDate(shipment.createdAt)}
          </p>
        </div>
      </section>
    </main>
  );
}