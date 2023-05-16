import { jsonProperty, Serializable } from 'ts-serializable';

import { Nullable } from '../../../base/types/BaseTypes';

// CP = CloudPayment
export default class CPPublicKey extends Serializable {
  @jsonProperty(String, null) key: Nullable<string> = null;
}
