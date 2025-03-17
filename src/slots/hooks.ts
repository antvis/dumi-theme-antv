import { useLocale } from 'dumi';
import { get } from 'lodash-es';
import { useEffect, useState } from 'react';
import type { IC } from '../types';

export const useChinaMirrorHost = (): [boolean] => {
  const [isChinaMirrorHost, setIsChinaMirrorHost] = useState(false);

  useEffect(() => {
    if (window.location.host.includes('gitee.io') && window.location.host.includes('antv')) {
      setIsChinaMirrorHost(true);
    }
  }, []);

  return [isChinaMirrorHost];
};

export const useScrollToTop = () => {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};

export const useLogoLink = ({
  link = '',
  siteUrl = '',
  lang = '',
}: {
  link?: string;
  siteUrl?: string;
  lang?: string;
}): [string] => {
  let defaultLogoLink;
  if (link) {
    defaultLogoLink = link;
  } else if (siteUrl === 'https://antv.vision') {
    defaultLogoLink = `/${lang}`;
  } else {
    defaultLogoLink = `https://antv.vision/${lang}`;
  }

  const [giteeLogoLink, setGiteeLogoLink] = useState('');
  useEffect(() => {
    if (window.location.host.includes('gitee.io') && window.location.host.includes('antv')) {
      setGiteeLogoLink(`https://antv.gitee.io/${lang}`);
    }
  }, []);

  return [giteeLogoLink || defaultLogoLink];
};

/**
 * i18n .umirc config
 * 如果是 object，则取 locale，否则直接用
 * @param v
 */
export function ic(v: string | IC) {
  const locale = useLocale();
  return icWithLocale(v, locale.id);
}

export function icWithLocale(v: string | IC, locale: string) {
  return typeof v === 'object' ? get(v, [locale]) : v;
}
