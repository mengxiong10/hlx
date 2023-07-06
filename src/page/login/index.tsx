import { Box, Container, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bg from 'src/assets/image/login-bg.png';
import logo from 'src/assets/image/login-logo.png';
import { login } from 'src/api/auth';
import { useMutation } from '@tanstack/react-query';
import { auth } from 'src/auth/auth';
import { queryClient } from 'src/queryClient';
import { AccountPassword } from './AccountPassword';
import { VerificationCode } from './VerificationCode';

export function LoginPage() {
  const [tab, setTab] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useMutation(login, {
    onSuccess(data) {
      auth.set(data);
      queryClient.clear();
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
    },
  });

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
        sx={{
          display: 'flex',
          flexDirection: 'column',
          py: 4,
          mt: 12,
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <img style={{ width: '85%' }} src={logo} alt="" />
        </Box>
        <Tabs value={tab} onChange={(evt, newValue) => setTab(newValue)}>
          <Tab label="密码登录" value={0}></Tab>
          <Tab label="验证码登录" value={1}></Tab>
        </Tabs>
        {tab === 0 && (
          <AccountPassword login={loginMutation.mutate} isLoading={loginMutation.isLoading} />
        )}
        {tab === 1 && (
          <VerificationCode login={loginMutation.mutate} isLoading={loginMutation.isLoading} />
        )}
      </Container>
    </Box>
  );
}
