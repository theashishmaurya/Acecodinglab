// components/UserTracker.tsx
'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { createClient } from '@/lib/supabase/supabaseClient';

export function UserTracker() {
  const supabase = createClient();
  useEffect(() => {
    const setIdentify = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        posthog.identify(data?.user.id);
        posthog.people.set({
          email: data.user.email,
          name: data.user.user_metadata.full_name,
        });
      }
    };
    setIdentify();
  }, [supabase.auth]);

  return null;
}
