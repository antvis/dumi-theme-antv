import React from 'react';

import styles from './index.module.less';
import {FileIcons} from "../../../constant";

interface DatasourceCardProps {
  type: 'FILE' | 'IMAGE';
  title: string;
  desc?: string;
  onDelete?: () => void;
}

function DatasourceCard(props: DatasourceCardProps) {
  const { type, title, desc, onDelete } = props;

  return (
    <div className={styles.datasourceCard}>
      <img src={FileIcons[type]} alt={type} />
      <div className={styles.title} title={title}>
        {title}
      </div>
      {desc && <div className={styles.desc}>{desc}</div>}

      {onDelete && (
        <img
          className={styles.delete}
          onClick={onDelete}
          src="https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*xfBPTJxWAjoAAAAAAAAAAAAAeriAAQ/original"
        />
      )}
    </div>
  );
}

export { DatasourceCard };
