import { Box, Stack } from '@mui/material';
import { Attach, AttachType } from 'src/api/study';
import screenfull from 'screenfull';
import { useRef } from 'react';

export interface MediaListProps {
  attach: Attach | undefined | Array<Attach | undefined>;
}

// TODO: tabs 重构
export function MediaList({ attach }: MediaListProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); // TODO: 逗号分隔多个视频
  const videoRef = useRef<HTMLVideoElement>(null);

  const filterAttachs = (Array.isArray(attach) ? attach : [attach]).filter(Boolean) as Attach[];

  const imageAttach = filterAttachs.find((v) => v.attachType === AttachType.Image);
  const audioAttach = filterAttachs.find((v) => v.attachType === AttachType.Audio);
  const videoAttach = filterAttachs.find((v) => v.attachType === AttachType.Video);

  const toggleImageFullscreen: React.MouseEventHandler<HTMLImageElement> = (evt) => {
    const { target } = evt;
    if (screenfull.isEnabled) {
      screenfull.toggle(target as HTMLImageElement);
    }
  };

  return (
    <Box mb={1} mt={1}>
      <Stack spacing={2} alignItems="center">
        {audioAttach && (
          <audio
            ref={audioRef}
            style={{ width: '100%' }}
            // style={{ display: type === AttachType.Audio ? 'block' : 'none' }}
            controls
            src={audioAttach.attachUrl}
          />
        )}
        {videoAttach && (
          <video
            style={{ maxWidth: '100%' }}
            ref={videoRef}
            // style={{ display: type === AttachType.Video ? 'block' : 'none' }}
            controls
            src={videoAttach.attachUrl}
          />
        )}
        {!videoAttach && imageAttach && (
          <img
            style={{ maxWidth: '100%' }}
            // style={{ display: type === AttachType.Image ? 'block' : 'none', maxWidth: 300 }}
            alt="study"
            ref={imageRef}
            src={imageAttach.attachUrl}
            onClick={toggleImageFullscreen}
          />
        )}
      </Stack>
    </Box>
  );
}
