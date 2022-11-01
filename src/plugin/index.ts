import type { IApi } from 'dumi';
import { getExamplesPageTopics } from './examples';
import { myResolve } from './utils';

export default (api: IApi) => {
  api.describe({ key: `dumi-theme:${require('../../package.json').name}` });

  const pages = [
    // Examples gallery page.
    {
      id: 'dumi-theme-antv-example-list-zh',
      path: '/examples/',
      file: myResolve('../pages/Examples/index.tsx'),
    },
    {
      id: 'dumi-theme-antv-example-list-lang',
      path: '/:language/examples/',
      file: myResolve('../pages/Examples/index.tsx'),
    },
    // single example preview page.
    {
      id: 'dumi-theme-antv-single-example-zh',
      path: '/examples/:topic/:example',
      file: myResolve('../pages/Example/index.tsx'),
    },
    {
      id: 'dumi-theme-antv-single-example-lang',
      path: '/:language/examples/:topic/:example',
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
  // const { themeConfig } = useSiteData();
  // const exampleTopics = themeConfig?.examples || [];

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
        path: page.path,
        absPath: page.path,
        file: page.file,
        parentId: 'DocLayout',
      };
    });

    // replace default 404
    routes['404'].file = myResolve('../pages/404.tsx');

    return routes;
  });
};
