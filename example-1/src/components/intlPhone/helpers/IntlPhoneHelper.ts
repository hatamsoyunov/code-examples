import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js/mobile';

import { Country } from '../../../modules/dictionary/models/Country';

export default class IntlPhoneHelper {
  /**
   * Parse phone number by country and return prepared phone values.
   *
   * @param phoneNumberString
   * @param country
   * @returns
   *  `rawPhone` - formatted phone as international without prefix and dial/calling code (e.g. 999 888 77 66)
   *  `phone` - phone with prefix (e.g. +79998887766)
   */
  static getFormattedPhoneByCountry = (phoneNumberString: string, country: Country | null) => {
    const regex = new RegExp(`^\\${country?.phonePrefix}`, 'g');

    const parsedPhoneObj = parsePhoneNumber(phoneNumberString, {
      defaultCountry: country?.code || undefined,
      extract: false,
    });

    const formattedPhone = parsedPhoneObj?.formatInternational() || phoneNumberString;
    const outputValue = parsedPhoneObj?.number || phoneNumberString;

    return {
      rawPhone: formattedPhone?.replace(regex, '').trim(),
      phone: outputValue,
    };
  };

  static parsePhone = (phoneNumberString: string, prefix = '+'): PhoneNumber | undefined => {
    return parsePhoneNumber(prefix + phoneNumberString, { extract: false });
  };
}
