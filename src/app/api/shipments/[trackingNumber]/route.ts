import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    trackingNumber: string;
  }>;
};

/* -------------------------------- */
/* GET — Get One Shipment */
/* -------------------------------- */

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { trackingNumber } = await params;

    const decodedTrackingNumber =
      decodeURIComponent(trackingNumber);

    const shipment =
      await prisma.shipment.findUnique({
        where: {
          trackingNumber:
            decodedTrackingNumber,
        },
        include: {
          trackingEvents: {
            orderBy: {
              timestamp: "desc",
            },
          },
        },
      });

    if (!shipment) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipment not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      shipment,
    });
  } catch (error) {
    console.error(
      "GET SHIPMENT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to retrieve shipment.",
      },
      { status: 500 },
    );
  }
}

/* -------------------------------- */
/* PATCH — Update Shipment */
/* -------------------------------- */

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { trackingNumber } = await params;

    const decodedTrackingNumber =
      decodeURIComponent(trackingNumber);

    const body = await request.json();

    const status = String(
      body.status ?? "",
    ).trim();

    const currentLocation = String(
      body.currentLocation ?? "",
    ).trim();

    const progress = Number(
      body.progress,
    );

    const estimatedDelivery = String(
      body.estimatedDelivery ?? "",
    ).trim();

    /* ------------------------------ */
    /* Validation */
    /* ------------------------------ */

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status is required.",
        },
        { status: 400 },
      );
    }

    if (!currentLocation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Current location is required.",
        },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Progress must be between 0 and 100.",
        },
        { status: 400 },
      );
    }

    if (!estimatedDelivery) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Estimated delivery is required.",
        },
        { status: 400 },
      );
    }

    const deliveryDate = new Date(
      estimatedDelivery,
    );

    if (
      Number.isNaN(
        deliveryDate.getTime(),
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid estimated delivery date.",
        },
        { status: 400 },
      );
    }

    /* ------------------------------ */
    /* Find Shipment */
    /* ------------------------------ */

    const existingShipment =
      await prisma.shipment.findUnique({
        where: {
          trackingNumber:
            decodedTrackingNumber,
        },
      });

    if (!existingShipment) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipment not found.",
        },
        { status: 404 },
      );
    }

    /* ------------------------------ */
    /* Update Shipment */
    /* ------------------------------ */

    const shipment =
      await prisma.shipment.update({
        where: {
          trackingNumber:
            decodedTrackingNumber,
        },

        data: {
          status,
          currentLocation,
          progress,
          estimatedDelivery:
            deliveryDate,
        },

        include: {
          trackingEvents: {
            orderBy: {
              timestamp: "desc",
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Shipment updated successfully.",
      shipment,
    });
  } catch (error) {
    console.error(
      "UPDATE SHIPMENT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update shipment.",
      },
      { status: 500 },
    );
  }
}

/* -------------------------------- */
/* POST — Add Tracking Event */
/* -------------------------------- */

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { trackingNumber } = await params;

    const decodedTrackingNumber =
      decodeURIComponent(trackingNumber);

    const body = await request.json();

    const title = String(
      body.title ?? "",
    ).trim();

    const location = String(
      body.location ?? "",
    ).trim();

    const description =
      body.description !== undefined &&
      body.description !== null &&
      String(body.description).trim()
        ? String(body.description).trim()
        : null;

    /* ------------------------------ */
    /* Validation */
    /* ------------------------------ */

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Event title is required.",
        },
        { status: 400 },
      );
    }

    if (!location) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Event location is required.",
        },
        { status: 400 },
      );
    }

    /* ------------------------------ */
    /* Find Shipment */
    /* ------------------------------ */

    const shipment =
      await prisma.shipment.findUnique({
        where: {
          trackingNumber:
            decodedTrackingNumber,
        },
      });

    if (!shipment) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipment not found.",
        },
        { status: 404 },
      );
    }

    /* ------------------------------ */
    /* Create Tracking Event */
    /* ------------------------------ */

    await prisma.trackingEvent.create({
      data: {
        shipmentId: shipment.id,
        title,
        location,
        description,
      },
    });

    /* ------------------------------ */
    /* Return Updated Shipment */
    /* ------------------------------ */

    const updatedShipment =
      await prisma.shipment.findUnique({
        where: {
          id: shipment.id,
        },

        include: {
          trackingEvents: {
            orderBy: {
              timestamp: "desc",
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Tracking event added successfully.",
      shipment: updatedShipment,
    });
  } catch (error) {
    console.error(
      "ADD TRACKING EVENT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to add tracking event.",
      },
      { status: 500 },
    );
  }
}