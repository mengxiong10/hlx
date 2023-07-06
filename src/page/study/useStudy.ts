import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useStep, UseStepParams } from './useStep';
import { useSubmit } from './useSubmit';

interface UseStudyParams<T> extends UseStepParams<T> {
  validateText?: string;
  validate?: (item: T) => boolean;
  isCorrect?: (item: T) => boolean | Promise<boolean>;
  needRestart?: boolean;
  resetOnWrong?: boolean;
}

export function useStudy<T = unknown>({
  data,
  reset,
  needRestart = true,
  validateText = '请猜着答完各个问题',
  validate = () => false,
  resetOnWrong = true,
  isCorrect,
}: UseStudyParams<T>) {
  const [isWrong, setWrong] = useState(false);
  const [restartList, setRestartList] = useState<T[]>([]);
  const [wrongList, setWrongList] = useState<T[]>([]);

  const { current, isLast, next, setIndex } = useStep({
    data: restartList.length ? restartList : data,
    reset,
  });

  const { submit, isLoading } = useSubmit();

  const onConfirm = async () => {
    if (validate(current)) {
      enqueueSnackbar(validateText, { variant: 'warning', autoHideDuration: 2000 });
      return;
    }
    const checkAnswer = isCorrect || (() => true);
    const result = await checkAnswer(current);
    if (typeof isCorrect === 'function') {
      if (result) {
        enqueueSnackbar('正确', { variant: 'success' });
      } else {
        enqueueSnackbar('错误', { variant: 'error' });
      }
    }
    if (result) {
      if (!isLast) {
        next();
      } else if (wrongList.length) {
        setIndex(0);
        reset?.(current);
        setRestartList(wrongList);
        setWrongList([]);
      } else {
        submit();
      }
    } else {
      if (resetOnWrong) {
        reset?.(current);
      }
      setWrong(true);
      if (needRestart && !wrongList.includes(current)) {
        setWrongList([...wrongList, current]);
      }
    }
  };

  // 不显示上一步
  // const onCancel = !isFirst ? previous : undefined;

  const onRight = () => setWrong(false);

  return { current, isLoading, onConfirm, isWrong, onRight };
}
