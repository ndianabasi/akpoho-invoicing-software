import { DateTime } from 'luxon';

export const stringSortFn = function (a: string, b: string) {
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
};

export const dateSortFn = function (a: string, b: string) {
  const aDate = DateTime.fromFormat(a, 'yyyy-LL-dd HH:mm:ss').toMillis();
  const bDate = DateTime.fromFormat(b, 'yyyy-LL-dd HH:mm:ss').toMillis();

  return aDate - bDate;
};
