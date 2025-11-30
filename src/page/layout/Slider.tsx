// import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HistoryIcon from '@mui/icons-material/History';
// import ArticleIcon from '@mui/icons-material/Article';
import MailIcon from '@mui/icons-material/Mail';
// import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { MessageCount } from '../message/count';

interface Item {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export const navList: Item[] = [
  {
    key: '/alltextbook',
    label: '免费课程',
    icon: <LibraryBooksIcon />,
  },
  {
    key: '/textbook',
    label: '已报课程',
    icon: <MenuBookIcon />,
  },
  {
    key: '/history',
    label: '学习记录',
    icon: <HistoryIcon />,
  },
  // {
  //   key: '/exams',
  //   label: '现在测试',
  //   icon: <ArticleIcon />,
  // },
  // {
  //   key: '/recordExam',
  //   label: '测试记录',
  //   icon: <HistoryEduIcon />,
  // },
  {
    key: '/feedback',
    label: '师生互动',
    icon: <HistoryIcon />,
  },
  {
    key: '/message',
    label: <MessageCount>系统通知</MessageCount>,
    icon: <MailIcon />,
  },
];

export function Slider({ onClick }: { onClick?: VoidFunction }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (item: Item) => {
    navigate(item.key);
    onClick?.();
  };

  const selectedKey = location.pathname;

  return (
    <List
      sx={{
        width: 240,
        px: 2,
      }}
      component="nav"
    >
      {navList.map((item) => (
        <ListItem key={item.key} disablePadding>
          <ListItemButton
            selected={selectedKey === item.key}
            onClick={() => handleClick(item)}
            sx={(theme) => ({
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                backgroundColor: 'transparent',
              },
            })}
          >
            <ListItemIcon sx={{ minWidth: 35, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
