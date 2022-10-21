import React from 'react';

export interface NewDemo {
  title: string;
  id: string;
  category: string;
}

export interface AnnouncementProps {
  message: React.ReactNode;
  localStorageId: string;
  bannerId: string;
  style?: React.CSSProperties;
}

export interface GalleryPageContentProps {
  // TODO: 优化类型定义
  exampleSections: Record<any, any>;

  /**
   * 所有 DEMO
   */
  allDemos: any[];
}

export interface LeftMenuProps {
  edges: any[];
  examples: any[];
}
