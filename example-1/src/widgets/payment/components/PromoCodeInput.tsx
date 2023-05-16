import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { isTrue } from '../../../base/utils/baseUtil';
import { IInputOutlinedProps, InputOutlined } from '../../../components/InputOutlined';
import { Loader } from '../../../components/Loader';
import { Ag, Text } from '../../../components/Text';
import { View } from '../../../components/View/View';
import { Icon } from '../../../components/icons/Icon';
import { Colors } from '../../../styles/Colors';

interface IPromoCodeInputProps extends Omit<IInputOutlinedProps, 'value' | 'onChange' | 'onChangeText'> {
  usedPromoCode: string;
  onApplyCode: (value: string) => void;
  onDeleteCode: () => void;
  onDeleteErrorMessage: () => void;
  loading?: boolean;
}

export const PromoCodeInput: React.FC<IPromoCodeInputProps> = props => {
  const { t } = useTranslation('payment');

  const [value, setValue] = useState<string>();
  const isApplied = isTrue(props.usedPromoCode);

  // Effects

  useEffect(() => {
    setValue(props.usedPromoCode);
  }, [props.usedPromoCode]);

  const handleChange = (value: string) => {
    if (props.errorMessage) {
      props.onDeleteErrorMessage();
    }

    if (value.length === 0) {
      props.onDeleteCode();
    }

    setValue(value);
  };

  // Renders

  const renderRightComponent = () => {
    if (!value?.length) {
      return;
    }

    if (props.loading) {
      return <Loader size="small" />;
    }

    if (isApplied) {
      return (
        <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={props.onDeleteCode}>
          <Icon name="ic_fluent_delete_24_regular" size={24} color={Colors.error} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={() => props.onApplyCode(value)}>
        <Icon name="ic_fluent_add_circle_24_regular" size={24} color={Colors.primary.default} />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <InputOutlined
        label={t('payment.input.promoCode.label')}
        placeholder={t('payment.input.promoCode.placeholder')}
        {...props}
        editable={!(isApplied || props.loading)}
        value={value}
        onChangeText={handleChange}
        rightComponent={renderRightComponent()}
        rightComponentIsHightPriority
        disabledOpacity={1}
      />

      {isApplied && (
        <View mt={8}>
          <Text ag={Ag.Caption1} color={Colors.primary.default}>
            {t('payment.input.promoCode.validation.applied')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    padding: 5,
    marginRight: -6,
  },
});
