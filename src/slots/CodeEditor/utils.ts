import path from 'path';
// @ts-ignore
import { transform } from '@babel/standalone';
import indentString from 'indent-string';

export function replaceFetchUrl(sourceCode: string) {
  const dataFileMatch = sourceCode.match(/fetch\('(.*)'\)/);
  if (
    dataFileMatch &&
    dataFileMatch.length > 0 &&
    !dataFileMatch[1].startsWith('http')
  ) {
    return sourceCode.replace(
      dataFileMatch[1],
      path.join(
        location!.origin || '',
        location!.pathname || '',
        '..',
        dataFileMatch[1],
      ),
    );
  }
  return sourceCode;
}

/**
 * 通过代码提取代码片段的 pkg 依赖
 * @param sourceCode
 */
export function extractImportDeps(sourceCode: string) {
  const requireMatches = sourceCode.match(/require\(['"](.*)['"]\)/g) || [];
  const importMatches = sourceCode.match(/from\s+['"](.*)['"]/g) || [];

  const deps: any = {};
  [...requireMatches, ...importMatches].forEach((match: string) => {
    const requireMatch = match.match(/require\(['"](.*)['"]\)/);
    if (requireMatch && requireMatch[1]) {
      deps[requireMatch[1]] = 'latest';
    }
    const importMatch = match.match(/from\s+['"](.*)['"]/);
    if (importMatch && importMatch[1]) {
      deps[importMatch[1]] = 'latest';
    }
  });

  return deps;
}

export function getCodeSandboxConfig(title: string, sourceCode: string, fileExtension: string, deps: any, devDependencies: any, playground: any) {
  return {
    files: {
      'package.json': {
        content: {
          main: `index.${fileExtension}`,
          dependencies: deps,
          devDependencies,
        },
      },
      [`index.${fileExtension}`]: {
        content: replaceFetchUrl(sourceCode),
      },
      'index.html': {
        content: playground.container || '<div id="container" />',
      },
    } as {
      [key: string]: any;
    },
  }
}

export function getRiddleConfig(title: string, sourceCode: string, fileExtension: string, deps: any, devDependencies: any, playground: any) {
  return {
    title,
    js: sourceCode,
    html: playground.container || '<div id="container" />',
    // 预填的 package.json 代码
    json: JSON.stringify({
      dependencies: deps,
      devDependencies,
      ...playground.json,
    }),
  };
}

export function getStackblitzConfig(title: string, sourceCode: string, fileExtension: string, deps: any, devDependencies: any, playground: any) {
  return {
    title: title || '',
    description: '',
    template: 'create-react-app' as any,
    dependencies: deps,
    files: {
      [`index.${fileExtension.startsWith('ts') ? 'ts' : 'js'}`]: sourceCode,
      'index.html': playground.container || '<div id="container" />',
    },
  };
}

export function getHtmlCodeTemplate(title: string, sourceCode: string, fileExtension: string, deps: any, devDependencies: any, playground: any) {
  const { htmlCodeTemplate = '', container = '' } = playground;
  const insertCssMatcher = /insertCss\(`\s*(.*)\s*`\);/;
  const code = replaceFetchUrl(sourceCode)
    .replace(/import\s+.*\s+from\s+['"].*['"];?/g, '')
    .replace(insertCssMatcher, '')
    .replace(/^\s+|\s+$/g, '');
  let result = htmlCodeTemplate
    .replace('{{code}}', indentString(code, 4))
    .replace('{{title}}', title || 'example');
  const customStyles = sourceCode.match(insertCssMatcher);
  if (customStyles && customStyles[1]) {
    result = result.replace(
      '</head>',
      `  <style>\n${indentString(
        customStyles[1],
        4,
      )}\n    </style>\n  </head>`,
    );
  }
  if (container) {
    result = result.replace(
      '<body>',
      `<body>\n${indentString(container, 4)}`,
    );
  }
  return result;
}


export function replaceInsertCss(str: string, lang: string) {
  const comment =
    lang === 'zh'
    ? `// 我们用 insert-css 演示引入自定义样式
// 推荐将样式添加到自己的样式文件中
// 若拷贝官方代码，别忘了 npm install insert-css
insertCss(`
    : `// We use 'insert-css' to insert custom styles
// It is recommended to add the style to your own style sheet files
// If you want to copy the code directly, please remember to install the npm package 'insert-css
insertCss(`;
  // 统一增加对 insert-css 的使用注释
  return str.replace(/^insertCss\(/gm, comment);
}

/**
 * 执行代码
 * @param code 运行的代码
 * @param playgroundScriptContainer 运行的节点
 * @param container 代码中 container dom
 * @param replaceId rid
 * @param cb 回调错误
 */
export function execute(code: string, playgroundScriptContainer: string, container: string, replaceId = 'container') {
  const node = document.getElementById(playgroundScriptContainer);
  const script = document.createElement('script');
  // replace container id in case of multi demos in document
  const newCode = code.replace(/'container'|"container"/, `'${replaceId}'`);
  script.innerHTML = `
// Can only have one anonymous define call per script file
// 和 monaco loader 加载冲突
var __runnerDefine = window['define'];
window['define'] = null;
try {
  ${newCode}

  // 清除显示的错误
  window.__reportErrorInPlayground && window.__reportErrorInPlayground(null);
} catch(e) {
  window.__reportErrorInPlayground && window.__reportErrorInPlayground(e);
} finally {
  window['define'] = __runnerDefine;
}
  `;
  // 追加图表容器
  node.innerHTML = container || `<div id=${replaceId} />`;
  // 运行 script
  node!.appendChild(script);
}

/**
 * 编译代码
 */
export function compile(value: string, relativePath: string) {
  const { code } = transform(value, {
    filename: relativePath,
    presets: ['react', 'typescript', 'es2015', 'stage-3'],
    plugins: ['transform-modules-umd'],
    
  });
  return code;
}
