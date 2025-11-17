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


/**
 * 基于代码内容，启发式地判断其最合适的文件扩展名。
 * @param {string} code - 要分析的前端代码字符串。
 * @returns {'tsx' | 'jsx' | 'ts' | 'js'} - 推断出的文件扩展名（不含点）。
 */
export function getLanguageExtension(code) {
  // --- 特征检测函数 ---

  /**
   * 检查代码是否包含 JSX 语法。
   * 这是一个启发式检查，它查找类似HTML标签的模式。
   * - 匹配 <div...>, <MyComponent...>, </tag>, <Component/>, <>
   */
  const containsJsx = (text) => {
    // 1. 查找开/闭标签 <...> 或自闭合标签 <.../>
    // 2. 忽略可能误判的比较操作，如 `i < j`
    // 这个正则查找一个'<'符号，后面不能是'!' (注释)或'=' (小于等于)，
    // 并且后面跟着一个合法的标签名（字母开头）或闭合标签'/'。
    // 这比简单的 /<...>/ 更可靠。
    const jsxRegex = /<(?![\s!=])([a-zA-Z][a-zA-Z0-9-]*|\/|)/;
    return jsxRegex.test(text);
  };

  /**
   * 检查代码是否包含 TypeScript 语法。
   * 这是一个启发式检查，查找TS独有的关键字和语法模式。
   */
  const containsTypeScript = (text) => {
    // 检查点 1: 类型/接口定义（非常明确的信号）
    // 匹配 `type MyType = ...` 或 `interface MyInterface { ... }`
    const typeDefinitionRegex = /\b(interface|type)\s+[A-Z][a-zA-Z0-9]*\b/;
    if (typeDefinitionRegex.test(text)) {
      return true;
    }

    // 检查点 2: 变量或参数的类型注解（强信号）
    // 匹配 `: string`, `: number`, `: MyType` 等
    // 这个正则查找一个冒号，后面跟着一个类型（通常大写字母开头或ts内置类型）
    const typeAnnotationRegex = /:\s*([A-Z][a-zA-Z0-9<>.]*|string|number|boolean|any\[?\]?)/;
    if (typeAnnotationRegex.test(text)) {
      return true;
    }

    // 检查点 3: 其他TS关键字
    // 匹配 `as someType`, `implements`, `private`, `public`, `protected` 等
    const tsKeywordsRegex = /\b(as|implements|private|public|protected|readonly)\s+[a-zA-Z]/;
    if (tsKeywordsRegex.test(text)) {
      return true;
    }

    return false;
  };

  // --- 决策逻辑 ---

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


export function wrap2VisionSnap (codeBlock: string = '') {
  const ext = getLanguageExtension(codeBlock);
  const mainFile = `/src/index.${ext}`;
  const appFile = `/src/App.${ext}`;
  const dependencies = generateDependencies(codeBlock);
  const rootElementType = dependencies['@antv/f2'] ? 'canvas' : 'div';
  const dependenciesJSON = {
    "name": "AntV-adapted-project",
    "version": "1.0.0",
    "main": mainFile,
    "dependencies": dependencies
};
  return {
    modules: {
      '/package.json': {
        fpath: '/package.json',
        code: JSON.stringify(dependenciesJSON, null, 2)
      },
      [mainFile]: {
        fpath: mainFile,
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
  import('./App.${ext}');

}
      `
      },
      [appFile]: {
        fpath: [appFile],
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

