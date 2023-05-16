import { jsonProperty } from 'ts-serializable';

import { Nullable } from '../../../base/types/BaseTypes';
import CardDto from './CardDto';

export default class PayByNewCardDto extends CardDto {
  @jsonProperty(Number, null) transactionId: Nullable<number> = null;
}
