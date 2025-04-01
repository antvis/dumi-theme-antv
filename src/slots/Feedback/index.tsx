import { useSiteData } from 'dumi';
import React, { lazy } from 'react';

const EditButton = lazy(() => import('./EditButton'));
const Contributors = lazy(() => import('./Contributors'));
const SectionFeedback = lazy(() => import('./SectionFeedback'));

export const Feedback: React.FC = () => {
  const { themeConfig } = useSiteData();
  const { feedback } = themeConfig;

  if (!feedback) {
    return null;
  }

  return (
    <>
      <EditButton />
      <Contributors />
      <SectionFeedback />
    </>
  );
};
