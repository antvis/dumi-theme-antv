import React from 'react';
import cx from 'classnames';
import styles from './FeatureCard.module.less';
import { useT } from '../hooks';

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <img
          className={cx(styles.icon, 'feature-logo')}
          src={icon}
          alt="advantage"
        />
        <p className={styles.title}>{useT(title)}</p>
        <p className={styles.description}>{useT(description)}</p>
      </div>
    </div>
  );
};

export default FeatureCard;