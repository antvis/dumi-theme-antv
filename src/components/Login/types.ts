export enum STEP {
  Login = 'Login',
  CompleteUserInfo = 'CompleteUserInfo',
}

export type SetStep = (step: STEP) => void;
