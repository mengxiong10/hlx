import { request } from 'src/request';
import { PageParams } from './record';

export function getMessageCount() {
  return request.post<any, number>('/common/message/count', {});
}

export function getMessage(params: PageParams = { page: 0, size: 10 }) {
  return request
    .post<any, MessageResponse>('/common/message/search', {
      ...params,
      params: {
        title: '',
        newsContent: '',
        receiver: 3,
      },
    })
    .then((res) => {
      const { totalElements } = res;

      const totalPages = Math.ceil(totalElements / params.size);

      return {
        ...res,
        ...params,
        totalPages,
      };
    });
}

export interface MessageResponse {
  content: Message[];
  totalElements: number;
}

export interface Message {
  id: string;
  title: string;
  newsContent: string;
  enabled: null;
  createTime: null;
}
