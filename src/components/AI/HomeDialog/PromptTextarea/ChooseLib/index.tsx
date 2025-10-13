import React from 'react';
import {Dropdown} from "antd";
import {useProducts} from "../../../../../hooks/useProducts";
import {useLocale} from "dumi";
import {FormProps} from "../../../types";
import styles from './index.module.less';

type ChooseLibProps = FormProps<string> & {
  size?: 'default' | 'compact';
};

export function ChooseLib(props: ChooseLibProps) {
  const { value, onChange, size = "default" } = props;
  const isCompact = size === 'compact';
  const locale = useLocale();
  const lang = locale.id === 'zh' ? 'zh' : 'en';
  const { data = [] } = useProducts();

  const onSelect = (key: string) => {
    onChange?.(key);
  };

  const items = data
    .filter(item => item.lang === lang && ["G2", "F2", "S2", "G6", "X6", "AVA"].includes(item.title))
    .map(item => ({
    key: item.title,
    label: item.title,
      icon: <img src={item.icon} alt={item.title} className={styles.icon}/>,
      extra: (!isCompact && item.slogan),
      onClick: () => onSelect(item.title)
  }));

  return (
    <Dropdown menu={{ items }}>
      <button
        type="button"
      >
        <img className={styles.icon} src={
          data.find(item => item.title === value)?.icon ||
          "https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original"}
             alt="AntV"/>
        { value || (!isCompact && '选择技术栈') }
      </button>
    </Dropdown>
  );
}

