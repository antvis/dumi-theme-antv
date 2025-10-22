import { useState } from 'react';
import { useDeepCompareEffect } from 'ahooks';

interface UseStreamingTextOptions {
  url: string;
  method?: 'POST' | 'GET';
  headers?: Record<string, string>;
  body?: object;
  trigger: boolean;
  beforeStart?: () => void;
  onFinish?: (text: string) => void;
  onError?: (error: Error) => void;
}

export const useStreamingText = ({
                                   url,
                                   method = 'POST',
                                   headers = { 'Content-Type': 'application/json' },
                                   body,
                                   trigger,
                                   onFinish,
                                   onError,
                                   beforeStart
                                 }: UseStreamingTextOptions) => {
  const [text, setText] = useState('');

  useDeepCompareEffect(() => {
    if (!trigger || !body.query) {
      setText('');
      return;
    }

    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.body) {
          throw new Error('Response body is null');
        }

        if (response.headers.get("content-type") === "application/json") {
          onFinish?.(JSON.stringify(await response.json()));
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            onFinish?.(accumulatedText); // 流结束时调用 onFinish
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          setText(accumulatedText);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Streaming fetch error:', error);
          onError?.(error as Error);
        }
      }
    };

    beforeStart?.();

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [trigger, url, method, headers, body]);

  return text;
};
