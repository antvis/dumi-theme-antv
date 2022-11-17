// import { navigate } from 'gatsby';
import React, { useState, useEffect } from 'react';
import { useMedia } from 'react-use';
import { useNavigate } from "react-router-dom";
import cx from 'classnames';
import { useSiteData, useLocale, FormattedMessage } from 'dumi';
import {
  GithubOutlined,
  MenuOutlined,
  CaretDownFilled,
  DownOutlined,
  WechatOutlined,
  LinkOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { Modal, Button, Popover, Menu, Dropdown, Select } from 'antd';
import { get, map, size } from 'lodash-es';
import { Search } from './Search';
import { Products } from './Products';
import { Navs, INav } from './Navs';
import { Logo } from './Logo';
import { LogoWhite } from './LogoWhite';
import { getLangUrl } from './utils';
import { ic } from '../hooks';

import styles from './index.module.less';

export type HeaderProps = {
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
  },
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
   }
  }
}

function redirectChinaMirror(chinaMirrorOrigin: string) {
  window.location.href = window.location.href.replace(window.location.origin, chinaMirrorOrigin);
}

/**
 * 头部菜单
 */
const HeaderComponent: React.FC<HeaderProps> = ({
  subTitle = '',
  subTitleHref,
  pathPrefix = '',
  navs = [],
  showSearch = true,
  showGithubStar = false,
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
  Link = 'a',
  transparent,
  isHomePage,
  isAntVSite = false,
  rootDomain = '',
  versions,
  internalSite,
  ecosystems,
  searchOptions
}) => {
  const isAntVHome = isAntVSite && isHomePage; // 是否为AntV官网首页

  const showChinaMirror: boolean = !!internalSite;
  const chinaMirrorUrl: string = get(internalSite, 'url');
  const [chinaMirrorHintVisible, updateChinaMirrorHintVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        showChinaMirror && lang === 'zh'
        && !localStorage.getItem('china-mirror-no-more-hint')
        && window.location.host.includes('antv.vision')
      ) {
        updateChinaMirrorHintVisible(true);
      }
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  });

  const locale = useLocale();
  const nav = useNavigate()

  const [lang, setLang] = useState(locale.id)

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
    img: isAntVHome ? <LogoWhite style={{}} /> : <Logo style={{}} />,
    link: '',
    ...logo,
  };

  useEffect(() => {
    if (popupMenuVisible) {
      setPopupMenuVisible(false);
    }
  }, [window.location.pathname]);

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

  const menuIcon = !isWide ? (
    <MenuOutlined
      className={styles.menuIcon}
      onClick={onTogglePopupMenuVisible}
    />
  ) : null;

  const productItemProps = isWide
    ? {
      onMouseEnter: onProductMouseEnter,
      onMouseLeave: onProductMouseLeave,
    }
    : {
      onClick: onToggleProductMenuVisible,
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
        size(navs) ?
        <Navs navs={navs} path={window.location.pathname} /> : null
      }

      {
        /** 生态产品 */
        size(ecosystems) ?
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
        </li> : null
      }


      {showChinaMirror && isWide ? (
        <Popover
          title={null}
          content={
            <div style={{ width: 300 }}>
              <div>
                <span
                  role="img"
                  aria-labelledby="中国"
                  style={{ marginRight: '8px' }}
                >
                  🇨🇳
                </span>
                AntV 系列网站部署在 gh-pages
                上，若访问速度不佳，可以前往国内镜像站点。
              </div>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button
                  onClick={() => updateChinaMirrorHintVisible(false)}
                  size="small"
                  style={{ marginRight: 8 }}
                >
                  暂时关闭
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    localStorage.setItem(
                      'china-mirror-no-more-hint',
                      Date.now().toString(),
                    );
                    updateChinaMirrorHintVisible(false);
                  }}
                >
                  不再提醒
                </Button>
              </div>
            </div>
          }
          visible={chinaMirrorHintVisible}
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
              {!isAntVHome && <LinkOutlined />}
            </a>
          </li>
        </Popover>
      ) : null}

      {showChinaMirror && !isWide && (
        <Modal
          visible={chinaMirrorHintVisible}
          cancelText="不再提醒"
          okText="立即前往"
          onCancel={() => {
            updateChinaMirrorHintVisible(false);
          }}
          onOk={() => redirectChinaMirror(chinaMirrorUrl) }
          cancelButtonProps={{
            onClick: () => {
              localStorage.setItem(
                'china-mirror-no-more-hint',
                Date.now().toString(),
              );
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
              <LinkOutlined />
            </a>
            <span> 站点。</span>
          </div>
        </Modal>
      )}

      {
        /** 产品列表 */
        showAntVProductsCard &&
        <li { ...productItemProps }>
          <a>
              {<FormattedMessage id="所有产品" />}
            {!isAntVHome ? (
              <img
                src="https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png"
                alt="antv logo arrow"
                className={cx(styles.arrow, {
                  [styles.open]: productMenuVisible,
                })}
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
            show={productMenuVisible}
            rootDomain={rootDomain}
            language={defaultLanguage}
          />
        </li>
      }

      {
        /** 版本列表 */
        versions &&
        <li>
          <Select
            defaultValue={Object.keys(versions)[0]}
            className={styles.versions}
            bordered={false}
            size="small"
            onChange={(value: string) => {
              window.location.href = value;
            }}
          >
            {Object.keys(versions).map((version: string) => {
              const url = versions[version];
              if (url.startsWith('http')) {
                return (
                  <Select.Option key={url} value={url}>
                    {version}
                  </Select.Option>
                );
              }
              return null;
            })}
          </Select>
        </li>
      }

      {
        /** 切换网站语言 */
        showLanguageSwitcher && (
        <li>
          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu
                defaultSelectedKeys={[lang]}
                selectable
                onSelect={({ key }) => {
                  if (key === lang) {
                    return;
                  }
                  setLang(key)
                  if (onLanguageChange) {
                    onLanguageChange(key.toString());
                    return;
                  }
                  const newUrl = getLangUrl(window.location.href, key);
                  nav(newUrl.replace(window.location.origin, ''))
                }}
              >
                <Menu.Item key="en">
                  <CheckOutlined
                    style={{
                      visibility: lang === 'en' ? 'visible' : 'hidden',
                      color: '#52c41a',
                    }}
                  />
                  English
                </Menu.Item>
                <Menu.Item key="zh">
                  <CheckOutlined
                    style={{
                      visibility: lang === 'zh' ? 'visible' : 'hidden',
                      color: '#52c41a',
                    }}
                  />
                  简体中文
                </Menu.Item>
              </Menu>
            }
            className={styles.translation}
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
              >
                <svg className={styles.translation}  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" /></svg>
            </a>
          </Dropdown>
        </li>
      )
      }

      {
        /** 微信公众号 */
        showWxQrcode &&
        <li className={styles.wxQrcode}>
          <Popover
            content={
              <img width="100%" height="100%" src="https://gw.alipayobjects.com/zos/antfincdn/ZKlx96dsfs/qrcode_for_gh_f52d8b6aa591_258.jpg" alt="wx-qrcode" />
            }
            title="微信扫一扫关注"
            overlayClassName="wx-qrcode-popover"
            overlayStyle={{ width: 128, height: 128 }}
            overlayInnerStyle={{ padding: 2 }}
          >
            <WechatOutlined />
          </Popover>
        </li>
      }

      {
        /** GitHub icon */
        showGithubCorner &&
        <li className={styles.githubCorner}>
          <a
            href={githubUrl}
            target="_blank" rel="noreferrer"
          >
            <GithubOutlined />
          </a>
        </li>
      }
    </ul>
  );

  return (
    <header
      className={cx(styles.header, {
        [styles.transparent]: !!transparent && !productMenuVisible,
        [styles.isHomePage]: !!isHomePage && !isAntVHome,
        [styles.lightTheme]: !!isAntVHome && !productMenuVisible && isWide,
        [styles.fixed]: popupMenuVisible,
      })}
    >
      <div className={styles.container}>
        <div className={styles.left}>
          <h1>
            <a href={siteUrl[lang] ? siteUrl[lang]: siteUrl}>{img}</a>
          </h1>
          {!isAntVHome && subTitle && (
            <>
              <span className={styles.divider} />
              <h2 className={styles.subProduceName}>
                <a href={(window.location.pathname.startsWith('/en')?'/en':'/')}>{subTitle}</a>
              </h2>
            </>
          )}
          {
            showSearch && !isAntVHome &&
            <Search {...searchOptions}  />
          }
        </div>
        <nav className={styles.nav}>
          {menu}
          {menuIcon}
        </nav>
      </div>
    </header>
  );
};

export const Header: React.FC<Partial<HeaderProps>> = (props) => {
  const { themeConfig } = useSiteData();
  const {
    title, siteUrl, githubUrl, isAntVSite, subTitleHref, internalSite,
    showSearch, showGithubCorner, showGithubStars, showLanguageSwitcher, showWxQrcode, defaultLanguage, showAntVProductsCard,
    versions, ecosystems, navs, docsearchOptions
  } = themeConfig;
  const searchOptions = {
    docsearchOptions
  }

  const locale = useLocale();
  const path = window.location.pathname;
  const isHomePage = 
    path === '/' ||
    path === `/${locale.id}` ||
    path === `/${locale.id}/`;

  const headerProps = {
    subTitle: title,
    subTitleHref,
    githubUrl,
    isAntVSite,
    siteUrl,
    internalSite,
    showSearch, showGithubCorner, showGithubStars, showLanguageSwitcher, showWxQrcode, defaultLanguage, showAntVProductsCard,
    versions, ecosystems, navs, searchOptions,
    isHomePage,
    transparent: isHomePage && isAntVSite,
  }

  return <HeaderComponent { ...Object.assign({} , headerProps, props)} />;
}
