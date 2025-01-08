import { Alert, Button, Divider, Form, Input } from 'antd';
import { useIntl } from 'dumi';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

const StyledFeedbackMessageWrapper = styled.div`
  .alert {
    border-radius: 8px;
    margin: 12px 0 16px;
    padding: 16px;
    background-color: rgba(255, 251, 235, 0.5);
    border: 1px solid rgba(173, 104, 0, 0.15);
    line-height: 1.8;

    .ant-alert-icon {
      color: #cc8800;
    }
  }

  .alert-link {
    text-decoration: underline;
    font-weight: bold;
    color: #56390c;
  }
`;

export const FeedbackMessage: React.FC = () => {
  const [show, setShow] = useState();
  const { formatMessage } = useIntl();

  // const description = useMemo(() => {
  //   'How can we improve this page? (optional)';
  //   'What did you like about this page? (optional)';
  //   "How can we improve \"\" section? (optional)";
  // }, []);

  const alertMsg = (
    <div>
      {formatMessage({ id: '如果遇到问题或发现某些功能无法正常工作，请通过' })}
      <Link to={''} className="alert-link">
        {formatMessage({ id: '提交问题报告' })}
      </Link>
      {formatMessage({ id: '来反馈。否则，团队将无法提供进一步的答复或获取更多信息。' })}
    </div>
  );

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onReset = () => {};

  return (
    <StyledFeedbackMessageWrapper>
      <Divider dashed />
      <div className="form">
        <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" layout="vertical">
          <Form.Item name="comment" label="How can we improve this page? (optional)">
            <Input.TextArea rows={5} />
          </Form.Item>
          <Alert type="warning" className="alert" message={alertMsg} showIcon />
          <Form.Item style={{ textAlign: 'right' }}>
            <Button htmlType="button" type="text" onClick={onReset}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </StyledFeedbackMessageWrapper>
  );
};
