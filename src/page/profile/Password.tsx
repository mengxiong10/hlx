import { TextField, Box } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Modal } from 'src/component/DialogBasic';
import { useForm } from 'react-hook-form';
import { useUser } from 'src/auth/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { auth } from 'src/auth/auth';
import { ChangePwdParams, changePwd } from 'src/api/auth';

export interface PasswordProps {
  open: boolean;
  onClose: () => void;
}

export function Password(props: PasswordProps) {
  const user = useUser()!;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ChangePwdParams & { newPassConfirm: string }>();

  const submit = useMutation(changePwd);

  const handleConfirm = async (data: ChangePwdParams & { newPassConfirm: string }) => {
    const { newPassConfirm, ...restData } = data;
    await submit.mutateAsync({ ...restData, id: user.id, username: user.username });
    enqueueSnackbar('修改成功', { variant: 'success' });
    auth.clear();
  };

  return (
    <Modal
      {...props}
      title="修改密码"
      confirmLoading={submit.isLoading}
      onConfirm={handleSubmit(handleConfirm)}
      maxWidth="xs"
    >
      <Box component="form" noValidate>
        <TextField
          margin="normal"
          variant="standard"
          required
          fullWidth
          label="原始密码"
          autoComplete="tel"
          autoFocus
          helperText={errors.pass?.message}
          error={!!errors.pass}
          {...register('pass', { required: '原始秘密不能为空' })}
        ></TextField>
        <TextField
          margin="normal"
          variant="standard"
          required
          fullWidth
          label="新密码"
          type="password"
          autoComplete="current-password"
          error={!!errors.newPass}
          helperText={errors.newPass?.message}
          {...register('newPass', { required: '新密码不能为空' })}
        ></TextField>
        <TextField
          margin="normal"
          variant="standard"
          required
          fullWidth
          label="确认密码"
          type="password"
          autoComplete="current-password"
          error={!!errors.newPassConfirm}
          helperText={errors.newPassConfirm?.message}
          {...register('newPassConfirm', {
            required: '确认密码不能为空',
            validate: {
              same: (value: string) => {
                const password = getValues('newPass');
                return value !== password ? '确认密码和新密码不一致' : '';
              },
            },
          })}
        ></TextField>
      </Box>
    </Modal>
  );
}
