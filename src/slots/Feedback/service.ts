/**
 * 服务模块
 * https://docs.leancloud.cn/sdk/storage/guide/js/
 */
import AV from 'leancloud-storage';

AV.init({
  appId: 'iHqYaIUSgLOlOTkQxnqicMax-gzGzoHsz',
  appKey: 'fyjYpAT54tFGui2Vn6CYDMaf',
  serverURL: 'https://ihqyaius.lc-cn-n1-shared.com',
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
}

export function submitFeedback(params: FeedbackApiParams): Promise<AV.Object> {
  const Feedback = AV.Object.extend('UserFeedback');
  const f = new Feedback();

  Object.entries(params).forEach(([key, value]) => {
    f.set(key, value);
  });

  return f.save();
}
