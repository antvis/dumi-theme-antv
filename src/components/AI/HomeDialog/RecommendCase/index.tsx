import { Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from './Card';
import styles from './index.module.less';
import {ReloadOutlined} from "@ant-design/icons";
import {ReplayCase} from "../../types";
import RecommendJson from "./recommend.json";
import classnames from "classnames";
import { FormattedMessage } from 'dumi';

type RecommendCaseProps = {
  className?: string;
  onClick?: (item: ReplayCase) => void;
};

export const RecommendCase = (props: RecommendCaseProps) => {
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState<ReplayCase[]>([]);

  const fetchList = useCallback(
    async () => {
      try {
        setLoading(true);
        const data = RecommendJson as unknown as ReplayCase[];
        setList(data.slice(0, 4));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [list],
  );

  useEffect(() => {
    fetchList();
  }, []);

  if (!list.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={styles.quickStart}>
          <FormattedMessage id="ai.recommend.title" />
        </span>
        <span className={styles.refresh} onClick={() => fetchList()}>
          <ReloadOutlined />
          <FormattedMessage id="ai.recommend.refresh" />
        </span>
      </div>
      <Spin spinning={loading} wrapperClassName={classnames(styles.listContainer, props.className)}>
        <div className={styles.list}>
          {list.map((item, index) => {
            return <Card key={item.caseId} item={item} index={index} onClick={() => {
              props.onClick?.(item);
            }}/>;
          })}
        </div>
      </Spin>
    </div>
  );
};
