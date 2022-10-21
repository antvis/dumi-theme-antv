import React, { useState, useEffect } from 'react';
import { default as RCFooter, FooterProps as RcFooterProps } from 'rc-footer';
import { useTranslation } from 'react-i18next';
import {
  GithubOutlined,
  WeiboOutlined,
  ZhihuOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import cx from 'classnames';
import { omit } from 'lodash-es';

import 'rc-footer/assets/index.less';
import styles from './index.module.less';
import classnames from 'classnames';

interface FooterProps extends RcFooterProps {
  rootDomain?: string;
  language?: string;
  githubUrl?: string;
}

/**
 * 底部菜单
 * @returns
 */
export const Footer: React.FC<FooterProps> = ({
                                                columns,
                                                bottom,
                                                theme = 'dark',
                                                language,
                                                rootDomain = '',
                                                ...restProps
                                              }) => {
  const { t, i18n } = useTranslation();
  const lang = language || i18n.language;

  // TODO: 待迁移
  const [withMenu, setWithMenu] = useState<boolean>(true);

  const getColums = () => {
    // 如果外部没有传入 columns，则默认展示 antv footer
    const col1 = {
      title: t('Resources'),
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
          description: t('React 应用开发框架'),
          url: 'https://umijs.org',
          openExternal: true,
        },
        {
          title: 'Dumi',
          description: t('组件/文档研发工具'),
          url: 'https://d.umijs.org',
          openExternal: true,
        },
        {
          title: 'ahooks',
          description: t('React Hooks 库'),
          url: 'https://github.com/alibaba/hooks',
          openExternal: true,
        },
        {
          title: t('国内镜像'),
          url: 'https://antv.antgroup.com/',
        },
      ],
    };

    const col2 = {
      title: t('社区'),
      items: [
        {
          icon: <ZhihuOutlined style={{ color: '#0084ff' }} />,
          title: t('体验科技专栏'),
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
          description: t('蚂蚁体验科技大会'),
          url: 'https://seeconf.antfin.com/',
          openExternal: true,
        },
      ],
    };

    const col3 = {
      title: t('帮助'),
      items: [
        {
          icon: <GithubOutlined />,
          title: 'GitHub',
          url: 'https://github.com/antvis',
          openExternal: true,
        },
        {
          icon: <QuestionCircleOutlined />,
          title: t('StackOverflow'),
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
      title: t('更多产品'),
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
          description: t('企业级 UI 设计语言'),
          openExternal: true,
        },
        {
          icon: (
            <img
              src='https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg'
              alt='yuque'
            />
          ),
          title: t('语雀'),
          url: 'https://yuque.com',
          description: t('知识创作与分享工具'),
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
          description: t('企业级 Node 开发框架'),
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
          description: t('Sketch 工具集'),
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
          title: t('蚂蚁体验科技'),
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
      columns={columns || getColums()}
      className={classnames(styles.footer, {
        [styles.withMenu]: withMenu,
      })}
      bottom={
        bottom || (
          <>
            <div className={styles.bottom}>
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
                <a href={`${rootDomain}/${lang}/about`}>{t('关于我们')}</a>
              </div>
              <div>
                © {new Date().getFullYear()} Made with ❤ by{' '}
                <a href='https://xtech.antfin.com/'>AntV</a>
              </div>
            </div>
          </>
        )
      }
      {...omit(restProps, ['githubUrl'])}
    />
  );
};
