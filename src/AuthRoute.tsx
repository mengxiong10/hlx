import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { initWxConfig } from './wx';

export function AuthRoute() {
  useEffect(() => {
    initWxConfig();
  }, []);

  return <Outlet />;
}
