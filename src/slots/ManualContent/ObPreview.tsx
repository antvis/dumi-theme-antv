import React from 'react';
import { useMenu } from '../../hooks/useMenu';
import { usePreview } from './usePreview';

const ObPreview = () => {
  const [, selectedKey] = useMenu();

  usePreview({}, selectedKey);

  return <div></div>;
};

export default ObPreview;
