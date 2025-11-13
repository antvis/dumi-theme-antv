import { Dropdown, Space } from 'antd';
import { useIntl } from 'dumi';
import React from 'react';
import { useSnapshot } from 'valtio';
import { AIChatStore } from '../../../../model/AIChat';
import { AIModeMeta } from '../../constant';

export function ModeSelectorDropdown() {
  const { formatMessage } = useIntl();
  const snap = useSnapshot(AIChatStore);

  const items = Object.entries(AIModeMeta).map(([key, value]) => ({
    key: key,
    label: formatMessage({ id: value.shortName }),
    icon: value.icon,
    // @ts-ignore
    onClick: () => (AIChatStore.mode = key),
  }));

  return (
    <Dropdown menu={{ items }}>
      <button type="button">
        <a>
          <Space>
            {AIModeMeta[snap.mode].icon}
            {formatMessage({ id: AIModeMeta[snap.mode].shortName })}
          </Space>
        </a>
      </button>
    </Dropdown>
  );
}
