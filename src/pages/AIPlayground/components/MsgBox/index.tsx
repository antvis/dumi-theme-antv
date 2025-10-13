import React from 'react';
import styles from "./index.module.less";
import {PromptTextarea} from "../../../../components/AI/HomeDialog/PromptTextarea";

function MsgBox(props) {
  return (
    <>
      <div className={styles.msg}>
        <div className={styles.query}>
          一个城市过去五年来的年度降雨量分别是：2016年800毫米，2017年900毫米，2018年700毫米，2019年1000毫米，2020年1100毫米。使用折线图描绘这些数据。
        </div>
      </div>
      <PromptTextarea size="compact" mode="implement" value="" style={{marginBottom: 0}}/>
    </>
  );
}

export default MsgBox;
