import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { checkVoice, SpeakingInfo } from 'src/api/study';
import { blobToBase64 } from 'src/util';
import { StudyContainer } from './Container';
import { SpeakingSentenceTip } from './SpeakingSentenceTip';
import { Subject, SubjectBaseKeys } from './Subject';
import { useStudy } from './useStudy';
import { AudioSpeaking } from './AudioSpeaking';

interface SpeakingProps {
  data: SpeakingInfo[];
  title: string;
  baseKey: SubjectBaseKeys<SpeakingInfo>;
}

export function SpeakingSentence({ data, title, baseKey }: SpeakingProps) {
  const { type, stepValue } = useParams() as { type: string; stepValue: string };

  const [audio, setAudio] = useState<Blob>();

  const sentenceMutation = useMutation(checkVoice);

  const isCorrect = async (value: SpeakingInfo) => {
    const audioBase64 = await blobToBase64(audio!);
    const val = await sentenceMutation.mutateAsync({
      type: parseInt(stepValue, 10),
      id: value.id,
      language: type,
      audioBase64,
    });
    return val.status === '1';
  };

  const { current, isLoading, ...restProps } = useStudy({
    data,
    validateText: '请先录音',
    validate: () => audio === undefined,
    isCorrect,
  });

  const isComfirmLoading = isLoading || sentenceMutation.isLoading;

  return (
    <StudyContainer
      footer={
        <AudioSpeaking
          disabled={isComfirmLoading}
          onChange={setAudio}
          value={audio}
          url={current.audioAttach?.attachUrl}
        />
      }
      confirmProps={{ disabled: !audio }}
      confirmText="提交"
      title={title}
      isLoading={isComfirmLoading}
      tips={
        <SpeakingSentenceTip
          audioAttach={current.audioAttach}
          words={sentenceMutation.data?.words}
        />
      }
      {...restProps}
    >
      <Subject data={current} baseKey={baseKey} />
    </StudyContainer>
  );
}
