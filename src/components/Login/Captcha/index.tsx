import {NC_SCENE} from '../utils';
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react'; // 图形验证码资源文件
import type {FormInstance} from 'antd';
import {Form, Input} from 'antd';
import cls from 'classnames';
import {useIntl} from 'dumi';
import './index.less';

// 图形验证码资源文件
const NC_CSS_SOURCE = 'https://g.alicdn.com/sd/ncpc/nc.css?t=1514534550478';
const NC_SCRIPT_SOURCE = 'https://g.alicdn.com/sd/ncpc/nc.js?t=1514534550478';

interface CaptchaProps {
  ncName?: string;
  scene?: NC_SCENE;
  form: FormInstance;
  onCallback?: () => void;
  className?: string;
  en?: boolean;
}

const NC_NAME = 'NoCaptcha';

const Captcha = forwardRef(
  (
    {
      ncName = NC_NAME,
      scene = NC_SCENE.login,
      form,
      en,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onCallback = () => {},
      className,
    }: CaptchaProps,
    ref,
  ) => {
    const { formatMessage } = useIntl();
    const ncInstance = useRef(null);

    function reset() {
      form.setFieldsValue({
        csessionid: '',
        sig: '',
        token: '',
        scene: '',
        captcha: null,
      });
      ncInstance.current?.reset(1);
    }

    function getValues() {
      return form.getFieldsValue(['csessionid', 'sig', 'token', 'scene', 'captcha']);
    }

    useImperativeHandle(ref, () => ({
      resetCaptcha() {
        reset();
      },
      getCaptchaValues() {
        return getValues();
      },
    }));

    function loadCaptcha() {
      if (!ncInstance.current) {
        /* eslint no-undef:0 */
        /* eslint new-cap:0 */
        // ncInstance.current = new noCaptcha();
        // window[ncName] = ncInstance.current;
      }
      const nc_appkey = 'FFFF000000000179A3AD';
      const nc_token = [nc_appkey, new Date().getTime(), Math.random()].join(':');
      const nc_scene = scene;
      const nc_customWidth = document.getElementById(`captcha_render_id_${ncName}`)?.offsetWidth || 300;
      const nc_option = {
        renderTo: `#captcha_render_id_${ncName}`,
        appkey: nc_appkey,
        scene: nc_scene,
        token: nc_token,
        language: en ? 'en' : 'cn',
        customWidth: nc_customWidth,
        callback: (data) => {
          // 校验成功回调
          const { setFieldsValue } = form;
          setFieldsValue({
            csessionid: data.csessionid,
            sig: data.sig,
            token: nc_token,
            scene: nc_scene,
            captcha: 'true',
          });

          onCallback?.();
        },
      };
      ncInstance.current?.init(nc_option);
      const lang = {
        _startTEXT: en ? formatMessage({ id: 'login.captcha.drag.en' }) : formatMessage({ id: 'login.captcha.drag' }),
        _yesTEXT: en
          ? formatMessage({ id: 'login.captcha.success.en' })
          : formatMessage({ id: 'login.captcha.success' }),
        _Loading: en
          ? formatMessage({ id: 'login.captcha.loading.en' })
          : formatMessage({ id: 'login.captcha.loading' }),
        _error300: en
          ? formatMessage({ id: 'login.captcha.error.wrong.en' }) +
            ' <a href="javascript:__nc.reset()">' +
            formatMessage({ id: 'login.captcha.error.refresh.en' }) +
            '</a>'
          : formatMessage({ id: 'login.captcha.error.wrong' }) +
            ' <a href="javascript:__nc.reset()">' +
            formatMessage({ id: 'login.captcha.error.refresh' }) +
            '</a>',
        _errorNetwork: en
          ? formatMessage({ id: 'login.captcha.error.network.en' }) +
            ' <a href="javascript:__nc.reset()">' +
            formatMessage({ id: 'login.captcha.error.refresh.en' }) +
            '</a>'
          : formatMessage({ id: 'login.captcha.error.network' }) +
            ' <a href="javascript:__nc.reset()">' +
            formatMessage({ id: 'login.captcha.error.refresh' }) +
            '</a>',
      };
      if (en) {
        ncInstance.current?.upLang('en', lang);
      } else {
        ncInstance.current?.upLang('cn', lang);
      }
    }

    useEffect(() => {
      const script = document.createElement('script');
      script.src = NC_SCRIPT_SOURCE;
      const link = document.createElement('link');
      script.async = true;

      link.href = NC_CSS_SOURCE;
      link.rel = 'stylesheet';
      link.type = 'text/css';

      // 如果资源没有加载过，则添加到head中
      document.head.appendChild(link);
      if (!window.noCaptcha) {
        document.head.appendChild(script);
        script.onload = () => {
          loadCaptcha();
        };
      } else {
        loadCaptcha();
      }
      return () => {
        try {
          script.remove();
          link.remove();
          if (script.parentNode === document.body) {
            document.body.removeChild(script);
          }
          if (link.parentNode === document.body) {
            document.body.removeChild(link);
          }
        } catch (e) {
          // ignore error
        }
      };
    }, []);

    return (
      <div className={cls('captcha', className)}>
        <div id={`captcha_render_id_${ncName}`} />
        <Form.Item name="csessionid" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="sig" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="token" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="scene" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          name="captcha"
          rules={[
            {
              required: true,
              message: en
                ? formatMessage({ id: 'login.captcha.required.en' })
                : formatMessage({ id: 'login.captcha.required' }),
            },
          ]}
          className="captcha-tip"
        >
          <Input type="hidden" />
        </Form.Item>
      </div>
    );
  },
);

export interface ICaptcha {
  resetCaptcha: () => void;
  getCaptchaValues: () => any;
}

export default Captcha;
