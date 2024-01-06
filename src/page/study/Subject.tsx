import { Box, Typography } from '@mui/material';
import { Attach } from 'src/api/study';
import { PickByValue } from 'utility-types';
import reactStringReplace from 'react-string-replace';
import { MediaList } from './MediaList';

type SubjectBaseKey<T> = keyof PickByValue<Required<T>, string | Attach>;

export type SubjectBaseKeys<T> = SubjectBaseKey<T> | SubjectBaseKey<T>[];
export interface SubjectProps<T extends Record<string, any>> {
  mediaId?: string;
  data: T;
  baseKey: SubjectBaseKeys<T>;
  mediaFirst?: boolean;
}

export function Subject<T extends Record<string, any>>({
  data,
  mediaId = 'id',
  baseKey,
  mediaFirst = false,
}: SubjectProps<T>) {
  const keys = Array.isArray(baseKey) ? baseKey : [baseKey];

  const stringArray = keys.filter((v) => !/Attach/.test(String(v)));
  const attachArray = keys.filter((v) => /Attach/.test(String(v)));

  const paras = stringArray.map((key) => {
    const value = data[key];
    if (typeof value === 'string') {
      return (
        <Typography key={String(key)} variant="study" mb={1}>
          {reactStringReplace(value.replace(/_/g, ' '), '#', () => {
            return (
              <Box
                sx={{
                  display: 'inline-flex',
                  width: '2em',
                  height: '1em',
                  borderBottom: '1px solid',
                  borderBottomColor: 'primary.main',
                }}
              ></Box>
            );
          })}
        </Typography>
      );
    }
    return null;
  });

  const media = attachArray.length ? (
    <MediaList key={data[mediaId]} attach={attachArray.map((v) => data[v])} />
  ) : null;

  if (mediaFirst) {
    return (
      <>
        {media}
        {paras}
      </>
    );
  }
  return (
    <>
      {paras}
      {media}
    </>
  );
}
