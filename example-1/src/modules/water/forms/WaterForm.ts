import { BaseForm } from '../../../base/types/FormTypes';
import FormValidationHelper from '../../../helpers/FormValidationHelper';

export const WaterForm: IWaterForm = {
  waterVolume: '',

  isValidForm: (form: IWaterForm) => {
    return FormValidationHelper.isRequired(form.waterVolume);
  },
};

export interface IWaterForm extends BaseForm<IWaterForm> {
  waterVolume: string;
}

export enum WaterFormFields {
  waterVolume = 'waterVolume',
}
