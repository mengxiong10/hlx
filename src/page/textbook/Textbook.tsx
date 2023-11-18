import { Tab, Tabs, Tooltip } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getTextbookUnit } from 'src/api/textbook';
import { isObject } from 'src/util';
import { PageContainer } from '../layout/PageContainer';
import { Payment } from './Payment';

export function Textbook() {
  const location = useLocation();
  const navigate = useNavigate();
  const { textbookId, unitId, type } = useParams();

  const prefix = location.pathname.match(/^\/\w+/)![0];

  const replaceBreadcrumbs = () => {
    return [
      { path: `${prefix}?type=${type}`, name: prefix === '/textbook' ? '已报课程' : '免费课程' },
      { path: location.pathname, name: isObject(location.state) ? location.state.title : '' },
    ];
  };

  const textbook = useQuery(['textbook', textbookId], () => getTextbookUnit(textbookId!));

  const units = textbook.data || [];

  const setUnitId = useCallback((id: string) => {
    navigate(`unit/${id}`, { replace: true, state: location.state });
  }, []);

  useEffect(() => {
    if (!unitId && units.length) {
      const active = units.find((item) => item.selected === '1') || units[0];
      setUnitId(active.id);
    }
  }, [unitId, units]);

  return (
    <PageContainer replaceBreadcrumbs={replaceBreadcrumbs} action={<Payment id={textbookId!} />}>
      <Tabs
        variant="scrollable"
        value={unitId || false}
        onChange={(evt, value) => {
          if (value) {
            setUnitId(value);
          }
        }}
      >
        {units.map((item) => {
          const isDisabled = item.enabled === '0';
          return (
            <Tab
              key={item.id}
              value={isDisabled ? '' : item.id}
              sx={isDisabled ? { color: 'rgba(0,0,0,0.38)', cursor: 'not-allowed' } : {}}
              label={
                isDisabled ? (
                  <Tooltip title="该课程未授权" placement="top-start">
                    <span>{item.title}</span>
                  </Tooltip>
                ) : (
                  item.title
                )
              }
            />
          );
        })}
      </Tabs>
      <Outlet />
    </PageContainer>
  );
}
