
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ trackingNumber: string }>;
};

const MAX_IMAGES = 10;
const MAX_SIZE = 2 * 1024 * 1024;

async function isAdmin() {
  const store = await cookies();
  return store.get("vanguard_admin")?.value === "authenticated";
}

export async function GET(request: Request, { params }: Context) {
  try {
    const { trackingNumber } = await params;
    const admin = new URL(request.url).searchParams.get("admin") === "true";

    if (admin && !(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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
      return NextResponse.json(
        { success: false, error: "Shipment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      images: shipment.destinationImages,
    });
  } catch (error) {
    console.error("LIST IMAGES ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Unable to load images" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { trackingNumber } = await params;

    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber },
      select: { id: true },
    });

    if (!shipment) {
      return NextResponse.json(
        { success: false, error: "Shipment not found" },
        { status: 404 }
      );
    }

    const count = await prisma.destinationImage.count({
      where: { shipmentId: shipment.id },
    });

    if (count >= MAX_IMAGES) {
      return NextResponse.json(
        { success: false, error: "Maximum 10 images per shipment" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Please select an image" },
        { status: 400 }
      );
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image must be 2 MB or smaller" },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    const jpeg =
      bytes[0] === 255 &&
      bytes[1] === 216 &&
      bytes[2] === 255;

    const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
      (value, index) => bytes[index] === value
    );

    const webp =
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";

    const valid =
      (file.type === "image/jpeg" && jpeg) ||
      (file.type === "image/png" && png) ||
      (file.type === "image/webp" && webp);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid image file" },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        image,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("UPLOAD IMAGE ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Unable to upload image" },
      { status: 500 }
    );
  }
}
