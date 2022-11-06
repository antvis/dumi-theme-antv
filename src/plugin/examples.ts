import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';
import fm from 'front-matter';

import { Demo, Example, ExampleTopic } from '../types';

const examplesBaseDir = path.resolve(process.cwd(), 'examples');

/**
 * 获取某个案例下所有的 DEMO
 *
 * @param {string} exampleDir 案例路径
 * @returns {Demo[]} DEMO 列表
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const getExampleDemos = (exampleDir: string) => {
  const demoMetaJSON = fs
    .readFileSync(path.resolve(exampleDir, 'demo', 'meta.json'))
    .toString();
  const demoMeta: any[] = JSON.parse(demoMetaJSON).demos;
  const demos: Demo[] = demoMeta.map((item) => {
    const { title, screenshot, filename, new: isNew } = item;
    const id = filename
      .replace(/\.tsx?$/, '')
      .replace(/\.ts?$/, '')
      .replace(/\.jsx?$/, '')
      .replace(/\.js?$/, '');
    return {
      id,
      screenshot,
      source: fs
        .readFileSync(path.resolve(exampleDir, 'demo', filename))
        .toString(),
      title,
      filename,
      isNew: !!isNew
    };
  });
  return demos;
};

/**
 * 获取某个案例主题下面的所有案例
 *
 * @param {string} topicPath 案例主题路径
 * @returns {Example[]} 案例列表
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
const getTopicExamples = (topicPath: string) => {
  const examplePaths = glob.sync(`${topicPath}/*`).filter((item) => {
    return !item.endsWith('.js');
  });

  return examplePaths.map((item) => {
    const exampleMetaZh = fs
      .readFileSync(path.resolve(item, 'index.zh.md'))
      .toString();
    const exampleMetaEn = fs
      .readFileSync(path.resolve(item, 'index.en.md'))
      .toString();
    const exampleMetaZhContent: Record<string, any> = fm(exampleMetaZh);
    const exampleMetaEnContent: Record<string, any> = fm(exampleMetaEn);

    const example: Example = {
      demos: getExampleDemos(item),
      // 二级暂时无须 ICON，保留
      icon: '',
      id: <string>item.split('/').pop(),
      title: {
        en: exampleMetaEnContent.attributes.title,
        zh: exampleMetaZhContent.attributes.title
      },
      childrenKey: 'demos',
      order: exampleMetaZhContent.attributes.order || 0,
    };
    return example;
  }).sort((a, b) => a.order - b.order);
};

/**
 * 获取案例页面的所有主题
 *
 * @returns {ExampleTopic[]} 案例主题列表
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
export const getExamplesPageTopics = (
  exampleTopics: ExampleTopic[]
) => {
  return exampleTopics.map(
    ({ id, slug, title, icon }: ExampleTopic) => {
      const nid = (id || slug) as string;
      let examples: Example[] = [];
      try {
        examples = getTopicExamples(path.join(examplesBaseDir, nid));
      } catch (e) {
        console.warn(e);
      }
      return {
        id: nid,
        title,
        icon,
        examples,
        childrenKey: 'examples'
      };
    }
  );
};

/**
 * 根据目录结构返回，所有的 example 页面，用于 buiild static
 */
export function getExamplePaths() {
  const exampleTopicPaths = glob.sync(`${examplesBaseDir}/*/*`);
  const paths =  exampleTopicPaths.map(p => p.replace(process.cwd(), ''));
  return [
    ...paths,
    ...paths.map(p => `/zh${p}`),
    ...paths.map(p => `/en${p}`),
  ]
}