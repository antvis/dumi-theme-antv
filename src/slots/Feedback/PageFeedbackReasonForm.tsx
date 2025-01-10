import { Alert, Button, Divider, Form, Select } from 'antd';
import { useIntl, useLocale } from 'dumi';
import React, { useEffect } from 'react';
import { styled } from 'styled-components';
import { useSnapshot } from 'valtio';
import { feedbackStore, resetPageFeedback } from '../../model/feedback';
import { useGithubRepo } from '../../utils/github';
import { useFeedbackService, type FeedbackApiParams } from './service';

const StyledFeedbackMessageWrapper = styled.div<{ $rating?: string }>`
  display: ${(props) => (props.$rating ? 'block' : 'none')};

  .ant-divider-horizontal {
    margin: 16px 0;
  }

  .alert {
    margin: 12px 0 16px;
    padding: 16px;
    font-size: 13px;
    line-height: 1.8;
    background-color: rgba(255, 251, 235, 0.5);
    border: 1px solid rgba(173, 104, 0, 0.15);
    border-radius: 8px;

    .ant-alert-icon {
      color: #cc8800;
    }
  }

  .alert-link {
    color: #56390c;
    font-weight: bold;
    text-decoration: underline;
  }

  .ant-form-item:last-child {
    margin-bottom: 8px;
  }
`;

export const PageFeedbackReasonForm: React.FC = () => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const feedbackState = useSnapshot(feedbackStore);
  const { owner, repo } = useGithubRepo();
  const pageUrl = window.location.href;

  const locale = useLocale();
  const currentLocale = locale.id;

  const issueUrl = `https://github.com/${owner}/${repo}/issues/new?labels=status%3A+waiting+for+maintainer%2Cdocs-feedback&template=docs-feedback.yml&title=[docs]+&page-url=${pageUrl}`;

  const alertMsg = (
    <div>
      {formatMessage({ id: '如果遇到问题或发现某些功能无法正常工作，请通过' })}
      <a onClick={() => window.open(issueUrl, '_blank')} className="alert-link">
        {formatMessage({ id: '提交问题报告' })}
      </a>
      {formatMessage({ id: '来反馈。否则，团队将无法提供进一步的答复或获取更多信息。' })}
    </div>
  );

  const { submitFeedback, showFeedbackResult } = useFeedbackService();

  const onFinish = (values: any) => {
    const params: Partial<FeedbackApiParams> = {
      rating: feedbackState.rating,
      reason: values.reason,
    };

    submitFeedback(params)
      .then((f) => {
        onCancel();
        showFeedbackResult(true);
      })
      .catch(() => {
        showFeedbackResult(false);
      });
  };

  const onCancel = () => {
    form.resetFields();
    resetPageFeedback();
  };

  useEffect(() => {
    if (!feedbackState.rating) onCancel();
  }, [feedbackState.rating]);

  const likeReasons = [
    { label: formatMessage({ id: '容易理解' }), value: 'easy_to_understand' },
    { label: formatMessage({ id: '解决了我的问题' }), value: 'solved_my_problem' },
    { label: formatMessage({ id: '其它' }), value: 'other' },
  ];

  const dislikeReasons = [
    { label: formatMessage({ id: '缺少我需要的信息' }), value: 'missing_information' },
    { label: formatMessage({ id: '过于复杂/步骤太多' }), value: 'too_complicated' },
    { label: formatMessage({ id: '内容更新不及时' }), value: 'out_of_date' },
    { label: formatMessage({ id: '示例/代码有问题' }), value: 'code_issue' },
    { label: formatMessage({ id: '其它' }), value: 'other' },
  ];

  const reasons = feedbackState.rating === '1' ? likeReasons : dislikeReasons;

  useEffect(() => {
    // 默认选中第一个原因
    form?.setFieldsValue({ reason: reasons[0].value });
  }, [feedbackState.rating, currentLocale]);

  const dislike = feedbackState.rating !== '1';

  return (
    <StyledFeedbackMessageWrapper $rating={feedbackState.rating}>
      <Divider dashed />
      <div className="form">
        <Form form={form} name="page-feedback-form" onFinish={onFinish} layout="vertical">
          <Form.Item name="reason" label={formatMessage({ id: '🚀 留下你的真实感受' })}>
            <Select options={reasons} />
          </Form.Item>

          {dislike && <Alert type="warning" className="alert" message={alertMsg} showIcon />}

          <Form.Item style={{ textAlign: 'right' }}>
            <Button htmlType="button" type="text" size="small" onClick={onCancel} style={{ marginRight: 8 }}>
              {formatMessage({ id: '取消' })}
            </Button>
            <Button type="primary" htmlType="submit" size="small">
              {formatMessage({ id: '提交' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </StyledFeedbackMessageWrapper>
  );
};
