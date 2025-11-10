import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as antd from 'antd';
import { useOutlet } from 'dumi';
import React, { type FC, useEffect } from 'react';
import { initializeAIChat } from '../../model/AIChat';
import { initializeAuth } from '../../model/auth';

const queryClient = new QueryClient();
const GlobalLayout: FC = () => {
  const outlet = useOutlet();
  useEffect(() => {
    initializeAIChat();
    initializeAuth();
    if (typeof window !== 'undefined') {
      window.antd = antd;
    }
  }, []);
  return outlet && <QueryClientProvider client={queryClient}>{outlet}</QueryClientProvider>;
};

export default GlobalLayout;
