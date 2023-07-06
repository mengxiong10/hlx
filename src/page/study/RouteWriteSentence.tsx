import { useState } from 'react';
import { WriteSentenceInfo } from 'src/api/study';
import { TextField } from '@mui/material';
import { isSameSentence } from 'src/util';
import { Subject, SubjectBaseKeys } from './Subject';
import { StudyContainer } from './Container';
import { useStudy } from './useStudy';
import { ReadingContent } from './RouteReading';

interface WriteSentenceProps {
  data: WriteSentenceInfo[];
  title: string;
  baseKey: SubjectBaseKeys<WriteSentenceInfo>;
}

export function WriteSentence({ data, title, baseKey }: WriteSentenceProps) {
  const [value, setValue] = useState<string>('');
  const reset = () => setValue('');

  const { current, ...restProps } = useStudy({
    data,
    reset,
    resetOnWrong: false,
    validateText: '答案不能为空',
    validate: () => value.trim() === '',
    isCorrect: (item) => isSameSentence(value, item.content),
  });

  const handleInput: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => {
    setValue(evt.target.value);
  };

  return (
    <StudyContainer tips={<ReadingContent current={current} />} title={title} {...restProps}>
      <Subject data={current} baseKey={baseKey} />
      <TextField fullWidth multiline value={value} onChange={handleInput} variant="standard" />
    </StudyContainer>
  );
}
