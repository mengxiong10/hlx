export function isAscendingOrder(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}

export function pick<T extends object>(obj: T, props: Array<keyof T>): Partial<T> {
  const result: Partial<T> = {};
  props.forEach((prop) => {
    result[prop] = obj[prop];
  });
  return result;
}

export function delay(wait = 1000) {
  return new Promise<void>((res) => {
    window.setTimeout(res, wait);
  });
}

export function isObject<T = any>(value: unknown): value is T {
  return typeof value === 'object' && value !== null;
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export function isSameSentence(a: string, b: string) {
  const removeRest = (str: string) => str.replace(/[\p{P}]/gu, '').replace(/\s{2,}/g, ' ');
  return removeRest(a) === removeRest(b);
}

export function getTimeFormat(time: number) {
  let minutes = Math.floor(time / 60);
  const hours = Math.floor(minutes / 60);
  minutes %= 60;
  const seconds = time % 60;
  if (hours) {
    return `${hours}时${minutes}分`;
  }
  if (minutes) {
    return `${minutes}分${seconds}秒`;
  }
  return `${seconds}秒`;
}
