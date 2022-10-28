import { map } from 'lodash-es';

/**
 * 将数据结构转化成 map，便于后续检索的速度
 * @param exampleTopics 
 * @returns 
 */
export function getExampleTopicMap(exampleTopics: ExamplesPage.ExampleTopic[]) {
  const exampleTopicMap = new Map<string, ExamplesPage.Demo>();

  map(exampleTopics, (({ id: topic, examples }) => {
    map(examples, ({ id: example, demos }) => {
      map(demos, (demo) => {
        exampleTopicMap.set(`${topic}-${example}-${demo.id}`, {
          ...demo,
          relativePath: `${topic}/${example}/demo/${demo.filename}`,
        });
      });
    });
  }));

  return exampleTopicMap;
}

/**
 * 从 Context 信息中，获取到 Example 相关的信息，用于页面渲染
 */
export function getDemoInfo(exampleTopics: ExamplesPage.ExampleTopic[], topic: string, example: string, demo: string): ExamplesPage.Demo {
  const m = getExampleTopicMap(exampleTopics);

  return m.get(`${topic}-${example}-${demo}`);
}