import React from 'react';
import { Link, useLocale } from 'dumi';
import { Badge } from 'antd';
import { DemoCardProps } from '../../../types';
import styles from '../../../index.module.less';

/**
 * DEMO 的卡片预览
 *
 * @param {DemoCardProps} props 相关参数，详见类型定义
 * @returns {React.FC} React.FC
 * @author YuZhanglong <loveyzl1123@gmail.com>
 */
export const DemoCard: React.FC<DemoCardProps> = (props) => {
  const { demo, topicId, exampleId } = props;
  const locale = useLocale();

  const renderCardInternal = () => {
    const img = demo.screenshot ||
      'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/screenshot-placeholder-b8e70.png';
    return (
      <>
        <div style={{
          backgroundImage: `url("${img}")`,
          backgroundSize: 'cover',
        }} />
      </>
    );
  };

  return (
    <Link
      className={styles.galleryCardLink}
      to={`${locale.id == 'zh' ? '' : '/en'}/examples/${topicId}/${exampleId}/#${demo.id}`}
    >
      {demo.isNew ? (
        <Badge.Ribbon
          text='new'
          className={styles.customRibbon}
        >
          {renderCardInternal()}
        </Badge.Ribbon>
      ) : renderCardInternal()
      }
      <h4>{demo.title[locale.id]}</h4>
    </Link>
  );
};
