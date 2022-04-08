# dumi-theme-antv

dumi theme for antv site

## Install

```
yarn add @antv/dumi-theme-antv --save-dev

```

## Usage

> Refer to the documentation for the [Dumi theme](https://d.umijs.org/zh-CN/config#themeconfig)

<strong >note ⚠️<strong>
Since `*.module.less` is used in `@antv/dumi-theme-antv`, extraBabelIncludes needs to be configured:

```tsx
export default {
  //...
  mode: "site",
  extraBabelIncludes: ["@antv/dumi-theme-antv"],
};
```

## Contributing

### Development install

- start `@antv/dumi-theme-antv`

```bash
- 1. git clone https://github.com/antvis/dumi-theme-antv.git
- 2. yarn  // install deps
- 3. npm run start //start dev

```

- start demo of antv sub product site

```bash

- 1. npm link

- 2. cd site

- 3. note: remove `@antv/dumi-theme-antv` from `devDependencies` in `package.json`

- 4. yarn // install deps

- 5. npm link @antv/dumi-theme-antv

- 6. npm run start
```
