import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Divider, Link } from '@mui/material';
import logo from 'src/assets/image/logo.png';
import { Notifications } from '@mui/icons-material';
import { useState } from 'react';
import { auth } from 'src/auth/auth';
import { useUser } from 'src/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dept } from '../profile/Dept';
import { Password } from '../profile/Password';
import { MessageCount } from '../message/count';
import { EmailBind } from '../profile/Email';

export function Header({ children }: { children?: React.ReactNode }) {
  const user = useUser()!;
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMessage = () => {
    navigate('message');
  };

  const [deptVisible, setDeptVisible] = useState(false);
  const [changePwdVisible, setChangePwdVisible] = useState(false);
  const [changeEmailVisible, setChangeEmailVisible] = useState(false);

  const deptTitle = '选择部门';

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #ff630f, #ff870f)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Toolbar>
        {children}
        <Link
          href="/"
          sx={{
            flex: '0 1 198px',
            height: '45px',
            backgroundImage: `url("${logo}")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left center',
          }}
        ></Link>
        <span style={{ flex: '1 1 0%' }}></span>
        <IconButton size="large" color="inherit" onClick={handleMessage}>
          <MessageCount>
            <Notifications />
          </MessageCount>
        </IconButton>
        <IconButton
          size="large"
          sx={{ p: 0, ml: '12px' }}
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar>{user.realName[0]}</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem dense>{user.username}</MenuItem>
          <MenuItem dense onClick={() => setDeptVisible(true)}>
            {deptTitle}
          </MenuItem>
          <MenuItem dense onClick={() => setChangePwdVisible(true)}>
            修改密码
          </MenuItem>
          <MenuItem dense onClick={() => setChangeEmailVisible(true)}>
            现在签约
          </MenuItem>
          <MenuItem dense onClick={() => navigate('rebate')}>
            我的奖金
          </MenuItem>
          <Divider />
          <MenuItem dense onClick={() => auth.clear()}>
            退出
          </MenuItem>
        </Menu>
        <Dept title={deptTitle} open={deptVisible} onClose={() => setDeptVisible(false)}></Dept>
        {changePwdVisible && (
          <Password open={changePwdVisible} onClose={() => setChangePwdVisible(false)} />
        )}
        {changeEmailVisible && (
          <EmailBind open={changeEmailVisible} onClose={() => setChangeEmailVisible(false)} />
        )}
      </Toolbar>
    </AppBar>
  );
}
