import { NextRequest, NextResponse } from "next/server";
import { register } from "@/modules/auth/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Email and password are required" },
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Password must be at least 8 characters" },
        },
        { status: 400 }
      );
    }

    const user = await register({ email, password, name });

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json(
      {
        success: false,
        error: { code: status === 409 ? "CONFLICT" : "BAD_REQUEST", message },
      },
      { status }
    );
  }
}
