declare type Field = (row: TableRow) => string | string;
declare type Format = (value: string) => string;

declare function SortStringFn(arg1: string, arg2: string): number;
declare function SortNumberFn(arg1: number, arg2: number): number;

export interface TableRow {
  name: string;
  label: string;
  align?: string;
  sortable?: boolean;
  sort?: typeof SortStringFn | typeof SortNumberFn;
  field: string;
  required?: boolean;
  format?: Format;
}
