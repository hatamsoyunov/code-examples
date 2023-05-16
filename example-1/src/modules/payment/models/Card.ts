import { jsonProperty, Serializable } from 'ts-serializable';

import { Nullable } from '../../../base/types/BaseTypes';

export default class Card extends Serializable {
  @jsonProperty(Number, null) id: Nullable<number> = null;
  @jsonProperty(String, null) cardType: Nullable<string> = null;
  @jsonProperty(String, null) lastFour: Nullable<string> = null;
  @jsonProperty(String, null) expirationDate: Nullable<string> = null;
  @jsonProperty(String, null) paymentSystem: Nullable<string> = null;
}
