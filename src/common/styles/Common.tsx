import { css, Global } from '@emotion/react';
import React from 'react';

export default () => {
  return (
    <Global
      styles={css`
        :root {
          --container-max-width: 1440px;
          --container-padding-large: 80px;
          --container-padding-medium: 80px;
          --container-padding-small: 32px;
          --primary-color: #873bf4;
          --toc-width: 260px;
          --border-color-split: #f0f0f0;
          --text-color-secondary: rgba(0, 0, 0, 0.45);
          --text-color: rgba(0, 0, 0, 0.85);
          --font-family: AlibabaPuHuiTiRHeavy, sans-serif;
        }

        @font-face {
          font-family: AlibabaPuHuiTiRHeavy;
          src: url(../../font/Alibaba-PuHuiTi-Heavy.otf);
        }

        body {
          margin: 0;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
            sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          font-variant: tabular-nums;
          line-height: 1.5715;
          background-color: #fff;
          font-feature-settings: 'tnum';
          text-decoration: none;
        }

        a {
          text-decoration: none;
          background-color: transparent;
          outline: none;
          cursor: pointer;
          transition: color 0.3s;
          -webkit-text-decoration-skip: objects;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          > a[aria-hidden]:first-child {
            float: left;
            width: 20px;
            font-size: 0;
            line-height: inherit;
            text-align: right;
            padding-inline-end: 6px;
            margin-inline-start: -20px;

            &:hover {
              border: 0;
            }

            > .icon-link::before {
              font-size: 20px;
              content: '#';
            }
          }

          &:not(:hover) > a[aria-hidden]:first-child > .icon-link {
            visibility: hidden;
          }
        }

        /* 非常关键，用于 react-split-pane 的样式，如果没有，会没有办法鼠标拖拽 */
        /* 参考：https://codesandbox.io/s/mow7x4zyqx */
        .Pane1,
        .Pane2 {
          overflow: auto;
        }

        .Resizer {
          z-index: 1;
          box-sizing: border-box;
          background: #000;
          background-clip: padding-box;
          opacity: 0.1;

          &:hover {
            transition: all 2s ease;
          }

          &.horizontal {
            width: 100%;
            height: 11px;
            margin: -5px 0;
            border-top: 5px solid rgba(255, 255, 255, 0);
            border-bottom: 5px solid rgba(255, 255, 255, 0);
            cursor: row-resize;

            &:hover {
              border-top: 5px solid rgba(0, 0, 0, 0.5);
              border-bottom: 5px solid rgba(0, 0, 0, 0.5);
            }
          }

          &.vertical {
            width: 11px;
            margin: 0 -5px;
            border-right: 5px solid rgba(255, 255, 255, 0);
            border-left: 5px solid rgba(255, 255, 255, 0);
            cursor: col-resize;

            Pane2 {
              border-left: 1px solid #e6e6e6;
            }

            &:hover {
              border-right: 5px solid rgba(0, 0, 0, 0.5);
              border-left: 5px solid rgba(0, 0, 0, 0.5);
            }
          }

          &.disabled {
            cursor: not-allowed;

            &:hover {
              border-color: transparent;
            }
          }
        }

        /* 段落反馈 Icon */
        .comment-link {
          font-size: 0.8em;
          float: right;
          color: #6d7c92;
          transform: scale(0.9);
          transition: background 0.3s, color 0.3s;

          &:hover {
            color: #873bf4;
            background-color: #f8f1ff;
            cursor: pointer;
            border-radius: 2px;
          }
        }
      `}
    />
  );
};
