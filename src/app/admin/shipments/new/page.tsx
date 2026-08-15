"use client";

import { FormEvent, useState } from "react";

export default function NewShipmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">(
    "",
  );

  const [formData, setFormData] = useState({
    trackingNumber: "",
    shipmentType: "Secure Gold Cargo",
    weight: "",
    status: "In Transit",
    origin: "",
    destination: "",
    currentLocation: "",
    estimatedDelivery: "",
    progress: "0",
    eventTitle: "Shipment Created",
    eventLocation: "",
    eventDescription: "",
  });

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingNumber: formData.trackingNumber,
          shipmentType: formData.shipmentType,
          weight: Number(formData.weight),
          status: formData.status,
          origin: formData.origin,
          destination: formData.destination,
          currentLocation: formData.currentLocation,
          estimatedDelivery: formData.estimatedDelivery,
          progress: Number(formData.progress),
          eventTitle: formData.eventTitle,
          eventLocation: formData.eventLocation,
          eventDescription: formData.eventDescription,
        }),
      });

      const responseText = await response.text();

      let result: {
        success?: boolean;
        message?: string;
      } = {};

      try {
        result = responseText
          ? JSON.parse(responseText)
          : {
              success: false,
              message: "The server returned an empty response.",
            };
      } catch {
        result = {
          success: false,
          message: "The server returned an invalid response.",
        };
      }

      if (!response.ok) {
        setMessage(
          result.message || "Unable to create shipment.",
        );
        setMessageType("error");
        return;
      }

      setMessage(
        result.message || "Shipment created successfully.",
      );
      setMessageType("success");

      setFormData({
        trackingNumber: "",
        shipmentType: "Secure Gold Cargo",
        weight: "",
        status: "In Transit",
        origin: "",
        destination: "",
        currentLocation: "",
        estimatedDelivery: "",
        progress: "0",
        eventTitle: "Shipment Created",
        eventLocation: "",
        eventDescription: "",
      });
    } catch (error) {
      console.error("CREATE SHIPMENT ERROR:", error);

      setMessage(
        "Unable to connect to the server. Please try again.",
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-10 text-[#111]">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#8a6a20]">
            Vanguard Haulers Cargo
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create New Shipment
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Create a shipment record and generate the initial tracking
            event for the customer.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-8 rounded-xl border px-5 py-4 text-sm ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Shipment Information */}
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Shipment Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic information about the shipment.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Tracking Number */}
              <div>
                <label
                  htmlFor="trackingNumber"
                  className="mb-2 block text-sm font-medium"
                >
                  Tracking Number
                </label>

                <input
                  id="trackingNumber"
                  name="trackingNumber"
                  type="text"
                  value={formData.trackingNumber}
                  onChange={handleChange}
                  placeholder="VH-8492-0183"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              {/* Shipment Type */}
              <div>
                <label
                  htmlFor="shipmentType"
                  className="mb-2 block text-sm font-medium"
                >
                  Shipment Type
                </label>

                <select
                  id="shipmentType"
                  name="shipmentType"
                  value={formData.shipmentType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                >
                  <option value="Secure Gold Cargo">
                    Secure Gold Cargo
                  </option>
                  <option value="Gold Bullion">
                    Gold Bullion
                  </option>
                  <option value="Precious Metals">
                    Precious Metals
                  </option>
                  <option value="High Value Cargo">
                    High Value Cargo
                  </option>
                  <option value="Other Secure Cargo">
                    Other Secure Cargo
                  </option>
                </select>
              </div>

              {/* Weight */}
              <div>
                <label
                  htmlFor="weight"
                  className="mb-2 block text-sm font-medium"
                >
                  Package Weight
                </label>

                <div className="relative">
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="42.50"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    kg
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium"
                >
                  Shipment Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                >
                  <option value="Processing">Processing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="At Facility">At Facility</option>
                  <option value="Out for Delivery">
                    Out for Delivery
                  </option>
                  <option value="Delivered">Delivered</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>
          </section>

          {/* Route Information */}
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Route & Delivery
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Define where the shipment is coming from and where it
                is going.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Origin */}
              <div>
                <label
                  htmlFor="origin"
                  className="mb-2 block text-sm font-medium"
                >
                  Origin
                </label>

                <input
                  id="origin"
                  name="origin"
                  type="text"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="New York, NY"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              {/* Destination */}
              <div>
                <label
                  htmlFor="destination"
                  className="mb-2 block text-sm font-medium"
                >
                  Destination
                </label>

                <input
                  id="destination"
                  name="destination"
                  type="text"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Los Angeles, CA"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              {/* Current Location */}
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
                  type="text"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  placeholder="New York Secure Facility"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              {/* Delivery Date */}
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
                  value={formData.estimatedDelivery}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              {/* Progress */}
              <div className="md:col-span-2">
                <label
                  htmlFor="progress"
                  className="mb-2 block text-sm font-medium"
                >
                  Delivery Progress
                </label>

                <div className="flex items-center gap-4">
                  <input
                    id="progress"
                    name="progress"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleChange}
                    className="w-full accent-[#9a7626]"
                  />

                  <div className="w-16 rounded-lg bg-gray-100 px-3 py-2 text-center text-sm font-medium">
                    {formData.progress}%
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Initial Tracking Event */}
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Initial Tracking Event
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                This event will appear on the customer's tracking
                timeline.
              </p>
            </div>

            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label
                  htmlFor="eventTitle"
                  className="mb-2 block text-sm font-medium"
                >
                  Event Title
                </label>

                <input
                  id="eventTitle"
                  name="eventTitle"
                  type="text"
                  value={formData.eventTitle}
                  onChange={handleChange}
                  placeholder="Shipment Created"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              {/* Event Location */}
              <div>
                <label
                  htmlFor="eventLocation"
                  className="mb-2 block text-sm font-medium"
                >
                  Event Location
                </label>

                <input
                  id="eventLocation"
                  name="eventLocation"
                  type="text"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  placeholder="New York Secure Facility"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              {/* Event Description */}
              <div>
                <label
                  htmlFor="eventDescription"
                  className="mb-2 block text-sm font-medium"
                >
                  Event Description
                </label>

                <textarea
                  id="eventDescription"
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Shipment has been received and is being prepared for secure transit."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#9a7626] focus:bg-white"
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-500">
              The shipment will be saved securely and made available
              through its tracking number.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#111] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Creating Shipment..."
                : "Create Shipment"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}