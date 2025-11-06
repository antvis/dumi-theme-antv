import React from 'react';
import LoginForm from './LoginForm';
import { Modal } from 'antd';
import { useSnapshot } from 'valtio';
import { useIntl } from 'dumi';
import {authStore, hideLoginModal} from "../../model/auth";

export function LoginModal() {
  const authSnap = useSnapshot(authStore);
  const intl = useIntl();

  return (
    <Modal
      width={400}
      title={intl.formatMessage({ id: 'login.modal.title' })}
      open={authSnap.isModalOpen}
      onCancel={() => hideLoginModal()} // 直接调用 store 的 action
      footer={null}
      maskClosable={false}
      destroyOnHidden
    >
        <LoginForm />
    </Modal>
  );
}
