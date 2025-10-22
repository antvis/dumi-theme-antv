export function isPreviewable(str) {
  if (typeof str !== 'string') {
    return false;
  }

  const trimmedStr = str.trim();

  // \b 是一个“单词边界”，确保我们匹配的是完整的 "import" 单词
  // 而不是 "important" 的一部分
  const hasImportStatement = /\bimport\b/.test(trimmedStr);

  if (
    trimmedStr.startsWith('```') &&
    trimmedStr.endsWith('```') &&
    hasImportStatement
  ) {
    return true;
  }

  return false;
}

export function getCodeFromMarkdown(md: string = '') {
  const regex = /```(?<lang>\w*)\n?(?<code>[\s\S]*?)```/;

  const match = md.match(regex);

  if (match) {
    return {
      lang: match.groups.lang || 'plaintext',
      code: match.groups.code.trim()
    };
  }
  return {
    code: ''
  };
}
