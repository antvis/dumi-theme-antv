import * as fs from 'fs-extra';

const MARKDOW_REG_NSIGN = /`markdown:(\S+)`/g;

const getContent = (filePath: string) => {
  let content: string = '';
  try {
    const currentContent = fs.readFileSync(filePath).toString();
    const lines = currentContent.split('\n');
    lines.forEach((line, index) => {
      if (line.match(MARKDOW_REG_NSIGN)) {
        let nestedPath = '';
        line.replace(MARKDOW_REG_NSIGN, (match, p1) => {
          nestedPath = p1;
          return '';
        });
        content += getContent(nestedPath);
      } else {
        content += `${line} \n`;
      }
    });
  } catch (e) {
    console.error(e);
  } finally {
    return content;
  }
};

/**
 * 获取API
 *
 * @param {string} apiPath API路径
 * @returns {string} 文件内容
 */
export const getExampleAPI = (apiPath: string) => {
  return getContent(apiPath);
};
