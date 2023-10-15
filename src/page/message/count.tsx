import { Badge } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getMessageCount } from 'src/api/message';

export interface MessageCountProps {
  children: React.ReactNode;
}

export function MessageCount({ children }: MessageCountProps) {
  const result = useQuery(['messageCount'], () => getMessageCount());

  return (
    <Badge badgeContent={result.data ?? 0} color="primary">
      {children}
    </Badge>
  );
}
