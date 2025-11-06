import React from 'react';
import LoginForm from './LoginForm';
import { Modal } from 'antd';
import { useSnapshot } from 'valtio';
import {authStore, hideLoginModal} from "../../model/auth";

export function LoginModal() {
  const authSnap = useSnapshot(authStore);

  return (
    <Modal
      width={400}
      title="验证码登录"
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
