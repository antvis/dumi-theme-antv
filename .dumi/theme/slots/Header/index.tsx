// import { navigate } from 'gatsby';
import React, { useState, useEffect } from 'react';
import { useMedia } from 'react-use';
import cx from 'classnames';
import { useSiteData } from 'dumi';
import { useTranslation } from 'react-i18next';
import {
  GithubOutlined,
  MenuOutlined,
  CaretDownFilled,
  DownOutlined,
  WechatOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import { Popover, Menu, Dropdown, Select } from 'antd';
import { map, size } from 'lodash-es';
import { Search } from './Search';
import { Products } from './Products';
import { Navs, INav } from './Navs';
import { Logo } from './Logo';
import { LogoWhite } from './LogoWhite';

import styles from './index.module.less';

export type HeaderProps = {
  pathPrefix?: string;
  path?: string;
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
  /** 是否展示国内镜像链接 */
  showChinaMirror?: boolean;
  /** 是否显示 AntV 产品卡片 */
  showAntVProductsCard?: boolean;
  /** 展示版本切换 */
  versions?: { [key: string]: string };
  /** 展示周边生态 */
  ecosystems?: Array<{
    name: Record<string /** zh, en */, string>;
    url: string;
  }>;
}

/**
 * 头部菜单
 */
const HeaderComponent: React.FC<HeaderProps> = ({
  subTitle = '',
  subTitleHref,
  pathPrefix = '',
  path = '',
  navs = [],
  showSearch = true,
  showGithubStar = false,
  showGithubCorner = true,
  showAntVProductsCard = true,
  showLanguageSwitcher = true,
  showChinaMirror = true,
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
  ecosystems,
}) => {
  const { t, i18n } = useTranslation();
  const isAntVHome = isAntVSite && isHomePage; // 是否为AntV官网首页

  const lang =
    typeof defaultLanguage !== 'undefined'
      ? defaultLanguage
      : i18n.language || '';
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
  }, [path]);

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
        size(navs) &&
        <Navs navs={navs} path={path} />
      }

      {
        /** 生态产品 */
        size(ecosystems) &&
        <li>
          <Dropdown
            className={styles.ecoSystems}
            overlay={
              <Menu>
                {map(ecosystems, ({ url, name: ecosystemName }) => (
                  <Menu.Item key={ecosystemName?.[lang]}>
                    <a target="_blank" rel="noreferrer" href={url}>
                      {ecosystemName?.[lang]} <LikeOutlined />
                    </a>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <span>
              {t('周边生态')}
              <DownOutlined style={{ marginLeft: '6px' }} />
            </span>
          </Dropdown>
        </li>
      }

      {
        /** 产品列表 */
        showAntVProductsCard &&
        <li { ...productItemProps }>
          <a>
            所有产品
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
            target="_blank"
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
            <a href={siteUrl}>{img}</a>
          </h1>
          {subTitle && (
            <>
              <span className={styles.divider} />
              <h2 className={styles.subProduceName}>
                <a href="/">{subTitle}</a>
              </h2>
            </>
          )}
          {
            showSearch && !isAntVHome &&
            <Search />
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
    title, siteUrl, githubUrl, isAntVSite, subTitleHref,
    showSearch, showGithubCorner, showGithubStars, showLanguageSwitcher, showWxQrcode, defaultLanguage, showAntVProductsCard,
    versions, ecosystems, navs,
  } = themeConfig;

  const headerProps = {
    subTitle: title,
    subTitleHref,
    githubUrl,
    isAntVSite,
    siteUrl,
    showSearch, showGithubCorner, showGithubStars, showLanguageSwitcher, showWxQrcode, defaultLanguage, showAntVProductsCard,
    versions, ecosystems, navs,
    isHomePage: true,
  }

  return <HeaderComponent { ...Object.assign({} , headerProps, props)} />;
}
