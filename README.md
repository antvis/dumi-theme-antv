# @antv/dumi-theme-antv

[![NPM version](https://img.shields.io/npm/v/@antv/dumi-theme-antv.svg?style=flat)](https://npmjs.org/package/@antv/dumi-theme-antv) [![NPM downloads](http://img.shields.io/npm/dm/@antv/dumi-theme-antv.svg?style=flat)](https://npmjs.org/package/@antv/dumi-theme-antv)

A theme package for the [dumi](https://next.d.umijs.org) framework, serving AntV official websites including G2, G6, X6, F2, S2, L7, and more.

[dumi](https://next.d.umijs.org) 框架的主题包，服务于 AntV 官网，包括 G2、G6、X6、F2、S2、L7 等等。

## Usage / 用法

Install this theme into `devDependencies`:

安装此主题到 `devDependencies`：

```bash
$ npm i @antv/dumi-theme-antv -D
```

Configure it in dumi config file `.dumirc.ts`:

在 dumi 配置文件 `.dumirc.ts` 中配置：

```ts
import { defineConfig } from 'dumi';

export defineConfig({
  themeConfig: {
    ...
  },
});
```

That's all, now you can execute `dumi dev` and enjoy this theme.

这就行了，现在你可以执行 `dumi dev` 并享受这个主题了。

## Options / 选项

TODO

`themeConfig.docsearchOptions.sort` creates a sorting rule for search results. This can be defined using an array of strings.

`themeConfig.docsearchOptions.sort` 用于配置搜索结果的排序规则。可以通过字符串数组来定义排序逻辑。

- Each string can be a path segment used to match the link of search results.
- If a string starts with `!`, it means results NOT containing that path segment should be ranked before those that do.

- 每个字符串可以是一个路径片段，用于匹配搜索结果的链接。
- 如果字符串以 `!` 开头，则表示不包含该路径片段的结果应排在包含该路径片段的结果之前。

## Development / 开发

```bash
$ npm install
```

If you want to test locally, it is recommended to `npm link` directly to the corresponding AntV official website project for testing, so that HMR (Hot Module Replacement) works. Testing directly using this project (e.g. in `example`) does not support HMR.

如果想本地测试，建议直接通过 `npm link` 到对应的 AntV 官网项目中测试，这样才有热更新 (HMR)。直接使用本项目测试（如 `example` 目录）是没有热更新的。

dumi theme development documentation: https://next.d.umijs.org/theme

dumi 主题开发文档：https://next.d.umijs.org/theme

## Release / 发布

This project uses GitHub Actions for automated releasing and [Trusted Publishing](https://docs.npmjs.com/trusted-publishers).

本项目使用 GitHub Actions 进行自动化发布，并采用了 [可信发布 (Trusted Publishing)](https://docs.npmjs.com/trusted-publishers)。

To publish a new version, simply push a git tag:

发布新版本只需推送一个 git tag：

```bash
# for stable release / 正式发布
git tag v0.8.0
git push origin v0.8.0

# for pre-release (auto-tagged as beta/alpha/etc on npm based on the suffix)
# 预发布（根据后缀自动在 npm 标记为 beta/alpha 等）
git tag v0.8.0-beta.1
git push origin v0.8.0-beta.1
```

The CI will automatically:
1. Parse the version from the tag.
2. Build the project.
3. Publish to npm (with provenance).
4. Create a GitHub Release.

CI 将会自动：
1. 从 tag 中解析版本号。
2. 构建项目。
3. 发布到 npm（带有 provenance）。
4. 创建 GitHub Release。

## LICENSE

MIT
