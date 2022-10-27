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
     * 路径
     */
    slug: string;

    /**
     * 截图
     */
    screenshot: string;

    /**
     * TypeScript 源码文件
     */
    source: string;
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
