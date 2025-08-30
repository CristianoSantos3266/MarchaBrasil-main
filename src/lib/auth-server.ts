import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Returns the authenticated user (or null) for server components/route handlers. */
export async function getCurrentUser(): Promise<{ email?: string } | null> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
