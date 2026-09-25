"use client";

import {
  useEffect,
  useState,
} from "react";

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
  isActive: boolean;
  createdAt: string;
  trackingEvents: TrackingEvent[];
};

export default function ShipmentManagementPage({
  params,
}: {
  params: Promise<{
    trackingNumber: string;
  }>;
}) {
  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState("");

  const [shipment, setShipment] =
    useState<Shipment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    addingEvent,
    setAddingEvent,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [
    messageType,
    setMessageType,
  ] = useState<
    "success" | "error" | ""
  >("");

  const [formData, setFormData] =
    useState({
      trackingNumber: "",
      status: "",
      currentLocation: "",
      progress: "0",
      estimatedDelivery: "",
    });

  const [eventData, setEventData] =
    useState({
      title: "",
      location: "",
      description: "",
    });

  /* ================================= */
  /* LOAD ADMIN SHIPMENT */
  /* ================================= */

  useEffect(() => {
    async function loadShipment() {
      try {
        setLoading(true);
        setMessage("");
        setMessageType("");

        const resolvedParams =
          await params;

        const number =
          decodeURIComponent(
            resolvedParams.trackingNumber,
          );

        setTrackingNumber(number);

        const response = await fetch(
          `/api/shipments/${encodeURIComponent(
            number,
          )}?admin=true`,
          {
            cache: "no-store",
          },
        );

        const text =
          await response.text();

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
              "The server returned an invalid response.",
            );
          }
        }

        if (
          !response.ok ||
          !data.success ||
          !data.shipment
        ) {
          throw new Error(
            data.message ||
              "Shipment not found.",
          );
        }

        const loadedShipment =
          data.shipment;

        setShipment(
          loadedShipment,
        );

        setFormData({
          trackingNumber:
            loadedShipment.trackingNumber,

          status:
            loadedShipment.status,

          currentLocation:
            loadedShipment.currentLocation,

          progress: String(
            loadedShipment.progress,
          ),

          estimatedDelivery:
            formatForDateTimeLocal(
              loadedShipment.estimatedDelivery,
            ),
        });
      } catch (error) {
        console.error(
          "LOAD SHIPMENT ERROR:",
          error,
        );

        setShipment(null);

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

  /* ================================= */
  /* DATE HELPERS */
  /* ================================= */

  function formatForDateTimeLocal(
    date: string,
  ) {
    const value = new Date(date);

    const year =
      value.getFullYear();

    const month = String(
      value.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      value.getDate(),
    ).padStart(2, "0");

    const hours = String(
      value.getHours(),
    ).padStart(2, "0");

    const minutes = String(
      value.getMinutes(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function formatDate(
    date: string,
  ) {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
    ).format(new Date(date));
  }

  function formatDateTime(
    date: string,
  ) {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      },
    ).format(new Date(date));
  }

  /* ================================= */
  /* FORM HANDLERS */
  /* ================================= */

  function handleShipmentChange(
    event: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
    >,
  ) {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEventChange(
    event: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
    >,
  ) {
    const { name, value } =
      event.target;

    setEventData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /* ================================= */
  /* SAVE SHIPMENT */
  /* ================================= */

  async function saveShipment(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const newTrackingNumber =
      formData.trackingNumber.trim();

    if (!newTrackingNumber) {
      setMessage(
        "Please enter a tracking number.",
      );
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      /*
       * The request URL uses the CURRENT tracking
       * number because that identifies the existing
       * shipment.
       *
       * The body contains the NEW tracking number.
       */
      const response = await fetch(
        `/api/shipments/${encodeURIComponent(
          trackingNumber,
        )}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            trackingNumber:
              newTrackingNumber,

            status:
              formData.status,

            currentLocation:
              formData.currentLocation,

            progress: Number(
              formData.progress,
            ),

            estimatedDelivery:
              formData.estimatedDelivery,
          }),
        },
      );

      const text =
        await response.text();

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
            "The server returned an invalid response.",
          );
        }
      }

      if (
        !response.ok ||
        !data.success ||
        !data.shipment
      ) {
        throw new Error(
          data.message ||
            "Unable to update shipment.",
        );
      }

      const updatedShipment =
        data.shipment;

      const trackingNumberChanged =
        updatedShipment.trackingNumber !==
        trackingNumber;

      setShipment(
        updatedShipment,
      );

      setTrackingNumber(
        updatedShipment.trackingNumber,
      );

      setFormData((previous) => ({
        ...previous,
        trackingNumber:
          updatedShipment.trackingNumber,
      }));

      /*
       * If the tracking number changed,
       * the current admin URL contains the
       * OLD tracking number.
       *
       * Move the browser to the new URL so
       * refreshing the page continues to work.
       */
      if (trackingNumberChanged) {
        window.location.href =
          `/admin/shipments/${encodeURIComponent(
            updatedShipment.trackingNumber,
          )}`;

        return;
      }

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

  /* ================================= */
  /* ADD TRACKING EVENT */
  /* ================================= */

  async function addTrackingEvent(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !eventData.title.trim()
    ) {
      setMessage(
        "Please enter an event title.",
      );

      setMessageType("error");

      return;
    }

    if (
      !eventData.location.trim()
    ) {
      setMessage(
        "Please enter an event location.",
      );

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
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              eventData.title,

            location:
              eventData.location,

            description:
              eventData.description,
          }),
        },
      );

      const text =
        await response.text();

      const data = text
        ? JSON.parse(text)
        : {
            success: false,
            message:
              "The server returned an empty response.",
          };

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to add tracking event.",
        );
      }

      setShipment(
        data.shipment,
      );

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

  /* ================================= */
  /* LOADING */
  /* ================================= */

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

  /* ================================= */
  /* NOT FOUND */
  /* ================================= */

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

  /* ================================= */
  /* PAGE */
  /* ================================= */

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

          {shipment.isActive ? (
            <a
              href={`/track?tracking=${encodeURIComponent(
                shipment.trackingNumber,
              )}`}
              className="text-sm font-medium text-[#76581c] hover:underline"
            >
              Customer Tracking →
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-400">
              Customer Tracking Disabled
            </span>
          )}
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
                {
                  shipment.trackingNumber
                }
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {
                  shipment.shipmentType
                }
              </p>

              <div className="mt-3">
                {shipment.isActive ? (
                  <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    Inactive
                  </span>
                )}
              </div>
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
              messageType ===
              "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Inactive Warning */}

        {!shipment.isActive && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-semibold text-amber-800">
              Customer tracking is
              disabled
            </p>

            <p className="mt-1 text-sm text-amber-700">
              This shipment is inactive.
              Customers cannot retrieve it
              from the public tracking
              page. You can reactivate it
              from the Shipments page.
            </p>
          </div>
        )}

        {/* Shipment Overview */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Weight
            </p>

            <p className="mt-2 text-xl font-semibold">
              {Number(
                shipment.weight,
              ).toFixed(2)}{" "}
              kg
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
              {
                shipment.destination
              }
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

        {/* Additional Information */}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Current Location
            </p>

            <p className="mt-2 text-base font-semibold">
              {
                shipment.currentLocation
              }
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Estimated Delivery
            </p>

            <p className="mt-2 text-base font-semibold">
              {formatDate(
                shipment.estimatedDelivery,
              )}
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
              Update the tracking number,
              current status, location,
              delivery date and progress.
            </p>
          </div>

          <form
            onSubmit={saveShipment}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Tracking Number */}

            <div className="md:col-span-2">
              <label
                htmlFor="trackingNumber"
                className="mb-2 block text-sm font-medium"
              >
                Tracking Number
              </label>

              <input
                id="trackingNumber"
                name="trackingNumber"
                value={
                  formData.trackingNumber
                }
                onChange={
                  handleShipmentChange
                }
                required
                autoComplete="off"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none focus:border-[#9a7626] focus:bg-white"
              />

              <p className="mt-2 text-xs text-gray-400">
                Changing this will make
                the old tracking number
                stop working.
              </p>
            </div>

            {/* Status */}

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
                value={
                  formData.status
                }
                onChange={
                  handleShipmentChange
                }
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
                value={
                  formData.currentLocation
                }
                onChange={
                  handleShipmentChange
                }
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
              />
            </div>

            {/* Estimated Delivery */}

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
                onChange={
                  handleShipmentChange
                }
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
              />
            </div>

            {/* Progress */}

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
                  value={
                    formData.progress
                  }
                  onChange={
                    handleShipmentChange
                  }
                  className="w-full accent-[#9a7626]"
                />

                <span className="w-12 text-right text-sm font-medium">
                  {
                    formData.progress
                  }
                  %
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
              Add a new update to the
              customer's tracking
              timeline.
            </p>
          </div>

          <form
            onSubmit={
              addTrackingEvent
            }
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Event Title */}

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
                  value={
                    eventData.title
                  }
                  onChange={
                    handleEventChange
                  }
                  placeholder="Shipment departed facility"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
                />
              </div>

              {/* Event Location */}

              <div>
                <label
                  htmlFor="event-location"
                  className="mb-2 block text-sm font-medium"
                >
                  Event Location
                </label>

                <input
                  id="event-location"
                  name="location"
                  value={
                    eventData.location
                  }
                  onChange={
                    handleEventChange
                  }
                  placeholder="Dallas, TX"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
                />
              </div>
            </div>

            {/* Description */}

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
                onChange={
                  handleEventChange
                }
                rows={4}
                placeholder="Optional details about this tracking update."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#9a7626] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={
                addingEvent
              }
              className="rounded-xl bg-[#9a7626] px-7 py-3.5 text-sm font-medium text-white hover:bg-[#80601e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addingEvent
                ? "Adding Event..."
                : "Add Tracking Event"}
            </button>
          </form>
        </section>

        {/* Tracking History */}

        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Tracking History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Complete tracking timeline
              for this shipment.
            </p>
          </div>

          {shipment.trackingEvents
            .length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-5 py-8 text-center">
              <p className="text-sm text-gray-500">
                No tracking events have
                been added yet.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {shipment.trackingEvents.map(
                (
                  trackingEvent,
                  index,
                ) => (
                  <div
                    key={
                      trackingEvent.id
                    }
                    className="relative flex gap-5"
                  >
                    {/* Timeline */}

                    <div className="flex flex-col items-center">
                      <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#9a7626]" />

                      {index !==
                        shipment
                          .trackingEvents
                          .length -
                          1 && (
                        <div className="min-h-20 w-px flex-1 bg-gray-200" />
                      )}
                    </div>

                    {/* Event */}

                    <div
                      className={`flex-1 ${
                        index !==
                        shipment
                          .trackingEvents
                          .length -
                          1
                          ? "pb-8"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {
                              trackingEvent.title
                            }
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {
                              trackingEvent.location
                            }
                          </p>
                        </div>

                        <p className="text-xs text-gray-400">
                          {formatDateTime(
                            trackingEvent.timestamp,
                          )}
                        </p>
                      </div>

                      {trackingEvent.description && (
                        <p className="mt-3 text-sm leading-6 text-gray-600">
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
      </section>
    </main>
  );
}