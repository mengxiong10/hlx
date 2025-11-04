import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ReadInfo } from 'src/api/study';
import TranslateIcon from '@mui/icons-material/Translate';
import SourceIcon from '@mui/icons-material/Source';
import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useRef } from 'react';
import { StudyContainer } from './Container';
import { MediaList } from './MediaList';
import { useStudy } from './useStudy';

export function ReadingContent({ current }: { current: ReadInfo }) {
  const translation: {
    key: string;
    icon: React.ReactNode;
    text: string[] | string | undefined;
  } = {
    key: 'translation',
    icon: <TranslateIcon fontSize="inherit" />,
    text: current.translation?.split('/'),
  };
  const content = {
    key: 'content',
    icon: <SourceIcon fontSize="inherit" />,
    text: current.content?.replace(/_/g, ' ').split(/\s{2,}/),
  };

  const analysis = {
    key: 'analysis',
    icon: <InfoIcon fontSize="inherit" />,
    text: current.analysis,
  };

  const list = [analysis, translation, content];

  const root = useRef(null);

  useEffect(() => {
    const dom = root.current as HTMLElement | null;
    if (dom) {
      const contentItems = [...dom.querySelectorAll('.js-width-content')] as HTMLElement[];
      const transItems = [...dom.querySelectorAll('.js-width-translation')] as HTMLElement[];
      const contentItemsWidth = contentItems.map((item) => item.offsetWidth);
      const transItemsWidth = transItems.map((item) => item.offsetWidth);
      const maxWidths = contentItemsWidth.map((item, index) => {
        return transItemsWidth[index] ? Math.max(transItemsWidth[index], item) : item;
      });
      contentItems.forEach((item, index) => {
        if (maxWidths[index]) {
          item.style.width = `${maxWidths[index] + 4}px`;
        }
      });
      transItems.forEach((item, index) => {
        if (maxWidths[index]) {
          item.style.width = `${maxWidths[index] + 4}px`;
        }
      });
    }
  }, [current.id]);

  return (
    <>
      <MediaList
        key={current.id}
        attach={[current.imageAttach, current.audioAttach, current.videoAttach]}
      ></MediaList>
      <List ref={root} key={current.id}>
        {list.map((item) =>
          item.text ? (
            <ListItem key={item.key} alignItems="flex-start">
              <ListItemIcon sx={{ color: 'primary.main', typography: 'study', minWidth: '28px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  Array.isArray(item.text)
                    ? item.text.map((v, i) => {
                        const text = (
                          <span
                            style={{ display: 'inline-block' }}
                            className={`js-width-${item.key}`}
                          >
                            {v}
                          </span>
                        );
                        return i !== 0
                          ? [
                              <span style={{ opacity: item.key === 'content' ? 0 : 1 }}>/</span>,
                              text,
                            ]
                          : text;
                      })
                    : item.text
                }
                primaryTypographyProps={{ variant: 'study', component: 'p' }}
              />
            </ListItem>
          ) : null
        )}
      </List>
    </>
  );
}

export function Reading({ data, title }: { data: ReadInfo[]; title: string }) {
  const { current, ...restProps } = useStudy({
    data: data.filter(
      (item) => /\s{2,}/.test(item.content) || item.imageAttach || item.videoAttach
    ),
  });

  return (
    <StudyContainer title={title} confirmText="知道了" {...restProps}>
      <ReadingContent current={current} />
    </StudyContainer>
  );
}
