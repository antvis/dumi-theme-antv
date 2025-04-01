import { css, Global } from '@emotion/react';
import React from 'react';

export default () => {
  return (
    <Global
      styles={css`
        .ant-btn-text {
          color: rgba(0, 0, 0, 0.85);
          border-color: transparent;
          background: transparent;
          box-shadow: none;
        }
      `}
    />
  );
};
