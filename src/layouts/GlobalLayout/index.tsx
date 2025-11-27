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
    console.log(
      `%c @antv/dumi-theme-antv %c ${__PACKAGE_VERSION__} %c`,
      'background:#35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
      'background:#41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;',
      'background:transparent;',
    );
  }, []);
  return outlet && <QueryClientProvider client={queryClient}>{outlet}</QueryClientProvider>;
};

export default GlobalLayout;
