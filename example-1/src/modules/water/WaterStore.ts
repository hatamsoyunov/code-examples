import { makeAutoObservable } from 'mobx';

import { IErrorFromParam, Nullable } from '../../base/types/BaseTypes';
import FormHelper from '../../helpers/FormHelper';
import WaterService from './WaterService';
import { IWaterErrorsForm, WaterErrorsForm, WaterErrorsFormFields } from './forms/WaterErrorsForm';
import { WaterForm, WaterFormFields } from './forms/WaterForm';
import { WaterInfo } from './models/WaterInfo';
import { AddWaterDrunkError } from './types/WaterTypes';

export class WaterStore {
  waterInfo: WaterInfo | null = null;
  waterInfoLoading: boolean = false;
  waterInfoRefreshLoading: boolean = false;
  isWaterInfoLoaded: boolean = true;

  waterForm = WaterForm;
  waterErrorsForm = WaterErrorsForm;
  addWaterDrankLoading: boolean = false;

  private waterService: WaterService;

  constructor() {
    makeAutoObservable(this);
    this.waterService = new WaterService();
  }

  // FORM

  changeForm = (key: WaterFormFields, value: any) => {
    this.waterForm = FormHelper.updateForm(this.waterForm, key, value);
  };

  changeWaterErrorsForm = (errors: Nullable<IErrorFromParam>) => {
    this.waterErrorsForm = FormHelper.updateErrorForm<IWaterErrorsForm>(this.waterErrorsForm, errors);
  };

  // API

  getWaterInfo = (isRefresh = false) => {
    this.setWaterLoading(isRefresh, true);

    return this.waterService
      .getWaterInfo()
      .then(waterInfo => {
        this.setWaterInfo(waterInfo);
        this.setIsWaterInfoLoaded(true);
      })
      .catch(() => {
        this.setIsWaterInfoLoaded(false);
      })
      .finally(() => {
        this.setWaterLoading(isRefresh, false);
      });
  };

  addWaterDrunk = (): Promise<boolean> => {
    this.setAddWaterDrankLoading(true);

    return this.waterService
      .addWaterDrunk(this.waterForm)
      .then(waterInfo => {
        this.setWaterInfo(waterInfo);

        return true;
      })
      .catch(error => {
        if (error?.response?.data?.errors?.[0] === AddWaterDrunkError.INCORRECT_WATER_VALUE) {
          this.changeWaterErrorsForm({
            [WaterErrorsFormFields.waterVolume]: [error?.response?.data?.message],
          });
        }

        return false;
      })
      .finally(() => {
        this.setAddWaterDrankLoading(false);
      });
  };

  // RESET

  reset = () => {
    this.waterInfo = null;
    this.waterInfoLoading = false;
    this.waterInfoRefreshLoading = false;
    this.isWaterInfoLoaded = true;

    this.waterForm = WaterForm;
    this.waterErrorsForm = WaterErrorsForm;
    this.addWaterDrankLoading = false;
  };

  // SETTERS

  private setWaterInfo = (value: WaterInfo) => {
    this.waterInfo = value;
  };

  private setWaterLoading = (isRefresh: boolean, value: boolean) => {
    if (isRefresh) {
      this.waterInfoRefreshLoading = value;
    } else {
      this.waterInfoLoading = value;
    }
  };

  private setIsWaterInfoLoaded = (value: boolean) => {
    this.isWaterInfoLoaded = value;
  };

  private setAddWaterDrankLoading = (value: boolean) => {
    this.addWaterDrankLoading = value;
  };
}
