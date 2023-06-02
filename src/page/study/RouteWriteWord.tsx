import { useState } from 'react';
import { WriteWordInfo } from 'src/api/study';
import { Cloze } from 'src/component/Cloze';
import { isSameSentence } from 'src/util';
import { StudyContainer } from './Container';
import { useStudy } from './useStudy';
import { Tips } from './Tips';
import { Subject } from './Subject';

export function WriteWord({ data, title }: { data: WriteWordInfo[]; title: string }) {
  const [values, setValues] = useState<string[]>([]);
  const reset = () => setValues([]);

  const { current, ...restProps } = useStudy({
    data,
    reset,
    validate: (item) => values.length !== item.answer.split('|').length,
    isCorrect: (item) => isSameSentence(values.join('|'), item.answer),
  });

  return (
    <StudyContainer tips={<Tips {...current.tips} />} title={title} {...restProps}>
      <Subject data={current} baseKey={['imageAttach', 'audioAttach', 'videoAttach']}></Subject>
      <Cloze content={current.content} value={values} onChange={setValues}></Cloze>
    </StudyContainer>
  );
}
