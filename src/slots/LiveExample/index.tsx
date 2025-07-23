import React, { createElement, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ChartPreview from './ChartPreview';
import { CodeEditor } from './CodeEditor';
import ExpressionPreview from './ExpressionPreview';
import IIFEPreview from './IIFEPreview';
import styles from './index.module.less';
import ReactPreview from './ReactPreview';
import { Toolbar } from './Toolbar';

interface LiveExampleProps {
  source: string;
  mode?: CodeMode | 'auto';
  lang?: string;
  pin?: boolean;
  title?: string;
  highlightLines?: number[];
  inject?: boolean;
}

const CODE_MODE = {
  React: 'react',
  Chart: 'chart',
  IIFE: 'iife',
  Expr: 'expr',
} as const;

type CodeMode = (typeof CODE_MODE)[keyof typeof CODE_MODE];

const previews: Record<CodeMode, FC<any>> = {
  react: ReactPreview,
  chart: ChartPreview,
  iife: IIFEPreview,
  expr: ExpressionPreview,
};

function detectMode(source: string, mode?: string, inject?: boolean): CodeMode {
  if (mode && mode !== 'auto') return mode as CodeMode;
  if (inject) return CODE_MODE.Chart;
  if (/export\s+default/.test(source)) return CODE_MODE.React;
  if (/^\(\(.*\)\s*=>|function\s*\(/.test(source.trim())) return CODE_MODE.IIFE;
  return CODE_MODE.Expr;
}

export default function LiveExample({ source, mode = 'auto', lang, pin, inject }: LiveExampleProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLUListElement>(null);

  const [refresh, setRefresh] = useState(0);
  const [sourceCode, setSourceCode] = useState(source);
  const [isCodeVisible, setIsCodeVisible] = useState(pin !== false);

  const realMode = useMemo(() => detectMode(sourceCode, mode, inject), [sourceCode, mode, inject]);

  const updateToolbarHeight = useCallback(() => {
    if (!toolbarRef.current || !previewRef.current || !codeRef.current) return;
    const codeHeight = codeRef.current.clientHeight;
    const previewHeight = previewRef.current.clientHeight;
    toolbarRef.current.style.height = `${codeHeight + previewHeight}px`;
  }, []);

  const toggleCodeVisibility = useCallback(() => {
    setIsCodeVisible((v) => {
      const visible = !v;
      if (codeRef.current) {
        codeRef.current.style.display = visible ? 'block' : 'none';
        setTimeout(updateToolbarHeight, 0);
      }
      return visible;
    });
  }, [updateToolbarHeight]);

  const handleSourceChange = useCallback((code: string) => {
    setSourceCode(code);
  }, []);

  const handleRunCode = useCallback(() => {
    setRefresh((k) => k + 1);
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (!toolbarRef.current || !codeRef.current) return;
      toolbarRef.current.style.display = 'block';
      codeRef.current.style.borderRadius = '0px';
      setTimeout(updateToolbarHeight, 0);
    };

    const handleMouseLeave = () => {
      if (!toolbarRef.current || !codeRef.current) return;
      toolbarRef.current.style.display = '';
      codeRef.current.style.borderRadius = '';
    };

    const codeEditor = codeRef.current;
    const previewContainer = previewRef.current;

    codeEditor?.addEventListener('mouseenter', handleMouseEnter);
    codeEditor?.addEventListener('mouseleave', handleMouseLeave);
    previewContainer?.addEventListener('mouseenter', handleMouseEnter);
    previewContainer?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      codeEditor?.removeEventListener('mouseenter', handleMouseEnter);
      codeEditor?.removeEventListener('mouseleave', handleMouseLeave);
      previewContainer?.removeEventListener('mouseenter', handleMouseEnter);
      previewContainer?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [updateToolbarHeight]);

  return (
    <div className={styles.preview}>
      <div ref={previewRef} className={styles.main}>
        {realMode in previews && createElement(previews[realMode], { code: sourceCode, refresh })}
      </div>
      <Toolbar toolbarRef={toolbarRef} onToggleCode={toggleCodeVisibility} onRun={handleRunCode} />
      <CodeEditor
        value={sourceCode}
        onChange={handleSourceChange}
        lang={lang}
        codeRef={codeRef}
        isVisible={isCodeVisible}
      />
    </div>
  );
}
