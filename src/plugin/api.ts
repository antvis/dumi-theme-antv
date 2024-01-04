import * as fs from 'fs-extra';

const MARKDOWN_REG_SIGN = /`markdown:([^`]*)`/g;
const EMBED_REG_SIGN = /<embed[^>]*src=["']([^"']*)["'][^>]*[>\/>]/g;

const getContent = (filePath: string) => {
  let content: string = '';
  try {
    const currentContent = fs.readFileSync(filePath).toString();
    const lines = currentContent.split('\n');
    let isTitle = false;
    lines.forEach((line, index) => {
      /**
       * @description 示例页面无需 title 信息，冗余
       * @example
       *  ---
       *  title: 条形图
       *  order: 7
       *  ---
       */
      if (line.startsWith('---')) {
        isTitle = !isTitle;
      } else {
        if (!isTitle) {
          let nestedPath = '';
          const markdownMatch = MARKDOWN_REG_SIGN.exec(line);
          const embedMatch = EMBED_REG_SIGN.exec(line);
          /**
           * @description 如果是 markdown 语法，则读取 markdown 文件内容
           * @example `markdown:docs/plots/bar.zh.md`
           */
          if (markdownMatch) {
            nestedPath = markdownMatch[1];
          }
          /**
           * @description 如果是 embed 语法，则读取 embed 文件内容
           * @example `<embed src="@/docs/options/plots/overview.zh.md"></embed>`
           */
          if (embedMatch) {
            nestedPath = embedMatch[1].replace(/@\//g, '');
          }
          if (nestedPath) {
            content += getContent(nestedPath);
          } else {
            content += `${line} \n`;
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
  return content;
};

/**
 * 获取API
 *
 * @param {string} apiPath API路径
 * @returns {string} 文件内容
 */
export const getExampleAPI = (apiPath: string): string => {
  if (!fs.existsSync(apiPath)) {
    console.error(`File does not exist: ${apiPath}`);
    return '';
  }
  return getContent(apiPath);
};
