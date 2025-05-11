import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/analytics", "/account"];
const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password"];
export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const user = await supabase.auth.getUser();
    // protected routes and not logged in
    if (
      PROTECTED_PATHS.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      ) &&
      user.error
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // public routes and logged in
    if (PUBLIC_PATHS.includes(request.nextUrl.pathname) && !user.error) {
      return NextResponse.redirect(new URL("/analytics", request.url));
    }
    return response;
  } catch (e) {
    console.error(`Supabase middleware error`, e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
