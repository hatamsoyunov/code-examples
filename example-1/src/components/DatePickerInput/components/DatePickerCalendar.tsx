import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, CalendarProps, DateData } from 'react-native-calendars';
import { DayProps } from 'react-native-calendars/src/calendar/day';

import Notification from '../../../base/ui/Notification';
import DateHelper from '../../../helpers/DateHelper';
import { Colors } from '../../../styles/Colors';
import { Ag, Text } from '../../Text';
import { View } from '../../View/View';
import { DatePickerCalendarHelper } from '../helpers/DatePickerCalendarHelper';
import DatePickerCalendarHeader from './DatePickerCalendarHeader';
import DatePickerCalendarYearsList from './DatePickerCalendarYearsList';

type CustomDayProps = DayProps & {
  date?: DateData | undefined;
};

export interface IDatePickerCalendarProps extends CalendarProps {
  selectedDate: string | undefined;
  onChangeDate: (formattedDate: string) => void;
}

const DatePickerCalendar: React.FC<IDatePickerCalendarProps> = props => {
  const [calendarRef, setCalendarRef] = useState<Calendar | null>(null);
  const [isVisibleYearsList, setIsVisibleYearsList] = useState(false);

  const { t } = useTranslation('common');

  const currentDate = useMemo(() => {
    const date: string = Object.keys(props?.markedDates || {})[0];

    if (date) {
      return date;
    }

    return DateHelper.today();
  }, [props?.markedDates]);

  const [prevSelectedYearDate, setPrevSelectedYearDate] = useState(currentDate);
  const currentYear = DateHelper.format(prevSelectedYearDate, 'yyyy') || null;

  // Handlers
  const handleToggleSelectYear = () => {
    setIsVisibleYearsList(prevState => !prevState);
  };

  const handleYearChange = (date: Date) => {
    if (!prevSelectedYearDate) {
      return;
    }

    const parsedISOPrevSelectedYearDate = DateHelper.parseISO(prevSelectedYearDate);
    const range = DateHelper.differenceInCalendarYears(date, parsedISOPrevSelectedYearDate);
    const dateWithChangedYear = DateHelper.add(parsedISOPrevSelectedYearDate, { years: range });
    const formattedDateWithChangedYear = DateHelper.formatFromDate(dateWithChangedYear, 'yyyy-MM-dd');

    const isNotAvailableToSelectDate = props.maxDate
      ? DateHelper.isAfter(dateWithChangedYear, DateHelper.parseISO(props.maxDate))
      : DateHelper.isFuture(dateWithChangedYear);

    // Меняем год, если дата доступна в выбранном году
    if (!isNotAvailableToSelectDate) {
      props.onChangeDate(formattedDateWithChangedYear);
    } else {
      // Сброс до начальной даты
      props.onChangeDate(props.current || DateHelper.today());
      Notification.showError(t('calendar.unavailableDate'));
    }

    // Прокручиваем календарь до нужного года
    calendarRef?.addMonth(range * 12);

    setTimeout(() => {
      setIsVisibleYearsList(false);
      setPrevSelectedYearDate(formattedDateWithChangedYear);
    }, 0);
  };

  // Renders
  const renderDayComponent = ({ date, state, theme, marking, onPress }: CustomDayProps) => {
    const dayColor: string = marking?.selected ? Colors.white : DatePickerCalendarHelper.getDayTextColor(state, theme);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.customDay, marking?.selected && styles.selectedCustomDay]}
        onPress={() => onPress && onPress(date)}
      >
        <Text ag={Ag.Control1Reg} style={{ color: dayColor }}>
          {date?.day?.toString()}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCustomHeader = (headerProps: any) => (
    <DatePickerCalendarHeader selectedDate={props.selectedDate} onDatePress={handleToggleSelectYear} {...headerProps} />
  );

  return (
    <View>
      <Calendar
        ref={ref => setCalendarRef(ref)}
        hideExtraDays
        disableAllTouchEventsForInactiveDays
        enableSwipeMonths={true}
        firstDay={1}
        dayComponent={renderDayComponent}
        customHeader={renderCustomHeader}
        style={styles.calendar}
        theme={{
          textSectionTitleColor: Colors.onSurface.secondary,
          textSectionTitleDisabledColor: Colors.onSurface.tertiary,
          selectedDayBackgroundColor: Colors.primary.default,
          selectedDayTextColor: Colors.white,
          todayTextColor: Colors.primary.default,
          dayTextColor: Colors.onSurface.primary,
          textDisabledColor: Colors.onSurface.tertiary,
          // @ts-ignore
          'stylesheet.calendar.main': {
            week: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 0,
              marginBottom: 0,
            },
          },
        }}
        {...props}
      />

      {isVisibleYearsList && <DatePickerCalendarYearsList current={currentYear} onChange={handleYearChange} />}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 8,
    paddingRight: 8,
    minHeight: 316,
  },
  customDay: {
    width: 40,
    height: 40,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40 / 2,
  },
  selectedCustomDay: {
    backgroundColor: Colors.primary.default,
  },
});

export default DatePickerCalendar;
