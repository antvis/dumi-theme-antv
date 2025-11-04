import { pickBy } from 'lodash';

export enum AuthScene {
  LOGIN = 'login',
  GET_ACCESS_TOKEN = 'get_access_token',
}

const AUTH_BROADCAST_CHANNEL_NAME = 'WeaveFox-Auth';

const AuthSceneUrlMap = {
  [AuthScene.LOGIN]: '/login/github/oauth',
  [AuthScene.GET_ACCESS_TOKEN]: '/login/github/access_token',
};

export function openAuthWindow(params: {
  scene: AuthScene;
  sceneParams?: Record<string, any>;
  onSuccess?: (params: { redirectUrl?: string }) => void;
  onFail?: (params: { errorCode: string }) => void;
}) {
  try {
    const { onSuccess, onFail, scene, sceneParams } = params || {};

    const broadcast = new BroadcastChannel(AUTH_BROADCAST_CHANNEL_NAME);

    const cleanedParams = pickBy(
      sceneParams,
      (val) => val !== undefined && val !== null,
    );
    let sceneParamsString = new URLSearchParams(cleanedParams).toString();

    sceneParamsString = sceneParamsString ? `?${sceneParamsString}` : '';

    window.open(
      AuthSceneUrlMap[scene] + sceneParamsString,
      'github_auth',
      'left=0,top=0,width=600,height=600',
    );

    const handler = (event) => {
      if (event.data.source !== 'WeaveFox-Auth') return;
      // 验证来源是否可信
      if (event.origin !== window.location.origin) {
        console.warn('Untrusted origin: ', event.origin);
        return;
      }

      if (event.data.success) {
        if (onSuccess) {
          onSuccess(event.data);
        }
      } else if (onFail) {
        onFail(event.data);
      }

      window.removeEventListener('message', handler);
      broadcast.removeEventListener('message', handler);
    };

    window.addEventListener('message', handler, false);
    broadcast.addEventListener('message', handler, false);

    // 未解之谜，窗口可能会丢失 opener 信息，暂时用 5s 后强制刷新解决
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  } catch (e) {
    console.error('auth unexpected error', e);
  }
}
