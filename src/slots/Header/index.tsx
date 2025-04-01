import {
  CaretDownFilled,
  DownOutlined,
  GithubOutlined,
  LinkOutlined,
  MenuOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Alert, Button, Dropdown, Menu, Modal, Popover } from 'antd';
import cx from 'classnames';
import { FormattedMessage, Link, useLocale, useSiteData } from 'dumi';
import { get, map, size } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { getPurePathname } from '../../utils/location';
import { ic, icWithLocale } from '../hooks';
import { INav, Navs } from './Navs';
import { Products } from './Products';
import { Search } from './Search';
import { findVersion } from './utils';

import type { IC } from '../../types';

import { Assistant } from '@petercatai/assistant';
import '@petercatai/assistant/style';
import { useLocation } from 'react-router-dom';
import { determineUserType } from '../../utils/user';
import styles from './index.module.less';

export type HeaderProps = {
  /** 网站 header 标题 */
  title?: string;
  /** 网站 的 meta 标签 */
  metas?: {
    title: IC | string;
    description: IC | string;
  };
  /** 官网子包所在路径 */
  sitePackagePath?: string;
  pathPrefix?: string;
  /** 子标题 */
  subTitle?: React.ReactNode;
  /** 子标题的链接 */
  subTitleHref?: string;
  /** 文档和演示的菜单数据 */
  navs?: INav[];
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 是否显示 Github 图标 */
  showGithubCorner?: boolean;
  /** 是否显示 Github Star */
  showGithubStar?: boolean;
  /** 是否显示切换语言选项 */
  showLanguageSwitcher?: boolean;
  /**
   * 国内镜像相关的信息
   */
  internalSite?: {
    url: string;
    name: object;
  };
  /** 切换语言的回调 */
  onLanguageChange?: (language: string) => void;
  /** 是否二维码 */
  showWxQrcode?: boolean;
  /** 自定义 logo */
  logo?: {
    img?: React.ReactNode;
    link?: string;
  };
  siteUrl?: string;
  /** github 仓库地址 */
  githubUrl?: string;
  /** 默认语言 */
  defaultLanguage?: 'zh' | 'en';
  /** 自定义 Link */
  Link?: React.ComponentType<any>;
  /** 底色是否透明 */
  transparent?: boolean;
  /** 是否首页模式 */
  isHomePage?: boolean;
  /** 是否是AntV官网 */
  isAntVSite?: boolean;
  /** AntV root 域名，直接用主题的可不传 */
  rootDomain?: string;
  /** 是否显示 AntV 产品卡片 */
  showAntVProductsCard?: boolean;
  /**
   * 当前版本
   */
  version?: string;
  /** 展示版本切换 */
  versions?: { [key: string]: string };
  /** 展示周边生态 */
  ecosystems?: Array<{
    name: Record<string /** zh, en */, string>;
    url: string;
  }>;
  /** 头部搜索框配置 */
  searchOptions?: {
    docsearchOptions: {
      versionV3: boolean;
      apiKey: string;
      indexName: string;
      appId: string;
      sort?: string[];
    };
  };
  /** 是否开启用户反馈功能 */
  feedback?: boolean;
  /** petercat 配置 */
  petercat?: {
    token: string;
    show: boolean;
  };
  /** 是否显示 links 研发小蜜 */
  links?: boolean;
  /** 页面头部公告 */
  announcement?: {
    title: IC;
    icon: string;
    link: {
      url: string;
      text: IC;
    };
  };
};

function redirectChinaMirror(chinaMirrorOrigin: string) {
  window.location.href = window.location.href.replace(window.location.origin, chinaMirrorOrigin);
}

const ANNOUNCEMENT_LOCALSTORAGE_ID = 'ANNOUNCEMENT_LOCALSTORAGE_ID';

/**
 * 头部菜单
 */
