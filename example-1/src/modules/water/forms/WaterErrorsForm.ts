export const WaterErrorsForm: IWaterErrorsForm = {
  waterVolume: '',
};

export interface IWaterErrorsForm {
  waterVolume: string;
}

export enum WaterErrorsFormFields {
  waterVolume = 'waterVolume',
}
