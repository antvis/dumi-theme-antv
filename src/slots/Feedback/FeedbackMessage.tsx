import { MehOutlined, SmileOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, notification, Switch } from 'antd';
import { useIntl, useLocale, useRouteMeta } from 'dumi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import useSWR from 'swr';
import { useSnapshot } from 'valtio';
import { feedbackStore, invokeSectionFeedback, resetFeedbackState } from '../../model/feedback';
import { getLatestVersion, useGithubRepo } from '../../utils/github';
import { submitFeedback, type FeedbackApiParams } from './service';

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
  const feedbackState = useSnapshot(feedbackStore);
  const { owner, repo } = useGithubRepo();
  const meta = useRouteMeta();
  const [enableRealName, setEnableRealName] = useState(false);
  const pageUrl = window.location.href;

  const locale = useLocale();
  const currentLocale = locale.id;

  const issueUrl = `https://github.com/${owner}/${repo}/issues/new?labels=status%3A+waiting+for+maintainer%2Cdocs-feedback&template=docs-feedback.yml&title=[docs]+&page-url=${pageUrl}`;

  const alertMsg = (
    <div>
      {formatMessage({ id: '如果遇到问题或发现某些功能无法正常工作，请通过' })}
      <Link to={issueUrl} className="alert-link">
        {formatMessage({ id: '提交问题报告' })}
      </Link>
      {formatMessage({ id: '来反馈。否则，团队将无法提供进一步的答复或获取更多信息。' })}
    </div>
  );

  const openNotification = (success: boolean) => {
    notification.info({
      message: formatMessage({ id: success ? '反馈已提交' : '报错了，请稍后再试' }),
      description: formatMessage({
        id: success ? '感谢你的支持！' : '如果问题持续，请前往 GitHub 提交 issue。',
      }),
      icon: success ? <SmileOutlined style={{ color: '#873bf4' }} /> : <MehOutlined style={{ color: '#873bf4' }} />,
      placement: 'bottomLeft',
    });
  };

  const { data: lastVersion } = useSWR(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, () =>
    getLatestVersion(owner, repo),
  );

  const onFinish = async (values: any) => {
    const params: FeedbackApiParams = {
      comment: values.comment,
      locale: currentLocale,
      url: pageUrl,
      rating: feedbackState.rating,
      repo: `${owner}/${repo}`,
      section: feedbackState.section,
      ua: navigator.userAgent,
      userId: enableRealName ? values.userId : 'anonymous',
      version: lastVersion,
      title: meta.frontmatter.title,
    };

    submitFeedback(params)
      .then((f) => {
        form.setFieldValue('comment', '');
        openNotification(true);
      })
      .catch(() => {
        openNotification(false);
      });
  };

  const onCancel = () => {
    resetFeedbackState();
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const buttons = document.querySelectorAll('.comment-link');
      if (!buttons || buttons.length === 0) return;

      const focusCommentInput = (e) => {
        const button = e.target.closest('.comment-link');
        invokeSectionFeedback(button.getAttribute('data-feedback-hash'));
      };

      buttons.forEach((button) => {
        button.addEventListener('click', focusCommentInput);
      });

      return () => {
        buttons.forEach((button) => {
          button.removeEventListener('click', focusCommentInput);
        });
      };
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!feedbackState.show) {
      form.setFieldValue('comment', '');
      setEnableRealName(false);
    }
  }, [feedbackState.show]);

  useEffect(() => {
    if (feedbackState.section) {
      form.scrollToField('comment', { behavior: 'smooth', block: 'center' });
    }
  }, [feedbackState.section]);

  const showAlert = feedbackState.rating !== '1';

  const getCommentFieldLabel = () => {
    if (feedbackState.rating === '1') {
      return formatMessage({ id: '你认为这个页面有哪些做的好的地方？（可选）' });
    } else if (feedbackState.rating === '0') {
      return formatMessage({ id: '你觉得我们可以如何改进此页面？（可选）' });
    } else {
      const leftQuote = currentLocale === 'zh' ? '「' : '"';
      const rightQuote = currentLocale === 'zh' ? '」' : '"';

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

  return (
    <StyledFeedbackMessageWrapper $show={feedbackState.show}>
      <Divider dashed />
      <div className="form">
        <Form form={form} name="comment" onFinish={onFinish} layout="vertical">
          <Switch
            checkedChildren="实名"
            unCheckedChildren="匿名"
            checked={enableRealName}
            onChange={setEnableRealName}
            style={{ marginBottom: 16 }}
          />
          {enableRealName && (
            <Form.Item name="userId" label={formatMessage({ id: 'Github ID' })}>
              <Input style={{ width: '220px' }} />
            </Form.Item>
          )}
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
