import { Paper, Container, Stack, Button, ButtonProps, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Header } from 'src/component/Header';
import { DialogFullscreen } from 'src/component/DialogFullscreen';
import { useParams } from 'react-router-dom';
import { useSteps } from '../textbook/Unit';

export interface StudyContainerProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tips?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isWrong?: boolean;
  confirmProps?: ButtonProps;
  onRight?: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

const voidFunction = () => {};

export function StudyContainer({
  title,
  tips,
  isLoading = false,
  isWrong = false,
  onRight,
  onCancel,
  onConfirm,
  confirmProps,
  cancelText = '上一步',
  confirmText = '确定',
  children,
  footer,
}: StudyContainerProps) {
  const steps = useSteps();
  const { stepId } = useParams();
  const step = steps.find((v) => String(v.stepNum) === stepId);

  const headerTitle = step ? step.title : title;

  return (
    <Paper sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <Header primary title={headerTitle}></Header>
      <Box sx={{ flex: 1, overflow: 'auto', py: 4 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
      <Stack
        p={2}
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        <>
          {footer}
          <LoadingButton
            loading={isLoading}
            size="large"
            variant="contained"
            onClick={onConfirm}
            {...confirmProps}
          >
            {confirmText}
          </LoadingButton>
          {onCancel && (
            <Button size="large" variant="outlined" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
        </>
      </Stack>
      {tips && (
        <DialogFullscreen
          title="提示"
          cancelButtonText="知道了"
          open={isWrong}
          onClose={onRight || voidFunction}
        >
          {tips}
        </DialogFullscreen>
      )}
    </Paper>
  );
}
