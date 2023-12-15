import React from 'react';
import { Row, Col } from 'antd';
import cx from 'classnames';
import FeatureCard from './FeatureCard';
import styles from './index.module.less';
import { ic } from '../hooks';

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

export const Features: React.FC<FeaturesProps> = ({
  title,
  features = [],
  className,
  style,
  id,
}) => {
  const getCards = () => {
    const children = features.map(card => (
      <Col className={styles.cardWrapper} key={ic(card.title)} md={8} xs={24}>
        <FeatureCard {...card} />
      </Col>
    ));
    return children;
  };

  return (
    <div
      id={id}
      className={cx(styles.wrapper, className)}
      style={style}
    >
      <div className={styles.content}>
        <div key="content">
          <p key="title" className={styles.title}>
            {title ? ic(title) : ''}
          </p>
          <div key="block" className={styles.cardsContainer}>
            <Row key="cards" className={styles.cards}>
              {getCards()}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
