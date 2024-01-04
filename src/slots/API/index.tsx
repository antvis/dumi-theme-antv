import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Collapse, Popover } from 'antd';
import { get } from 'lodash-es';
import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useSnapshot } from 'valtio';
import { store } from '../../model';
import { CollapsedIcon } from '../../pages/Example/components/CollapsedIcon';
import { ExampleTopic } from '../../types';
import { getDemoInfo } from '../CodeRunner/utils';
import styles from './index.module.less';

const { Panel } = Collapse;

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

  /** 从 MD 中解析出最短标题(eg: #、##、###)作为折叠分组条件 */
  const findShortestHashTag = (lines: string[]) => {
    const tagLines = lines.filter((line) => line.startsWith('#'));
    const tagReg = /^#+/g;
    const tagLengths = tagLines.map((line) => line.match(tagReg)[0].length);
    return Math.min(...tagLengths);
  };

  /** 将扁平状态的 MD 解析为嵌套结构 */
  const renderNestedDom = (content: string) => {
    if (!content) {
      return null;
    }
    const lines = content.split('\n');
    const result = [];
    const tagLengths = findShortestHashTag(lines);
    const regex = new RegExp(
      `^${new Array(tagLengths).fill('#').join('')}\\s+([^\\n]*)`,
    );
    lines.forEach((line, index) => {
      if (regex.exec(line)) {
        const header = regex.exec(line)[1];
        result.push({
          start: index,
          header,
        });
      }
    });

    const MarkdownComponent = ({ content }) => (
      <Markdown
        rehypePlugins={[rehypeRaw]}
        components={{
          // @ts-expect-error
          description(props) {
            const { node, ...rest } = props;
            return <span style={{ fontSize: 12, color: '#777' }} {...rest} />;
          },
        }}
      >
        {content}
      </Markdown>
    );

    /** 避免无标题的情况内容丢失 */
    const minStart = get(result, [0, 'start']);

    return (
      <React.Fragment>
        {minStart > 0 && (
          <div className={styles.disorganized}>
            <MarkdownComponent content={lines.slice(0, minStart).join('\n')} />
          </div>
        )}
        <Collapse bordered={false} defaultActiveKey={[result[0]?.header]} ghost>
          {result.map((item, index) => {
            const { start, header } = item;
            const end =
              index === result.length - 1
                ? lines.length
                : result[index + 1].start;
            return (
              <Panel
                header={<b style={{ lineHeight: '22px' }}>{header}</b>}
                key={header}
              >
                <MarkdownComponent
                  content={lines.slice(start + 1, end).join('\n')}
                />
              </Panel>
            );
          })}
        </Collapse>
      </React.Fragment>
    );
  };

  return (
    <div
      className={styles.api}
      style={{ width: state.showAPI ? state.apiContainerWidth : 24 }}
    >
      <div className={styles.header}>
        <p>API</p>
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
          renderNestedDom(APIContent)
        ) : (
          <div style={{ textAlign: 'center', padding: 12 }}>
            <h1>404</h1>
            <p>Sorry, the API you visited does not exist.</p>
          </div>
        )}
      </div>
    </div>
  );
};
