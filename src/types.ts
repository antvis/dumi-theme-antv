export interface IThemeConfig {
  [key: string]: any;
}

export type Status = 'responded' | 'error' | 'timeout';

/**
 * 配置文件中的国际化配置
 */
export type IC =
  | string
  | {
      zh: string;
      en: string;
    };

export interface TreeNode {
  /**
   * id
   */
  id: string;

  /**
   * 孩子节点 key
   */
  childrenKey?: string;

  /**
   * 标题（支持国际化）
   */
  title: {
    zh: string;
    en: string;
  };

  [key: string]: any;
}

/** 案例 DEMO */
export interface Demo extends TreeNode {
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

  /**
   * 是否为新品
   */
  isNew?: boolean;

  /**
   * 目标 example
   */
  targetExample?: Example;

  /**
   * 目标主题
   */
  targetTopic?: ExampleTopic;
}

/** 示例 */
export interface Example extends TreeNode {
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
export interface ExampleTopic extends TreeNode {
  /**
   * 图标
   */
  icon: string;

  /**
   * slug 和 id 一样，兼容旧配置
   */
  slug?: string;

  /**
   * 所有案例
   */
  examples: Example[];
}

export type MenuItem = {
  type: any;
  key: string;
  label?: string | React.ReactNode;
  slug?: string;
  title: string;
  order: number;
  link?: string;
  children?: MenuItem[];
  /**
   * 是否显示文章目录
   */
  showToc?: boolean;
};

export type SidebarData = MenuItem[];

export type FullSidebarData = {
  [key: string]: SidebarData;
};

export interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  mode?: 'implement' | 'solve';
  lib?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

// 定义整个应用的状态树结构
export interface AIChatState {
  // 数据初始化状态
  isInitialized: boolean;

  // 需要持久化的数据
  anonymousUserId: string | null;
  sessions: ChatSession[];
  // appSettings: AppSettings;

  // 运行时状态 (不需要持久化)
  activeSessionId: string | null;
  tempMessage: Message | null;
  codeBlock: string | null;
}
