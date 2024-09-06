import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const allowedPaths = [
  '/',              // Exact match for home page
  '/login',         // Exact match for login page
  '/signup',        // Exact match for signup page
  '/api/**',        // Wildcard for all API routes
  '/public/**',     // Wildcard for all public assets
  '/auth/**',       // Wildcard for auth-related pages (like OAuth callbacks)
  '/error',
  '/404'
]

// Function to check if a path matches any of the allowed paths
function isAllowedPath(path: string): boolean {
  return allowedPaths.some(allowedPath => {
    if (allowedPath.endsWith('/**')) {
      // For wildcard paths, check if the current path starts with the allowed path (minus the '*')
      return path.startsWith(allowedPath.slice(0, -2))
    } else {
      // For exact paths, check for an exact match
      return path === allowedPath
    }
  })
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !isAllowedPath(request.nextUrl.pathname)
    // !request.nextUrl.pathname.startsWith('/')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}