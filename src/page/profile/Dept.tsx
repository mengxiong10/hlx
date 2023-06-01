import { TextField, MenuItem, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bindDept, getDeptList, sendUnbindSms } from 'src/api/profile';
import { Modal } from 'src/component/DialogBasic';
import { SMS } from 'src/component/SMS';
import { useUser } from 'src/auth/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { auth } from 'src/auth/auth';

export interface DeptProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

export function Dept(props: DeptProps) {
  const user = useUser()!;

  const [deptId, setDeptId] = useState(user.deptId);
  const [code, setCode] = useState('');

  const result = useQuery(['dept'], () => getDeptList());

  const onSend = async () => {
    try {
      await sendUnbindSms(user.id);
      return true;
    } catch {
      return false;
    }
  };

  const submit = useMutation(bindDept);

  const handleConfirm = async () => {
    await submit.mutateAsync({ id: user.id, deptId, code });
    props.onClose();
    setCode('');
    auth.updateUser({ deptId });
    enqueueSnackbar('绑定成功', { variant: 'success' });
  };

  return (
    <Modal
      {...props}
      confirmLoading={submit.isLoading}
      onConfirm={handleConfirm}
      maxWidth="xs"
      confirmButtonProps={{
        disabled: !code || !deptId,
      }}
    >
      <TextField
        id="standard-select-currency"
        required
        select
        label="选择部门"
        fullWidth
        variant="standard"
        value={deptId}
        onChange={(evt) => {
          setDeptId(evt.target.value as any);
        }}
      >
        {(result.data || []).map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        margin="normal"
        variant="standard"
        required
        fullWidth
        label="验证码"
        autoComplete="off"
        value={code}
        onChange={(evt) => setCode(evt.target.value)}
        helperText={`向${user.phone.replace(/^(\d{3})(\d{4})/, '$1****')}的手机发送验证码`}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SMS onSend={onSend} />
            </InputAdornment>
          ),
        }}
      ></TextField>
    </Modal>
  );
}
