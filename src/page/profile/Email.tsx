import { TextField, Box, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Modal } from 'src/component/DialogBasic';
import { useForm } from 'react-hook-form';
import { useUser } from 'src/auth/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { auth } from 'src/auth/auth';
import { updateUser } from 'src/api/profile';

export interface EmailBindProps {
  open: boolean;
  onClose: () => void;
}

export function EmailBind(props: EmailBindProps) {
  const user = useUser()!;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({ defaultValues: { email: user.email } });

  const submit = useMutation(updateUser);

  const handleConfirm = async (data: { email: string }) => {
    await submit.mutateAsync({ id: user.id, ...data });
    enqueueSnackbar('绑定成功', { variant: 'success' });
    auth.updateUser(data);
    props.onClose();
  };

  return (
    <Modal
      {...props}
      title="现在签约"
      confirmLoading={submit.isLoading}
      onConfirm={handleSubmit(handleConfirm)}
      maxWidth="xs"
    >
      <Box component="form" noValidate>
        <Typography variant="body2">线上签约，承诺高分，否则退费。</Typography>
        <Typography variant="body2">学生接收电子协议的邮箱是：</Typography>
        <TextField
          margin="normal"
          variant="standard"
          required
          fullWidth
          label="签约邮箱"
          autoFocus
          helperText={errors.email?.message}
          error={!!errors.email}
          {...register('email', {
            required: '邮箱不能为空',
            pattern: {
              value: /^\w+(-+.\w+)*@\w+(-.\w+)*.\w+(-.\w+)*$/,
              message: '输入正确的邮箱',
            },
          })}
        ></TextField>
      </Box>
    </Modal>
  );
}
