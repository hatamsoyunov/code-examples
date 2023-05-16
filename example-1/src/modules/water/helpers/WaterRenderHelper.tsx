import { I18nextProviderProps } from 'react-i18next';

import { BottleIcon } from '../../../components/icons/svg/water/BottleIcon';
import { GlassIcon } from '../../../components/icons/svg/water/GlassIcon';
import { MugIcon } from '../../../components/icons/svg/water/MugIcon';

export class WaterRenderHelper {
  static getWaterVessels = (t: I18nextProviderProps['i18n']['t']) => {
    return [
      {
        id: 1,
        icon: <MugIcon />,
        label: t('vessels.mug'),
        volume: '200',
      },
      {
        id: 2,
        icon: <GlassIcon />,
        label: t('vessels.glass'),
        volume: '300',
      },
      {
        id: 3,
        icon: <BottleIcon />,
        label: t('vessels.bottle'),
        volume: '500',
      },
    ];
  };
}
