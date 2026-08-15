import { NextResponse } from "next/server";

const ADMIN_USERNAME =
  process.env.ADMIN_USERNAME || "";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = String(
      body.username ?? "",
    ).trim();

    const password = String(
      body.password ?? "",
    );

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error(
        "ADMIN_USERNAME or ADMIN_PASSWORD is not configured.",
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Admin login is not configured on the server.",
        },
        { status: 500 },
      );
    }

    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid username or password.",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set(
      "vanguard_admin",
      "authenticated",
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      },
    );

    return response;
  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process login request.",
      },
      { status: 500 },
    );
  }
}