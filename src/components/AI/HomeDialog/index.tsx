import React, { useState } from 'react';
import styles from './index.module.less';
import { AntVBanner } from './AntVBanner';
import { PromptTextarea } from './PromptTextarea';
import { RecommendCase } from './RecommendCase';
import { ModeSelector } from './ModeSelector';
import { useLocalStorageState } from 'ahooks';
import { AIMode, AIModeType } from '../constant';
import classnames from 'classnames';
import { useSiteData, useLocale } from 'dumi';
import {createNewSession} from '../../../model/AIChat';
import {ReplayCase} from "../types";

interface HomeDialogProps {
  className?: string;
  style?: React.CSSProperties;
  promptTextareaStyle?: React.CSSProperties;
  recommendCaseClassName?: string;
}

export function HomeDialog(props: HomeDialogProps) {
  const locale = useLocale();
  const { themeConfig } = useSiteData();
  const [lib, setLib] = useState(!themeConfig.isAntVSite ? themeConfig.title : undefined);
  const [mode, setMode] = useLocalStorageState<AIModeType>(
    'use-local-storage-ai-mode-type',
    {
      defaultValue: AIMode.implement
    }
  );
  const [promptText, setPromptText] = useState<string>('');
  const [fileSummary, setFileSummary] = useState('');

  return <div className={classnames(styles.content, props.className)} style={props.style}>
    <AntVBanner/>
    <ModeSelector
      onChange={(v) => {
        setMode(v);
        // todo  埋点
      }}
      value={mode}
    />
    <PromptTextarea
      mode={mode}
      value={promptText}
      lib={lib}
      onLibChange={(v) => {
        setLib(v);
      }}
      onChange={(val) => {
        setPromptText(val);
      }}
      onConfirm={() => {
        createNewSession({
          promptText,
          mode,
          lib,
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
        setPromptText(val.query);
      }
    }}/>
  </div>;
}
