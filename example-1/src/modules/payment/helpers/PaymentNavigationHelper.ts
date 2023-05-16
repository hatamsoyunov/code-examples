import Navigation from '../../../base/Navigation';
import { Screens } from '../../../navigation/consts/screens';
import { Stacks } from '../../../navigation/consts/stacks';
import { TransactionType } from '../modules/transaction/types/TransactionTypes';

export class PaymentNavigationHelper {
  static navigationAfterSuccessPayment = (transactionType: TransactionType) => {
    switch (transactionType) {
      case TransactionType.SERVICE_SUBSCRIBE:
      case TransactionType.MONTHLY_SUBSCRIBE:
        Navigation.replace(Stacks.RESULT, {
          screen: Screens.SUBSCRIPTION_SUCCESS,
        });

        break;

      case TransactionType.BOOK_PURCHASE:
        Navigation.replace(Stacks.RESULT, {
          screen: Screens.BOOK_PURCHASE_SUCCESS,
        });

        break;
    }
  };
}
