import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProductById, getPaymentUrl, getUnpaidOrder, PaymentInfo } from 'src/api/payment';
import { useUser } from 'src/auth/AuthContext';
import { pick } from 'lodash';
import { useCallback, useState } from 'react';
import { PaymentStatus } from './PaymentStatus';

export interface PaymentProps {
  id: string;
}

export function Payment({ id }: PaymentProps) {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<PaymentInfo | null>(null);

  const product = useQuery(['product', id], () => getProductById(id));

  const { mutateAsync: mutateGetPaymentUrl, isLoading } = useMutation(async (pid: string) => {
    let data: PaymentInfo | null = null;

    try {
      data = await getUnpaidOrder(pid);
    } catch (error) {
      console.error(error);
    }
    if (!data) {
      data = await getPaymentUrl(pid);
    }

    return data;
  });

  const handlePayment = async () => {
    const data = await mutateGetPaymentUrl(product.data!.id);
    setInfo(pick(data, 'codeUrl', 'orderNo'));
    setOpen(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  if (!user || user.phone !== '13607148408') {
    return null;
  }

  if (!product.data) {
    return null;
  }

  return (
    <>
      <LoadingButton loading={isLoading} onClick={handlePayment}>
        我要报课
      </LoadingButton>
      {info && (
        <PaymentStatus
          {...info}
          open={open}
          product={product.data}
          onClose={handleClose}
        ></PaymentStatus>
      )}
    </>
  );
}
