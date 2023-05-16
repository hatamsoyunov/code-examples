export const CardErrorsForm: ICardErrorsForm = {
  extDate: '',
  common: '',
};

export interface ICardErrorsForm {
  extDate: string;
  common: string;
}

export enum CardErrorsFormFields {
  extDate = 'extDate',
  common = 'common',
}
