import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const chinaMobilePhoneRE = /^(13\d|14\d|15[012356789]|16[567]|17[01235678]|18\d|19\d)\d{8}(\+\d+)?$/;
export enum SignupRegion {
  oversea = 'oversea', // 明确海外（非中国大陆）
  possible_oversea = 'possible_oversea', // 可能是海外（不确定/待确认）
}

export async function getFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get(); // 获取指纹数据
  return result;
}


export enum NC_SCENE {
  login = 'login',
  register = 'register',
  verifyUser = 'verify_user',
  registerH5 = 'nc_register_h5',
  loginH5 = 'nc_login_h5',
  reset = 'nc_reset',
}
export const UIA_UA_RE = /Macaca UI Robot/;
