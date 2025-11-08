import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
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

  // 创建音频播放器实例
  const [audio] = useState(() => new Audio());

  // 组件卸载时清理音频
  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  // 处理鼠标移入事件，播放对应文字块的音频
  const handleMouseEnter = (itemId: string) => {
    // 根据 itemId 找到对应的 SortOption
    const option = current.options.find((opt) => opt.value === itemId);
    if (option?.attachUrl) {
      audio.pause();
      audio.loop = false;
      audio.src = option.attachUrl;
      // 如果播放失败（如网络问题），静默处理，不影响其他功能
      audio
        .play()
        .then(() => {
          console.log('played');
        })
        .catch((err) => {
          console.error(err);
          // 静默处理播放失败
        });
    }
  };

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
              onMouseEnter={() => handleMouseEnter(item.id)}
            >
              <Typography variant="study">{item.content.replace(/_/g, ' ')}</Typography>
            </Paper>
          )}
        ></Sortable>
      </Box>
    </StudyContainer>
  );
}
