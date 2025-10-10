module.exports = {
  // 继承 umi 的 lint 配置，这是基础
  extends: require.resolve('@umijs/lint/dist/config/eslint'),

  rules: {
    // 1. 首先，禁用 ESLint 原生的 no-unused-vars 规则
    //    因为 @typescript-eslint/no-unused-vars 提供了更强大的替代方案
    'no-unused-vars': 'off',

    // 2. 然后，配置 @typescript-eslint 的版本
    '@typescript-eslint/no-unused-vars': [
      'error', // 或者 'warn'，根据你的偏好
      {
        // 'vars': 'all' (默认) - 检查所有变量
        // 'args': 'after-used' (默认) - 只检查最后一个使用参数之后的未使用的参数

        // 忽略以 'React' 命名的变量（通常用于 JSX 工厂函数）
        // 比如 import React from 'react';
        varsIgnorePattern: '^_|React$',

        // 忽略以下划线 (_) 开头的函数参数
        // 这将解决你在 interface 和 type 定义中遇到的问题
        argsIgnorePattern: '^_',

        // 可选：如果你也想捕获所有未使用的参数，而不仅仅是最后一个，可以设置
        // args: 'all',
      },
    ],
  },
};
