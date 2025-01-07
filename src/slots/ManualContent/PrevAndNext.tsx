import React, { useMemo } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { NavigatorBanner } from './NavigatorBanner';
import styles from './index.module.less';

export const PrevAndNext: React.FC = () => {
  const [, selectedKey, flattenMenuItems] = useMenu();

  const [prev, next] = useMemo(() => {
    if (!flattenMenuItems) {
      return [undefined, undefined];
    }

    let activeMenuItemIndex = -1;
    flattenMenuItems.forEach((menuItem, i) => {
      if (menuItem && menuItem.key === selectedKey) {
        activeMenuItemIndex = i;
      }
    });
    const prevItem = flattenMenuItems[activeMenuItemIndex - 1];
    const nextItem = flattenMenuItems[activeMenuItemIndex + 1];
    return [
      prevItem ? { slug: prevItem.link, title: prevItem.title } : undefined,
      nextItem ? { slug: nextItem.link, title: nextItem.title } : undefined,
    ] as const;
  }, [flattenMenuItems, selectedKey]);

  return (
    <div className={styles.preandnext}>
      <NavigatorBanner type="prev" post={prev} />
      <NavigatorBanner type="next" post={next} />
    </div>
  );
};
