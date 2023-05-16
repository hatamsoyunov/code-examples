import { jsonProperty, Serializable } from 'ts-serializable';

export default class WaterDto extends Serializable {
  @jsonProperty(Number) value: number | null = null;
}
