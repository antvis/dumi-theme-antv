import type { SidebarData } from "../types";

export const getAncestorMenuItems = (items: SidebarData, key: string) => {
  if (!items) return [];
  const findAncestors = (items, key, ancestors = []) => {
    for (const item of items) {
      if (item.key === key) return ancestors;
      if (item.children) {
        const result = findAncestors(item.children, key, [...ancestors, item]);
        if (result) return result;
      }
    }
    return null;
  };

  return findAncestors(items, key) || [];
};

export const flattenMenu = (menuItems: SidebarData): SidebarData | null => {
  if (Array.isArray(menuItems)) {
    return menuItems.reduce<Exclude<SidebarData, undefined>>((acc, item) => {
      if (!item) {
        return acc;
      }
      if ('children' in item && item.children) {
        return acc.concat(flattenMenu(item.children) ?? []);
      }
      return acc.concat(item);
    }, []);
  }
  return null;
};
