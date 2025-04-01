import cx from 'classnames';
import React from 'react';

import styles from './index.module.less';

type Company = {
  name: string;
  img: string;
};

interface CompaniesProps {
  title: any;
  companies: Company[];
  className?: string;
  style?: React.CSSProperties;
}

export const Companies: React.FC<CompaniesProps> = ({ title, companies = [], className, style }) => {
  return (
    <div className={cx(styles.wrapper, className)} style={style}>
      <div key="content" className={cx(styles.content, 'container1440')}>
        <p key="title" className={styles.title}>
          {title}
        </p>
        <div key="companies-container" className={styles.companiesContainer}>
          <div className={styles.companiesGrid}>
            {companies.map((company) => (
              <div key={company.name} className={styles.company}>
                <img className={styles.companyimg} src={company.img} alt={company.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
