import { Tab, Tabs, Tooltip } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getTextBookDetail, getTextbookUnit } from 'src/api/textbook';
import { isObject } from 'src/util';
import { PageContainer } from '../layout/PageContainer';
import { Payment } from './Payment';

export function Textbook() {
  const location = useLocation();
  const navigate = useNavigate();
  const { textbookId, unitId, type } = useParams();
  const queryClient = useQueryClient();

  const prefix = location.pathname.match(/^\/\w+/)![0];

  const textbookUnits = useQuery(['textbookUnits', textbookId], () => getTextbookUnit(textbookId!));

  const textbookDetail = useQuery(['textbookDetail', textbookId], () =>
    getTextBookDetail(textbookId!)
  );

  const handlePaymentSuccess = useCallback(() => {
    // 刷新textbook详情和单元列表
    queryClient.invalidateQueries(['textbookDetail', textbookId]);
    queryClient.invalidateQueries(['textbookUnits', textbookId]);
  }, [queryClient, textbookId]);

  const units = textbookUnits.data || [];

  const replaceBreadcrumbs = () => {
    return [
      { path: `${prefix}?type=${type}`, name: prefix === '/textbook' ? '已报课程' : '免费课程' },
      {
        path: location.pathname,
        name:
          textbookDetail.data?.qsTextbook.qsName ??
          (isObject(location.state) ? location.state.title : ''),
      },
    ];
  };

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
    <PageContainer
      replaceBreadcrumbs={replaceBreadcrumbs}
      action={textbookDetail.data?.isAuth === 1 ? null : <Payment id={textbookId!} onSuccess={handlePaymentSuccess} />}
    >
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
