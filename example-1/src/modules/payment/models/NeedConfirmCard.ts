import { jsonProperty, Serializable } from 'ts-serializable';

import { Nullable } from '../../../base/types/BaseTypes';

export default class NeedConfirmCard extends Serializable {
  @jsonProperty(Boolean, null) needConfirm: Nullable<boolean> = null;
  @jsonProperty(Number, null) paymentId: Nullable<number> = null;
  @jsonProperty(String, null) token: Nullable<string> = null;
  @jsonProperty(String, null) transactionId: Nullable<string> = null;
  @jsonProperty(String, null) url: Nullable<string> = null;
}
