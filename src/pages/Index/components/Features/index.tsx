import cx from 'classnames';
import React from 'react';
import { ic } from '../../../../slots/hooks';
import FeatureCard from './FeatureCard';
import styles from './index.module.less';

interface Card {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  title?: string;
  features: Card[];
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const Features: React.FC<FeaturesProps> = ({ title, features = [], className, style, id }) => {
  return (
    <div id={id} className={cx(styles.wrapper, className)} style={style}>
      <div className={styles.content}>
        <div key="content">
          <p key="title" className={styles.title}>
            {title ? ic(title) : ''}
          </p>
          <div key="block" className={styles.cardsContainer}>
            <div className={styles.cardsGrid}>
              {features.map((card) => (
                <div key={ic(card.title)} className={styles.cardWrapper}>
                  <FeatureCard {...card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
