import { GenericTableData, SelectionAction } from 'src/types/table';

export type DataRows = Array<GenericTableData>;

export interface QuasarTableStateInterface {
  rows: DataRows;
  selectedRows: string[];
  selectionActions: SelectionAction[];
}

function state(): QuasarTableStateInterface {
  return {
    rows: [],
    selectedRows: [],
    selectionActions: [],
  };
}

export default state;
