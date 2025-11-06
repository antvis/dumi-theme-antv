import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Modal } from 'antd';
import { parse } from 'query-string';
import { chinaMobilePhoneRE, getFingerprint, SignupRegion } from './utils';
import CheckCode from './CheckCode';
import classNames from 'classnames';
import './LoginForm.less';
import { useIntl } from 'dumi';
import {loginOrRegister} from "../../model/auth";
import {MobileOutlined} from "@ant-design/icons";

const userProtocolLink = 'https://render.alipay.com/p/c/180021120000001078/index.html?agreementId=AG01001502';

const isInMainlandChina = () => {
  // 1. 检查时区（中国大陆为 UTC+8）
  const isChinaTimezone = Intl?.DateTimeFormat?.()
    ?.resolvedOptions?.()
    ?.timeZone?.includes('Asia/Shanghai');

  // 2. 检查浏览器语言（中文环境）
  const isChineseLang = navigator?.language?.startsWith('zh-CN');

  return isChinaTimezone || isChineseLang;
};

export default function LoginForm() {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [protocolAgreed, setProtocolAgreed] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  async function handleLoginOrRegister(values: any) {
    const platform =
      new URL(window.location.href).searchParams.get('platform') || 'web';
    const params = {
      ...values,
      platform,
    };
    // 获取设备指纹
    const fingerprintRes = await getFingerprint();
    params.fingerprint = fingerprintRes.visitorId;

    // 如果不在中国大陆，标记可能是海外用户
    if (!isInMainlandChina()) {
      params.signupRegion = SignupRegion.possible_oversea;
    }

    const res: any = await loginOrRegister(params);
    const { goto: gotoFromServer } = res;
    const { goto: gotoFromUrl } = parse(window.location.search);
    window.location.href = gotoFromUrl || gotoFromServer || '/';
  }

  async function handleProtocolConfirmModal() {
    return modal.confirm({
      title: formatMessage({ id: 'login.user.protocol.title' }),
      icon: null,
      content: (
        <div>
          {formatMessage({ id: 'login.user.protocol.content' })}
          <a href={userProtocolLink} target="blank">
            {formatMessage({ id: 'login.user.protocol.link' })}
          </a>
        </div>
      ),
      okText: formatMessage({ id: 'login.protocol.agree' }),
      onOk: () => {
        setProtocolAgreed(true);
        return true;
      },
      onCancel: () => {
        setSubmitting(false);
        return false;
      },
      cancelText: formatMessage({ id: 'login.protocol.disagree' }),
    });
  }

  async function onFinish(values: any) {
    setSubmitting(true);
    try {
      if (!protocolAgreed) {
        const confirmedModal = await handleProtocolConfirmModal();
        if (confirmedModal) {
          handleLoginOrRegister(values);
        } else {
          setSubmitting(false);
        }
      } else {
        handleLoginOrRegister(values);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={classNames('account-login form-pro')}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="login"
          className="mobile-code-field"
          validateTrigger={['onSubmit', 'onBlur']}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'login.placeholder.phone' })
            },
            {
              validator(rule, value, callback) {
                if (!value) {
                  callback();
                  return;
                }
                if (
                  !chinaMobilePhoneRE.test(value)
                ) {
                  callback(formatMessage({ id: 'login.error.invalid.phone' }));
                  return;
                }
                callback();
              },
            },
          ]}
        >
          <Input
            placeholder={formatMessage({ id: 'login.placeholder.phone' })}
            autoComplete="off"
            addonBefore="+86"
          />
        </Form.Item>
        <div className="login-check-code">
          <CheckCode form={form} />
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="btn-login"
            loading={submitting}
          >
            <span>{formatMessage({ id: 'login.button.login.or.register' })}</span>
          </Button>
        </Form.Item>
      </Form>
      <Checkbox
        className="protocol-check"
        checked={protocolAgreed}
        onChange={e => setProtocolAgreed(e.target.checked)}
      >
        {formatMessage({ id: 'login.protocol.read.agree' })}
        <a href={userProtocolLink} target="_blank" rel="noreferrer">
          {formatMessage({ id: 'login.protocol.link' })}
        </a>
      </Checkbox>
      <div>{contextHolder}</div>
    </div>
  );
}
