import { Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Attach, SentenceScoreWord } from 'src/api/study';
import { MediaList } from './MediaList';

export interface SpeakingSentenceTipProps {
  audioAttach?: Attach;
  words?: SentenceScoreWord[];
}

export function SpeakingSentenceTip({ audioAttach, words = [] }: SpeakingSentenceTipProps) {
  const [audio] = useState(() => new Audio());

  const play = (url: string) => {
    audio.pause();
    audio.loop = false;
    audio.src = url;
    audio.play();
  };

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, []);

  return (
    <>
      <MediaList attach={audioAttach}></MediaList>
      <Typography gutterBottom>
        {words.length > 0 ? '点击下面各词播该词音频' : '语音识别未通过'}
      </Typography>
      <Stack direction="row">
        {words.map((word) => (
          <Button
            sx={{ minWidth: 0 }}
            onClick={() => play(word.audioUrl)}
            variant="text"
            key={word.word}
          >
            {word.word}
          </Button>
        ))}
      </Stack>
    </>
  );
}
