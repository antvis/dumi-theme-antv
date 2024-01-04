import { proxy } from 'valtio';

export const store = proxy<{
  hideMenu: boolean;
  showAPI: boolean;
  apiContainerWidth: number;
}>({
  hideMenu: false,
  showAPI: false,
  apiContainerWidth: 420,
});
