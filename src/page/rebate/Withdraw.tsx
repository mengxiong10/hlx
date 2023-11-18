import { FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import { Modal } from 'src/component/DialogBasic';

export interface WithdrawProps {
  onClose: () => void;
  open: boolean;
}

export function Withdraw({ open, onClose }: WithdrawProps) {
  const handleConfirm = () => {
    onClose();
  };

  return (
    <Modal maxWidth="xs" title="提现" open={open} onClose={onClose} onConfirm={handleConfirm}>
      <FormControl fullWidth variant="standard">
        <InputLabel htmlFor="withdraw-amount">提现金额</InputLabel>
        <Input
          type="number"
          id="withdraw-amount"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
      </FormControl>
    </Modal>
  );
}
