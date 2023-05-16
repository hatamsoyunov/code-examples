import { add, differenceInCalendarYears, format, isAfter, isFuture, isToday, isValid, parseISO } from 'date-fns';
import * as langs from 'date-fns/locale';
import parse from 'date-fns/parse';

import { appConfig } from '../appConfig';
import { Localization } from '../modules/lang/LangAdapter';

export default class DateHelper {
  static getDateFnsLocale = () => {
    return (langs as any)[Localization.language] || appConfig.defaultLanguage;
  };

  static parseISO = (date: string) => {
    return parseISO(date);
  };

  static newDateWithParseIOS = (date: string) => {
    return new Date(DateHelper.parseISO(date));
  };

  static formatFromDate = (date: Date, customFormat = 'dd.MM.yyyy') => {
    return format(date, customFormat, {
      locale: DateHelper.getDateFnsLocale(),
    });
  };

  static format = (date: string | null | undefined, customFormat = 'dd.MM.yyyy'): string | undefined => {
    if (!date || !isValid(DateHelper.newDateWithParseIOS(date))) {
      return;
    }

    return format(DateHelper.newDateWithParseIOS(date), customFormat, {
      locale: DateHelper.getDateFnsLocale(),
    });
  };

  static differenceInCalendarYears = (dateLeft: Date, dateRight: Date) => {
    return differenceInCalendarYears(dateLeft, dateRight);
  };

  static add = (date: Date | number, duration: Duration) => {
    return add(date, duration);
  };
}
