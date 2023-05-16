import { jsonProperty, Serializable } from 'ts-serializable';

import { Nullable } from '../../types/BaseTypes';

export class Meta extends Serializable {
  @jsonProperty(Number, null) totalCount: Nullable<number> = null;
  @jsonProperty(Number, null) currentOffset: Nullable<number> = null;
  @jsonProperty(Number, null) limit?: Nullable<number> = null;
}