const HeaderComponent: React.FC<HeaderProps> = ({
  subTitle = '',
  navs = [],
  showSearch = true,
  showGithubCorner = true,
  showAntVProductsCard = true,
  showLanguageSwitcher = true,
  logo,
  onLanguageChange,
  // 默认就使用 AntV 的公众号
  showWxQrcode = true,
  siteUrl,
  githubUrl = 'https://github.com/antvis',
  defaultLanguage,
  transparent,
  isHomePage,
  isAntVSite = false,
  rootDomain = '',
  version,
  versions,
  internalSite,
  ecosystems,
  announcement,
}) => {
  const isAntVHome = isAntVSite && isHomePage; // 是否为AntV官网首页

  const [bannerVisible, setBannerVisible] = useState(false);

  const showChinaMirror: boolean = !!internalSite;
  const chinaMirrorUrl: string = get(internalSite, 'url');
  const [chinaMirrorHintVisible, updateChinaMirrorHintVisible] = useState(false);

  const locale = useLocale();
  const lang = locale.id;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        showChinaMirror &&
        lang === 'zh' &&
        !localStorage.getItem('china-mirror-no-more-hint') &&
        window.location.host.includes('antv.vision')
      ) {
        updateChinaMirrorHintVisible(true);
      }
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  });

  const announcementTitle = icWithLocale(announcement?.title, lang);
  const announcementLinkTitle = icWithLocale(announcement?.link?.text, lang);

  useEffect(() => {
    setBannerVisible(!!announcementTitle && localStorage.getItem(ANNOUNCEMENT_LOCALSTORAGE_ID) !== 'true');
  }, [announcementTitle]);

  function onBannerClose() {
    localStorage.setItem(ANNOUNCEMENT_LOCALSTORAGE_ID, 'true');
    setBannerVisible(false);
  }

  const [productMenuVisible, setProductMenuVisible] = useState(false);
  let productMenuHovering = false;
  const onProductMouseEnter = (e: React.MouseEvent) => {
    productMenuHovering = true;
    e.persist();
    setTimeout(() => {
      if (e.target instanceof Element && e.target.matches(':hover')) {
        setProductMenuVisible(true);
      }
    }, 200);
  };
  const onProductMouseLeave = (e: React.MouseEvent) => {
    e.persist();
    productMenuHovering = false;
    setTimeout(() => {
      if (productMenuHovering) {
        return;
      }
      setProductMenuVisible(false);
    }, 200);
  };
  const onToggleProductMenuVisible = () => {
    setProductMenuVisible(!productMenuVisible);
  };

  const [popupMenuVisible, setPopupMenuVisible] = useState(false);
  const onTogglePopupMenuVisible = () => {
    setPopupMenuVisible(!popupMenuVisible);
  };

  const { img, link } = {
    img: (
      <img
        src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original"
        alt="logo"
      />
    ),
    link: '',
    ...logo,
  };

  const { pathname } = useLocation();

  useEffect(() => {
    if (popupMenuVisible) {
      setPopupMenuVisible(false);
    }
  }, [pathname]);

  // 移动端下弹出菜单时，禁止页面滚动
  useEffect(() => {
    if (popupMenuVisible) {
      document.documentElement!.style.overflow = 'hidden';
    } else {
      document.documentElement!.style.overflow = '';
    }
    return () => {
      document.documentElement!.style.overflow = '';
    };
  }, [popupMenuVisible]);

  const isWide = useMedia('(min-width: 767.99px)', true);

  const menuIcon = !isWide ? <MenuOutlined className={styles.menuIcon} onClick={onTogglePopupMenuVisible} /> : null;

  const productItemProps = isWide
    ? {
        onMouseEnter: onProductMouseEnter,
        onMouseLeave: onProductMouseLeave,
        onClick: onToggleProductMenuVisible,
      }
    : {
        onClick: onToggleProductMenuVisible,
      };

  const handleSwitchLanguage = () => {
    onLanguageChange?.(lang);
  };

  const menu = (
    <ul
      className={cx(styles.menu, {
        [styles.popup]: !isWide,
        [styles.popupHidden]: !popupMenuVisible,
      })}
    >
      {
        /** 最左侧的菜单，一般是 教程、API、示例，或者其他自定义，有配置文件中的 `navs` 决定 */
        size(navs) ? <Navs navs={navs} path={pathname} /> : null
      }

      {
        /** 生态产品 */
        size(ecosystems) ? (
          <li>
            <Dropdown
              className={styles.ecoSystems}
              overlay={
                <Menu>
                  {map(ecosystems, ({ url, name: ecosystemName }) => (
                    <Menu.Item key={ecosystemName?.[lang]}>
                      <a target="_blank" rel="noreferrer" href={url}>
                        {ecosystemName?.[lang]} <LinkOutlined />
                      </a>
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <span>
                {<FormattedMessage id="周边生态" />}
                <DownOutlined style={{ marginLeft: '6px' }} />
              </span>
            </Dropdown>
          </li>
        ) : null
      }

      {showChinaMirror && isWide ? (
        <Popover
          title={null}
          content={
            <div style={{ width: 300 }}>
              <div>
                <span role="img" aria-labelledby="中国" style={{ marginRight: '8px' }}>
                  🇨🇳
                </span>
                AntV 系列网站部署在 gh-pages 上，若访问速度不佳，可以前往国内镜像站点。
              </div>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button onClick={() => updateChinaMirrorHintVisible(false)} size="small" style={{ marginRight: 8 }}>
                  暂时关闭
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    localStorage.setItem('china-mirror-no-more-hint', Date.now().toString());
                    updateChinaMirrorHintVisible(false);
                  }}
                >
                  不再提醒
                </Button>
              </div>
            </div>
          }
          open={chinaMirrorHintVisible}
          placement="bottomRight"
          align={{
            offset: [-12, -16],
          }}
        >
          <li>
            <a
              href={chinaMirrorUrl}
              onClick={(e) => {
                e.preventDefault();
                redirectChinaMirror(chinaMirrorUrl);
              }}
            >
              {ic(get(internalSite, 'name'))}
              {!isAntVHome && <LinkOutlined style={{ marginLeft: '6px' }} />}
            </a>
          </li>
        </Popover>
      ) : null}

      {showChinaMirror && !isWide && (
        <Modal
          open={chinaMirrorHintVisible}
          cancelText="不再提醒"
          okText="立即前往"
          onCancel={() => {
            updateChinaMirrorHintVisible(false);
          }}
          onOk={() => redirectChinaMirror(chinaMirrorUrl)}
          cancelButtonProps={{
            onClick: () => {
              localStorage.setItem('china-mirror-no-more-hint', Date.now().toString());
              updateChinaMirrorHintVisible(false);
            },
          }}
        >
          <div className={styles.modalContent}>
            <span role="img" aria-labelledby="中国">
              🇨🇳
            </span>
            AntV 系列网站部署在 gh-pages 上，若访问速度不佳，可以前往
            <a
              href={chinaMirrorUrl}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = chinaMirrorUrl;
              }}
              className={styles.remindHref}
            >
              {ic(get(internalSite, 'name'))}
              <LinkOutlined style={{ marginLeft: '6px' }} />
            </a>
            <span> 站点。</span>
          </div>
        </Modal>
      )}

      {
        /** 产品列表 */
        showAntVProductsCard && (
          <li {...productItemProps}>
            <a>
              {<FormattedMessage id="所有产品" />}
              {!isAntVHome ? (
                <img
                  src="https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png"
                  alt="antv logo arrow"
                  className={cx(styles.arrow, {
                    [styles.open]: productMenuVisible,
                  })}
                  style={{ marginLeft: '6px' }}
                />
              ) : (
                <CaretDownFilled
                  style={{ top: '1px', color: '#fff' }}
                  className={cx(styles.arrow, {
                    [styles.open]: productMenuVisible,
                  })}
                />
              )}
            </a>
            <Products
              className={styles.productsMenu}
              bannerVisible={bannerVisible}
              show={productMenuVisible}
              rootDomain={rootDomain}
              language={defaultLanguage}
            />
          </li>
        )
      }

      {
        /** 版本列表 */
        versions && (
          <li>
            <Dropdown
              className={styles.versions}
              menu={{
                items: Object.keys(versions).map((version: string) => ({
                  label: (
                    <a target="_blank" rel="noreferrer" href={versions[version]}>
                      {version}
                    </a>
                  ),
                  key: version,
                })),
                selectable: true,
                defaultSelectedKeys: [findVersion(version, Object.keys(versions))],
              }}
            >
              <span>
                {findVersion(version, Object.keys(versions))}
                <DownOutlined style={{ marginLeft: '6px' }} />
              </span>
            </Dropdown>
          </li>
        )
      }

      {
        /** 切换网站语言 */
        showLanguageSwitcher && (
          <li className={cx(styles.navIcon, styles.languageSwitcher)}>
            <Link to={lang === 'zh' ? '/en' : '/'} onClick={handleSwitchLanguage}>
              <svg
                className={styles.translation}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
              </svg>
            </Link>
          </li>
        )
      }

      {
        /** 微信公众号 */
        showWxQrcode && (
          <li className={cx(styles.navIcon, styles.wxQrcode)}>
            <Popover
              content={
                <img
                  width="100%"
                  height="100%"
                  src="https://gw.alipayobjects.com/zos/antfincdn/ZKlx96dsfs/qrcode_for_gh_f52d8b6aa591_258.jpg"
                  alt="wx-qrcode"
                />
              }
              title="微信扫一扫关注"
              styles={{
                body: {
                  padding: 2,
                },
                root: {
                  width: 128,
                  height: 128,
                },
              }}
            >
              <WechatOutlined />
            </Popover>
          </li>
        )
      }

      {
        /** GitHub icon */
        showGithubCorner && (
          <li className={cx(styles.navIcon, styles.githubCorner)}>
            <a href={githubUrl} target="_blank" rel="noreferrer">
              <GithubOutlined />
            </a>
          </li>
        )
      }
    </ul>
  );

  return (
    <header
      className={cx(styles.header, {
        [styles.transparent]: !!transparent && !productMenuVisible,
        [styles.isHomePage]: !!isHomePage && !isAntVHome,
        [styles.lightTheme]: !!isAntVHome && !productMenuVisible && isWide,
        [styles.isAntVHome]: !!isAntVHome,
        [styles.fixed]: popupMenuVisible,
      })}
    >
      {bannerVisible && announcementTitle && (
        <Alert
          className={styles.banner}
          message={
            <div className={styles.topAlert}>
              {announcement?.icon && <img src={announcement.icon} />}
              <div>{announcementTitle}</div>
              {announcementLinkTitle && <a href={announcement?.link.url}>{announcementLinkTitle}</a>}
            </div>
          }
          type="info"
          banner
          closable
          showIcon={false}
          onClose={onBannerClose}
        />
      )}
      <div className={cx(styles.container)}>
        <div className={styles.left}>
          <h1>
            <a href={siteUrl[lang] ? siteUrl[lang] : siteUrl}>{img}</a>
          </h1>
          {!isAntVHome && subTitle && (
            <>
              <span className={styles.divider} />
              <h2 className={styles.subProduceName}>
                <a href={pathname.startsWith('/en') ? '/en' : '/'}>{subTitle}</a>
              </h2>
            </>
          )}
          {showSearch && !isAntVHome && <Search />}
        </div>
        <nav className={styles.nav}>
          {menu}
          {menuIcon}
        </nav>
      </div>
    </header>
  );
};

