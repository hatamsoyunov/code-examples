import { Nullable } from '../../../base/types/BaseTypes';
import { WaterInfo } from '../models/WaterInfo';

export class WaterHelper {
  static getProgress = (waterInfo: Nullable<WaterInfo>): number => {
    if (waterInfo?.currentValue !== undefined && waterInfo?.dailyNorm !== undefined) {
      const percent = waterInfo.currentValue / waterInfo.dailyNorm;

      return percent > 1 ? 1 : percent;
    }

    return 0;
  };

  static getPlayerSpeed = (
    isFirstAnimation: boolean,
    progress: number | undefined,
    isFullBottle: boolean | undefined,
  ) => {
    return ((progress && progress > 0.5) || isFullBottle) && isFirstAnimation ? 2 : 1;
  };
}
