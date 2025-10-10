import { Popover } from 'antd';
import React from 'react';
import styles from './card.module.less';
import {ReplayCase} from "../../types";
import {COLORS} from "../../constant";
import {BarChartOutlined, QuestionCircleOutlined} from "@ant-design/icons";

interface ICardProps {
  item: ReplayCase;
  index: number;
}

export const Card: React.FC<ICardProps> = ({ item, index }) => {
  const { query, description, imageUrls = [], link, tag } = item;
  const style = COLORS[index];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const urlObj = new URL(location.href);
    urlObj.hash = `#/session/${link}?replayCase=true&replaySpeed=500`;
    window.open(urlObj.toString(), '_blank');
  };

  const popoverContent = (
    <div className={styles.popoverContent}>
      <div className={styles.popoverItem}>
        <div className={styles.popoverLabel}>案例名</div>
        <div className={styles.popoverValue}>{query}</div>
      </div>
      <div className={styles.popoverItem}>
        <div className={styles.popoverLabel}>描述信息</div>
        <div className={styles.popoverValue}>{description}</div>
      </div>

        <div className={styles.popoverItem}>
          <div className={styles.popoverLabel}>数据源</div>
          {/*<div className={styles.popoverValue}>{dataSourceName}</div>*/}
        </div>

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
          <BarChartOutlined className={styles.typeIcon}/>
          <QuestionCircleOutlined className={styles.typeIcon}/>
          <span className={styles.typeText}>{tag}</span>
        </div>

        <div className={styles.title}>{query}</div>

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
