import React, { useState } from 'react';
import { useIntl } from 'dumi';
import { relocate } from '@/util/location';
import LoginForm from './LoginForm';
import styles from './index.module.less';
import { CompleteUserInfoPageComp } from '../Account/CompleteUserInfo';
import { STEP } from './types';

export default function Login() {
  const [step, setStep] = useState<STEP>(STEP.Login);
  const [stepContextData, setStepContextData] = useState<any>({});
  const { locale } = useIntl();
  const isEn = locale === 'en';

  if (step === STEP.Login) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <LoginForm
            en={isEn}
            setStep={setStep}
            setStepContextData={setStepContextData}
          />
        </div>
      </div>
    );
  }

  if (
    step === STEP.CompleteUserInfo
    && (stepContextData.isEmailEmpty
      || stepContextData.isDefaultNickname
      || stepContextData.isMobileEmpty)
  ) {
    return (
      <CompleteUserInfoPageComp
        isNewUser={stepContextData.isNewUser}
        isDefaultNickname={stepContextData.isDefaultNickname}
        email={stepContextData.user.email}
        confirmEmail={stepContextData.confirmEmail}
        nickname={stepContextData.user.name}
        mobile={stepContextData.user.mobile}
        onSubmitSuccess={() => {
          relocate(stepContextData.goto);
        }}
      />
    );
  }

  return null;
}
