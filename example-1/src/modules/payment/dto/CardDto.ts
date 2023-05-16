import { jsonProperty, Serializable } from 'ts-serializable';

import { Nullable } from '../../../base/types/BaseTypes';

export default class CardDto extends Serializable {
  @jsonProperty(String, null) cardNumber: Nullable<string> = null;
  @jsonProperty(Number, null) expireYear: Nullable<number> = null;
  @jsonProperty(Number, null) expireMonth: Nullable<number> = null;
  @jsonProperty(String, null) secretCode: Nullable<string> = null;
  @jsonProperty(String, null) cardHolderName: Nullable<string> = null;
  @jsonProperty(String, null) cryptogram: Nullable<string> = null;
}
