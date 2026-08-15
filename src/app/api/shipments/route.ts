import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* -------------------------------- */
/* GET — Get All Shipments */
/* -------------------------------- */

export async function GET() {
  try {
    const shipments = await prisma.shipment.findMany({
      orderBy: {
        createdAt: "desc",
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
      shipments,
    });
  } catch (error) {
    console.error(
      "GET SHIPMENTS ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to retrieve shipments.",
      },
      { status: 500 },
    );
  }
}

/* -------------------------------- */
/* POST — Create Shipment */
/* -------------------------------- */

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const trackingNumber = String(
      body.trackingNumber ?? "",
    ).trim();

    const shipmentType = String(
      body.shipmentType ?? "",
    ).trim();

    const weight = Number(body.weight);

    const status = String(
      body.status ?? "In Transit",
    ).trim();

    const origin = String(
      body.origin ?? "",
    ).trim();

    const destination = String(
      body.destination ?? "",
    ).trim();

    const currentLocation = String(
      body.currentLocation ?? "",
    ).trim();

    const estimatedDelivery = String(
      body.estimatedDelivery ?? "",
    ).trim();

    const progress = Number(
      body.progress ?? 0,
    );

    const eventTitle = String(
      body.eventTitle ?? "",
    ).trim();

    const eventLocation = String(
      body.eventLocation ?? "",
    ).trim();

    const eventDescription =
      body.eventDescription
        ? String(
            body.eventDescription,
          ).trim()
        : null;

    /* ------------------------------ */
    /* Validation */
    /* ------------------------------ */

    if (!trackingNumber) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tracking number is required.",
        },
        { status: 400 },
      );
    }

    if (!shipmentType) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Shipment type is required.",
        },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Weight must be greater than zero.",
        },
        { status: 400 },
      );
    }

    if (!origin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Origin is required.",
        },
        { status: 400 },
      );
    }

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Destination is required.",
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

    if (
      !Number.isFinite(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Shipment progress must be between 0 and 100.",
        },
        { status: 400 },
      );
    }

    if (!eventTitle) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Initial tracking event title is required.",
        },
        { status: 400 },
      );
    }

    if (!eventLocation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Initial tracking event location is required.",
        },
        { status: 400 },
      );
    }

    /* ------------------------------ */
    /* Validate Delivery Date */
    /* ------------------------------ */

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
            "Please enter a valid estimated delivery date.",
        },
        { status: 400 },
      );
    }

    /* ------------------------------ */
    /* Check Duplicate Tracking Number */
    /* ------------------------------ */

    const existingShipment =
      await prisma.shipment.findUnique({
        where: {
          trackingNumber,
        },
      });

    if (existingShipment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A shipment with this tracking number already exists.",
        },
        { status: 409 },
      );
    }

    /* ------------------------------ */
    /* Create Shipment */
    /* ------------------------------ */

    const shipment =
      await prisma.shipment.create({
        data: {
          trackingNumber,
          shipmentType,
          weight,
          status,
          origin,
          destination,
          currentLocation,
          estimatedDelivery:
            deliveryDate,
          progress,

          trackingEvents: {
            create: {
              title: eventTitle,
              location: eventLocation,
              description:
                eventDescription,
            },
          },
        },

        include: {
          trackingEvents: {
            orderBy: {
              timestamp: "desc",
            },
          },
        },
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Shipment created successfully.",
        shipment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "CREATE SHIPMENT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "An unexpected error occurred while creating the shipment.",
      },
      { status: 500 },
    );
  }
}