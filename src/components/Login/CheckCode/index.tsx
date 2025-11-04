import { useRef, useState } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, message } from 'antd';
import CountDownButton, {
  ICountDownButtonRef,
} from '@/component/CountDownButton';
import cls from 'classnames';
import PropTypes from 'prop-types';
import * as UserImp from '@/sdk/user/ValidationCodeController';
import { NC_SCENE } from 'Isomorphic/constants/login';
import { UIA_UA_RE } from 'Isomorphic/constants/uia';
import { getLang } from '@/util/i18n';
import Captcha from '../Captcha';
import type { ICaptcha } from '../Captcha';
import { useIntl } from 'dumi';

import './index.less';

interface CheckCodeProps {
  form: FormInstance;
  disabeCaptcha?: boolean;
  targetFieldName: string;
  validateFailedMsg: string;
  en?: boolean;
  ncName?: string;
  scene?: NC_SCENE;
  onSendCodeClick?: () => void;
  handleSendCode?: (target: string, captchaValues: any) => Promise<void>;
}

const isUIA = UIA_UA_RE.test(navigator.userAgent);

function CheckCode({
  en,
  form,
  ncName,
  scene,
  targetFieldName,
  validateFailedMsg,
  handleSendCode,
  onSendCodeClick,
  disabeCaptcha,
}: CheckCodeProps) {
  const { formatMessage } = useIntl();
  const [sending, setSending] = useState(false);
  const captchaRef = useRef<ICaptcha>(null);
  const inputRef = useRef<typeof Input>(null);
  const countDownRef = useRef<ICountDownButtonRef>(null);
  const countDownSendText = !en ? formatMessage({ id: 'login.checkcode.get' }) : formatMessage({ id: 'login.checkcode.get.en' });

  function onCountDownEnd() {
    setSending(false);
    handleResetCaptcha();
  }

  async function sendCode(target: string, captchaValues: any) {
    try {
      if (handleSendCode) {
        await handleSendCode(target, captchaValues);
      } else {
        await UserImp.sendValidationCode({
          target,
          ...captchaValues,
          captcha: captchaValues.captcha ? 1 : 0,
        });
      }
      message.success(
        !en ? formatMessage({ id: 'login.checkcode.send.success' }) : formatMessage({ id: 'login.checkcode.send.success.en' }),
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
        !en
          ? formatMessage({ id: 'login.checkcode.error.incomplete' })
          : formatMessage({ id: 'login.checkcode.error.incomplete.en' }),
      );
      form.setFields([
        {
          name: 'captcha',
          errors: [
            !en
              ? formatMessage({ id: 'login.checkcode.error.incomplete' })
              : formatMessage({ id: 'login.checkcode.error.incomplete.en' }),
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

      const params = { ...captchaValues, lang: getLang() };
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

  function handleResetCaptcha() {
    captchaRef.current?.resetCaptcha();
  }

  function handleResetCountDown() {
    countDownRef.current?.resetCountDown();
  }

  const { getFieldError } = form;

  function renderHint() {
    // 重置密码时显示短信发送情况提醒
    if (sending) {
      return (
        <div className="mobile-code-hint">
          <span>
            {!en ? formatMessage({ id: 'login.checkcode.sent' }) : formatMessage({ id: 'login.checkcode.sent.en' })}
          </span>
        </div>
      );
    }
  }

  return (
    <div className={cls('mobile-code', 'captcha-check-code')}>
      {isUIA || disabeCaptcha ? null : (
        <Captcha
          form={form}
          scene={scene}
          ncName={ncName}
          ref={captchaRef}
          en={en}
        />
      )}
      <Form.Item
        className="mobile-code-showtip"
        help={getFieldError('code') ? getFieldError('code') : renderHint()}
      >
        <div className="mobile-code-main">
          <div className="mobile-code-field">
            <Form.Item
              name="code"
              validateTrigger={['onSubmit', 'onBlur']}
            rules={[
              {
                required: true,
                message: !en
                  ? formatMessage({ id: 'login.checkcode.required' })
                  : formatMessage({ id: 'login.checkcode.required.en' }),
              },
              {
                pattern: /^\d{6}$/,
                message: !en
                  ? formatMessage({ id: 'login.checkcode.invalid' })
                  : formatMessage({ id: 'login.checkcode.invalid.en' }),
              },
            ]}
            >
              <Input
                type="text"
                size="large"
                autoComplete="off"
                ref={inputRef}
                placeholder={!en ? formatMessage({ id: 'login.checkcode.placeholder' }) : formatMessage({ id: 'login.checkcode.placeholder.en' })}
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

CheckCode.propTypes = {
  form: PropTypes.object.isRequired,
  targetFieldName: PropTypes.string,
  validateFailedMsg: PropTypes.string,
  onSendCodeClick: PropTypes.func,
};

CheckCode.defaultProps = {
  targetFieldName: 'login',
  validateFailedMsg: 'Please enter your mobile number',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSendCodeClick: () => {},
};

export default CheckCode;
