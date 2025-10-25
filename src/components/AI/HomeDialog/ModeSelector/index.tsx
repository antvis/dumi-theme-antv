import classnames from 'classnames';
import React from 'react';
import styles from './index.module.less';
import {AIMode, AIModeMeta, AIModeType} from "../../constant";
import { FormattedMessage } from 'dumi';

export interface DatasetSelectorProps {
  size?: 'default' | 'compact';
  value: AIModeType;
  onChange: (_mode: AIModeType) => void;
}

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
              const meta = AIModeMeta[mode];
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
                  <FormattedMessage id={meta.name} />
                </div>
              );
            },
          )}
        </div>
      </div>
    );
  }
