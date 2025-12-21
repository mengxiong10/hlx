import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getStudyInfo, StepValue, StudyParams } from 'src/api/study';
import { QueryContainer } from 'src/component/QueryContainer';
import { Box } from '@mui/material';
import { WriteWord } from './RouteWriteWord';
import { Reading } from './RouteReading';
import { Sorting } from './RouteSorting';
import { Selection } from './RouteSelection';
import { WriteSentence } from './RouteWriteSentence';
import { WriteFullText } from './RouteWriteFullText';
import { Speaking } from './RouteSpeaking';
import { SpeakingSentence } from './RouteSpeakingSentence';
import { SpeakingFullText } from './RouteSpeakingFullText';

const map: {
  [key in StepValue]: JSX.Element;
} = {
  [StepValue.Reading]: <Reading title="看和听" data={[]} />,
  [StepValue.WriteWord]: <WriteWord title="填空" data={[]} />, // 有提示 错题重来
  [StepValue.WriteSentenceByAudio]: (
    <WriteSentence title="句子听写" data={[]} baseKey="audioAttach" />
  ), // 提示为看和听 错题重来
  [StepValue.WriteSentenceByTranslation]: (
    <WriteSentence title="据译写文" data={[]} baseKey="translation" />
  ), // 提示为看和听 错题重来
  [StepValue.WriteFullText]: <WriteFullText title="默写" data={[]} />, // 提示为看和听 错题重来

  [StepValue.SortSentence]: <Sorting title="排句成篇" data={[]} vertical />, // 无提示 无错题
  [StepValue.SortTranslation]: (
    <Sorting
      title="译文排序"
      data={[]}
      vertical
      baseKey={['imageAttach', 'audioAttach', 'videoAttach']}
    />
  ), // 无提示 无错题
  [StepValue.SortSentenceByAudio]: (
    <Sorting title="据音排句" data={[]} vertical baseKey="audioAttach" />
  ), // 无提示 无错题
  [StepValue.SortWordByAudio]: (
    <Sorting title="据音排词" data={[]} baseKey={['audioAttach', 'translation']} />
  ), // 提示为看和听 错题重来
  [StepValue.SortWordByTranslation]: <Sorting title="据译排词" data={[]} baseKey="translation" />, // 提示为看和听 错题重来

  [StepValue.Selection]: (
    <Selection
      title="常规选择"
      data={[]}
      multiple
      baseKey={['content', 'imageAttach', 'audioAttach', 'videoAttach']}
    />
  ), // 有提示 错误重来
  [StepValue.SelectionByAudio]: <Selection title="据音选文" data={[]} baseKey="audioAttach" />, // 无提示 错误重来
  [StepValue.SelectionByContent]: <Selection title="据文选择" data={[]} baseKey="content" />, // 无提示 错误重来
  [StepValue.SelectionImageByAudio]: <Selection title="据音选图" data={[]} baseKey="audioAttach" />, // 无提示 错误重来

  [StepValue.SpeakingByTranslation]: <Speaking title="据译说文" data={[]} baseKey="translation" />, // 直接过
  [StepValue.SpeakingByImage]: <Speaking title="说图" data={[]} baseKey="imageAttach" />, // 直接过
  [StepValue.SpeakingRepeat]: (
    <Speaking title="句子复述" data={[]} baseKey={['audioAttach', 'content']} />
  ), // 直接过
  [StepValue.SpeakingByContent]: <SpeakingSentence title="读句子" data={[]} baseKey="content" />, // 打分...
  [StepValue.SpeakingByFullword]: <SpeakingFullText title="背诵" data={[]} />,
};

// TODO:
// 读句中词
// 句中词听写
// 读单词

export function Study<T extends StepValue>() {
  const { textbookId, unitId, stepId, stepValue } = useParams() as StudyParams<T>;

  const info = useQuery(['study', textbookId, unitId, stepId, stepValue], () =>
    getStudyInfo({ textbookId, unitId, stepId, stepValue })
  );

  const { data } = info;

  let children: React.ReactNode = null;
  if (!map[stepValue]) {
    children = <span>暂不支持</span>;
  } else if (data) {
    children = React.cloneElement(map[stepValue], { data });
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        background: '#fff',
      }}
    >
      <QueryContainer sx={{ height: '100%' }} {...info}>
        {children}
      </QueryContainer>
    </Box>
  );
}
