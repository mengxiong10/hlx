import { Button } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useEffect, useRef, useState } from 'react';
import { padStart, debounce } from 'lodash';
import { recorder } from './recorderManager';

export interface AudioRecorderProps {
  url?: string; // 标准音频
  value?: Blob;
  onChange: (value?: Blob) => void;
  disabled?: boolean;
}

export function AudioRecorder({ url, value, onChange, disabled = false }: AudioRecorderProps) {
  const [recordState, setRecordState] = useState<RecordingState>('inactive');
  const [time, setTime] = useState(0);
  const [audioState, setAudioState] = useState('');
  const intervalId = useRef<number>();
  const [audioEl] = useState(() => new Audio());

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
      audioEl.pause();
      recorder.destroy();
    };
  }, []);

  const togglePlay = () => {
    if (audioState === 'play') {
      audioEl.pause();
    } else {
      audioEl.play();
    }
  };

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

  useEffect(() => {
    const audio = audioEl;

    if (value) {
      const playList: string[] = [];
      const audioURL = window.URL.createObjectURL(value);
      if (url) {
        playList.push(url);
      }
      playList.push(audioURL);
      let i = 0;
      const throttleSetAudioState = debounce(setAudioState, 50);

      audio.addEventListener('play', () => {
        throttleSetAudioState('play');
      });
      audio.addEventListener('pause', () => {
        throttleSetAudioState('pause');
      });
      audio.addEventListener('ended', () => {
        i = (i + 1) % playList.length;
        audio.src = playList[i];
        audio.play();
      });
      audio.loop = false;
      audio.src = playList[i];
      audio.play();
    }
    return () => {
      audio.pause();
    };
  }, [value, url]);

  useEffect(() => {
    if (disabled) {
      audioEl.pause();
    }
  }, [disabled, audioEl]);

  const mm = padStart(String((time / 60) | 0), 2, '0');
  const ss = padStart(String(time % 60), 2, '0');

  return (
    <>
      <Button
        size="large"
        variant="outlined"
        startIcon={
          audioState === 'play' ? (
            <PauseIcon fontSize="large" />
          ) : (
            <PlayArrowIcon fontSize="large" />
          )
        }
        disabled={!value || disabled}
        onClick={togglePlay}
      >
        {audioState === 'play' ? '暂停' : '播放'}
      </Button>
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
    </>
  );
}
