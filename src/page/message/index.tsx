import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { InfiniteScroll } from 'src/component/InfiniteScroll';
import { Message, getMessage } from 'src/api/message';
import messageCover from 'src/assets/image/message.png';
import { PageContainer } from '../layout/PageContainer';

export function MessageList() {
  const result = useInfiniteQuery(
    ['messages'],
    ({ pageParam = 0 }) => getMessage({ page: pageParam, size: 10 }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages - 1) {
          return lastPage.page + 1;
        }
        return undefined;
      },
    }
  );
  const list =
    result.data?.pages.reduce((acc, val) => acc.concat(val.content), [] as Message[]) || [];

  return (
    <PageContainer>
      <InfiniteScroll
        fetchNextPage={() => result.fetchNextPage()}
        hasNextPage={result.hasNextPage}
        isLoading={result.isLoading}
        hasChildren={list.length > 0}
      >
        <List>
          {list.map((value, index) => (
            <ListItem alignItems="flex-start" divider={index !== list.length - 1} key={value.id}>
              <ListItemAvatar>
                <Avatar variant="square" src={messageCover}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={value.title} secondary={value.newsContent}></ListItemText>
            </ListItem>
          ))}
        </List>
      </InfiniteScroll>
    </PageContainer>
  );
}
