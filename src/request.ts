import axios from 'axios';
import md5 from 'md5';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { auth } from './auth/auth';

export const request = axios.create({
  timeout: 15000,
  baseURL: 'https://admin.huilaixue.cn/fc',
});

request.interceptors.request.use((config) => {
  const now = Date.now();
  const mac = md5(dayjs(now).format('YYYY-MM-DD HH:mm:ss'));
  const token = auth.getAccessToken();
  config.headers!.mac = mac;
  if (token) {
    config.headers!['x-Authorization'] = token;
  }
  return config;
});

request.interceptors.response.use(
  (res) => {
    const { data, config } = res;
    if (/\/rebate\//.test(config.url || '')) return data;
    if (Object.prototype.hasOwnProperty.call(data, 'respResult') && data.respResult === 'success') {
      return data.respBody;
    }
    return Promise.reject(data);
  },
  (err) => {
    const msg = err.response?.data?.message || err.message;

    if (err.response?.status === 401) {
      auth.clear();
    }
    // enqueueSnackbar(msg, { variant: 'error' });
    return Promise.reject(new Error(`:( ${msg}`));
  }
);
