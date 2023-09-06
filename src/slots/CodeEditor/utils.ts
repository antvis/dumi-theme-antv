import path from 'path';
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

export function getCodeSandboxConfig(
  title: string,
  sourceCode: string,
  fileExtension: string,
  deps: any,
  devDependencies: any,
  playground: any,
) {
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
  };
}

export function getRiddleConfig(
  title: string,
  sourceCode: string,
  fileExtension: string,
  deps: any,
  devDependencies: any,
  playground: any,
) {
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

export function getStackblitzConfig(
  title: string,
  sourceCode: string,
  fileExtension: string,
  deps: any,
  devDependencies: any,
  playground: any,
) {
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

export function getHtmlCodeTemplate(
  title: string,
  sourceCode: string,
  fileExtension: string,
  deps: any,
  devDependencies: any,
  playground: any,
) {
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
      `  <style>\n${indentString(customStyles[1], 4)}\n    </style>\n  </head>`,
    );
  }
  if (container) {
    result = result.replace('<body>', `<body>\n${indentString(container, 4)}`);
  }
  return result;
}
