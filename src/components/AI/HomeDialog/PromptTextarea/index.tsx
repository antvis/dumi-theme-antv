import { DatasourceCard } from './DatasourceCard';
import { useEventListener } from 'ahooks';
import {message, Upload} from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import React, { useState } from 'react';
import styles from './index.module.less';
import { SendButton } from './SendButton';
import {AIMode, AIModeType, FileIcons} from "../../constant";
import { ChooseLib } from './ChooseLib';

interface PromptTextareaProps {
  value: string;
  loading?: boolean;
  onChange: (val: string) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onOpenDatasetModal?: () => void;
  size?: 'default' | 'compact';
  fileMeta?: {
    type: 'FILE' | 'IMAGE';
    fileName?: string;
    fileSize?: string;
  };
  mode: AIModeType;
  lib: string;
  onLibChange: (val: string) => void;
  style?: React.CSSProperties;
}

const PLACEHOLDER = {
  implement: '今天，你想可视化什么？',
  solve: '今天，你想解决什么可视化问题？',
} as const;


function PromptTextarea(props: PromptTextareaProps) {
  const {
    value,
    size,
    onChange,
    onConfirm,
    onCancel,
    loading,
    fileMeta,
    mode,
    lib,
    onLibChange
  } = props;
  const [showError, setShowError] = useState(false);
  const [focus, setFocus] = useState(false);


  function renderDatasourceCard() {
    if ((fileMeta?.type === 'FILE' || fileMeta?.type === 'IMAGE') && fileMeta?.fileName) {
      return (
        <DatasourceCard
          type={fileMeta.type}
          title={fileMeta.fileName!}
          desc={fileMeta.fileSize}
        />
      );
    } else {
      return null;
    }
  }

  const datasourceNode = renderDatasourceCard();

  const promptTextValid = Boolean(value);

  const send = () => {
    if (!promptTextValid) {
      message.warning('请输入指令');
    } else {
      setShowError(false);
      onConfirm?.();
    }
  };

  useEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      // 不区分 textarea 是否聚焦
      if (!event.shiftKey && !event.isComposing && !loading) {
        event.preventDefault();
        send(); // 触发自定义事件
      }
    }
  });

  return (
    <div
      className={classnames(styles.container, {
        [styles.active]: focus,
        [styles.compact]: size === 'compact',
        [styles.withDatasource]: Boolean(datasourceNode),
      })}
      style={props.style}
    >
      {datasourceNode && <div className={styles.header}>{datasourceNode}</div>}
      <textarea
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        id="prompt-textarea"
        className={classnames(styles.promptTextarea)}
        placeholder={_.get(PLACEHOLDER, mode, '今天，你想可视化什么？')}
        value={value}
        onChange={(evt) => {
          onChange(evt.target.value);
        }}
      />

      <div className={styles.footer}>
        <div className={styles.dataActions}>
          <ChooseLib value={lib} onChange={onLibChange} />
          {mode === AIMode.implement && <><Upload>
            <button type="button">
              <img src={FileIcons.FILE} /> 上传数据
            </button>
          </Upload>
          <Upload>
            <button type="button">
              <img src={FileIcons.IMAGE} /> 上传图片
            </button>
          </Upload></>}
        </div>
        <div className={styles.actions}>
          {loading ? (
            <img
              className={styles.actionBtn}
              onClick={onCancel}
              src="https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*Yin-QLza5hMAAAAAQBAAAAgAeriAAQ/original"
            />
          ) : (
            <SendButton
              onClick={send}
              disabled={!promptTextValid}
              tip={!promptTextValid ? `请输入内容后发送指令` : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { PromptTextarea };
