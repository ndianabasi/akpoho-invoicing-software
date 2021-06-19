import { GenericTableData } from 'src/types/table';

export type DataRows = Array<GenericTableData>;

export interface QuasarTableStateInterface {
  rows: DataRows;
  selectedRows: string[];
}

function state(): QuasarTableStateInterface {
  return {
    rows: [],
    selectedRows: [],
  };
}

export default state;
