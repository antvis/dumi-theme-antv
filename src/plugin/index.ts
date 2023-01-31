import * as path from 'path';
import type { IApi } from 'dumi';
import { getExamplesPageTopics, getExamplePaths } from './examples';
import { myResolve } from './utils';

export default (api: IApi) => {
  api.describe({ key: `dumi-theme:${require('../../package.json').name}` });

  api.modifyDefaultConfig((memo) => {
    // use passive mode for code blocks of markdown, to avoid dumi compile theme as react component
    memo.resolve.codeBlockMode = 'passive';
    
    // disable force kebab-case routing, respect naming from file system
    memo.resolve.forceKebabCaseRoutes = false;

    // add exportStatic .html
    memo.exportStatic.extraRoutePaths = getExamplePaths();

    // mfsu
    memo.mfsu = false;
    // 部署到 gh-pages 后，打开白屏，怀疑是 gzip 导致，所以换一个混淆器
    memo.jsMinifier = 'terser';

    // 网站 favicon
    memo.favicons = ['https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original'];

    return memo;
  });

  const pages = [
    {
      id: 'dumi-theme-antv-homepage',
      absPath: '/',
    },
    {
      id: 'dumi-theme-antv-en-homepage',
      absPath: '/en/',
    },
     {
      id: 'dumi-theme-antv-zh-homepage',
      absPath: '/zh/',
    },
    // Examples gallery page.
    {
      id: 'dumi-theme-antv-example-list-zh',
      absPath: '/examples',
      file: myResolve('../pages/Examples/index.tsx'),
    },
    {
      id: 'dumi-theme-antv-example-list-lang',
      absPath: '/:language/examples',
      file: myResolve('../pages/Examples/index.tsx'),
    },
    // single example preview page.
    {
      id: 'dumi-theme-antv-single-example-zh',
      absPath: '/examples/:topic/:example',
      file: myResolve('../pages/Example/index.tsx'),
    },
    {
      id: 'dumi-theme-antv-single-example-lang',
      absPath: '/:language/examples/:topic/:example',
      file: myResolve('../pages/Example/index.tsx'),
    },
  ];
  // FIXME: wrap winPath for windows when dumi exported
  const contextFilePath = myResolve('../context.ts');

  api.onGenerateFiles(() => {
    // write context provider when generate tmp file
    api.writeTmpFile({
      noPluginDir: true,
      path: 'theme-antv/ContextWrapper.tsx',
      content: `
import React from 'react';
import { useOutlet, useSiteData } from 'dumi';
import { ThemeAntVContext } from '${contextFilePath}';

export default function ThemeAntVContextWrapper() {
  const outlet = useOutlet();

  return (
    <ThemeAntVContext.Provider
      value={{
        meta: ${JSON.stringify({
          exampleTopics: getExamplesPageTopics(api.config.themeConfig.examples || []),
        })}
      }}
    >
      {outlet}
    </ThemeAntVContext.Provider>
  );
}
      `,
    });
  });

  // wrap context for all pages
  api.addLayouts(() => ({
    id: 'theme-antv-context',
    file: `${api.paths.absTmpPath}/theme-antv/ContextWrapper.tsx`,
  }));

  // add custom pages
  api.modifyRoutes((routes) => {
    pages.forEach((page) => {
      routes[page.id] = {
        id: page.id,
        path: page.absPath.slice(1),
        absPath: page.absPath,
        file: page.file,
        parentId: 'DocLayout',
      };
    });

    // replace default 404
    routes['404'].file = myResolve('../pages/404.tsx');

    return routes;
  });

  // watch the `examples` folder
  api.addTmpGenerateWatcherPaths(() => [path.resolve(process.cwd(), 'examples')]);
};
