import { jsonProperty, Serializable } from 'ts-serializable';

import { Nullable } from '../../../base/types/BaseTypes';

export default class CP3DsConfirmDto extends Serializable {
  @jsonProperty(String, null) PaRes: Nullable<string> = null;
  @jsonProperty(String, null) MD: Nullable<string> = null;
}
