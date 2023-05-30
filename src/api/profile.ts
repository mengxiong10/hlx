import { auth } from 'src/auth/auth';
import { request } from 'src/request';

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