const Header: React.FC<Partial<HeaderProps>> = (props) => {
  const { themeConfig } = useSiteData() as any;
  const {
    title,
    siteUrl,
    githubUrl,
    isAntVSite,
    subTitleHref,
    internalSite,
    showSearch,
    showGithubCorner,
    showGithubStars,
    showLanguageSwitcher,
    showWxQrcode,
    defaultLanguage,
    showAntVProductsCard,
    version,
    versions,
    ecosystems,
    navs,
    docsearchOptions,
    announcement,
    petercat,
    links,
  } = themeConfig;
  const searchOptions = {
    docsearchOptions,
  };

  const { pathname } = useLocation();
  const isHomePage = ['/', ''].includes(getPurePathname(pathname));
  const lang = useLocale().id;

  const headerProps = {
    subTitle: icWithLocale(title, lang),
    subTitleHref,
    githubUrl,
    isAntVSite,
    siteUrl,
    internalSite,
    showSearch,
    showGithubCorner,
    showGithubStars,
    showLanguageSwitcher,
    showWxQrcode,
    defaultLanguage,
    showAntVProductsCard,
    version,
    versions,
    ecosystems,
    navs,
    searchOptions,
    isHomePage,
    transparent: isHomePage && isAntVSite,
    announcement,
    petercat,
  };
  const [isInternalUser, setIsInternalUser] = useState<boolean | undefined>(undefined);
  const isPetercatShow = petercat?.show;

  useEffect(() => {
    const checkUserType = async () => {
      const result = await determineUserType();
      setIsInternalUser(result);
    };

    checkUserType();
  }, []);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    if (isInternalUser && links) {
      script = document.createElement('script');
      script.src = 'https://links.alipay.com/widgetInit/67a96a296b6fa80490bdf892';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [isInternalUser]);

  return (
    <>
      <HeaderComponent {...Object.assign({}, headerProps, props)} />
      {isPetercatShow && isInternalUser === false && (
        <Assistant token={petercat?.token} apiDomain="https://api.petercat.ai" />
      )}
    </>
  );
};

export default Header;
