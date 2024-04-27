import { auth } from 'src/auth/auth';
import { request } from 'src/request';
import { UserInfo } from './auth';

export function sendUnbindSms(id: number) {
  return request.post('/student/sendUnbindSms', { id });
}

interface UnbindPayload {
  id: number;
  code: string;
}

function unbindDept(data: UnbindPayload) {
  return request.post('/student/unbind', data);
}

export interface BindPayload {
  deptId: number;
  code: string;
  id: number;
}

export async function bindDept({ id, code, deptId }: BindPayload) {
  await unbindDept({ id, code });

  return request.post('/student/rebind', { id, deptId });
}

export function getDeptList() {
  return request.post<any, { label: string; value: number }[]>('/common/org/search', {
    grade: auth.getUser()?.grade || '13',
  });
}

// const user = {
//   id: 3,
//   birthday: '2010-01-05',
//   grade: '13',
//   email: '2051443552@qq.com',
//   phone: '13607148408',
//   province: '湖北省',
//   city: '武汉市',
//   county: '江汉区',
// };

export function updateUser(user: Partial<UserInfo>) {
  return request.post('/student/modify', user);
}
