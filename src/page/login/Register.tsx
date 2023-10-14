import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import bg from 'src/assets/image/login-bg.png';
import { registerUser, RegisterParams } from 'src/api/auth';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import { auth } from 'src/auth/auth';
import { useUser } from 'src/auth/AuthContext';

export function RegisterPage() {
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(window.location.search);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterParams>({
    defaultValues: {
      gander: '1',
      realName: '',
      inviterCode: params.get('inviteCode') || undefined,
    },
  });

  const submitMutation = useMutation(registerUser, {
    onSuccess(data) {
      auth.updateUser(data);
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
    },
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.registerFlag) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        height: '100%',
        alignItems: 'flex-start',
        backgroundImage: `url("${bg}")`,
        backgroundSize: 'cover',
        backgroundColor: '#fff',
        [theme.breakpoints.down(444)]: {
          backgroundImage: 'none',
        },
      })}
    >
      <Container
        maxWidth="xs"
        component="form"
        noValidate
        onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          py: 4,
          mt: 12,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h6" gutterBottom>
          完善个人信息
        </Typography>
        <TextField
          margin="normal"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          required
          fullWidth
          label="姓名"
          autoComplete="tel"
          autoFocus
          helperText={errors.realName?.message}
          error={!!errors.realName}
          {...register('realName', { required: '请输入姓名' })}
        ></TextField>
        <Controller
          control={control}
          name="gander"
          render={({ field }) => {
            return (
              <FormControl margin="normal" size="small">
                <FormLabel sx={{ transform: 'scale(0.75)', transformOrigin: 'left top' }}>
                  性别
                </FormLabel>
                <RadioGroup row {...field}>
                  <FormControlLabel value="1" control={<Radio />} label="男" />
                  <FormControlLabel value="2" control={<Radio />} label="女" />
                </RadioGroup>
              </FormControl>
            );
          }}
        />
        <LoadingButton
          sx={{ mt: 2 }}
          variant="contained"
          fullWidth
          type="submit"
          loadingPosition="start"
          startIcon={<SaveIcon />}
          loading={submitMutation.isLoading}
        >
          确认
        </LoadingButton>
      </Container>
    </Box>
  );
}
