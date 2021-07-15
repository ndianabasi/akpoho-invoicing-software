/* eslint-disable no-useless-escape */
import { DateTime } from 'luxon';
import { computed } from 'vue';

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
export const urlRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export const ALPHA_REGEX = /^\w$/;
export const DECIMAL_REGEX = /^\d*.\d*$/;
export const INTEGER_REGEX = /^\d*$/;
export const ALPHA_NUM_REGEX = /^a-zA-Z0-9$/;
export const EMAIL_REGEX = /^a-zA-Z0-9$/;
export const PASSWORD_REGEX = passwordRegex;
export const URL_REGEX = urlRegex;
export const PHONE_NUMBER_REGEX = phoneNumberRegex;

export const stockStatusArray = [
  'In Stock',
  'Out of Stock',
  'Made to Order',
  'Drop-shipped',
];

export const yesNoOptions = ['', 'Yes', 'No'];

export const stockStatusForSelect = computed(() =>
  stockStatusArray.map((status) => ({ label: status, value: status }))
);

export const yesNoOptionsForSelect = computed(() =>
  yesNoOptions.map((option) => ({
    label: option,
    value: option ? option : null,
  }))
);

export const typeSortFn = function <T>(a: T, b: T): number {
  {
    if (new String(a).toLocaleLowerCase() > new String(b).toLocaleLowerCase())
      return 1;
    if (new String(a).toLocaleLowerCase() < new String(b).toLocaleLowerCase())
      return -1;
    return 0;
  }
};
