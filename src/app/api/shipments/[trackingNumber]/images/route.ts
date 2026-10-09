
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ trackingNumber: string }>;
};

const MAX_IMAGES = 10;
const MAX_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function isAdmin() {
  const cookieStore = await cookies();

  return (
    cookieStore.get("vanguard_admin")?.value ===
    "authenticated"
  );
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      message,
    },
    { status }
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function isValidImage(
  bytes: Uint8Array,
  mimeType: string
): boolean {
  if (bytes.length < 12) {
    return false;
  }

  const jpeg =
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;

  const pngSignature = [
    137, 80, 78, 71, 13, 10, 26, 10,
  ];

  const png = pngSignature.every(
    (value, index) => bytes[index] === value
  );

  const riff =
    bytes[0] === 82 &&
    bytes[1] === 73 &&
    bytes[2] === 70 &&
    bytes[3] === 70;

  const webp =
    riff &&
    bytes[8] === 87 &&
    bytes[9] === 69 &&
    bytes[10] === 66 &&
    bytes[11] === 80;

  if (mimeType === "image/jpeg") return jpeg;
  if (mimeType === "image/png") return png;
  if (mimeType === "image/webp") return webp;

  return false;
}

export async function GET(
  request: Request,
  { params }: Context
) {
  try {
    const { trackingNumber } = await params;

    const admin =
      new URL(request.url).searchParams.get("admin") ===
      "true";

    if (admin && !(await isAdmin())) {
      return jsonError("Unauthorized", 401);
    }

    const shipment = await prisma.shipment.findFirst({
      where: {
        trackingNumber,
        ...(admin ? {} : { isActive: true }),
      },
      select: {
        destinationImages: {
          select: {
            id: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!shipment) {
      return jsonError("Shipment not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        images: shipment.destinationImages,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("LIST IMAGES ERROR:", error);

    return jsonError(
      "Unable to load destination images. Check the server terminal.",
      500
    );
  }
}

export async function POST(
  request: Request,
  { params }: Context
) {
  try {
    console.log("DESTINATION IMAGE UPLOAD STARTED");

    if (!(await isAdmin())) {
      console.error(
        "IMAGE UPLOAD REJECTED: Admin authentication failed"
      );

      return jsonError(
        "Unauthorized. Please log in to the admin dashboard again.",
        401
      );
    }

    const { trackingNumber } = await params;

    console.log(
      "Uploading image for shipment:",
      trackingNumber
    );

    const shipment = await prisma.shipment.findUnique({
      where: {
        trackingNumber,
      },
      select: {
        id: true,
        trackingNumber: true,
      },
    });

    if (!shipment) {
      return jsonError(
        "Shipment not found. Check the tracking number.",
        404
      );
    }

    const count = await prisma.destinationImage.count({
      where: {
        shipmentId: shipment.id,
      },
    });

    if (count >= MAX_IMAGES) {
      return jsonError(
        "This shipment already has 10 destination images.",
        400
      );
    }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch (error) {
      console.error("FORM DATA ERROR:", error);

      return jsonError(
        "Unable to read the uploaded file.",
        400
      );
    }

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return jsonError(
        "No image was received. Please select a file.",
        400
      );
    }

    console.log("IMAGE FILE RECEIVED:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonError(
        "Unsupported image type. Use JPG, PNG, or WebP.",
        400
      );
    }

    if (file.size === 0) {
      return jsonError(
        "The selected image is empty.",
        400
      );
    }

    if (file.size > MAX_SIZE) {
      return jsonError(
        "The image is too large. Maximum size is 2 MB.",
        400
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (!isValidImage(bytes, file.type)) {
      return jsonError(
        "Invalid or corrupted image file.",
        400
      );
    }

    console.log("SAVING DESTINATION IMAGE TO DATABASE");

    const image = await prisma.destinationImage.create({
      data: {
        shipmentId: shipment.id,
        imageData: bytes,
        mimeType: file.type,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    console.log(
      "DESTINATION IMAGE SAVED SUCCESSFULLY:",
      image.id
    );

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully.",
        image,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "DESTINATION IMAGE UPLOAD FAILED:",
      error
    );

    const errorMessage = getErrorMessage(error);

    // Prisma reports P2021 when a required table is missing.
    if (errorMessage.includes("P2021")) {
      return jsonError(
        "The destination image database table does not exist. Apply the database migration.",
        500
      );
    }

    // Prisma reports P2022 when a required column is missing.
    if (errorMessage.includes("P2022")) {
      return jsonError(
        "The destination image database columns are missing. Check the database schema.",
        500
      );
    }

    return jsonError(
      "Unable to save the image. Check the server terminal for the database error.",
      500
    );
  }
}
