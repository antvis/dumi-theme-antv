import { DatasourceCard } from './DatasourceCard';
import { useEventListener } from 'ahooks';
import classnames from 'classnames';
import _ from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import styles from './index.module.less';
import { SendButton } from './SendButton';
import { ChooseLib } from './ChooseLib';
import { useSiteData, useIntl } from 'dumi';
import { ic } from '../../../../slots/hooks';
import {useTypewriter} from "../../../../hooks/useTypewriter";
import { FileMeta, AnalyzedData } from './Uploader/DataUploader';
import {authStore, showLoginModal} from "../../../../model/auth";
import {useSnapshot} from "valtio";
import {AIChatStore} from "../../../../model/AIChat";
import {ModeSelectorDropdown} from "../ModeSelector/ModeSelectorDropdown";

interface PromptTextareaProps {
  value: string;
  loading?: boolean;
  onChange?: (val: string) => void;
  // 新增一个回调，用于传递解析出的数据摘要
  onDataSummaryChange?: (summary: string) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onOpenDatasetModal?: () => void;
  size?: 'default' | 'compact';
  // fileMeta现在由组件内部管理
  // fileMeta?: FileMeta;
  style?: React.CSSProperties;
  showAction?: boolean;
  showModeSelector?: boolean;
  skipLoginCheck?: boolean; // 是否跳过登录检查
  sendButtonTip?: string; // 发送按钮的悬浮提示
}

const PLACEHOLDER = {
  implement: 'ai.placeholder.implement',
  solve: 'ai.placeholder.solve',
} as const;

export const PromptTextarea = React.memo(function PromptTextareaInner(props: PromptTextareaProps) {
  const {
    value,
    size,
    onChange,
    onDataSummaryChange, // 接收新的prop
    onConfirm,
    onCancel,
    loading,
    showAction = true,
    showModeSelector = false,
    skipLoginCheck = false,
    sendButtonTip
  } = props;
  const snap = useSnapshot(AIChatStore);
  const authSnap = useSnapshot(authStore);
  const { formatMessage } = useIntl();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { themeConfig } = useSiteData();
  useEffect(() => {
    if (!themeConfig.isAntVSite && !snap.lib) {
      AIChatStore.lib = themeConfig.title;
    }
  }, [themeConfig.isAntVSite, themeConfig.title]);
  // 将fileMeta状态移到组件内部管理
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);

  // ... 其他状态和hooks保持不变
  const [focus, setFocus] = useState(false);
  const isCompact = size === 'compact';
  const typedPlaceholder = useTypewriter({
    texts: [
      formatMessage({ id: 'ai.placeholder.whatis' }, { title: themeConfig.title }),
      ic(themeConfig.metas.description),
    ],
  });

  // 处理DataUploader的回调
  const handleDataAnalyzed = (analyzedData: AnalyzedData) => {
    setFileMeta(analyzedData.fileMeta);
    if (onDataSummaryChange) {
      onDataSummaryChange(analyzedData.dataSummary);
    }
  };

  function renderDatasourceCard() {
    if ((fileMeta?.type === 'FILE' || fileMeta?.type === 'IMAGE') && fileMeta?.fileName) {
      // 当点击DatasourceCard的关闭按钮时，应该清空状态
      const handleClose = () => {
        setFileMeta(null);
        if (onDataSummaryChange) {
          onDataSummaryChange('');
        }
      };
      return <DatasourceCard type={fileMeta.type} title={fileMeta.fileName!} desc={fileMeta.fileSize} onDelete={handleClose} />;
    } else {
      return null;
    }
  }

  const datasourceNode = renderDatasourceCard();

  const promptTextValid = Boolean(value);

  const pureSend = () => {
    if (promptTextValid) {
      onConfirm?.();
    }
  };

  const send = () => {
    // 如果跳过登录检查，直接发送
    if (skipLoginCheck) {
      pureSend();
      return;
    }
    // 否则检查登录状态
    if (!authSnap.isAuthenticated) {
      showLoginModal(pureSend);
      return;
    }
    pureSend();
  };

  useEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      // 不区分 textarea 是否聚焦
      if (!event.shiftKey && !event.isComposing && !loading) {
        event.preventDefault();
        send(); // 触发自定义事件
      }
    }
  }, { target: textareaRef });

  return (
    <div
      className={classnames(styles.container, {
        [styles.active]: focus,
        [styles.compact]: isCompact,
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
        ref={textareaRef}
        placeholder={
          // (!isCompact && !themeConfig.isAntVSite && ic(themeConfig.metas.description)) ||
          (!isCompact && !themeConfig.isAntVSite) ? typedPlaceholder :
          formatMessage({ id: _.get(PLACEHOLDER, snap.mode, 'ai.placeholder.implement') })
        }
        value={value}
        onChange={(evt) => {
          onChange(evt.target.value);
        }}
      />

      <div className={styles.footer}>
        <div className={styles.dataActions}>
          {showAction && (
            <>
              <ChooseLib size={size} value={snap.lib} onChange={(s) => AIChatStore.lib = s} />
            </>
          )}
          {showModeSelector && (
            <>
              <ModeSelectorDropdown />
            </>
          )}
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
              tip={!promptTextValid ? formatMessage({ id: 'ai.msgbox.send.tip' }) : sendButtonTip}
            />
          )}
        </div>
      </div>
    </div>
  );
});
