import AbstractApiRepository from '../../base/api/AbstractApiRepository';
import CP3DsConfirmDto from './dto/CP3DsConfirmDto';
import CardDto from './dto/CardDto';
import PayByNewCardDto from './dto/PayByNewCardDto';
import { TransactionDto } from './models/TransactionsDto';

export default class PaymentApiRepository extends AbstractApiRepository {
  getPaymentSystem = () => {
    return this.apiClient.get({ url: '/payments/checkPaymentSystem/' });
  };

  getCPPublicKey = () => {
    return this.apiClient.get({ url: `/payments/publicKey/` });
  };

  // Cards

  getCards = () => {
    return this.apiClient.get({ url: 'payments/cards' });
  };

  addCard = (data: CardDto) => {
    return this.apiClient.post({ url: `/payments/chargeCard`, data });
  };

  confirmCP3DsAddingCard = (data: CP3DsConfirmDto) => {
    return this.apiClient.post({ url: `/payments/mobile/confirmCardCharge`, data });
  };

  deleteCard = (id: number) => {
    return this.apiClient.get({ url: `/payments/cards/remove/${id}` });
  };

  // Pay

  payByNewCard = (data: PayByNewCardDto) => {
    return this.apiClient.post({ url: '/payments/payByCard', data });
  };

  payBySavedCard = (data: TransactionDto) => {
    return this.apiClient.post({ url: `/payments/payByToken`, data });
  };

  confirmCP3DsTransaction = (data: CP3DsConfirmDto) => {
    return this.apiClient.post({ url: `/payments/mobile/confirmCloudpaymentsTransaction`, data });
  };
}
