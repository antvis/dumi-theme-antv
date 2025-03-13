import { useLocale as useDumiLocale } from 'dumi';

export interface LocaleMap<
  K extends PropertyKey = PropertyKey,
  V extends string | ((...params: any[]) => string) = string,
> {
  zh: Record<K, V>;
  en: Record<K, V>;
}

/**
 * 获取国际化
 */
const useLocale = <K extends PropertyKey = PropertyKey, V extends string | ((...params: any[]) => string) = string>(
  localeMap?: LocaleMap<K, V>,
): [Record<K, V>, 'zh' | 'en'] => {
  const { id } = useDumiLocale();
  const localeType = id === 'zh' ? 'zh' : 'en';
  return [localeMap?.[localeType]!, localeType] as const;
};

export default useLocale;
