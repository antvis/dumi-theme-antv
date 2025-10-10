import classnames from 'classnames';
import React, {
  ReactNode,
} from 'react';
import styles from './index.module.less';
import {BarChartOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {AIMode, AIModeType} from "../../constant";

export interface DatasetSelectorProps {
  size?: 'default' | 'compact';
  value: AIModeType;
  onChange: (_mode: AIModeType) => void;
}

export const BUTTON_META: Record<
    AIModeType,
  { name: string; icon: ReactNode }
> = {
    implement: {
    name: '可视化研发',
    icon: <BarChartOutlined />,
  },
  solve: {
    name: '可视化答疑',
    icon: <QuestionCircleOutlined />,
  },
};

export const ModeSelector =
  ({ value, size, onChange }: DatasetSelectorProps) => {

    return (
      <div
        className={classnames(styles.datasetSelector, {
          [styles.compact]: size === 'compact',
        })}
      >
        <div className={styles.typeSwitcher}>
          {[AIMode.implement, AIMode.solve].map(
            (mode) => {
              const meta = BUTTON_META[mode];
              return (
                <div
                  key={mode}
                  className={classnames(styles.switchBtn, {
                    [styles.active]: mode === value,
                  })}
                  onClick={() => {
                    if (mode !== value) {
                      onChange(mode);
                    }
                  }}
                >
                  {meta.icon}
                  <span>{meta.name}</span>
                </div>
              );
            },
          )}
        </div>
      </div>
    );
  }
