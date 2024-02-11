import { Button } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import StopIcon from '@mui/icons-material/Stop';
import { useEffect, useRef, useState } from 'react';
import { padStart } from 'lodash';
import { recorder } from './recorderManager';

export interface AudioRecorderProps {
  value?: Blob;
  onChange: (value?: Blob) => void;
}

export function AudioRecorder({ value, onChange }: AudioRecorderProps) {
  const [recordState, setRecordState] = useState<RecordingState>('inactive');
  const [time, setTime] = useState(0);

  const intervalId = useRef<number>();

  const stop = async () => {
    await recorder.stop();
    const blob = recorder.getWAVBlob();
    onChange(blob);
  };

  const start = () => {
    // 取消暂停步骤
    if (recordState === 'paused') {
      recorder.resume();
    } else if (recordState === 'recording') {
      // recorderManager.pause();
      stop();
      setRecordState('inactive');
    } else {
      onChange(undefined);
      recorder.start().then(() => {
        setRecordState('recording');
      });
    }
  };

  useEffect(() => {
    return () => {
      recorder.destroy();
    };
  }, []);

  useEffect(() => {
    if (recordState === 'recording') {
      intervalId.current = window.setInterval(() => {
        setTime((val) => val + 1);
      }, 1000);
    } else if (recordState !== 'paused') {
      setTime(0);
    }
    return () => {
      window.clearInterval(intervalId.current);
    };
  }, [recordState]);

  const mm = padStart(String((time / 60) | 0), 2, '0');
  const ss = padStart(String(time % 60), 2, '0');

  return (
    <Button
      size="large"
      variant="outlined"
      startIcon={
        recordState === 'recording' ? (
          <StopIcon fontSize="large" />
        ) : (
          <CircleIcon fontSize="large" />
        )
      }
      onClick={start}
    >
      {recordState === 'recording' ? `${mm}:${ss}` : value ? '重录' : '录音'}
    </Button>
  );
}
