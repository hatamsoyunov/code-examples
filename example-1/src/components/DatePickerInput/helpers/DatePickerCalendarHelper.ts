import { LocaleConfig } from 'react-native-calendars';

export class DatePickerCalendarHelper {
  static setCalendarLocaleConfig = (locale: string, locales: any) => {
    LocaleConfig.locales[locale] = locales;
    LocaleConfig.defaultLocale = locale;
  };

  static getDayTextColor = (state: any, theme: any) => {
    switch (state) {
      case 'today':
        return theme?.todayTextColor;

      case 'disabled':
        return theme?.textDisabledColor;

      default:
        return theme?.dayTextColor;
    }
  };
}
