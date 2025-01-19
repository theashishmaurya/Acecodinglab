'use server';

import createClient from '@/lib/supabase/supabaseServer';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient();

  // Sign up the user with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }
  // Redirect to a "verify your email" page or directly to dashboard
  redirect('/dashboard/practice'); // or '/dashboard' if you don't require email verification
}

export async function signInWithGithub() {
  const currentHeaders = await headers();
  const host = currentHeaders.get('host'); // Get the current host (e.g., localhost:3000 or domain.com)
  const protocol = host?.startsWith('localhost') ? 'http' : 'https'; // Use http for localhost, https for production
  const redirectTo = `${protocol}://${host}/auth/callback`;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectTo,
    },
  });
  if (error) {
    return { message: error.message };
  }

  redirect(data.url);
}
