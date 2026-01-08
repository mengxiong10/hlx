import { FormControl, Input, InputAdornment, InputLabel, Alert, TextField } from '@mui/material';
import { Modal } from 'src/component/DialogBasic';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyWithdraw } from 'src/api/rebate';
import { useSnackbar } from 'notistack';
import { useUser } from 'src/auth/AuthContext';

export interface WithdrawProps {
  onClose: () => void;
  open: boolean;
  onSuccess?: () => void;
}

export function Withdraw({ open, onClose, onSuccess }: WithdrawProps) {
  const [amount, setAmount] = useState<string>('');
  const [wechatAccount, setWechatAccount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const totalRebateQuery = queryClient.getQueryData<number>(['totalRebate']);
  const user = useUser();

  // 当对话框打开时，设置默认微信号为手机号
  useEffect(() => {
    if (open && user?.phone) {
      setWechatAccount(user.phone);
    }
  }, [open, user?.phone]);

export function Withdraw({ open, onClose, onSuccess }: WithdrawProps) {
  const [amount, setAmount] = useState<string>('');
  const [wechatAccount, setWechatAccount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const totalRebateQuery = queryClient.getQueryData<number>(['totalRebate']);
  const user = useUser();

  // 当对话框打开时，设置默认微信号为手机号
  useEffect(() => {
    if (open && user?.phone) {
      setWechatAccount(user.phone);
    }
  }, [open, user?.phone]);

  const withdrawMutation = useMutation(
    ({ amount, wechatAccount }: { amount: number; wechatAccount: string }) => applyWithdraw(amount, wechatAccount),
    {
      onSuccess: () => {
        enqueueSnackbar('提现申请成功', { variant: 'success' });
        queryClient.invalidateQueries(['totalRebate']);
        queryClient.invalidateQueries(['withdrawRecords']);
        setAmount('');
        setWechatAccount(user?.phone || '');
        setError('');
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || '提现申请失败';
        enqueueSnackbar(message, { variant: 'error' });
        setError(message);
      },
    }
  );

  const handleConfirm = () => {
    setError('');
    const amountNum = parseInt(amount, 10);
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('请输入有效的提现金额');
      return;
    }

    const total = totalRebateQuery || 0;
    if (amountNum > total) {
      setError('提现金额不能超过总积分');
      return;
    }

    if (!wechatAccount || wechatAccount.trim() === '') {
      setError('请输入微信号');
      return;
    }

    withdrawMutation.mutate({ amount: amountNum, wechatAccount: wechatAccount.trim() });
  };

  const handleClose = () => {
    setAmount('');
    setWechatAccount(user?.phone || '');
    setError('');
    onClose();
  };

  return (
    <Modal
      maxWidth="xs"
      title="提现"
      open={open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      loading={withdrawMutation.isLoading}
    >
      <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
        <InputLabel htmlFor="withdraw-amount">提现金额（分）</InputLabel>
        <Input
          type="number"
          id="withdraw-amount"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
          startAdornment={<InputAdornment position="start">¥</InputAdornment>}
        />
      </FormControl>
      <TextField
        fullWidth
        variant="standard"
        label="微信号"
        value={wechatAccount}
        onChange={(e) => {
          setWechatAccount(e.target.value);
          setError('');
        }}
        sx={{ mt: 2 }}
        helperText="默认使用手机号，可修改"
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {totalRebateQuery !== undefined && (
        <Alert severity="info" sx={{ mt: 1 }}>
          当前可用积分：{totalRebateQuery} 分（单位：分）
        </Alert>
      )}
    </Modal>
  );
}
