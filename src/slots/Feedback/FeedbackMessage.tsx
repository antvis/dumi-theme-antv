import { SmileOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, notification } from 'antd';
import { useIntl, useLocale } from 'dumi';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import { useSnapshot } from 'valtio';
import { feedbackStore, invokeSectionFeedback, resetFeedbackState } from '../../model/feedback';

const StyledFeedbackMessageWrapper = styled.div<{ $show: boolean }>`
  display: ${(props) => (props.$show ? 'block' : 'none')};

  .alert {
    margin: 12px 0 16px;
    padding: 16px;
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
`;

export const FeedbackMessage: React.FC = () => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const locale = useLocale();
  const currentLocale = locale.id;
  const feedbackState = useSnapshot(feedbackStore);

  const alertMsg = (
    <div>
      {formatMessage({ id: '如果遇到问题或发现某些功能无法正常工作，请通过' })}
      <Link to={''} className="alert-link">
        {formatMessage({ id: '提交问题报告' })}
      </Link>
      {formatMessage({ id: '来反馈。否则，团队将无法提供进一步的答复或获取更多信息。' })}
    </div>
  );

  const openNotification = () => {
    notification.info({
      message: '反馈已提交',
      icon: <SmileOutlined style={{ color: '#873bf4' }} />,
      placement: 'bottomLeft',
    });
  };

  const onFinish = (values: any) => {
    const params = {
      ...values,
      ...(feedbackState.rating ? { rating: feedbackState.rating } : {}),
      ...(feedbackState.section ? { section: feedbackState.section } : {}),
    };
    console.log('Received values:', params);
    openNotification();
  };

  const onCancel = () => {
    resetFeedbackState();
  };

  useEffect(() => {
    const buttons = document.querySelectorAll('.comment-link');
    if (!buttons || buttons.length === 0) return;

    const focusCommentInput = (e) => {
      const button = e.target.closest('.comment-link');
      invokeSectionFeedback(button.getAttribute('data-feedback-hash'));
      setTimeout(() => {
        form.scrollToField('comment', { behavior: 'smooth', block: 'center' });
      }, 0);
    };

    buttons.forEach((button) => {
      button.addEventListener('click', focusCommentInput);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener('click', focusCommentInput);
      });
    };
  }, [form]);

  const showAlert = feedbackState.rating !== '1';

  const leftQuote = currentLocale === 'zh' ? '「' : '"';
  const rightQuote = currentLocale === 'zh' ? '」' : '"';

  const getCommentFieldLabel = () => {
    if (feedbackState.rating === '1') {
      return formatMessage({ id: '你认为这个页面有哪些做的好的地方？（可选）' });
    } else if (feedbackState.rating === '0') {
      return formatMessage({ id: '你觉得我们可以如何改进此页面？（可选）' });
    } else {
      return (
        <div>
          {formatMessage({ id: '你认为该' })}{' '}
          <b>
            {leftQuote}
            {feedbackState.section}
            {rightQuote}
          </b>{' '}
          {formatMessage({ id: '部分如何改进更好？（可选）' })}
        </div>
      );
    }
  };

  useEffect(() => {
    if (!feedbackState.show) {
      form.resetFields();
    }
  }, [feedbackState.show]);

  return (
    <StyledFeedbackMessageWrapper $show={feedbackState.show}>
      <Divider dashed />
      <div className="form">
        <Form form={form} name="comment" onFinish={onFinish} layout="vertical">
          <Form.Item name="comment" label={getCommentFieldLabel()}>
            <Input.TextArea rows={5} />
          </Form.Item>
          {showAlert && <Alert type="warning" className="alert" message={alertMsg} showIcon />}
          <Form.Item style={{ textAlign: 'right' }}>
            <Button htmlType="button" type="text" onClick={onCancel} style={{ marginRight: 8 }}>
              {formatMessage({ id: '取消' })}
            </Button>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: '提交' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </StyledFeedbackMessageWrapper>
  );
};
