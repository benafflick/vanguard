
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    trackingNumber: string;
    imageId: string;
  }>;
};

async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  return (
    cookieStore.get("vanguard_admin")?.value ===
    "authenticated"
  );
}

/* ================================= */
/* GET — SERVE DESTINATION IMAGE */
/* ================================= */

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { trackingNumber, imageId } =
      await params;

    const decodedTrackingNumber =
      decodeURIComponent(trackingNumber);

    const adminRequest =
      new URL(request.url).searchParams.get(
        "admin",
      ) === "true";

    if (
      adminRequest &&
      !(await isAdminAuthenticated())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const image =
      await prisma.destinationImage.findFirst({
        where: {
          id: imageId,

          shipment: {
            trackingNumber:
              decodedTrackingNumber,

            ...(adminRequest
              ? {}
              : { isActive: true }),
          },
        },

        select: {
          imageData: true,
          mimeType: true,
        },
      });

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found.",
        },
        { status: 404 },
      );
    }

    return new NextResponse(
      new Uint8Array(image.imageData),
      {
        status: 200,

        headers: {
          "Content-Type": image.mimeType,
          "Cache-Control":
            "private, no-store, max-age=0",
          "X-Content-Type-Options":
            "nosniff",
        },
      },
    );
  } catch (error) {
    console.error(
      "GET DESTINATION IMAGE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to retrieve destination image.",
      },
      { status: 500 },
    );
  }
}

/* ================================= */
/* DELETE — REMOVE DESTINATION IMAGE */
/* ADMIN ONLY */
/* ================================= */

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const { trackingNumber, imageId } =
      await params;

    const decodedTrackingNumber =
      decodeURIComponent(trackingNumber);

    const image =
      await prisma.destinationImage.findFirst({
        where: {
          id: imageId,

          shipment: {
            trackingNumber:
              decodedTrackingNumber,
          },
        },

        select: {
          id: true,
        },
      });

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found.",
        },
        { status: 404 },
      );
    }

    await prisma.destinationImage.delete({
      where: {
        id: image.id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Destination image deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE DESTINATION IMAGE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete destination image.",
      },
      { status: 500 },
    );
  }
}
