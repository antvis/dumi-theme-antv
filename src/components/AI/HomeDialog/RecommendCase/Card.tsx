import { Popover } from 'antd';
import React from 'react';
import styles from './card.module.less';
import {ReplayCase} from "../../types";
import {BarChartOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {AIMode, AIModeMeta, COLORS} from "../../constant";
import {FormattedMessage, useLocale} from 'dumi';

interface ICardProps {
  item: ReplayCase;
  index: number;
  onClick: () => void;
}

export const Card: React.FC<ICardProps> = ({ item, index, onClick }) => {
  const { query = {}, description = {}, imageUrls = [], tag } = item;
  const style = COLORS[index];
  const locale = useLocale();
  const lang = locale.id === 'zh' ? 'zh' : 'en';
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const popoverContent = (
    <div className={styles.popoverContent}>
      <div className={styles.popoverItem}>
        <div className={styles.popoverLabel}>
          <FormattedMessage id="ai.recommend.card.caseName" />
        </div>
        <div className={styles.popoverValue}>{typeof query === 'object' ? query[lang] : query}</div>
      </div>
      <div className={styles.popoverItem}>
        <div className={styles.popoverLabel}>
          <FormattedMessage id="ai.recommend.card.description" />
        </div>
        <div className={styles.popoverValue}>{typeof description === 'object' ? description[lang] : description}</div>
      </div>
        {/*<div className={styles.popoverItem}>*/}
          {/*<div className={styles.popoverLabel}>数据源</div>*/}
          {/*<div className={styles.popoverValue}>{dataSourceName}</div>*/}
        {/*</div>*/}
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      placement="top"
      overlayClassName={styles.popoverOverlay}
    >
      <div
        className={styles.card}
        style={{
          background: style?.backgroundColor,
        }}
        onClick={handleClick}
      >
        <div className={styles.typeTag} style={style}>
          { tag === AIMode.implement ? <BarChartOutlined className={styles.typeIcon}/>
          : <QuestionCircleOutlined className={styles.typeIcon}/> }
          <span className={styles.typeText}><FormattedMessage id={AIModeMeta[tag]?.name || tag} /></span>
        </div>

        <div className={styles.title}>{typeof query === 'object' ? query[lang] : query}</div>

        <div className={styles.imageContainer}>
          {imageUrls.slice(0, 2).map((item, idx) => {
            return (
              <img src={item} key={idx} className={styles[`image${idx}`]} />
            );
          })}
        </div>

        <div className={styles.hoverMask} />
      </div>
    </Popover>
  );
};
