import type { IApi } from 'dumi';
import * as fs from 'fs-extra';
import * as path from 'path';
import { getExamplesPageTopics } from './examples';

function generateMetaJSON() {
  const res = getExamplesPageTopics();
  const content = fs.readFileSync(path.resolve(process.cwd(), 'site-config.json')).toString();
  return {
    ...JSON.parse(content),
    exampleTopics: res,
  };
}

export default (api: IApi) => {
  const pages = [
    // Examples gallery page.
    {
      id: 'dumi-theme-antv-example-list-zh',
      path: '/examples/',
      file: require.resolve('./.dumi/theme/pages/Examples/index.tsx'),
    },
    {
      id: 'dumi-theme-antv-example-list-lang',
      path: '/:language/examples/',
      file: require.resolve('./.dumi/theme/pages/Examples/index.tsx'),
    },
    // single example preview page.
    {
      id: 'dumi-theme-antv-single-example-zh',
      path: '/examples/:topic/:example',
      file: require.resolve('./.dumi/theme/pages/Example/index.tsx'),
    },
    {
      id: 'dumi-theme-antv-single-example-lang',
      path: '/:language/examples/:topic/:example',
      file: require.resolve('./.dumi/theme/pages/Example/index.tsx'),
    },
  ];
  // FIXME: wrap winPath for windows when dumi exported
  const contextFilePath = require.resolve('./.dumi/theme/context.ts');

  api.onGenerateFiles(() => {
    // write context provider when generate tmp file
    api.writeTmpFile({
      noPluginDir: true,
      path: 'theme-antv/ContextWrapper.tsx',
      content: `
import { useOutlet } from 'dumi';
import { ThemeAntVContext } from '${contextFilePath}';

export default function ThemeAntVContextWrapper() {
  const outlet = useOutlet();

  return (
    <ThemeAntVContext.Provider
      value={{
        meta: ${JSON.stringify(generateMetaJSON())}
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
    routes['404'].file = require.resolve('./.dumi/theme/pages/404.tsx');

    return routes;
  });
};
