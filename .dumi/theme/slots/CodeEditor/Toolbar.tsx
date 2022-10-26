import React, { useEffect, useState } from 'react';
import {
  CodeSandboxOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { Typography, Tooltip } from 'antd';
import { useLocale } from 'dumi';
import { getParameters } from 'codesandbox/lib/api/define';
import stackblitzSdk from '@stackblitz/sdk';
import { ping } from '../utils';
import { extractImportDeps, getCodeSandboxConfig, getStackblitzConfig, getRiddleConfig } from './utils';
import { useT } from '../hooks';
import styles from './Toolbar.module.less';

const { Paragraph } = Typography;

export enum EDITOR_TABS {
  JAVASCRIPT = 'JavaScript',
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
  location?: Location;
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
   * 全屏状态，用于显示不同的 icon 
   */
  isFullScreen?: boolean;
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
   * 进入/退出全屏
   */
  onToggleFullscreen?: null | (() => void);
  /**
   * 执行代码
   */
  onExecuteCode: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  sourceCode,
  fileExtension,
  playground = {},
  location,
  title = '',
  isFullScreen = false,
  editorTabs,
  currentEditorTab,
  onEditorTabChange,
  onToggleFullscreen = null,
  onExecuteCode,
}) => {
  const locale = useLocale()
  const exampleTitle =
    (typeof title === 'object' ? title[locale.id as 'zh' | 'en'] : title) as string;

  // 使用 playground.dependencies 定义的版本号
  const dependencies = {
    ...extractImportDeps(sourceCode),
    ...playground.dependencies,
  };
  const devDependencies = playground.devDependencies || {};

  const codeSandboxConfig = getCodeSandboxConfig(exampleTitle, sourceCode, fileExtension, dependencies, devDependencies, playground);
  const riddlePrefillConfig = getRiddleConfig(exampleTitle, sourceCode, fileExtension, dependencies, devDependencies, playground);
  const stackblitzPrefillConfig = getStackblitzConfig(exampleTitle, sourceCode, fileExtension, dependencies, devDependencies, playground);

  // const htmlCode = getHtmlCodeTemplate(exampleTitle, sourceCode, fileExtension, dependencies, devDependencies, playground);

  const [riddleVisible, updateRiddleVisible] = useState(false);
  useEffect(() => {
    ping((status) => {
      updateRiddleVisible(status === 'responded');
    });
  }, []);

  return (
    <div className={styles.toolbar}>
      <div className={styles.editortabs}>
        {editorTabs.map((tab, index) => (
          <span
            key={index}
            className={tab === currentEditorTab ? styles.current : ''}
            onClick={() => onEditorTabChange(tab)}
          >
            {tab}
          </span>
        ))}
      </div>
      {riddleVisible ? (
        <form
          action="//riddle.alibaba-inc.com/riddles/define"
          method="POST"
          target="_blank"
        >
          <input
            type="hidden"
            name="data"
            value={JSON.stringify(riddlePrefillConfig)}
          />
          <Tooltip title={useT('在 Riddle 中打开')}>
            <input
              type="submit"
              value="Create New Riddle with Prefilled Data"
              className={styles.riddle}
            />
          </Tooltip>
        </form>
      ) : null}
      <Tooltip title={useT('在 StackBlitz 中打开')}>
        <ThunderboltOutlined
          className={styles.stackblitz}
          onClick={() => {
            stackblitzSdk.openProject(stackblitzPrefillConfig);
          }}
        />
      </Tooltip>
      <Tooltip title={useT('在 CodeSandbox 中打开')}>
        <form
          action="https://codesandbox.io/api/v1/sandboxes/define"
          method="POST"
          target="_blank"
        >
          <input
            type="hidden"
            name="parameters"
            value={getParameters(codeSandboxConfig)}
          />
          <button type="submit" className={styles.codesandbox}>
            <CodeSandboxOutlined style={{ marginLeft: 8 }} />
          </button>
        </form>
      </Tooltip>
      <Paragraph copyable={{ text: sourceCode }} style={{ marginLeft: 6 }} />
      {onToggleFullscreen ? (
        <Tooltip title={isFullScreen ? useT('离开全屏') : useT('进入全屏')}>
          {isFullScreen ? (
            <FullscreenExitOutlined
              onClick={onToggleFullscreen}
              style={{ marginLeft: 12 }}
            />
          ) : (
            <FullscreenOutlined
              onClick={onToggleFullscreen}
              style={{ marginLeft: 12 }}
            />
          )}
        </Tooltip>
      ) : null}
      <Tooltip title={useT('执行代码')}>
        <PlayCircleOutlined
          onClick={onExecuteCode}
          style={{ marginLeft: 12 }}
        />
      </Tooltip>
    </div>
  );
};