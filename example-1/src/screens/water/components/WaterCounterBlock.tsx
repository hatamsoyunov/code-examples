import React from 'react';
import { useTranslation } from 'react-i18next';

import { Row } from '../../../components/Row';
import { Ag, Align, Text } from '../../../components/Text';
import { View } from '../../../components/View/View';

interface IWaterCounterBlockProps {
  current: number;
  dailyNorm: number;
  isDailyNormCompleted: boolean;
}

export const WaterCounterBlock: React.FC<IWaterCounterBlockProps> = props => {
  const { t } = useTranslation(['water', 'common']);

  return (
    <View ai="center" ph={16} mt={24} mb={24}>
      <Row mb={8}>
        <Text ag={Ag.GolosTextH2}>
          {props.isDailyNormCompleted && '⭐ '}
          {props.current}/{props.dailyNorm} {t('common:measurements.ml')}
          {props.isDailyNormCompleted && ' ⭐'}
        </Text>
      </Row>
      <Text ag={Ag.Body2} align={Align.Center}>
        {props.isDailyNormCompleted ? t('status.dailyWaterDrunk') : t('status.needDrink')}
      </Text>
    </View>
  );
};
