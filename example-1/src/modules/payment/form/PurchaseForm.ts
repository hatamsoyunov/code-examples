import { Nullable } from '../../../base/types/BaseTypes';
import { BaseForm } from '../../../base/types/FormTypes';
import { ITabItem } from '../../../components/TabSwitch';
import FormValidationHelper from '../../../helpers/FormValidationHelper';
import { SubscriptionHelper } from '../../subscription/helpers/SubscriptionHelper';
import { SubscriptionPriceType } from '../../subscription/types/SubscriptionTypes';
import Card from '../models/Card';

export const PurchaseForm: IPurchaseForm = {
  promoCode: '',
  card: null,
  spendPoints: false,

  // used only subscription purchase
  type: SubscriptionHelper.getDefaultSubscriptionPriceTypes(),

  isValidForm: (form: IPurchaseForm) => {
    return FormValidationHelper.isRequired(form.card);
  },
};

export interface IPurchaseForm extends BaseForm<IPurchaseForm> {
  promoCode: string;
  card: Nullable<Card>;
  spendPoints: boolean;

  type: Nullable<ITabItem<SubscriptionPriceType>>;
}

export enum PurchaseFormFields {
  promoCode = 'promoCode',
  spendPoints = 'spendPoints',
  card = 'card',

  type = 'type',
}
