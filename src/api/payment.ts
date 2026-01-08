import { request } from 'src/request';

export interface ProductInfo {
  id: string;
  createTime: number;
  updateTime: number;
  qstb_id: null;
  title: string;
  price: number;
  rebate: null;
}

export interface PaymentInfo {
  codeUrl: string;
  orderNo: string;
}

export function getProductById(id: string) {
  return request.get<any, ProductInfo>(`/payment/product/getProductById/${id}`);
}

export function getUnpaidOrder(productId: string) {
  return request.get<any, PaymentInfo | null>(`/payment/getUnpaidOrder?productId=${productId}`);
}

export function getPaymentUrl(productId: string) {
  return request.post<any, PaymentInfo>(`/payment/wx-pay/native/${productId}`);
}

export function getPaymentOrderInfo(orderId: string) {
  return request.get<any, string>(`/payment/order-info/query-order-status/${orderId}`);
}

export function refreshOrderStatus(orderNo: string) {
  return request.post<any, string>(`/payment/order-info/refresh-order-status/${orderNo}`);
}
