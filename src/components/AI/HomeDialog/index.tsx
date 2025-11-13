import React, {useState} from 'react';
import styles from './index.module.less';
import { AntVBanner } from './AntVBanner';
import { PromptTextarea } from './PromptTextarea';
import { RecommendCase } from './RecommendCase';
import { ModeSelector } from './ModeSelector';
import classnames from 'classnames';
import { useLocale } from 'dumi';
import {AIChatStore, createNewSession} from '../../../model/AIChat';
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
  const [fileSummary, setFileSummary] = useState('');

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
      onConfirm={() => {
        createNewSession({
          promptText,
          mode: snap.mode,
          jump: true,
          context: fileSummary,
          lang: locale.id
        })
      }}
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
