export interface ExcelSheetInput {
  name?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface ExcelGenerateParams {
  sheets: ExcelSheetInput[];
}
