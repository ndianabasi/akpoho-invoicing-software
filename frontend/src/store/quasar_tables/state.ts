export type GenericRowObject = {
  [key: string]: unknown;
};

export type DataRows = Array<GenericRowObject>;

export interface QuasarTableStateInterface {
  rows: DataRows;
}

function state(): QuasarTableStateInterface {
  return {
    rows: [],
  };
}

export default state;
