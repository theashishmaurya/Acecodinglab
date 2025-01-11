'use client';

import React, { useState, useEffect, use } from 'react';
import CodeEditor from '@/components/codeEditor';
import { practiceSessionsAPI } from '@/db/practiceSession/practiceSession.client';
import { getHelloWorld } from './action';
import { CodeEditorMode } from '@/components/codeEditor/types';

export default function Page(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const [content, setContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSample, setIsSample] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (params.slug === 'sample') {
          const sampleContent = await getHelloWorld();
          setContent(sampleContent);
          setIsSample(true);
        } else {
          const sessionData = await practiceSessionsAPI.getSession(params.slug);
          setContent(JSON.parse(sessionData.current_code));
          setIsSample(false);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
        setError('Failed to load session data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

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
      <CodeEditor
        files={content}
        isSample={isSample}
        mode={CodeEditorMode.PRACTICE}
      />
    </div>
  );
}
