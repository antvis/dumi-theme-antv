import React, {type FC, useEffect} from 'react';
import { useOutlet } from 'dumi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {initializeStore} from "../../model/AIChat";
const queryClient = new QueryClient();
const GlobalLayout: FC = () => {
  const outlet = useOutlet();
  useEffect(() => {
    initializeStore();
  }, []);
  return (
    outlet && (
      <QueryClientProvider client={queryClient}>
        {outlet}
      </QueryClientProvider>
    )
  );
};

export default GlobalLayout;
