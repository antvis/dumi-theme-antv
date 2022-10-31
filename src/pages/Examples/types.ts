import React from 'react';

export interface AnnouncementProps {
  message: React.ReactNode;
  localStorageId: string;
  bannerId: string;
  style?: React.CSSProperties;
}

export interface GalleryPageContentProps {
  /**
   * 案例主题列表
   */
  exampleTopics: ExamplesPage.ExampleTopic[];
}

export interface LeftMenuProps {
  /**
   * 案例主题列表
   */
  exampleTopics: ExamplesPage.ExampleTopic[];
}

export interface ExampleWithTopic extends ExamplesPage.Example {
  targetTopic: ExamplesPage.ExampleTopic;
}

export interface DemoCardProps {
  demo: ExamplesPage.Demo;
  topicId: string;
  exampleId: string;
}

export interface LeftMenuProps {
  /**
   * 案例主题列表
   */
  exampleTopics: ExamplesPage.ExampleTopic[];
}

