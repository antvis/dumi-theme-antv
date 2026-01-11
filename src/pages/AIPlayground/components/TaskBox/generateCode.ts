/**
 * 从代码字符串中提取依赖，并生成 package.json 的 dependencies 对象。
 *
 * @param {string} codeString 包含代码的字符串。
 * @returns {object} 一个符合 package.json dependencies 格式的对象。
 */
export function generateDependencies(codeString = '', ext = 'js') {
  // 1. 初始化固定的依赖
  let dependencies: Record<string, string> = {};

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

  // VisionSnap限制只要是jsx就必须装React。
  if (ext === 'jsx' || ext === 'tsx') {
    dependencies["react"] = "^18";
    dependencies["react-dom"] = "^18";
  }

  if (ext === 'vue') {
    dependencies["vue"] = "^3";
  }

  if (dependencies['@antv/s2'] || dependencies['@antv/s2-react'] || dependencies['@antv/s2-react-components'] || dependencies['@antv/s2-vue']) {
    dependencies = {
      ...dependencies,
      "@ant-design/icons": "^6.1.0",
      "@antv/s2": "^2.4.9",
      "@antv/s2-react": "^2.2.3",
      "@antv/s2-react-components": "^2.1.2",
      "antd": "^5.27.6",
      "insert-css": "^2.0.0",
      "react": "^18.3.1",
      "react-color": "^2.19.3",
      "react-dom": "^18.3.1",
      "@antv/g2": "^5.4.2"
    }
  }

  return dependencies;
}


/**
 * 基于代码内容，启发式地判断其最合适的文件扩展名。
 * @param {string} code - 要分析的前端代码字符串。
 * @returns {'vue' | 'tsx' | 'jsx' | 'ts' | 'js'} - 推断出的文件扩展名（不含点）。
 */
export function getLanguageExtension(code) {
  // --- 特征检测函数 ---

  /**
   * 检查代码是否包含 Vue 单文件组件 (SFC) 的特征。
   * 这是最优先的检查，因为Vue的SFC结构非常独特。
   */
  const containsVue = (text) => {
    // 检查点 1: Vue 3 <script setup> 语法（最强信号）
    // 匹配 <script setup> 或 <script lang="ts" setup>
    const scriptSetupRegex = /<script\s+(?:lang="ts"\s+)?setup>/;
    if (scriptSetupRegex.test(text)) {
      return true;
    }

    // 检查点 2: 顶层 <template> 块（非常强的信号）
    // 使用 'm' (multiline) 标志，'^' 匹配每行的开头。
    const templateRegex = /^\s*<template.*>/m;
    if (templateRegex.test(text)) {
      return true;
    }

    // 检查点 3: 导入 Vue 核心库（通用信号）
    // 匹配 import ... from 'vue'
    const vueImportRegex = /import\s+.*?\s+from\s*['"]vue['"]/;
    if (vueImportRegex.test(text)) {
      return true;
    }

    // 检查点 4: Vue 2 Options API 特征（辅助信号）
    // 匹配 export default { ... data|methods|computed ... } 结构
    const optionsApiRegex = /\bexport\s+default\s*{[\s\S]*?\b(data|methods|computed|watch)\b/;
    if (optionsApiRegex.test(text)) {
      return true;
    }

    return false;
  };

  const containsJsx = (text) => {
    const jsxRegex = /<(?![\s!=])([a-zA-Z][a-zA-Z0-9-]*|\/|)/;
    return jsxRegex.test(text);
  };

  const containsTypeScript = (text) => {
    const typeDefinitionRegex = /\b(interface|type)\s+[A-Z][a-zA-Z0-9]*\b/;
    if (typeDefinitionRegex.test(text)) return true;

    const typeAnnotationRegex = /:\s*([A-Z][a-zA-Z0-9<>.]*|string|number|boolean|any\[?\]?)/;
    if (typeAnnotationRegex.test(text)) return true;

    const tsKeywordsRegex = /\b(as|implements|private|public|protected|readonly)\s+[a-zA-Z]/;
    if (tsKeywordsRegex.test(text)) return true;

    return false;
  };

  // --- 决策逻辑（Vue优先） ---

  if (containsVue(code)) {
    return 'vue';
  }

  // 如果不是Vue，则回退到原有的React/JS逻辑
  if (containsJsx(code)) {
    if (containsTypeScript(code)) {
      return 'tsx';
    }
    return 'jsx';
  } else {
    if (containsTypeScript(code)) {
      return 'ts';
    }
    return 'js';
  }
}



export function wrap2VisionSnap(codeBlock: string = '') {
  const ext = getLanguageExtension(codeBlock);
  const mainFile = ext === 'vue' ? `/src/index.js` : `/src/index.${ext}`;
  const appFile = `/src/App.${ext}`;
  const dependencies = generateDependencies(codeBlock, ext);
  const rootElementType = dependencies['@antv/f2'] ? 'canvas' : 'div';
  const dependenciesJSON = {
    "name": "AntV-adapted-project",
    "version": "1.0.0",
    "main": mainFile,
    "dependencies": dependencies
  };
  const mainFileCode = ext === 'vue' ? `import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');
` : `
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
  import('./App.${ext}');

}
      `;
  return {
    modules: {
      '/package.json': {
        fpath: '/package.json',
        code: JSON.stringify(dependenciesJSON, null, 2)
      },
      [mainFile]: {
        fpath: mainFile,
        code: mainFileCode
      },
      [appFile]: {
        fpath: appFile,
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

