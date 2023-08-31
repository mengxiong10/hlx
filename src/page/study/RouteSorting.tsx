import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { SortingInfo } from 'src/api/study';
import { Sortable } from 'src/component/Sortable';
import { Subject, SubjectBaseKeys } from './Subject';
import { StudyContainer } from './Container';
import { useStudy } from './useStudy';
import { ReadingContent } from './RouteReading';

interface SortingProps {
  data: SortingInfo[];
  title: string;
  baseKey?: SubjectBaseKeys<SortingInfo>;
  vertical?: boolean;
}

export function Sorting({ data, title, baseKey, vertical = false }: SortingProps) {
  const [value, setValue] = useState<Array<{ id: string; content: string }> | null>(null);
  const reset = () => setValue(null);

  const needRestart = vertical === false; // 排句子 不用重来 也没有提示

  const { current, ...restProps } = useStudy({
    data,
    reset,
    needRestart,
    isCorrect: (item) => {
      // 会有 content 一样的选项, 直接对比整个字符串
      const result = item.options
        .slice()
        .sort((a, b) => +a.value - +b.value)
        .map((v) => v.content)
        .join('');
      const answer = (value || item.options).map((v) => v.content).join('');
      return result === answer;
    },
  });

  const items = value || current.options.map((v) => ({ id: v.value, content: v.content }));

  return (
    <StudyContainer
      tips={vertical ? undefined : <ReadingContent current={current} />}
      title={title}
      {...restProps}
    >
      {baseKey && <Subject data={current} baseKey={baseKey} />}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: vertical ? 'column' : 'row' }}>
        <Sortable
          strategy={vertical ? verticalListSortingStrategy : undefined}
          items={items}
          setItems={setValue as any}
          renderItem={({ item, listeners, attributes, setNodeRef, style }) => (
            <Paper
              variant="outlined"
              ref={setNodeRef}
              style={style}
              sx={vertical ? { p: '0.5em', my: 1 } : { p: '0.5em', mr: '1px' }}
              {...listeners}
              {...attributes}
            >
              <Typography variant="study">{item.content.replace(/_/g, ' ')}</Typography>
            </Paper>
          )}
        ></Sortable>
      </Box>
    </StudyContainer>
  );
}
