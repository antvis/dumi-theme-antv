import type React from 'react';
import { ReactNode, useLayoutEffect, useState } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const [clientReady, setClientReady] = useState<boolean>(false);

  useLayoutEffect(() => {
    setClientReady(true);
  }, []);

  return clientReady ? (children as React.ReactElement) : (fallback as React.ReactElement);
};

export default ClientOnly;
