import { Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { AudioRecorder } from 'src/component/AudioRecorder';

export interface AudioSpeakingProps {
  url?: string; // 标准音频
  value?: Blob;
  onChange: (value?: Blob) => void;
  disabled?: boolean;
}

export function AudioSpeaking({ url, value, onChange, disabled = false }: AudioSpeakingProps) {
  const [audioState, setAudioState] = useState('');
  const [audioEl] = useState(() => new Audio());

  useEffect(() => {
    return () => {
      audioEl.pause();
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
      <AudioRecorder value={value} onChange={onChange}></AudioRecorder>
    </>
  );
}
