import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Paper,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ProductInfo, getPaymentOrderInfo, refreshOrderStatus } from 'src/api/payment';
import { queryClient } from 'src/queryClient';
import QRCode from 'qrcode';
import { LoadingButton } from '@mui/lab';

export interface PaymentStatusProps {
  codeUrl: string;
  orderNo: string;
  product: ProductInfo;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
}

export function PaymentStatus({ codeUrl, orderNo, product, onClose, onSuccess, open }: PaymentStatusProps) {
  const [codeImg, setCodeImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 将价格从分转换为元
  const priceInYuan = product.price ? (product.price / 100).toFixed(2) : '0.00';

  const confirm = useCallback(async () => {
    setRefreshing(true);
    try {
      const result = await refreshOrderStatus(orderNo);
      if (typeof result === 'string' && result.includes('支付成功')) {
        enqueueSnackbar('购买成功', { variant: 'success' });
        onClose();
        // 触发成功回调，刷新textbook页面
        if (onSuccess) {
          onSuccess();
        }
      } else {
        enqueueSnackbar(result || '订单状态已更新', { variant: 'info' });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message || '刷新订单状态失败', { variant: 'error' });
    } finally {
      setRefreshing(false);
    }
  }, [onClose, onSuccess, orderNo]);

  useLayoutEffect(() => {
    if (codeUrl) {
      setLoading(true);
      QRCode.toDataURL(codeUrl, { width: 300, margin: 2 }, (err: any, url: string) => {
        if (url) {
          setCodeImg(url);
        }
        setLoading(false);
      });
    }
  }, [codeUrl]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && open) {
        getPaymentOrderInfo(orderNo).then((res) => {
          // res为"支付成功"表示已支付
          if (res === '支付成功') {
            // 自动关闭弹窗并刷新
            enqueueSnackbar('购买成功', { variant: 'success' });
            onClose();
            if (onSuccess) {
              onSuccess();
            }
          }
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [orderNo, open, onClose, onSuccess]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          扫码支付
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {/* 商品信息 */}
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              商品名称
            </Typography>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {product.title}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 0.5 }}>
              <Typography variant="h5" color="primary" fontWeight="bold">
                ¥{priceInYuan}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                元
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ width: '100%' }} />

          {/* 二维码 */}
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
              <Box sx={{ width: 300, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : codeImg ? (
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <img
                  src={codeImg}
                  alt="支付二维码"
                  style={{
                    width: '280px',
                    height: '280px',
                    display: 'block',
                  }}
                />
              </Paper>
            ) : null}
          </Box>

          {/* 提示文字 */}
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              请使用微信扫描上方二维码完成支付
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              订单号：{orderNo}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined" disabled={refreshing}>
          取消
        </Button>
        <LoadingButton
          onClick={confirm}
          variant="contained"
          color="primary"
          loading={refreshing}
        >
          已完成支付
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
