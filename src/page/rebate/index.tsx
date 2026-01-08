import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Paper,
  Box,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getRebateDetail, getTotalRebate, getWithdrawRecords } from 'src/api/rebate';
import dayjs from 'dayjs';
import { useState } from 'react';
import { QueryContainer } from 'src/component/QueryContainer';
import { PageContainer } from '../layout/PageContainer';
import { Withdraw } from './Withdraw';

export function Rebate() {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const queryClient = useQueryClient();

  const totalQuery = useQuery(['totalRebate'], () => getTotalRebate());

  const detailQuery = useQuery(['rebateDetail'], () => getRebateDetail({ page: 0, size: 20 }));

  const withdrawQuery = useQuery(['withdrawRecords'], () => getWithdrawRecords({ page: 0, size: 20 }));

  const rebateContent = detailQuery.data?.content ?? [];
  const withdrawContent = withdrawQuery.data?.content ?? [];

  const total = totalQuery.data ?? 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleWithdrawSuccess = () => {
    queryClient.invalidateQueries(['totalRebate']);
    queryClient.invalidateQueries(['rebateDetail']);
    queryClient.invalidateQueries(['withdrawRecords']);
    setOpen(false);
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: '待审核',
      APPROVED: '已通过',
      REJECTED: '已拒绝',
      COMPLETED: '已完成',
    };
    return statusMap[status] || status;
  };

  return (
    <PageContainer>
      <QueryContainer sx={{ flex: 1, overflow: 'auto' }} isEmpty={false} {...totalQuery}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}
        >
          <Typography variant="body1">总额 (分) : {total}</Typography>
          <Button variant="contained" disabled={total === 0} onClick={() => setOpen(true)}>
            提现
          </Button>
        </Box>

        <Paper sx={{ m: 1.5 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="返利记录" />
            <Tab label="提现记录" />
          </Tabs>

          {tabValue === 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>时间</TableCell>
                  <TableCell align="right">类型</TableCell>
                  <TableCell align="right">金额</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rebateContent.map((row) => (
                  <TableRow key={row.order_no || row.withdraw_id || row.create_time}>
                    <TableCell component="th" scope="row">
                      {dayjs(row.create_time).format('YYYY/MM/DD HH:mm')}
                    </TableCell>
                    <TableCell align="right">
                      {row.change_type === 0 ? (
                        <span>返利收入（{row.invitee_name || '-'}）</span>
                      ) : (
                        <span>提现支出</span>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <span style={{ color: row.change_type === 0 ? '#4caf50' : '#f44336' }}>
                        {row.change_type === 0 ? '+' : '-'}
                        {row.rebate_change} 分
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {rebateContent.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      暂无返利记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {tabValue === 1 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>申请时间</TableCell>
                  <TableCell align="right">提现金额</TableCell>
                  <TableCell align="right">状态</TableCell>
                  <TableCell align="right">备注</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {withdrawContent.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {dayjs(row.create_time).format('YYYY/MM/DD HH:mm')}
                    </TableCell>
                    <TableCell align="right">{row.amount} 分</TableCell>
                    <TableCell align="right">{getStatusText(row.status)}</TableCell>
                    <TableCell align="right">{row.remark || '-'}</TableCell>
                  </TableRow>
                ))}
                {withdrawContent.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      暂无提现记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Paper>
      </QueryContainer>
      <Withdraw open={open} onClose={() => setOpen(false)} onSuccess={handleWithdrawSuccess} />
    </PageContainer>
  );
}
