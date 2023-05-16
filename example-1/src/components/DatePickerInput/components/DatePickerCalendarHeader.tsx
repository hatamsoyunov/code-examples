import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import { CalendarHeaderProps } from 'react-native-calendars/src/calendar/header';

import DateHelper from '../../../helpers/DateHelper';
import { useRootStore } from '../../../hooks/useRootStore';
import { Colors } from '../../../styles/Colors';
import { Ag, Text } from '../../Text';
import { View } from '../../View/View';
import { Icon } from '../../icons/Icon';

interface IDatePickerCalendarHeaderProps extends CalendarHeaderProps {
  selectedDate: string | undefined;
  onDatePress?: () => void;
}

const DatePickerCalendarHeader: React.FC<IDatePickerCalendarHeaderProps> = props => {
  const { langStore } = useRootStore();

  const locale = LocaleConfig.locales[langStore.lang];

  const { t } = useTranslation('common');

  // Handlers

  const handlePrev = () => {
    if (props.addMonth) {
      props.addMonth(-1);
    }
  };

  const handleNext = () => {
    if (props.addMonth) {
      props.addMonth(1);
    }
  };

  // Renders

  const renderCurrentDateTitle = () => {
    return DateHelper.format(props.selectedDate, 'd MMMM') || '-';
  };

  const renderCurrentMonthTitle = () => {
    return DateHelper.format(props?.month?.[0]?.toISOString(), 'LLLL yyyy') || '-';
  };

  return (
    <View {...props} style={[props.style, styles.header]}>
      <View style={styles.top}>
        <View mb={8}>
          <Text ag={Ag.Control2} color={Colors.white}>
            {t('common:calendar.title')}
          </Text>
        </View>
        <Text ag={Ag.GolosTextH2} color={Colors.white}>
          {renderCurrentDateTitle()}
        </Text>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity activeOpacity={0.7} style={styles.yearSelect} onPress={props.onDatePress}>
          <View mr={8}>
            <Text ag={Ag.Control1Reg}>{renderCurrentMonthTitle()}</Text>
          </View>
          <Icon name="ic_fluent_chevron_down_16_regular" size={20} />
        </TouchableOpacity>

        <View style={styles.arrows}>
          <TouchableOpacity activeOpacity={0.7} onPress={handlePrev} style={styles.arrowBtn}>
            <Icon name="ic_fluent_chevron_left_16_regular" size={20} />
          </TouchableOpacity>

          <View ml={24}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleNext} style={styles.arrowBtn}>
              <Icon name="ic_fluent_chevron_right_16_regular" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.dayNames}>
        {Object.values(locale.dayNamesShort).map((day, index) => (
          <View style={styles.dayName} key={index}>
            <Text ag={Ag.Control2} color={Colors.onSurface.secondary}>
              {day as string}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: -8,
  },
  top: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary.default,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  yearSelect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowBtn: {
    padding: 4,
  },
  dayNames: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayName: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    margin: 4,
  },
});

export default DatePickerCalendarHeader;
