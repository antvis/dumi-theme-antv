import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import styles from './index.module.less';
import {ReloadOutlined} from "@ant-design/icons";
import {ReplayCase} from "../../types";
import RecommendJson from "./recommend.json";
import classnames from "classnames";
import {FormattedMessage, useSiteData} from 'dumi';
import {sample, sampleSize} from "lodash-es";
import {AIChatStore} from "../../../../model/AIChat";
import {AIModeType} from "../../constant";
import {useLibrary} from "../../../../hooks/useProducts";
import {getBaseSiteDataUrl} from "../../../../utils/env";

type RecommendCaseProps = {
  className?: string;
  onClick?: (item: ReplayCase) => void;
};

export const RecommendCase = (props: RecommendCaseProps) => {
  const [loading, setLoading] = useState(false);
  const { themeConfig } = useSiteData();
  const [list, setList] = useState<ReplayCase[]>([]);
  const { data: library = [] } = useLibrary();

  const fetchList = async () => {
    try {
      setLoading(true);
      let data: ReplayCase[] = [];
      const url = (themeConfig.isAntVSite && library.length) ? `${getBaseSiteDataUrl()}/${sample(library).toLowerCase()}/recommend.json` : (themeConfig?.ai?.recommend || `${getBaseSiteDataUrl()}/${themeConfig.title}/recommend.json`);
      if (url) {
        data = await fetch(url)
          .then((res) => res.json());
      } else {
        data = RecommendJson as unknown as ReplayCase[];
      }
      setList(sampleSize(data, 4));
    } catch (err) {
      setList(RecommendJson)
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (library.length) {
      fetchList();
    }
  }, [themeConfig.isAntVSite, library.length]);

  if (!list.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={styles.quickStart}>
          <FormattedMessage id="ai.recommend.title" />
        </span>
        {list?.length > 4 ? <span className={styles.refresh} onClick={() => fetchList()}>
          <ReloadOutlined />
          <FormattedMessage id="ai.recommend.refresh" />
        </span> : <></>}
      </div>
      <Spin spinning={loading} wrapperClassName={classnames(styles.listContainer, props.className)}>
        <div className={styles.list}>
          {list.map((item, index) => {
            return <Card key={item.caseId} item={item} index={index} onClick={() => {
              props.onClick?.(item);
              if (item.tag) {
                AIChatStore.mode = item.tag as AIModeType;
              }
            }}/>;
          })}
        </div>
      </Spin>
    </div>
  );
};
