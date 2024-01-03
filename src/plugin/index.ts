import type { IApi } from 'dumi';
import { winPath } from 'dumi/plugin-utils';
import * as path from 'path';
import { getExamplePaths, getExamplesPageTopics } from './examples';
import rehypeObservable from './rehypeObservable';

const PAGES_DIR = winPath(path.join(__dirname, '../pages'));
const MOCK_META = { frontmatter: { title: 'mock-meta' }, texts: [], toc: [] };

export default (api: IApi) => {
  api.describe({ key: `dumi-theme:${require('../../package.json').name}` });

  api.modifyDefaultConfig((memo) => {
    // use passive mode for code blocks of markdown, to avoid dumi compile theme as react component
    memo.resolve.codeBlockMode = 'passive';

    // add exportStatic .html
    memo.exportStatic.extraRoutePaths = getExamplePaths();

    // mfsu
    memo.mfsu = false;
    // 部署到 gh-pages 后，打开白屏，怀疑是 gzip 导致，所以换一个混淆器
    memo.jsMinifier = 'terser';

    // 网站 favicon
    memo.favicons = [
      'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original',
    ];

    // observable demo
    memo.extraRehypePlugins = [rehypeObservable];

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
      file: `${PAGES_DIR}/Examples`,
    },
    {
      id: 'dumi-theme-antv-example-list-lang',
      absPath: '/:language/examples',
      file: `${PAGES_DIR}/Examples`,
    },
    // single example preview page.
    {
      id: 'dumi-theme-antv-single-example-zh',
      absPath: '/examples/:topic/:example',
      file: `${PAGES_DIR}/Example`,
    },
    {
      id: 'dumi-theme-antv-single-example-lang',
      absPath: '/:language/examples/:topic/:example',
      file: `${PAGES_DIR}/Example`,
    },
  ];

  api.onGenerateFiles(() => {
    // write context provider when generate tmp file
    api.writeTmpFile({
      noPluginDir: true,
      path: 'theme-antv/ContextWrapper.tsx',
      content: `
import React from 'react';
import { useOutlet, useSiteData } from 'dumi';
import { ThemeAntVContext } from '${winPath(
        path.join(__dirname, '../context'),
      )}';

export default function ThemeAntVContextWrapper() {
  const outlet = useOutlet();

  return (
    <ThemeAntVContext.Provider
      value={{
        meta: ${JSON.stringify({
          exampleTopics: getExamplesPageTopics(
            api.config.themeConfig.examples || [],
            api.userConfig.themeConfig.showAPIDoc,
          ),
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
        meta: MOCK_META,
      };
    });

    // replace default 404
    routes['404'].file = `${PAGES_DIR}/404`;
    routes['404'].meta = MOCK_META;

    return routes;
  });

  // watch the `examples` folder
  api.addTmpGenerateWatcherPaths(() => [
    path.resolve(process.cwd(), 'examples'),
  ]);
};
