import { eachYearOfInterval, format } from 'date-fns';
import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { Colors } from '../../../styles/Colors';
import { Ag, Text } from '../../Text';
import { View } from '../../View/View';

interface IDatePickerCalendarYearsListProps {
  current: string | null;
  onChange: (date: Date) => void;
}

const YEARS_COLS = 4;
const YEAR_ITEM_HEIGHT = 56;

const years = eachYearOfInterval({
  start: new Date(1900, 12, 31),
  end: new Date(),
});

const DatePickerCalendarYearsList: React.FC<IDatePickerCalendarYearsListProps> = ({ current, onChange }) => {
  const yearsRef = useRef<FlatList>(null);

  const getItemLayout = (data: any, index: number) => {
    return { length: YEAR_ITEM_HEIGHT, offset: YEAR_ITEM_HEIGHT * index, index };
  };

  // Effects

  useEffect(() => {
    setTimeout(() => {
      const currentIndex = years.findIndex(year => format(year, 'yyyy') === current);
      const index = Math.floor((currentIndex < 0 ? 0 : currentIndex) / YEARS_COLS);

      yearsRef.current?.scrollToIndex({ animated: true, index });
    }, 0);
  }, [current]);

  // Renders

  const renderYear = (date: Date) => {
    const year = format(date, 'yyyy');
    const isSelected = year === current;

    const renderYearButton = () => {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => onChange(date)}>
          <Text ag={Ag.Control1Reg} color={isSelected ? Colors.white : Colors.onSurface.primary}>
            {year}
          </Text>
        </TouchableOpacity>
      );
    };

    return <View style={[styles.year, isSelected && styles.selectedYear]}>{renderYearButton()}</View>;
  };

  const renderYearItem = ({ item }: { item: Date }) => {
    return <View style={styles.yearItem}>{renderYear(item)}</View>;
  };

  return (
    <View style={styles.yearsSelect}>
      <FlatList
        ref={yearsRef}
        data={years}
        renderItem={renderYearItem}
        numColumns={YEARS_COLS}
        keyExtractor={item => String(item.getFullYear())}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  yearsSelect: {
    ...StyleSheet.absoluteFillObject,
    top: 96, // Calendar header navigation height
    backgroundColor: Colors.white,
  },
  yearItem: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  year: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectedYear: {
    backgroundColor: Colors.primary.default,
  },
});

export default DatePickerCalendarYearsList;
