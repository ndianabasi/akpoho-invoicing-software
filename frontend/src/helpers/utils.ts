/* eslint-disable no-useless-escape */
import { DateTime } from 'luxon';
//import { Format, TableRow } from 'src/types/table';

export const stringSortFn = function (a: string, b: string) {
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  return 0;
};

export const dateSortFn = function (a: string, b: string) {
  const aDate = DateTime.fromFormat(a, 'yyyy-LL-dd HH:mm:ss').toMillis();
  const bDate = DateTime.fromFormat(b, 'yyyy-LL-dd HH:mm:ss').toMillis();

  return aDate - bDate;
};

interface ObjectInterface<T> {
  [index: string]: unknown | string | number | T;
}

export function isEmpty<T>(obj: ObjectInterface<T>) {
  return Object.keys(obj).length === 0;
}

export const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
export const phoneNumberRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
