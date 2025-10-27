import SourceCodeEditor from 'dumi/theme-default/slots/SourceCodeEditor';
import React, { FC } from 'react';

interface CodeEditorProps {
  codeRef: React.RefObject<HTMLDivElement>;
  value: string;
  onChange: (v: string) => void;
  lang?: string;
  isVisible: boolean;
}

export const CodeEditor: FC<CodeEditorProps> = ({ value, onChange, lang, codeRef, isVisible }) => (
  <div ref={codeRef} style={{ display: isVisible ? 'block' : 'none' }}>
    <SourceCodeEditor onChange={onChange} initialValue={value} lang={lang} />
  </div>
);
