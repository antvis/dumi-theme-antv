import React from 'react';

import styles from './SendButton.module.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
  tip?: string;
}

function SendButton(props: SendButtonProps) {
  const { onClick, disabled, tip } = props;

  return (
    <Tooltip title={disabled ? tip : null}>
      <img
        className={classnames(styles.actionBtn, {
          [styles.disabled]: disabled,
        })}
        onClick={() => {
          !disabled && onClick();
        }}
        src={
          disabled
            ? 'https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*MzQBS6rzlygAAAAAJ8AAAAgAeriAAQ/original'
            : 'https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*gXFNTJTBx0oAAAAANwAAAAgAeriAAQ/original'
        }
      />
    </Tooltip>
  );
}

export { SendButton };
