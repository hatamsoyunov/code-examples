export default class NumberHelper {
  static getDigits = (phone: string) => {
    return phone.replace(/\D/g, '');
  };
}
