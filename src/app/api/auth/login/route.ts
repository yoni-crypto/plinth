import { NextRequest, NextResponse } from "next/server";
import { login, type AuthUser } from "@/modules/auth/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Email and password are required" },
        },
        { status: 400 }
      );
    }

    const user = await login({ email, password });

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message },
      },
      { status: 401 }
    );
  }
}
