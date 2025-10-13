import React, { type FC } from 'react';
import { useOutlet } from 'dumi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
const GlobalLayout: FC = () => {
  const outlet = useOutlet();
  return (
    outlet && (
      <QueryClientProvider client={queryClient}>
        {outlet}
      </QueryClientProvider>
    )
  );
};

export default GlobalLayout;
