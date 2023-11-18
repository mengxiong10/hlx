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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getRebateDetail, getTotalRebate } from 'src/api/rebate';
import dayjs from 'dayjs';
import { useState } from 'react';
import { QueryContainer } from 'src/component/QueryContainer';
import { PageContainer } from '../layout/PageContainer';
import { Withdraw } from './Withdraw';

export function Rebate() {
  const [open, setOpen] = useState(false);

  const totalQuery = useQuery(['totalRebase'], () => getTotalRebate());

  const detail = useQuery(['rebate'], () => getRebateDetail());

  const content = detail.data?.content ?? [];

  const total = totalQuery.data ?? 0;

  return (
    <PageContainer>
      <QueryContainer sx={{ flex: 1, overflow: 'auto' }} isEmpty={false} {...totalQuery}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}
        >
          <Typography variant="body1">您的总积分: {total}</Typography>
          <Button variant="contained" disabled={total === 0} onClick={() => setOpen(true)}>
            提现
          </Button>
        </Box>

        <Paper sx={{ m: 1.5 }}>
          <Typography variant="body1" p={2} bgcolor="#f7f7f8">
            积分详情
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>创建时间</TableCell>
                <TableCell align="right">佣金</TableCell>
                <TableCell align="right">被邀请人</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map((row) => (
                <TableRow key={row.order_no}>
                  <TableCell component="th" scope="row">
                    {dayjs(row.create_time).format('YYYY/MM/DD')}
                  </TableCell>
                  <TableCell align="right">{row.rebate_change}</TableCell>
                  <TableCell align="right">{row.invitee_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </QueryContainer>
      <Withdraw open={open} onClose={() => setOpen(false)}></Withdraw>
    </PageContainer>
  );
}
