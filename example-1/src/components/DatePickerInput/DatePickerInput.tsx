import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarProps } from 'react-native-calendars';

import DateHelper from '../../helpers/DateHelper';
import { useRootStore } from '../../hooks/useRootStore';
import { Colors } from '../../styles/Colors';
import { InputOutlined } from '../InputOutlined';
import { IInputOutlinedProps } from '../InputOutlined';
import { Icon } from '../icons/Icon';
import { IconFilled } from '../icons/IconFilled';
import DatePickerCalendar from './components/DatePickerCalendar';
import { DatePickerModal } from './components/DatePickerModal';
import { DatePickerCalendarHelper } from './helpers/DatePickerCalendarHelper';

interface IDatePickerInputProps extends Omit<IInputOutlinedProps, 'onChange' | 'onChangeText'> {
  value: string;
  onClear?: () => void;
  onChange?: (value: string) => void;
  calendarProps?: CalendarProps;
}

const DatePickerInput: React.FC<IDatePickerInputProps> = observer(props => {
  const { onChange, ...rest } = props;

  const { langStore } = useRootStore();

  const { t } = useTranslation('common');

  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const markedDates = useMemo<{}>(() => {
    if (selectedDate) {
      return {
        [selectedDate]: {
          selected: true,
          disableTouchEvent: true,
        },
      };
    }

    return {};
  }, [selectedDate]);

  // Effects

  // set locales
  useEffect(() => {
    DatePickerCalendarHelper.setCalendarLocaleConfig(langStore.lang, t('common:calendar', { returnObjects: true }));
  }, [langStore.lang]);

  // Handlers

  const handleClose = () => {
    setIsVisibleModal(false);
    setSelectedDate('');
  };

  const handleInputPress = () => {
    setIsVisibleModal(true);
    setSelectedDate(props.value);
  };

  const handleChangeDay = (formattedDate: string) => {
    setSelectedDate(formattedDate);
  };

  const handleDayPress: CalendarProps['onDayPress'] = day => {
    setSelectedDate(day.dateString);
  };

  const handleSave = () => {
    if (props.onChange) {
      props.onChange(selectedDate);
    }

    setIsVisibleModal(false);
    setSelectedDate('');
  };

  // Renders

  const renderInputRightComponent = () => {
    if (props.value?.length) {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={props.onClear}>
          <IconFilled name="ic_fluent_dismiss_circle_20_filled" size={20} color={Colors.onSurface.tertiary} />
        </TouchableOpacity>
      );
    }

    return <Icon name="ic_fluent_calendar_ltr_20_regular" size={20} />;
  };

  return (
    <>
      <InputOutlined
        {...rest}
        editable={false}
        value={DateHelper.format(props.value) || ''}
        onInputPress={handleInputPress}
        rightComponent={renderInputRightComponent()}
        disabledOpacity={1}
      />

      <DatePickerModal
        isVisible={isVisibleModal}
        onBackdropPress={handleClose}
        onClose={handleClose}
        onSave={handleSave}
      >
        <DatePickerCalendar
          {...props.calendarProps}
          current={props.value || DateHelper.today()}
          selectedDate={selectedDate}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          onChangeDate={handleChangeDay}
        />
      </DatePickerModal>
    </>
  );
});

const styles = StyleSheet.create({
  modal: {
    borderRadius: 16,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
});

export default DatePickerInput;
