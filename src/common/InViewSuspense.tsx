/**
 * 只在组件进入视口（可见区域）时才会加载和渲染被包裹的懒加载组件
 */
import { Skeleton } from 'antd';
import React, { Suspense } from 'react';
import type { IntersectionObserverProps } from 'react-intersection-observer';
import { InView } from 'react-intersection-observer';

type InViewSuspenseProps = Pick<IntersectionObserverProps, 'delay'> & {
  fallback?: React.ReactNode;
};

const InViewSuspense: React.FC<React.PropsWithChildren<InViewSuspenseProps>> = ({
  children,
  fallback = <Skeleton.Input active size="small" />,
  delay = 200,
}) => (
  <InView triggerOnce delay={delay}>
    {({ inView, ref }) => (
      <div ref={ref}>
        <Suspense fallback={fallback}>{inView ? children : <span />}</Suspense>
      </div>
    )}
  </InView>
);

export default InViewSuspense;
