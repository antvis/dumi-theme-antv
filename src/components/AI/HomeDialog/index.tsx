import React, {useState} from 'react';
import styles from './index.module.less';
import { AntVBanner } from './AntVBanner';
import { PromptTextarea } from './PromptTextarea';
import { RecommendCase } from './RecommendCase';
import { ModeSelector } from './ModeSelector';
import classnames from 'classnames';
import { useLocale } from 'dumi';
import {AIChatStore} from '../../../model/AIChat';
import {ReplayCase} from "../types";
import {useSnapshot} from "valtio";

interface HomeDialogProps {
  className?: string;
  style?: React.CSSProperties;
  promptTextareaStyle?: React.CSSProperties;
  recommendCaseClassName?: string;
}

export function HomeDialog(props: HomeDialogProps) {
  const locale = useLocale();
  const lang = locale.id === 'zh' ? 'zh' : 'en';
  const snap = useSnapshot(AIChatStore);
  const [promptText, setPromptText] = useState<string>('');
  const [_fileSummary, setFileSummary] = useState('');

  const handleConfirm = () => {
    // 在新标签页打开新站点，携带问题参数
    const encodedMessage = encodeURIComponent(promptText);
    const targetUrl = `https://sive.antv.antgroup.com/qa?message=${encodedMessage}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return <div className={classnames(styles.content, props.className)} style={props.style}>
    <AntVBanner/>
    <ModeSelector
      onChange={(v) => {
        AIChatStore.mode = v;
      }}
      value={snap.mode}
    />
    <PromptTextarea
      value={promptText}
      onChange={(val) => {
        setPromptText(val);
      }}
      onConfirm={handleConfirm}
      skipLoginCheck={true}
      sendButtonTip={lang === 'zh' ? '现智能问答功能已迁移到 AntV 新站点 Sive，点击发送后将自动为您跳转' : 'Smart Q&A has been migrated to AntV Sive. You will be redirected automatically after clicking send.'}
      style={props.promptTextareaStyle}
      onDataSummaryChange={setFileSummary}
    />
    <RecommendCase className={props.recommendCaseClassName} onClick={(val: ReplayCase) => {
      if (val?.query) {
        setPromptText(val.query[lang]);
      }
    }}/>
  </div>;
}
