import { PlayCircleOutlined, ReloadOutlined, ThunderboltOutlined} from '@ant-design/icons';
import stackblitzSdk from '@stackblitz/sdk';
import { Tooltip, Typography } from 'antd';
import { FormattedMessage, useLocale } from 'dumi';
import React, { useEffect, useState } from 'react';
import { ping } from '../utils';
import { extractImportDeps, getRiddleConfig, getStackblitzConfig } from './utils';

import styles from './Toolbar.module.less';

const { Paragraph } = Typography;

export enum EDITOR_TABS {
  SPEC = 'Spec',
  API = 'API',
  DATA = 'Data',
}

type ToolbarProps = {
  /**
   * 源码文件，用于传入到三方代码平台
   */
  sourceCode: string;
  /**
   * 生成代码文件名后缀，用于传入到三方代码平台
   */
  fileExtension: string;
  /**
   * 项目标题，用于传入到三方代码平台
   */
  title:
    | {
        zh?: string;
        en?: string;
      }
    | string;
  /**
   * playground 的一些配置项
   */
  playground: {
    container?: string;
    playgroundDidMount?: string;
    playgroundWillUnmount?: string;
    dependencies?: {
      [key: string]: string;
    };
    devDependencies?: {
      [key: string]: string;
    };
    htmlCodeTemplate?: string;
    json?: {
      [key: string]: any;
    };
  };
  /**
   * Tabs 数据
   */
  editorTabs: EDITOR_TABS[];
  /**
   * 当前编辑哪个 tab
   */
  currentEditorTab: EDITOR_TABS;
  /**
   * 切换 tab
   */
  onEditorTabChange: (tab: EDITOR_TABS) => void;
  /**
   * 执行代码
   */
  onExecuteCode: () => void;

  onClickAI: () => void;
  onReload: () => void;
  showAI?: boolean;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  sourceCode,
  fileExtension,
  playground = {},
  title = '',
  editorTabs,
  currentEditorTab,
  onEditorTabChange,
  onExecuteCode,
  onClickAI,
  onReload,
  showAI = true
}) => {
  const locale = useLocale();
  const exampleTitle = (typeof title === 'object' ? title[locale.id as 'zh' | 'en'] : title) as string;

  // 使用 playground.dependencies 定义的版本号
  const dependencies = {
    ...extractImportDeps(sourceCode),
    ...playground.dependencies,
  };
  const devDependencies = playground.devDependencies || {};

  const riddlePrefillConfig = getRiddleConfig(
    exampleTitle,
    sourceCode,
    fileExtension,
    dependencies,
    devDependencies,
    playground,
  );
  const stackblitzPrefillConfig = getStackblitzConfig(
    exampleTitle,
    sourceCode,
    fileExtension,
    dependencies,
    devDependencies,
    playground,
  );

  const [riddleVisible, updateRiddleVisible] = useState(false);
  useEffect(() => {
    ping()
      .then((status) => updateRiddleVisible(status === 'responded'))
      .catch(() => updateRiddleVisible(false));
  }, []);
  return (
    <div className={styles.toolbar}>
      <div className={styles.editortabs}>
        {editorTabs.map((tab, index) => {
          return (
            <span
              key={index}
              className={tab === currentEditorTab ? styles.current : ''}
              onClick={() => onEditorTabChange(tab)}
            >
              {tab}
            </span>
          );
        })}
      </div>
      {showAI ? <><a className={styles.ai} onClick={onClickAI}><FormattedMessage id="ai.toolbar.assistant" /></a>
      <Tooltip title={<FormattedMessage id="ai.toolbar.restore" />}><span className={styles.ai} onClick={onReload}><ReloadOutlined /></span></Tooltip>
      </> : null }
      {riddleVisible ? (
        <form action="//riddle.alibaba-inc.com/riddles/define" method="POST" target="_blank">
          <input type="hidden" name="data" value={JSON.stringify(riddlePrefillConfig)} />
          <Tooltip title={<FormattedMessage id="ai.toolbar.open.riddle" />}>
            <input type="submit" value="Create New Riddle with Prefilled Data" className={styles.riddle} />
          </Tooltip>
        </form>
      ) : null}
      <Tooltip title={<FormattedMessage id="ai.toolbar.open.stackblitz" />}>
        <ThunderboltOutlined
          className={styles.stackblitz}
          onClick={() => {
            stackblitzSdk.openProject(stackblitzPrefillConfig);
          }}
        />
      </Tooltip>
      <Paragraph copyable={{ text: sourceCode }} style={{ marginLeft: 6 }} />
      <Tooltip title={<FormattedMessage id="ai.toolbar.execute" />}>
        <PlayCircleOutlined onClick={onExecuteCode} style={{ marginLeft: 12 }} />
      </Tooltip>
    </div>
  );
};
