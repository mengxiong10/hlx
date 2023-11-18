import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ProductInfo, getPaymentOrderInfo } from 'src/api/payment';
import { queryClient } from 'src/queryClient';
import QRCode from 'qrcode';

export interface PaymentStatusProps {
  codeUrl: string;
  orderNo: string;
  product: ProductInfo;
  onClose: () => void;
  open: boolean;
}

export function PaymentStatus({ codeUrl, orderNo, product, onClose, open }: PaymentStatusProps) {
  const [codeImg, setCodeImg] = useState('');

  const confirm = useCallback(() => {
    onClose();
    queryClient.clear();
    enqueueSnackbar('购买成功', { variant: 'success' });
  }, [onClose]);

  useLayoutEffect(() => {
    QRCode.toDataURL(codeUrl, (err: any, url: string) => {
      if (url) {
        setCodeImg(url);
      }
    });
  }, [codeUrl]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        getPaymentOrderInfo(orderNo).then((res) => {
          if (!res) {
            confirm();
          }
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [orderNo, confirm]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>购买课程</DialogTitle>
      <DialogContent>
        {`${product.title} ${product.price}元`}
        <Typography>扫描下方二维码支付</Typography>
        <img src={codeImg} alt="" />
        {/* <QRCodeCanvas value={codeUrl} /> */}
      </DialogContent>
      <DialogActions disableSpacing sx={{ py: 1 }}>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={confirm}>已完成支付</Button>
        {/* <Button href={codeUrl} LinkComponent="a">
          去支付
        </Button> */}
        {/* {isSuccess && data && !hasUnpaid ? (
          <LoadingButton loading startIcon={<SaveIcon />} loadingPosition="start">
            支付中
          </LoadingButton>
        ) : (
          <Button href={codeUrl} LinkComponent="a">
            去支付
          </Button>
        )} */}
      </DialogActions>
    </Dialog>
  );
}
