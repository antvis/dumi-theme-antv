/**
 * 从代码字符串中提取依赖，并生成 package.json 的 dependencies 对象。
 *
 * @param {string} codeString 包含代码的字符串。
 * @returns {object} 一个符合 package.json dependencies 格式的对象。
 */
export function generateDependencies(codeString) {
  // 1. 初始化固定的依赖
  const dependencies: Record<string, string> = {
  };

  // 2. 定义正则表达式来匹配 import 语句的来源
  // 这个正则表达式可以处理以下情况:
  // - import defaultExport from 'package-name';
  // - import { namedExport } from 'package-name';
  // - import * as name from 'package-name';
  // - import 'package-name'; (用于副作用)
  // - import defaultExport from '@scoped/package-name/sub-path';
  //
  // 解析:
  // - `import(?:.*from)?` : 匹配 "import" 关键字，以及可选的 "... from" 部分。
  // - `\s+` : 匹配一个或多个空格。
  // - `['"]` : 匹配单引号或双引号。
  // - `([^'"]+)` : 核心捕获组。匹配引号内的所有字符，这就是我们需要的包路径。
  // - `['"]` : 匹配结束的引号。
  // - `/g` : 全局匹配，查找所有符合条件的导入。
  const importRegex = /import(?:.*from)?\s+['"]([^'"]+)['"]/g;

  // 使用 Set 来存储找到的包，可以自动去重
  const foundPackages = new Set<string>();

  // 3. 遍历所有匹配项
  let match;
  while ((match = importRegex.exec(codeString)) !== null) {
    // 捕获组 match[1] 包含了完整的导入路径，例如 '@antv/g2' 或 'react-dom/client'
    const importPath = match[1];

    // 4. 过滤掉相对路径和绝对路径
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      continue;
    }

    // 5. 提取根包名
    // 这可以处理像 'react-dom/client' 这样的深层导入，我们只需要 'react-dom'
    // 或者像 '@antv/g2/es/chart'，我们只需要 '@antv/g2'
    let rootPackage;
    const pathParts = importPath.split('/');

    if (importPath.startsWith('@')) {
      // 对于作用域包 (scoped package)，例如 @antv/g2，根包名是前两部分
      rootPackage = `${pathParts[0]}/${pathParts[1]}`;
    } else {
      // 对于普通包，根包名是第一部分
      rootPackage = pathParts[0];
    }

    foundPackages.add(rootPackage);
  }

  // 6. 将找到的包添加到最终的依赖对象中
  for (const pkg of foundPackages) {
    // 如果不是固定的依赖，就添加并设置为 'latest'
    if (!Object.prototype.hasOwnProperty.call(dependencies, pkg)) {
      dependencies[pkg] = "latest";
    }
  }

  return dependencies;
}

export function wrap2VisionSnap (codeBlock: string = '') {
  const dependencies = generateDependencies(codeBlock);
  const rootElementType = dependencies['@antv/f2'] ? 'canvas' : 'div';
  return {
    modules: {
      '/package.json': {
        fpath: '/package.json',
        code: `{
  "name": "AntV-adapted-project",
  "version": "1.0.0",
  "main": "/src/index.jsx",
  "dependencies": ${(JSON.stringify(dependencies, null, 2))}
}`
      },
      '/src/index.jsx': {
        fpath: '/src/index.jsx',
        code: `
// --- Adapter Script ---

// 1. 找到编辑器环境提供的根节点 #root
const rootElement = document.getElementById('root');

if (rootElement) {
  // 2. 在 #root 内部创建一个 ${rootElementType}
  const containerElement = document.createElement('${rootElementType}');

  // 3. 将这个 div 的 id 设置为 'container'，以满足用户代码的需求
  containerElement.id = 'container';

  // 4. 将它添加到 #root 中
  rootElement.appendChild(containerElement);

  // 5. 现在 DOM 中已经存在 #container，安全地导入并执行用户的代码
  import('./App.jsx');

}
      `
      },
      '/src/App.jsx': {
        fpath: '/src/App.jsx',
        code: codeBlock
      }
    }
  }
}

  export function wrap2Sandpack(codeBlock: string = '') {
    // const regex = /^```[\w-]*\n([\s\S]*?)\n?```$/m;
    // const match = codeBlock.match(regex);
    // if (match) {
    return {
      "/package.json": {
        code: `{
      "name": "AntV-AI-Code",
      "version": "1.0.0",
      "main": "/index.tsx",
      "dependencies": ${JSON.stringify(generateDependencies(codeBlock), null, 2)}
    }`
      },
      "/index.tsx": {
        code: codeBlock
      },
      "/index.html": {
        code: `<!DOCTYPE html>
<html>
<head>
  <title>Vanilla JS Example</title>
</head>
<body>
  <div id="root"></div>
  <div id="container"></div>
  <script src="index.tsx"></script>
</body>
</html>`
      },
    };
  }

