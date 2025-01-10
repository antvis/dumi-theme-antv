import { Button, Form, Input } from 'antd';
import { useIntl, useLocale } from 'dumi';
import React from 'react';
import { styled } from 'styled-components';
import { useSnapshot } from 'valtio';
import { feedbackStore, resetSectionFeedback } from '../../model/feedback';
import { useFeedbackService } from './service';

const StyledForm = styled(Form)`
  .ant-form-item:last-child {
    margin-bottom: 8px;
  }
`;

export const SectionFeedbackCommentForm: React.FC = () => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const feedbackState = useSnapshot(feedbackStore);

  const locale = useLocale();
  const currentLocale = locale.id;

  const onCancel = () => {
    form.resetFields();
    resetSectionFeedback();
  };

  const { submitFeedback, showFeedbackResult } = useFeedbackService();
  const onFinish = (values) => {
    submitFeedback({
      comment: values.comment,
    })
      .then(() => {
        onCancel();
        showFeedbackResult(true);
      })
      .catch(() => {
        showFeedbackResult(false);
      });
  };

  const getCommentFieldLabel = () => {
    const leftQuote = currentLocale === 'zh' ? '「' : '"';
    const rightQuote = currentLocale === 'zh' ? '」' : '"';

    return (
      <div>
        {formatMessage({ id: '📖 你认为' })}{' '}
        <b>
          {leftQuote}
          {feedbackState.section}
          {rightQuote}
        </b>{' '}
        {formatMessage({ id: '部分如何改进更好？' })}
      </div>
    );
  };

  return (
    <StyledForm name="section-feedback-form" form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="comment" label={getCommentFieldLabel()}>
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button htmlType="button" type="text" size="small" onClick={onCancel} style={{ marginRight: 8 }}>
          {formatMessage({ id: '取消' })}
        </Button>
        <Button type="primary" htmlType="submit" size="small">
          {formatMessage({ id: '提交' })}
        </Button>
      </Form.Item>
    </StyledForm>
  );
};
