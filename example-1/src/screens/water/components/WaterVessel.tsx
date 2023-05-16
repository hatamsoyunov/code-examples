import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Ag, Text } from '../../../components/Text';
import { View } from '../../../components/View/View';
import { Colors } from '../../../styles/Colors';

interface IWaterVesselProps {
  icon: JSX.Element;
  label: string;
  volume: string;
  isSelected: boolean;
  onChange: (volume: string) => void;
}

export const WaterVessel: React.FC<IWaterVesselProps> = props => {
  const { t } = useTranslation('common');

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, props.isSelected && styles.selected]}
      onPress={() => props.onChange(props.volume)}
    >
      <View mb={4}>{props.icon}</View>
      <View mb={4}>
        <Text>{props.label}</Text>
      </View>
      <Text ag={Ag.Caption1} color={Colors.onSurface.secondary}>
        {props.volume} {t('measurements.ml')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.transparent,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  selected: {
    borderColor: Colors.primary.default,
  },
});
