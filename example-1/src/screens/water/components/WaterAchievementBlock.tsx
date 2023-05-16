import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Row } from '../../../components/Row';
import { Ag, Text } from '../../../components/Text';
import { View } from '../../../components/View/View';
import { Branch } from '../../../components/svg/Branch';
import { Colors } from '../../../styles/Colors';

interface IWaterAchievementBlockProps {
  daysCount: number;
}

export const WaterAchievementBlock: React.FC<IWaterAchievementBlockProps> = props => {
  const { t } = useTranslation(['water', 'common']);

  if (props.daysCount < 1) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <Row mb={10}>
        <Branch />

        <View ai="center" mt={8}>
          <Text style={styles.daysCount}>{props.daysCount?.toString()}</Text>
          <Text ag={Ag.Body2} color={Colors.onSurface.secondary}>
            {t('achieve.daysRow', { count: props.daysCount })}
          </Text>
        </View>

        <Branch style={styles.scaleX} />
      </Row>

      <Text ag={Ag.GolosTextH3}>{t('achieve.title')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  daysCount: {
    fontSize: 40,
    lineHeight: 48,
  },
  scaleX: {
    transform: [{ scaleX: -1 }],
  },
});
