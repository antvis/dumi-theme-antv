import React, {
  useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useIntl } from 'dumi';
import './index.less';

const DEFAULT_COUNTING_TIME = 60;

interface CountDownButtonProps {
  counting?: boolean;
  sendText?: string;
  en?: boolean;
  onSendClick?: (callback: () => void) => void;
  buttonProps?: any;
  onCountDownEnd?: () => void;
}

export interface ICountDownButtonRef {
  resetCountDown: () => void;
}

const CountDownButton = forwardRef(({
  counting: initialCounting, en,
  sendText, onSendClick, buttonProps, onCountDownEnd,
}: CountDownButtonProps, ref) => {
  const { formatMessage } = useIntl();
  const [counting, setCounting] = useState(!!initialCounting);
  const [countingTime, setCountingTime] = useState(DEFAULT_COUNTING_TIME);
  const [hasSend, setHasSend] = useState(false);
  const countTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialCounting) {
      doCounting();
    }
    return () => {
      if (countTimer.current) {
        clearInterval(countTimer.current);
      }
    };
  }, [initialCounting]);

  const reset = useCallback(() => {
    setCounting(false);
    setCountingTime(DEFAULT_COUNTING_TIME);
    if (countTimer.current) {
      clearInterval(countTimer.current);
      countTimer.current = null;
    }
  }, [countTimer]);

  const doCounting = useCallback(() => {
    setCountingTime(DEFAULT_COUNTING_TIME);
    setCounting(true);
    countTimer.current = setInterval(() => {
      setCountingTime((prevTime) => {
        if (prevTime === 1) {
          reset();
          onCountDownEnd?.();
          return DEFAULT_COUNTING_TIME;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [reset]);

  const handleSendClick = () => {
    if (onSendClick) {
      onSendClick(() => {
        doCounting();
        setHasSend(true);
      });
    }
  };

  const renderSendCodeTxt = () => {
    if (counting) {
      return (
        <span className="code-count-text">
          {en ? formatMessage({ id: 'login.countdown.resend.en' }, { time: countingTime }) : formatMessage({ id: 'login.countdown.resend' }, { time: countingTime })}
        </span>
      );
    }

    if (hasSend) {
      return en ? formatMessage({ id: 'login.countdown.resend.simple.en' }) : formatMessage({ id: 'login.countdown.resend.simple' });
    }
    return sendText;
  };

  useImperativeHandle(ref, () => ({
    resetCountDown() {
      reset();
    },
  }));

  return (
    <span className="countdown-btn">
      <Button
        onClick={handleSendClick}
        className="code-send-button"
        disabled={counting}
        {...buttonProps}
      >
        <span className="code-send-text">{renderSendCodeTxt()}</span>
      </Button>
    </span>
  );
});

CountDownButton.propTypes = {
  counting: PropTypes.bool,
  sendText: PropTypes.string,
  onSendClick: PropTypes.func,
  buttonProps: PropTypes.object,
  onCountDownEnd: PropTypes.func,
};

CountDownButton.defaultProps = {
  counting: false,
  sendText: formatMessage({ id: 'login.checkcode.get' }),
};

export default CountDownButton;
