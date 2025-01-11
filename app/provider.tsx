// app/providers.js
'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    loaded: function (posthog) {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug();
      }
    },
  });
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    return <>{children}</>;
  }
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
