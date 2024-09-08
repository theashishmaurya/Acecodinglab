'use client';

import React, { useState, useEffect } from 'react';
import CodeEditor from "@/components/codeEditor";
import { practiceSessionsAPI } from '@/db/practiceSession/practiceSession.client';

export default function Page({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessionData() {
      try {
        setIsLoading(true);
        const sessionData = await practiceSessionsAPI.getSession(params.slug);
        setContent(JSON.parse(sessionData.current_code));
      } catch (e) {
        console.error(e);
        setError('Failed to load session data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessionData();
  }, [params.slug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <CodeEditor files={content} />
    </div>
  );
}