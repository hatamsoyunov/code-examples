import { BaseForm } from '../../../base/types/FormTypes';
import FormValidationHelper from '../../../helpers/FormValidationHelper';
import NumberHelper from '../../../helpers/NumberHelper';

export const CardForm: ICardForm = {
  number: '',
  extDate: '',
  cvvCode: '',
  name: '',

  isValidForm: (form: ICardForm) => {
    return (
      NumberHelper.getDigits(form.number).length === 16 &&
      NumberHelper.getDigits(form.extDate).length === 4 &&
      NumberHelper.getDigits(form.cvvCode).length === 3 &&
      FormValidationHelper.isRequired(form.name)
    );
  },
};

export interface ICardForm extends BaseForm<ICardForm> {
  number: string;
  extDate: string;
  cvvCode: string;
  name: string;
}

export enum CardFormFields {
  number = 'number',
  extDate = 'extDate',
  cvvCode = 'cvvCode',
  name = 'name',
}
