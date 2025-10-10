export const AIMode = {
  implement: 'implement',
  solve: 'solve',
} as const;

export type AIModeType = keyof typeof AIMode;

// 循环取这几个颜色
export const COLORS = [
  {
    color: '#5792E6',
    backgroundColor: 'rgba(22,119,255,0.06)',
  },
  { color: '#66cf85', backgroundColor: 'rgba(44,208,119,0.06)' },
  {
    color: '#f99542',
    backgroundColor: 'rgba(231,173,69,0.08)',
  },
  {
    color: '#5761f3',
    backgroundColor: 'rgba(22,55,255,0.06)',
  },
] as const;

export const FileIcons = {
  FILE: 'https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*bc2KQq259ucAAAAAAAAAAAAAeriAAQ/original',
  IMAGE: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6I-zQKAmDUsAAAAAQBAAAAgAemJ7AQ/original',
} as const;
