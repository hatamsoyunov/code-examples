import { jsonProperty, Serializable } from 'ts-serializable';

import { Nullable } from '../types/BaseTypes';

export class PaginationDto extends Serializable {
  @jsonProperty(Number, null) limit: Nullable<number> = null;
  @jsonProperty(Number, null) offset: Nullable<number> = null;
}
