/**
 * 服务模块
 * https://docs.leancloud.cn/sdk/storage/guide/js/
 */
import { MehOutlined, SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { useIntl, useLocale, useRouteMeta, useSiteData } from 'dumi';
import AV from 'leancloud-storage';
import React from 'react';
import { useGithubRepo } from '../../utils/github';

AV.init({
  appId: 'mAckVaWaCleA1L1tRu0vDkkl-gzGzoHsz',
  appKey: '5BCFPGawWnS37eHVnzSptNa5',
  serverURL: 'https://mackvawa.lc-cn-n1-shared.com',
});

export interface FeedbackApiParams {
  comment?: string;
  locale: string;
  rating?: string;
  repo: string;
  section?: string;
  ua: string;
  url: string;
  userId: string;
  version: string;
  title: string;
  reason?: string;
}

export const useFeedbackService = () => {
  const { formatMessage } = useIntl();
  const { owner, repo } = useGithubRepo();
  const meta = useRouteMeta();
  const { version } = useSiteData().themeConfig;
  const locale = useLocale().id;

  const commonParams: FeedbackApiParams = {
    locale,
    repo: `${owner}/${repo}`,
    ua: navigator.userAgent,
    url: window.location.href,
    userId: 'anonymous',
    version,
    title: meta.frontmatter.title,
  };

  const Feedback = AV.Object.extend('UserFeedback');

  const submitFeedback = (params: Partial<FeedbackApiParams>): Promise<AV.Object> => {
    const f = new Feedback();
    Object.entries({ ...commonParams, ...params }).forEach(([key, value]) => {
      f.set(key, value);
    });

    return f.save();
  };

  const showFeedbackResult = (success: boolean) => {
    const Icon = success ? SmileOutlined : MehOutlined;
    notification.info({
      message: formatMessage({ id: success ? '谢谢你的反馈意见！' : '报错了，请稍后再试' }),
      icon: <Icon style={{ color: '#873bf4' }} />,
      placement: 'bottomRight',
    });
  };

  return {
    submitFeedback,
    showFeedbackResult,
  };
};
