import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import FormValidationHelper from '../../helpers/FormValidationHelper';
import { Country } from '../../modules/dictionary/models/Country';
import { IInputOutlinedProps, InputOutlined } from '../InputOutlined';
import { Loader } from '../Loader';
import { Row } from '../Row';
import { Text } from '../Text';
import { View } from '../View/View';
import { ArrowDownFilledIcon } from '../icons/svg/ArrowDownFilledIcon';
import IntlPhoneHelper from './helpers/IntlPhoneHelper';

interface IIntlPhoneInputProps extends IInputOutlinedProps {
  value: string;
  country: Country | null;
  multiple?: boolean;
  textCutterLength?: number;
  onPressCode?: () => void;
  loading?: boolean;
  isDisabled?: boolean;
}

export const IntlPhoneInput: React.FC<IIntlPhoneInputProps> = props => {
  const [rawPhone, setRawPhone] = useState('');
  const [isFocused, setIsFocused] = useState<boolean>(!!props.autoFocus);
  const isDisabled = props.editable === false;

  // Effects
  useEffect(() => {
    if (props.value && !isFocused) {
      handleChange(props.value);
    }
  }, [props.value, isFocused]);

  useEffect(() => {
    if (!props.value?.length || !props.country) {
      setRawPhone('');
      return;
    }

    const { rawPhone } = IntlPhoneHelper.getFormattedPhoneByCountry(props.value, props.country);

    setRawPhone(rawPhone);
  }, [props.country]);

  // Handlers

  const handleChange = (value: string) => {
    const { rawPhone, phone } = IntlPhoneHelper.getFormattedPhoneByCountry(value, props.country);

    setRawPhone(rawPhone);
    props.onChangeText && props.onChangeText(phone);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    //
  };

  // Renders

  const renderLeftComponent = () => {
    if (props.loading) {
      return <Loader size="small" />;
    }

    return (
      <TouchableOpacity activeOpacity={isDisabled ? 1 : 0.7} onPress={!isDisabled ? props.onPressCode : undefined}>
        <Row>
          <Text>{props.country?.phonePrefix || '-'}</Text>
          <View mr={-8}>
            <ArrowDownFilledIcon />
          </View>
        </Row>
      </TouchableOpacity>
    );
  };

  return (
    <InputOutlined
      validation={FormValidationHelper.isValidPhoneNumberForCountry(props.value, props.country)}
      {...props}
      keyboardType="number-pad"
      value={rawPhone}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onChangeText={handleChange}
      leftComponent={renderLeftComponent()}
    />
  );
};
