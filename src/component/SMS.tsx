import { Button, ButtonProps } from '@mui/material';
import { useEffect, useState } from 'react';

export interface SMSprops extends ButtonProps {
  onSend: () => Promise<boolean>;
}

function CountDown({ onEnd }: { onEnd: VoidFunction }) {
  const [time, setTime] = useState(60);

  useEffect(() => {
    if (time === 0) {
      onEnd();
    }
  }, [time, onEnd]);

  useEffect(() => {
    const tid = window.setInterval(() => {
      setTime((value) => value - 1);
    }, 1000);
    return () => {
      window.clearInterval(tid);
    };
  }, []);

  return <span>{`${time}秒后可重发`}</span>;
}

export function SMS({ onSend, ...restProps }: SMSprops) {
  const [smsState, setSmsState] = useState(0); // 0 是未发送 1 是已发送 2 是已发送且可以重新发送

  const handleClick = async () => {
    const canSend = await onSend();
    if (canSend) {
      setSmsState(1);
    }
  };

  return (
    <Button
      disabled={smsState === 1}
      onClick={handleClick}
      size="medium"
      variant="text"
      {...restProps}
    >
      {smsState === 1 ? (
        <CountDown onEnd={() => setSmsState(2)} />
      ) : (
        `${smsState === 2 ? '重新' : ''}获取验证码`
      )}
    </Button>
  );
}
