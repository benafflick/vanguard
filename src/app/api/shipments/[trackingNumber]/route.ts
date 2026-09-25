import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    trackingNumber: string;
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
/* GET — SHIPMENT */
/* PUBLIC: ACTIVE ONLY */
/* ADMIN: ACTIVE + INACTIVE */
/* ================================= */

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { trackingNumber } = await params;

    const decodedTrackingNumber =
      decodeURIComponent(trackingNumber);

    const url = new URL(request.url);

    const adminRequest =
      url.searchParams.get("admin") === "true";

    /*
     * ADMIN REQUEST
     *
     * Admin can retrieve both active and inactive
     * shipments, but only when authenticated.
     */
    if (adminRequest) {
      const authenticated =
        await isAdminAuthenticated();

      if (!authenticated) {
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized.",
          },
          { status: 401 },
        );
      }

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
    }

    /*
     * PUBLIC REQUEST
     *
     * Customers can only retrieve shipments
     * that are currently active.
     */
    const shipment =
      await prisma.shipment.findFirst({
        where: {
          trackingNumber:
            decodedTrackingNumber,

          isActive: true,
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
          message:
            "We couldn't find a shipment with that tracking number.",
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

/* ================================= */
/* PATCH — UPDATE SHIPMENT */
/* ADMIN ONLY */
/* ================================= */

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const { trackingNumber } = await params;

    const decodedTrackingNumber =
      decodeURIComponent(trackingNumber);

    const body = await request.json();

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

    /*
     * ACTIVATE / DEACTIVATE
     *
     * Keep this before normal shipment validation.
     */
    if (
      typeof body.isActive === "boolean"
    ) {
      const shipment =
        await prisma.shipment.update({
          where: {
            trackingNumber:
              decodedTrackingNumber,
          },

          data: {
            isActive: body.isActive,
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

        message: body.isActive
          ? "Shipment reactivated successfully."
          : "Shipment deactivated successfully.",

        shipment,
      });
    }

    /*
     * NORMAL SHIPMENT UPDATE
     */

    const newTrackingNumber = String(
      body.trackingNumber ?? "",
    ).trim();

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

    /*
     * TRACKING NUMBER VALIDATION
     */
    if (!newTrackingNumber) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tracking number is required.",
        },
        { status: 400 },
      );
    }

    /*
     * If the tracking number changed,
     * make sure another shipment is not
     * already using the new number.
     */
    if (
      newTrackingNumber !==
      existingShipment.trackingNumber
    ) {
      const duplicateShipment =
        await prisma.shipment.findUnique({
          where: {
            trackingNumber:
              newTrackingNumber,
          },
        });

      if (duplicateShipment) {
        return NextResponse.json(
          {
            success: false,
            message:
              "That tracking number is already in use.",
          },
          { status: 409 },
        );
      }
    }

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required.",
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

    const deliveryDate =
      new Date(estimatedDelivery);

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

    const shipment =
      await prisma.shipment.update({
        where: {
          id: existingShipment.id,
        },

        data: {
          trackingNumber:
            newTrackingNumber,
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

/* ================================= */
/* POST — ADD TRACKING EVENT */
/* ADMIN ONLY */
/* ================================= */

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

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
        ? String(
            body.description,
          ).trim()
        : null;

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

    await prisma.trackingEvent.create({
      data: {
        shipmentId: shipment.id,
        title,
        location,
        description,
      },
    });

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

/* ================================= */
/* DELETE — SHIPMENT */
/* ADMIN ONLY */
/* ================================= */

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const { trackingNumber } = await params;

    const decodedTrackingNumber =
      decodeURIComponent(trackingNumber);

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

    await prisma.shipment.delete({
      where: {
        trackingNumber:
          decodedTrackingNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Shipment permanently deleted.",
    });
  } catch (error) {
    console.error(
      "DELETE SHIPMENT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete shipment.",
      },
      { status: 500 },
    );
  }
}