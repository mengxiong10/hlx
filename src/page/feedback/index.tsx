import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { createFeedback, FeedbackContent, getFeedbackList } from 'src/api/feedback';
import { Modal } from 'src/component/DialogBasic';
import { InfiniteScroll } from 'src/component/InfiniteScroll';
import { PageContainer } from '../layout/PageContainer';

export function Feedback() {
  const result = useInfiniteQuery(
    ['feedback'],
    ({ pageParam = 0 }) => getFeedbackList({ page: pageParam, size: 10 }),
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
    result.data?.pages.reduce((acc, cur) => acc.concat(cur.content), [] as FeedbackContent[]) || [];

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isError, setError] = useState(false);

  const submit = useMutation(createFeedback);

  const handleClose = () => {
    setOpen(false);
    setContent('');
    setError(false);
  };
  const handleConfirm = async () => {
    if (!content) {
      setError(true);
    } else {
      await submit.mutateAsync(content);
      result.refetch();
      handleClose();
    }
  };

  return (
    <PageContainer
      contentStyle={{ bgcolor: 'grey.100' }}
      action={
        <Button variant="outlined" onClick={() => setOpen(true)}>
          发给老师
        </Button>
      }
    >
      <InfiniteScroll
        fetchNextPage={() => result.fetchNextPage()}
        hasNextPage={result.hasNextPage}
        isLoading={result.isLoading}
        hasChildren={list.length > 0}
      >
        {list.map((item) => (
          <Card key={item.id} sx={{ m: 1.5 }} elevation={1}>
            <CardContent style={{ padding: '1px' }}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                {item.createTime}
              </Typography>
              <Typography sx={{ fontSize: 16 }} variant="h6">
                {item.recontent || '空'}
              </Typography>
              {item.response && (
                <CardContent sx={{ bgcolor: 'grey.100', mt: 1 }} style={{ padding: '1px' }}>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    {item.updateTime}
                  </Typography>
                  <Typography sx={{ fontSize: 16 }} variant="body2">
                    {item.response}
                  </Typography>
                </CardContent>
              )}
            </CardContent>
          </Card>
        ))}
      </InfiniteScroll>
      <Modal
        title="发给老师"
        open={open}
        confirmLoading={submit.isLoading}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        <TextField
          fullWidth
          multiline
          autoFocus
          error={isError}
          helperText={isError ? '不能为空' : ''}
          rows={10}
          value={content}
          onChange={(evt) => setContent(evt.target.value)}
        />
      </Modal>
    </PageContainer>
  );
}
