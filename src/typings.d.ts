declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: string;
  export default content;
}

declare module '*.module.less' {
  const classes: any;
  export default classes;
}

declare module '*.less' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

/**
 * 由构建工具注入的包版本号。
 * @see fatherrc.ts
 */
declare const __PACKAGE_VERSION__: string;
