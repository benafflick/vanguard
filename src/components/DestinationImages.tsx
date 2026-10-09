
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ImageRecord = {
  id: string;
  createdAt: string;
};

type Props = {
  trackingNumber: string;
  destination: string;
  admin?: boolean;
};

export default function DestinationImages({
  trackingNumber,
  destination,
  admin = false,
}: Props) {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const base = `/api/shipments/${encodeURIComponent(trackingNumber)}/images`;

  const load = useCallback(async () => {
    try {
      const response = await fetch(
        `${base}${admin ? "?admin=true" : ""}`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to load photos");
      }

      setImages(data.images || []);
    } catch (error) {
      setImages([]);
      if (admin) {
        setMessage(
          error instanceof Error ? error.message : "Unable to load photos"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [base, admin]);

  useEffect(() => {
    setLoading(true);
    setImages([]);
    setMessage("");
    void load();
  }, [load]);

  async function upload(files: FileList | null) {
    if (!files?.length || busy) return;

    setMessage("");

    if (images.length + files.length > 10) {
      setMessage("A shipment can have a maximum of 10 photos.");
      return;
    }

    setBusy(true);

    try {
      for (const file of Array.from(files)) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size === 0 ||
          file.size > 2 * 1024 * 1024
        ) {
          throw new Error(
            `${file.name}: use JPG, PNG or WebP, maximum 2 MB each.`
          );
        }

        const form = new FormData();
        form.append("image", file);

        const response = await fetch(base, {
          method: "POST",
          body: form,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || `Upload failed: ${file.name}`);
        }
      }

      setMessage("Destination photos uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
      await load();
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (
      busy ||
      !window.confirm("Delete this destination photo permanently?")
    ) {
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const response = await fetch(
        `${base}/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Delete failed");
      }

      setMessage("Photo deleted.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!admin && (loading || images.length === 0)) {
    return null;
  }

  function imageUrl(id: string) {
    return `${base}/${encodeURIComponent(id)}${
      admin ? "?admin=true" : ""
    }`;
  }

  return (
    <section className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7626]">
            Destination photographs
          </p>

          <h3 className="mt-2 text-xl font-semibold text-[#111]">
            {destination}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {admin
              ? `Upload destination location photos (${images.length}/10). JPG, PNG or WebP; 2 MB each.`
              : "Photos of the shipment destination location."}
          </p>
        </div>

        {admin && (
          <label
            className={`inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#111] px-5 py-3 text-sm font-medium text-white ${
              busy || images.length >= 10
                ? "opacity-50"
                : "hover:bg-[#292929]"
            }`}
          >
            {busy ? "Working..." : "Upload photos"}

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              disabled={busy || images.length >= 10}
              onChange={(event) => void upload(event.target.files)}
            />
          </label>
        )}
      </div>

      {message && admin && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-[#f7f7f5] px-4 py-3 text-sm text-[#76581c]"
        >
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">
          Loading photographs...
        </p>
      ) : images.length === 0 ? (
        admin ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">
              No destination photographs uploaded yet.
            </p>
          </div>
        ) : null
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
            >
              <button
                type="button"
                onClick={() => setSelected(image.id)}
                className="block w-full cursor-zoom-in"
                aria-label={`View destination photograph ${index + 1}`}
              >
                <img
                  src={imageUrl(image.id)}
                  alt={`Destination ${destination}, photograph ${index + 1}`}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
              </button>

              {admin && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-gray-500">
                    Photo {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => void remove(image.id)}
                    disabled={busy}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Destination photograph preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
          >
            Close
          </button>

          <img
            src={imageUrl(selected)}
            alt={`Destination location: ${destination}`}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
