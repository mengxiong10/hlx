import { useState } from 'react';
import { SpeakingInfo } from 'src/api/study';
import { StudyContainer } from './Container';
import { Subject, SubjectBaseKeys } from './Subject';
import { useStudy } from './useStudy';
import { AudioSpeaking } from './AudioSpeaking';

interface SpeakingProps {
  data: SpeakingInfo[];
  title: string;
  baseKey: SubjectBaseKeys<SpeakingInfo>;
}

export function Speaking({ data, title, baseKey }: SpeakingProps) {
  const [audio, setAudio] = useState<Blob | undefined>();

  const { current, ...restProps } = useStudy({
    data,
    validateText: '请先录音',
    validate: () => audio === undefined,
    reset: () => setAudio(undefined),
  });

  return (
    <StudyContainer
      footer={
        <AudioSpeaking value={audio} onChange={setAudio} url={current.audioAttach?.attachUrl} />
      }
      confirmText="读的不错"
      title={title}
      {...restProps}
    >
      <Subject mediaFirst data={current} baseKey={baseKey} />
    </StudyContainer>
  );
}
