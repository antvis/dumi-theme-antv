import { useRef, useState } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, message } from 'antd';
import CountDownButton, {
  ICountDownButtonRef,
} from '../CountDownButton';
import cls from 'classnames';
import { NC_SCENE } from '../utils';
import { UIA_UA_RE } from '../utils';
import Captcha from '../Captcha';
import type { ICaptcha } from '../Captcha';
import { useIntl } from 'dumi';

import './index.less';
import React from 'react';
import {sendValidationCode} from "../../../model/auth";

interface CheckCodeProps {
  form: FormInstance;
  disabeCaptcha?: boolean;
  targetFieldName?: string;
  validateFailedMsg?: string;
  en?: boolean;
  ncName?: string;
  scene?: NC_SCENE;
  onSendCodeClick?: () => void;
  handleSendCode?: (target: string, captchaValues: any) => Promise<void>;
}

function CheckCode({
  en,
  form,
  ncName,
  scene,
  targetFieldName = 'login',
  validateFailedMsg = 'Please enter your mobile number',
  handleSendCode,
  onSendCodeClick =  () => {},
}: CheckCodeProps) {
  const { formatMessage, locale } = useIntl();
  const [sending, setSending] = useState(false);
  const captchaRef = useRef<ICaptcha>(null);
  const inputRef = useRef(null);
  const countDownRef = useRef<ICountDownButtonRef>(null);
  const countDownSendText = formatMessage({ id: 'login.checkcode.get' });

  function handleResetCountDown() {
    countDownRef.current?.resetCountDown();
  }

  function handleResetCaptcha() {
    captchaRef.current?.resetCaptcha();
  }

  function onCountDownEnd() {
    setSending(false);
    handleResetCaptcha();
  }

  async function sendCode(target: string, captchaValues: any) {
    try {
      if (handleSendCode) {
        await handleSendCode(target, captchaValues);
      } else {
        await sendValidationCode({
          target,
          ...captchaValues,
          captcha: captchaValues.captcha ? 1 : 0,
        });
      }
      message.success(
        formatMessage({ id: 'login.checkcode.send.success' }),
      );
    } catch (error: any) {
      console.error(error);
      handleResetCaptcha();
    }
  }

  async function onSendClick(callback?: () => void) {
    if (!captchaRef.current || sending) {
      return;
    }

    const captchaValues = captchaRef.current.getCaptchaValues();

    if (!captchaValues.captcha) {
      handleResetCountDown();
      message.error(
        formatMessage({ id: 'login.checkcode.error.incomplete' }),
      );
      form.setFields([
        {
          name: 'captcha',
          errors: [
            formatMessage({ id: 'login.checkcode.error.incomplete' }),
          ],
        },
      ]);
      // 尝试解决滑块显示完成，但提示没有完成的问题
      handleResetCaptcha();
      return;
    }

    try {
      const values = await form.validateFields([targetFieldName]);
      const target = values[targetFieldName];
      if (!target) {
        form.setFields([
          {
            name: targetFieldName,
            errors: [validateFailedMsg],
          },
        ]);
        return;
      }

      const params = { ...captchaValues, lang: locale };
      await sendCode(target, params);
      callback?.();
      onSendCodeClick?.();
    } catch (error) {
      handleResetCaptcha();
      form.setFields([
        {
          name: targetFieldName,
          errors: [validateFailedMsg],
        },
      ]);
    }
  }

  const { getFieldError } = form;

  function renderHint() {
    // 重置密码时显示短信发送情况提醒
    if (sending) {
      return (
        <div className="mobile-code-hint">
          <span>
            {formatMessage({ id: 'login.checkcode.sent' })}
          </span>
        </div>
      );
    }
  }

  return (
    <div className={cls('mobile-code', 'captcha-check-code')}>
      <Captcha form={form} scene={scene} ncName={ncName} ref={captchaRef} en={en} />
      <Form.Item className="mobile-code-showtip" help={getFieldError('code') ? getFieldError('code') : renderHint()}>
        <div className="mobile-code-main">
          <div className="mobile-code-field">
            <Form.Item
              name="code"
              validateTrigger={['onSubmit', 'onBlur']}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'login.checkcode.required' }),
                },
                {
                  pattern: /^\d{6}$/,
                  message: formatMessage({ id: 'login.checkcode.invalid' }),
                },
              ]}
            >
              <Input
                type="text"
                autoComplete="off"
                ref={inputRef}
                placeholder={
                  formatMessage({ id: 'login.checkcode.placeholder' })
                }
                maxLength={6}
              />
            </Form.Item>
          </div>
          <div className="mobile-code-getBtn">
            <CountDownButton
              en={en}
              onSendClick={onSendClick}
              ref={countDownRef}
              buttonProps={{
                ghost: true,
                htmlType: 'button',
              }}
              sendText={countDownSendText}
              onCountDownEnd={onCountDownEnd}
            />
          </div>
        </div>
      </Form.Item>
    </div>
  );
}

export default CheckCode;
