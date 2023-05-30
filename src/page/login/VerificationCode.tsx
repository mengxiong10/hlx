import { LoadingButton } from '@mui/lab';
import { Box, TextField, InputAdornment } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from 'react-hook-form';
import { LoginByCodeParams, sendSms } from 'src/api/auth';
import { SMS } from 'src/component/SMS';

export interface VerificationCodeProps {
  login: (values: LoginByCodeParams) => void;
  isLoading: boolean;
}

export function VerificationCode({ login, isLoading }: VerificationCodeProps) {
  const {
    trigger,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginByCodeParams>({ mode: 'onChange' });

  const onSendSms = async () => {
    const success = await trigger('phone', { shouldFocus: true });
    if (success) {
      await sendSms({ phone: getValues('phone') });
      return true;
    }
    return false;
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(login)}>
      <TextField
        margin="normal"
        variant="standard"
        required
        fullWidth
        label="手机号"
        autoComplete="tel"
        autoFocus
        helperText={errors.phone?.message}
        error={!!errors.phone}
        {...register('phone', { required: '请输入手机号' })}
      ></TextField>
      <TextField
        margin="normal"
        variant="standard"
        required
        fullWidth
        label="验证码"
        autoComplete="off"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SMS onSend={onSendSms} />
            </InputAdornment>
          ),
        }}
        error={!!errors.code}
        helperText={errors.code?.message}
        {...register('code', { required: '验证码不能为空' })}
      ></TextField>
      <LoadingButton
        sx={{ mt: 2 }}
        variant="contained"
        fullWidth
        type="submit"
        loadingPosition="start"
        startIcon={<SaveIcon />}
        loading={isLoading}
      >
        登录
      </LoadingButton>
    </Box>
  );
}
