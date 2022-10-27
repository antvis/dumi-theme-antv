import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';
import fm from 'front-matter';

const examplesBaseDir = path.resolve(process.cwd(), 'examples');

/**
 * 获取某个案例下所有的 DEMO
 *
 * @param {string} exampleDir 案例路径
 * @returns {ExamplesPage.Demo[]} DEMO 列表
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const getExampleDemos = (exampleDir: string) => {
  const demoMetaJSON = fs.readFileSync(path.resolve(exampleDir, 'demo', 'meta.json')).toString();
  const demoMeta: any[] = JSON.parse(demoMetaJSON).demos;
  const demos: ExamplesPage.Demo[] = demoMeta.map(item => {
    const { title, screenshot, filename } = item;
    const id = filename.replace(/\.tsx?$/, '');
    return {
      id,
      screenshot,
      source: fs.readFileSync(path.resolve(exampleDir, 'demo', filename)).toString(),
      title,
    };
  });
  return demos;
};


/**
 * 获取某个案例主题下面的所有案例
 *
 * @param {string} topicPath 案例主题路径
 * @returns {ExamplesPage.Example[]} 案例列表
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const getTopicExamples = (topicPath: string) => {
  const examplePaths = glob.sync(`${topicPath}/*`).filter(item => {
    return !item.endsWith('.js');
  });

  return examplePaths.map(item => {
    const exampleMetaZh = fs.readFileSync(path.resolve(item, 'index.zh.md')).toString();
    const exampleMetaEn = fs.readFileSync(path.resolve(item, 'index.en.md')).toString();
    const exampleMetaZhContent: Record<string, any> = fm(exampleMetaZh);
    const exampleMetaEnContent: Record<string, any> = fm(exampleMetaEn);

    const example: ExamplesPage.Example = {
      demos: getExampleDemos(item),
      // 二级暂时无须 ICON，保留
      icon: '',
      id: <string>item.split('/').pop(),
      title: {
        en: exampleMetaEnContent.title,
        zh: exampleMetaZhContent.title,
      },
    };
    return example;
  });
};

/**
 * 获取案例页面的所有主题
 *
 * @returns {ExamplesPage.ExampleTopic[]} 案例主题列表
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
export const getExamplesPageTopics = () => {
  // 最外层目录
  const exampleTopicPaths = glob.sync(`${examplesBaseDir}/*`);
  return exampleTopicPaths
    .map((topicPath) => {
      const topicMetaPath = path.resolve(topicPath, 'meta.js');
      const topicMeta: ExamplesPage.ExampleTopic = require(topicMetaPath);
      // 追加所有的 examples
      topicMeta.examples = getTopicExamples(topicPath);
      return topicMeta;
    });
};
