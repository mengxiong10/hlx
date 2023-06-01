import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getExams } from 'src/api/exam';
import { TextbookType } from 'src/api/textbook';
import { useUser } from 'src/auth/AuthContext';
import { QueryContainer } from 'src/component/QueryContainer';
import { PageContainer } from 'src/page/layout/PageContainer';
import examCover from 'src/assets/image/examCover.png';

export function ExamList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useUser()!;

  const type = (searchParams.get('type') as TextbookType) || TextbookType.English;

  const result = useQuery(['exams', type], () => getExams({ deptId: user.deptId, subType: type }));

  const handleChange = (evt: React.SyntheticEvent, value: TextbookType) => {
    setSearchParams({ type: value });
  };

  const items = result.data || [];

  return (
    <PageContainer>
      <Tabs variant="scrollable" value={type} onChange={handleChange}>
        <Tab label="英语课程" value={TextbookType.English} />
        <Tab label="汉语课程" value={TextbookType.Chinese} />
      </Tabs>
      <QueryContainer sx={{ flex: 1, overflow: 'auto' }} isEmpty={items.length === 0} {...result}>
        <List>
          {items.map((value, index) => (
            <ListItem divider={index !== items.length - 1} disablePadding key={value.id}>
              <ListItemButton
                component={Link}
                to={`/exam/${value.id}`}
                state={{ title: value.examName }}
              >
                <ListItemAvatar>
                  <Avatar variant="square" src={examCover}></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      {value.examName}
                      <Typography
                        sx={{ display: 'inline', marginLeft: '0.5em' }}
                        component="span"
                        color="text.secondary"
                      >
                        {`(共 ${value.examTotal} 题)`}
                      </Typography>
                    </>
                  }
                  secondary={value.examDesc}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </QueryContainer>
    </PageContainer>
  );
}
