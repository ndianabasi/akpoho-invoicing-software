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

/* export const booleanFormatter: Format<boolean, TableRow, string> =
  () => (value: boolean, row: TableRow) => {
    console.log(value);

    return value
      ? '<div class="q-badge flex inline items-center no-wrap q-badge--single-line bg-blue" role="alert" aria-label="TRUE">TRUE</div>'
      : '<div class="q-badge flex inline items-center no-wrap q-badge--single-line bg-orange" role="alert" aria-label="FALSE">FALSE</div>';
  }; */
