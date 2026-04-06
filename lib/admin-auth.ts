import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Checks that the incoming request is from the configured admin user.
 * Uses the cookie-based Supabase session for identity, then validates
 * against CANSTACK_ADMIN_USER_ID env var.
 *
 * Returns { authorized: true, userId } on success.
 * Returns a NextResponse 401 on failure — return it directly from the route.
 */
export async function checkAdminAuth(): Promise<
  | { authorized: true; userId: string }
  | { authorized: false; response: NextResponse }
> {
  const adminUserId = process.env.CANSTACK_ADMIN_USER_ID;

  if (!adminUserId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Admin not configured." },
        { status: 401 }
      ),
    };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== adminUserId) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Unauthorized." },
          { status: 401 }
        ),
      };
    }

    return { authorized: true, userId: user.id };
  } catch {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Auth check failed." },
        { status: 401 }
      ),
    };
  }
}
