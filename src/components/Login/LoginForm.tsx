import { useState, useCallback } from 'react';
import { Button, Checkbox, Form, Input, Modal } from 'antd';
import { parse } from 'query-string';
import { chinaMobilePhoneRE, emailRegex } from 'Isomorphic/validator/mobile';
import CheckCode from '@/component/CheckCode';
import classNames from 'classnames';
import * as AccountImp from '@/sdk/user/AccountController';
import { relocate } from 'Common/utils/location';
import debounce from 'lodash/debounce';
import './LoginForm.less';
import { SignupRegion } from 'Isomorphic/constants/user';
import { getFingerprint } from '@/util/fingerprint';
import { SetStep, STEP } from './types';
import { AuthScene, openAuthWindow } from './openAuthWindow';
import { useIntl } from 'dumi';
import React from 'react';

type Props = {
  en?: boolean;
  setStep: SetStep;
  setStepContextData: (data: any) => void;
};

const userProtocolLink =
  'https://render.alipay.com/p/c/180021120000001078/index.html?agreementId=AG01001502';
/**
 * 判断是否在中国内陆
 * 用于优化非中国内陆用户的注册提示 和 打标可能的海外用户
 *
 * 临时方案，后续可能会有更好的方案
 */
const isInMainlandChina = () => {
  // 1. 检查时区（中国大陆为 UTC+8）
  const isChinaTimezone = Intl?.DateTimeFormat?.()
    ?.resolvedOptions?.()
    ?.timeZone?.includes('Asia/Shanghai');

  // 2. 检查浏览器语言（中文环境）
  const isChineseLang = navigator?.language?.startsWith('zh-CN');

  return isChinaTimezone || isChineseLang;
};

export default function LoginForm(props: Props) {
  const { en, setStep, setStepContextData } = props;
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

    const res: any = await AccountImp.loginOrRegister(params);
    const {
      isDefaultNickname,
      isEmailEmpty,
      user,
      goto: gotoFromServer,
      isNewUser,
    } = res;
    const { goto: gotoFromUrl } = parse(window.location.search);
    const goto = gotoFromUrl || gotoFromServer || '/';

    if (isNewUser && (isDefaultNickname || isEmailEmpty)) {
      setStep(STEP.CompleteUserInfo);
      setStepContextData({
        isDefaultNickname,
        isEmailEmpty,
        user,
        goto,
        isNewUser,
      });
    } else {
      relocate(goto);
    }
  }

  async function handleProtocolConfirmModal() {
    return await modal.confirm({
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

  async function handleAuthLogin() {
    const queryParams = new URL(window.location.href).searchParams;
    const platform = queryParams.get('platform');
    const goto = queryParams.get('goto');

    const fingerprintRes = await getFingerprint();

    openAuthWindow({
      scene: AuthScene.LOGIN,
      sceneParams: {
        platform,
        signupRegion: isInMainlandChina()
          ? undefined
          : SignupRegion.possible_oversea,
        goto,
        fingerprint: fingerprintRes.visitorId,
      },
      onSuccess(params) {
        if (params.redirectUrl) {
          window.location.replace(params.redirectUrl);
        }
      },
    });
  }

  const onAuthLogin = useCallback(
    debounce(async () => {
      if (!protocolAgreed) {
        const confirmedModal = await handleProtocolConfirmModal();
        if (confirmedModal) {
          handleAuthLogin();
        }
      } else {
        handleAuthLogin();
      }
    }, 1000),
    [protocolAgreed],
  );

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
              message: !en
                ? formatMessage({ id: 'login.placeholder.phone' })
                : formatMessage({ id: 'login.placeholder.phone.or.email' }) + (isInMainlandChina() ? '' : ''),
            },
            {
              validator(rule, value, callback) {
                if (!value) {
                  callback();
                  return;
                }
                if (
                  !chinaMobilePhoneRE.test(value) &&
                  !emailRegex.test(value)
                ) {
                  callback(
                    !en
                      ? formatMessage({ id: 'login.error.invalid.phone' })
                      : formatMessage({ id: 'login.error.invalid.phone.or.email' }) + (isInMainlandChina() ? '' : ''),
                  );
                  return;
                }
                callback();
              },
            },
          ]}
        >
          <Input
            placeholder={
              !en
                ? formatMessage({ id: 'login.placeholder.phone' })
                : formatMessage({ id: 'login.placeholder.phone.or.email' }) + (isInMainlandChina() ? '' : '')
            }
            size="large"
            autoComplete="off"
          />
        </Form.Item>
        <div className="login-check-code">
          <CheckCode form={form} en={en} />
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
            <span>{!en ? formatMessage({ id: 'login.button.login.or.register' }) : formatMessage({ id: 'login.button.login.or.register.en' })}</span>
          </Button>
        </Form.Item>
      </Form>
      <Checkbox
        className="protocol-check"
        checked={protocolAgreed}
        onChange={e => setProtocolAgreed(e.target.checked)}
      >
        {formatMessage({ id: 'login.protocol.read.agree' })}
        <a href={userProtocolLink} target="_blank">
          {formatMessage({ id: 'login.protocol.link' })}
        </a>
      </Checkbox>
      <div>
        <a href="/">{!en ? formatMessage({ id: 'login.link.home' }) : formatMessage({ id: 'login.link.home.en' })}</a>
      </div>
      <div>{contextHolder}</div>
    </div>
  );
}
