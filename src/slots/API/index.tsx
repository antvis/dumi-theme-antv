import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { get } from 'lodash-es';
import Markdown from 'markdown-to-jsx';
import React from 'react';
import { useSnapshot } from 'valtio';
import { store } from '../../model';
import { CollapsedIcon } from '../../pages/Example/components/CollapsedIcon';
import { ExampleTopic } from '../../types';
import { getDemoInfo } from '../CodeRunner/utils';
import styles from './index.module.less';

type APIProps = {
  isPlayground?: boolean;
  topic: string;
  example: string;
  demo: string;
  exampleTopics: ExampleTopic[];
  language?: string;
};
const EMPTY = /^\s*$/;
/**
 * API 预览
 */
export const API = ({
  exampleTopics,
  topic,
  example,
  demo,
  language = 'zh',
}: APIProps) => {
  const state = useSnapshot(store);
  const demoInfo = getDemoInfo(exampleTopics, topic, example, demo);
  const APIContent = get(demoInfo, ['api', language]);

  return (
    <div
      className={styles.api}
      style={{ width: state.showAPI ? state.apiContainerWidth : 24 }}
    >
      <div className={styles.header}>
        <div className={styles.zoom}>
          <ZoomInOutlined
            onClick={() => {
              store.apiContainerWidth += 100;
            }}
          />
          <ZoomOutOutlined
            style={{ marginLeft: 8 }}
            onClick={() => {
              if (state.apiContainerWidth > 150) {
                store.apiContainerWidth -= 100;
              }
            }}
          />
        </div>
        <Popover
          content={language === 'zh' ? '展示文档' : 'Show docs'}
          placement="right"
        >
          <CollapsedIcon
            isCollapsed={state.showAPI}
            onClick={(show: boolean) => {
              store.showAPI = show;
            }}
            style={{
              left: 0,
              top: 0,
            }}
          />
        </Popover>
      </div>
      <div className={styles.content}>
        {!EMPTY.test(APIContent) ? (
          <Markdown>{APIContent}</Markdown>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h1>404</h1>
            <p>Sorry, the API you visited does not exist.</p>
          </div>
        )}
      </div>
    </div>
  );
};
