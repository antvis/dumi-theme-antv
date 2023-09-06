import { map } from 'lodash-es';
import { transform } from '@babel/standalone';
import { Demo, ExampleTopic } from '../../types';

/**
 * 将数据结构转化成 map，便于后续检索的速度
 * @param exampleTopics
 * @returns
 */
export function getExampleTopicMap(exampleTopics: ExampleTopic[]) {
  const exampleTopicMap = new Map<string, Demo>();

  map(exampleTopics, ((topic) => {
    map(topic.examples, (example) => {
      map(example.demos, (demo) => {
        exampleTopicMap.set(`${topic.id}-${example.id}-${demo.id}`, {
          ...demo,
          relativePath: `${topic.id}/${example.id}/demo/${demo.filename}`,
          targetExample: example,
          targetTopic: topic,
        });
      });
    });
  }));

  return exampleTopicMap;
}

/**
 * 从 Context 信息中，获取到 Example 相关的信息，用于页面渲染
 */
export function getDemoInfo(exampleTopics: ExampleTopic[], topic: string, example: string, demo: string) {
  const m = getExampleTopicMap(exampleTopics);

  return m.get(`${topic}-${example}-${demo}`);
}

export function replaceInsertCss(str: string, lang: string) {
  const comment =
    lang === 'zh'
      ? `// 我们用 insert-css 演示引入自定义样式
// 推荐将样式添加到自己的样式文件中
// 若拷贝官方代码，别忘了 npm install insert-css
insertCss(`
      : `// We use 'insert-css' to insert custom styles
// It is recommended to add the style to your own style sheet files
// If you want to copy the code directly, please remember to install the npm package 'insert-css
insertCss(`;
  // 统一增加对 insert-css 的使用注释
  return str.replace(/^insertCss\(/gm, comment);
}

/**
 * 编译代码
 */
export function compile(value: string, relativePath: string, es5 = true) {
  const { code } = transform(value, {
    filename: relativePath,
    presets: [
      'react',
      'typescript',
      es5 ? 'es2015' : 'es2016',
      ['stage-3', { decoratorsBeforeExport: true }],
    ],
    plugins: ['transform-modules-umd'],
  });
  return code;
}
