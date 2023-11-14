import React from 'react';
import { default as RCFooter, FooterProps as RcFooterProps } from 'rc-footer';
import {
  GithubOutlined,
  WeiboOutlined,
  ZhihuOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import cx from 'classnames';
import { omit } from 'lodash-es';
import classnames from 'classnames';
import { useLocale, FormattedMessage, useSiteData } from 'dumi';

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
export const Footer: React.FC<FooterProps> = (props) => {
  const {
    columns,
    bottom,
    language,
    isDynamicFooter,
    rootDomain = '',
    className,
    ...restProps
  } = props;
  const { themeConfig } = useSiteData();
  const locale = useLocale();
  const lang = locale.id;
  const { footerTheme = 'dark' } = themeConfig;
  const { theme = footerTheme } = restProps;

  const getColumns = () => {
    // 如果外部没有传入 columns，则默认展示 antv footer
    const col1 = {
      title: 'Resources',
      items: [
        {
          title: 'Ant Design',
          url: 'https://ant.design',
          openExternal: true,
        },
        {
          title: 'Ant Design Mobile',
          url: 'https://mobile.ant.design',
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
          title: <FormattedMessage id="国内镜像" />,
          url: 'https://antv.antgroup.com/',
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
          icon: (
            <img
              src='https://gw.alipayobjects.com/zos/rmsportal/mZBWtboYbnMkTBaRIuWQ.png'
              alt='seeconf'
            />
          ),
          title: 'SEE Conf',
          description: <FormattedMessage id="蚂蚁体验科技大会" />,
          url: 'https://seeconf.antfin.com/',
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
      icon: (
        <img
          src='https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg'
          alt='more products'
        />
      ),
      title: '更多产品',
      items: [
        {
          icon: (
            <img
              src='https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
              alt='Ant Design'
            />
          ),
          title: 'Ant Design',
          url: 'https://ant.design',
          description: '企业级 UI 设计语言',
          openExternal: true,
        },
        {
          icon: (
            <img
              src='https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg'
              alt='yuque'
            />
          ),
          title: '语雀',
          url: 'https://yuque.com',
          description: '知识创作与分享工具',
          openExternal: true,
        },
        {
          icon: (
            <img
              src='https://gw.alipayobjects.com/zos/antfincdn/v2%24rh7lqpu/82f338dd-b0a6-41bc-9a86-58aaa9df217b.png'
              alt='Egg'
            />
          ),
          title: 'Egg',
          url: 'https://eggjs.org',
          description: '企业级 Node 开发框架',
          openExternal: true,
        },
        {
          icon: (
            <img
              src='https://gw.alipayobjects.com/zos/rmsportal/DMDOlAUhmktLyEODCMBR.ico'
              alt='kitchen'
            />
          ),
          title: 'Kitchen',
          description: 'Sketch 工具集',
          url: 'https://kitchen.alipay.com',
          openExternal: true,
        },
        {
          icon: (
            <img
              src='https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg'
              alt='xtech'
            />
          ),
          title: '蚂蚁体验科技',
          url: 'https://xtech.antfin.com/',
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
              {
                theme === 'light' ?
                  '© Copyright 2022 Ant Group Co., Ltd..备案号：京ICP备15032932号-38' :
                  <>
                    <div>
                      <a
                        href='https://weibo.com/antv2017'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <WeiboOutlined />
                      </a>
                      <a
                        href='https://zhuanlan.zhihu.com/aiux-antv'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <ZhihuOutlined />
                      </a>
                      <a
                        href='https://github.com/antvis'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <GithubOutlined />
                      </a>
                      <a href={`${rootDomain}/${lang}/about`}>{<FormattedMessage id="关于我们" />}</a>
                    </div>
                    <div>
                      © {new Date().getFullYear()} Made with ❤ by{' '}
                      <a href='https://xtech.antfin.com/'>AntV</a>
                    </div>
                  </>
              }
            </div>
          </>
        )
      }
      {...omit(restProps, ['githubUrl'])}
    />
  );
};
