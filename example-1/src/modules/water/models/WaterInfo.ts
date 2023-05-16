import { jsonProperty, Serializable } from 'ts-serializable';

export class WaterInfo extends Serializable {
  @jsonProperty(Number) dailyNorm: number = 0;
  @jsonProperty(Number) currentValue: number = 0;
  @jsonProperty(Boolean) currentDayCompleted: boolean = false;
  @jsonProperty(Number) completedDaysCount: number = 0;
}
