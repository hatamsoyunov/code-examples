import { isPossiblePhoneNumber } from 'libphonenumber-js/mobile';

import { IValidResponse } from '../base/types/FormTypes';
import { isTrue } from '../base/utils/baseUtil';
import { Country } from '../modules/dictionary/models/Country';
import { Localization } from '../modules/lang/LangAdapter';

export default class FormValidationHelper {
  static isEmailValid = (email: string): IValidResponse => {
    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;

    return {
      isValid: reg.test(email),
      message: Localization.t('common:input.email.validation.incorrect'),
    };
  };

  static isRequired = (field: any): boolean => {
    switch (typeof field) {
      case 'string':
        return field.trim().length !== 0;

      case 'object':
        if (Array.isArray(field)) {
          return field?.length !== 0;
        }

        return isTrue(field);

      default:
        return isTrue(field);
    }
  };

  static isValidPhoneNumberForCountry = (phoneNumberString: string, country: Country | null): IValidResponse => {
    if (!country) {
      return {
        isValid: false,
        message: Localization.t('common:input.phone.validation.countryNotSelected'),
      };
    }

    return {
      // https://github.com/catamphetamine/libphonenumber-js#using-phone-number-validation-feature
      isValid: isPossiblePhoneNumber(phoneNumberString, country?.code || undefined),
      message: Localization.t('common:input.phone.validation.incorrect'),
    };
  };
}
