import { useEffect, useState } from 'react';

export const useChinaMirrorHost = (): [boolean] => {
  const [isChinaMirrorHost, setIsChinaMirrorHost] = useState(false);
  useEffect(() => {
    if (
      window.location.host.includes('gitee.io') &&
      window.location.host.includes('antv')
    ) {
      setIsChinaMirrorHost(true);
    }
  }, []);
  return [isChinaMirrorHost];
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
    if (
      window.location.host.includes('gitee.io') &&
      window.location.host.includes('antv')
    ) {
      setGiteeLogoLink(`https://antv.gitee.io/${lang}`);
    }
  }, []);

  return [giteeLogoLink || defaultLogoLink];
};
