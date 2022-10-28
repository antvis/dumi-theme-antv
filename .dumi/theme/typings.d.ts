declare module '\*.jpg' {
  const content: string;
  export default content;
}

declare module '\*.png' {
  const content: string;
  export default content;
}

declare module '\*.json' {
  const content: string;
  export default content;
}

declare module '\*.less' {
  const content: any;
  export default content;
}

declare module '\*.svg' {
  const content: any;
  export default content;
}

declare namespace ExamplesPage {
  /** 案例 DEMO */
  export interface Demo {
    /**
     * id
     */
    id: string;

    /**
     * 标题（支持国际化）
     */
    title: {
      zh: string;
      en: string;
    };

    /**
     * 截图
     */
    screenshot: string;

    /**
     * TypeScript 源码文件
     */
    source: string;

    /**
     * DEMO 代码文件名称
     */
    filename: string;
    
    /**
     * 衍生属性，通过 topic.id + example.id + demo.id 可以计算获取
     */
    relativePath?: string;
  }

  /** 示例 */
  export interface Example {
    /**
     * id
     */
    id: string;

    /**
     * 标题（支持国际化）
     */
    title: {
      zh: string;
      en: string;
    };

    /**
     * 图标
     */
    icon: string;

    /**
     * DEMO
     */
    demos: Demo[];
  }

  /** 案例主题 */
  export interface ExampleTopic {
    /**
     * id
     */
    id: string;

    /**
     * 标题
     */
    title: {
      zh: string;
      en: string;
    };

    /**
     * 图标
     */
    icon: string;

    /**
     * 所有案例
     */
    examples: Example[];
  }
}

/**
 * 配置文件中的国际化配置
 */
export type IC = string | {
  zh: string;
  en: string;
}
