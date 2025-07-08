import { GithubOutlined, QuestionCircleOutlined, WeiboOutlined, ZhihuOutlined } from '@ant-design/icons';
import { default as classnames, default as cx } from 'classnames';
import { FormattedMessage, useLocale, useSiteData } from 'dumi';
import { omit } from 'lodash-es';
import { default as RCFooter, FooterProps as RcFooterProps } from 'rc-footer';
import React from 'react';

import 'rc-footer/assets/index.less';
import styles from './index.module.less';

interface FooterProps extends RcFooterProps {
  rootDomain?: string;
  language?: string;
  githubUrl?: string;
  /**
   * 是否为动态 footer
   */
  isDynamicFooter?: boolean;
}

/**
 * 底部菜单
 * @returns
 */
const Footer: React.FC<FooterProps> = (props) => {
  const { columns, bottom, language, isDynamicFooter, rootDomain = '', className, ...restProps } = props;
  const { themeConfig } = useSiteData();
  const locale = useLocale();
  const lang = locale.id;
  const { footerTheme = 'dark' } = themeConfig;
  const { theme = footerTheme } = restProps;

  const getColumns = () => {
    // 如果外部没有传入 columns，则默认展示 antv footer
    const col1 = {
      title: <FormattedMessage id="资源" />,
      items: [
        {
          title: 'Ant Design',
          url: 'https://ant.design',
          openExternal: true,
        },
        {
          title: 'Galacea Effects',
          url: 'https://galacean.antgroup.com/effects/',
          openExternal: true,
        },
        {
          title: 'Umi',
          description: <FormattedMessage id="React 应用开发框架" />,
          url: 'https://umijs.org',
          openExternal: true,
        },
        {
          title: 'Dumi',
          description: <FormattedMessage id="组件/文档研发工具" />,
          url: 'https://d.umijs.org',
          openExternal: true,
        },
        {
          title: 'ahooks',
          description: <FormattedMessage id="React Hooks 库" />,
          url: 'https://github.com/alibaba/hooks',
          openExternal: true,
        },
        {
          title: 'WeaveFox',
          description: <FormattedMessage id="前端智能研发" />,
          url: 'https://github.com/weavefox',
          openExternal: true,
        },
      ],
    };

    const col2 = {
      title: <FormattedMessage id="社区" />,
      items: [
        {
          icon: <ZhihuOutlined style={{ color: '#0084ff' }} />,
          title: <FormattedMessage id="体验科技专栏" />,
          url: 'http://zhuanlan.zhihu.com/xtech',
          openExternal: true,
        },
        {
          icon: <img src="https://gw.alipayobjects.com/zos/rmsportal/mZBWtboYbnMkTBaRIuWQ.png" alt="seeconf" />,
          title: 'SEE Conf',
          description: <FormattedMessage id="蚂蚁体验科技大会" />,
          url: 'https://seeconf.antfin.com/',
          openExternal: true,
        },
        {
          icon: <img src="https://mdn.alipayobjects.com/huamei_4qpv3u/afts/img/iH6wQKX4WCYAAAAAAAAAAAAAeocTAQFr/original" alt="weavefox" />,
          title: 'WeaveFox',
          description: <FormattedMessage id="WeaveFox 智能研发技术社区" />,
          url: 'https://www.yuque.com/weavefox/blog',
          openExternal: true,
        },
      ],
    };

    const col3 = {
      title: <FormattedMessage id="帮助" />,
      items: [
        {
          icon: <GithubOutlined />,
          title: 'GitHub',
          url: 'https://github.com/antvis',
          openExternal: true,
        },
        {
          icon: <QuestionCircleOutlined />,
          title: <FormattedMessage id="StackOverflow" />,
          url: 'http://stackoverflow.com/questions/tagged/antv',
          openExternal: true,
        },
      ],
    };

    const more = {
      icon: <img src="https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg" alt="more products" />,
      title: <FormattedMessage id="更多产品" />,
      items: [
        {
          icon: <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="Ant Design" />,
          title: 'Ant Design',
          url: 'https://ant.design',
          description: <FormattedMessage id="企业级 UI 设计语言" />,
          openExternal: true,
        },
        {
          icon: <img src="https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg" alt="yuque" />,
          title: <FormattedMessage id="语雀" />,
          url: 'https://yuque.com',
          description: <FormattedMessage id="知识创作与分享工具" />,
          openExternal: true,
        },
        {
          icon: (
            <img
              src="https://gw.alipayobjects.com/zos/antfincdn/v2%24rh7lqpu/82f338dd-b0a6-41bc-9a86-58aaa9df217b.png"
              alt="Egg"
            />
          ),
          title: 'Egg',
          url: 'https://eggjs.org',
          description: <FormattedMessage id="企业级 Node 开发框架" />,
          openExternal: true,
        },
        {
          icon: <img src="https://gw.alipayobjects.com/zos/rmsportal/DMDOlAUhmktLyEODCMBR.ico" alt="kitchen" />,
          title: 'Kitchen',
          description: <FormattedMessage id="Sketch 工具集" />,
          url: 'https://kitchen.alipay.com',
          openExternal: true,
        },
        {
          icon: (
            <img
              src="https://mdn.alipayobjects.com/huamei_j9rjmc/afts/img/A*3ittT5OEo2gAAAAAAAAAAAAADvGmAQ/original"
              width={16}
              height={16}
              alt="Galacean"
            />
          ),
          title: 'Galacean',
          description: <FormattedMessage id="互动图形解决方案" />,
          url: 'https://galacean.antgroup.com',
          openExternal: true,
        },
        {
          icon: <img src="https://mdn.alipayobjects.com/huamei_4qpv3u/afts/img/iH6wQKX4WCYAAAAAAAAAAAAAeocTAQFr/original" alt="weavefox" />,
          title: 'WeaveFox',
          description: <FormattedMessage id="前端智能研发" />,
          url: 'https://weavefox.alipay.com',
          openExternal: true,
        },
      ],
    };

    return [col1, col2, col3, more];
  };

  return (
    <RCFooter
      maxColumnsPerRow={5}
      theme={theme}
      columns={columns || getColumns()}
      className={classnames(styles.footer, className, {
        [styles.light]: theme === 'light',
        [styles.withMenu]: isDynamicFooter,
      })}
      bottom={
        bottom || (
          <>
            <div
              className={cx(styles.bottom, {
                [styles.light]: theme === 'light',
              })}
            >
              {theme === 'light' ? (
                `© Copyright ${new Date().getFullYear()} Ant Group Co., Ltd..备案号：京ICP备15032932号-38`
              ) : (
                <>
                  <div>
                    <a href="https://weibo.com/antv2017" target="_blank" rel="noopener noreferrer">
                      <WeiboOutlined />
                    </a>
                    <a href="https://zhuanlan.zhihu.com/aiux-antv" target="_blank" rel="noopener noreferrer">
                      <ZhihuOutlined />
                    </a>
                    <a href="https://github.com/antvis" target="_blank" rel="noopener noreferrer">
                      <GithubOutlined />
                    </a>
                    <a href={`${rootDomain}/${lang}/about`}>{<FormattedMessage id="关于我们" />}</a>
                  </div>
                  <div>
                    © {new Date().getFullYear()} Made with ❤ by <a href="https://xtech.antfin.com/">AntV</a>
                  </div>
                </>
              )}
            </div>
          </>
        )
      }
      {...omit(restProps, ['githubUrl'])}
    />
  );
};

export default Footer;
