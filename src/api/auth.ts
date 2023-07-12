import { request } from 'src/request';

export interface UserInfo {
  avatar: string;
  birthday: string;
  city: string;
  county: string;
  email?: string;
  id: number;
  deptId: number;
  realName: string;
  username: string; // phone
  phone: string;
  grade: string;
  registerFlag: 0 | 1;
}

export interface AuthInfo {
  accessToken: string;
  messageTotal: number;
  userInfo: UserInfo;
}

export interface LoginByPassParams {
  username: string;
  pass: string;
}

export interface LoginByCodeParams {
  phone: string;
  code: string;
}

export type LoginHandler = typeof login;

// 发送手机验证码
export function sendSms(params: { phone: string }) {
  return request.post('/login/sendSms', params);
}

export function login(params: LoginByPassParams | LoginByCodeParams) {
  if (Object.prototype.hasOwnProperty.call(params, 'phone')) {
    return request.post<any, AuthInfo>('/login/sms', params);
  }
  return request.post<any, AuthInfo>('/login/username', params);
}

export interface RegisterParams {
  realName: string;
  gander: string; // '1' | '2' 男 1 女 2
}

export function registerUser(params: RegisterParams) {
  const data = { ...params, grade: '13', deptId: 29 };
  return request.post('/student/register', data).then(() => {
    return { ...data, registerFlag: 1 as const };
  });
}

export interface ChangePwdParams {
  id: number;
  newPass: string;
  pass: string;
  username: string;
}

export function changePwd(params: ChangePwdParams) {
  return request.post('/student/changePwd', params);
}

export interface WxInfo {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
  title?: string;
  desc?: string;
  imgUrl?: string;
}

export function getWxInfo(url: string) {
  return request.post<any, WxInfo>('/wx/share', { url });
}
