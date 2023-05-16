import { Platform } from 'react-native';
import RNCloudPayment from 'react-native-cloudpayments';

export default class CardFormHelper {
  static isValidCardExpirationDate = async (date: string): Promise<boolean> => {
    const expirationDate = Platform.OS === 'ios' ? date : date.replace('/', '');
    const isValidExpired = await RNCloudPayment.isValidExpired(expirationDate);

    return isValidExpired;
  };
}
