import { jsonProperty, Serializable } from 'ts-serializable';

import { Nullable } from '../../../base/types/BaseTypes';

export default class PaymentSystem extends Serializable {
  @jsonProperty(String, null) name: Nullable<string> = null;
  @jsonProperty(Boolean, null) needCryptogram: Nullable<boolean> = null;
}
