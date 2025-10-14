import React from 'react';
import {PromptTextarea} from "../../../../components/AI/HomeDialog/PromptTextarea";
import {Flex, List} from 'antd';
import { Bubble } from '@ant-design/x';
import {CheckOutlined} from "@ant-design/icons";
import {projectFiles} from "../../demo";
import styles from "./index.module.less";

const avatar = {
  icon: (
    <img
      draggable={false}
      src={'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original'}
      alt="AntV"
    />
  ),
  style: {
    borderRadius: 0,
    backgroundColor: '#fff',
  }};

function MsgBox(props) {

  return <>
    <Flex gap="middle" vertical>
      <Bubble
        placement="end"
        content="一个城市过去五年来的年度降雨量分别是：2016年800毫米，2017年900毫米，2018年700毫米，2019年1000毫米，2020年1100毫米。使用折线图描绘这些数据。"
        avatar={null}
      />
      <Bubble
        placement="start"
        content={<List style={{width: "200px"}}
          itemLayout="horizontal"
                       size="small"
        >
          {Object.keys(projectFiles).map((item, index) => <List.Item key={index}>
              <List.Item.Meta
                avatar={<CheckOutlined style={{color: '#49de80'}}/>}
                title={`创建 ${item}`}
              />
            </List.Item>)}
        </List>}
        avatar={avatar}
      />
    </Flex>
    <PromptTextarea size="compact" mode="implement" value="" style={{ marginBottom: 0 }} />
  </>;
}

export default MsgBox;
