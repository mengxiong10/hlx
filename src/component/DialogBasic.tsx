import {
  DialogProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  ButtonProps,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import CloseIcon from '@mui/icons-material/Close';

export interface ModalProps extends DialogProps {
  title?: string;
  onConfirm?: () => void;
  onClose: () => void;
  children: React.ReactNode;
  confirmLoading?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  confirmButtonProps?: ButtonProps;
}

export function Modal({
  title = '',
  open,
  children,
  onClose,
  onConfirm,
  confirmButtonProps,
  confirmLoading = false,
  cancelButtonText = '取消',
  confirmButtonText = '确定',
  ...restProps
}: ModalProps) {
  return (
    <Dialog fullWidth maxWidth="sm" {...restProps} open={open} onClose={onClose}>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions disableSpacing sx={{ py: 1 }}>
        <Button onClick={onClose}>{cancelButtonText}</Button>
        {onConfirm && (
          <LoadingButton loading={confirmLoading} onClick={onConfirm} {...confirmButtonProps}>
            {confirmButtonText}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
