import RNCloudPayment from 'react-native-cloudpayments';

import { Dto } from '../../base/Dto';
import { modelFactory } from '../../base/ModelFactory';
import NumberHelper from '../../helpers/NumberHelper';
import { CardType } from '../card/types/CardTypes';
import PaymentApiRepository from './PaymentApiRepository';
import CP3DsConfirmDto from './dto/CP3DsConfirmDto';
import CardDto from './dto/CardDto';
import PayByNewCardDto from './dto/PayByNewCardDto';
import { ICardForm } from './form/CardForm';
import CPPublicKey from './models/CPPublicKey';
import Card from './models/Card';
import NeedConfirmCard from './models/NeedConfirmCard';
import PaymentSystem from './models/PaymentSystem';
import { TransactionDto } from './models/TransactionsDto';
import { TransactionConfirmation } from './modules/transaction/models/TransactionConfirmation';

export default class PaymentService {
  paymentApi: PaymentApiRepository;

  constructor() {
    this.paymentApi = new PaymentApiRepository();
  }

  // API

  getPaymentSystem = async (): Promise<PaymentSystem> => {
    const { data } = await this.paymentApi.getPaymentSystem();

    return modelFactory.create(PaymentSystem, (data?.data as any)?.paymentSystem);
  };

  getCPPublicKey = async (): Promise<CPPublicKey> => {
    const { data } = await this.paymentApi.getCPPublicKey();

    return modelFactory.create(CPPublicKey, data.data);
  };

  // Cards

  addCard = async (form: ICardForm, cryptogram?: string): Promise<NeedConfirmCard | Card> => {
    const dto = this.createCardDto(form, cryptogram);
    const { data } = await this.paymentApi.addCard(dto);

    if ((data?.data as any)?.needConfirm === true) {
      return modelFactory.create(NeedConfirmCard, data.data);
    }

    return modelFactory.create(Card, data.data);
  };

  confirmCP3DsAddingCard = async (data: NeedConfirmCard) => {
    const dto = await this.createCP3DsConfirmDto(data);

    return this.paymentApi.confirmCP3DsAddingCard(dto);
  };

  getCards = async (): Promise<Card[]> => {
    const { data } = await this.paymentApi.getCards();

    return modelFactory.createList(Card, (data as any).data);
  };

  deleteCard = async (id: number) => {
    await this.paymentApi.deleteCard(id);
  };

  // Pay

  payByNewCard = async (
    form: ICardForm,
    transactionId: number,
    cryptogram?: string,
  ): Promise<NeedConfirmCard | TransactionConfirmation | void> => {
    const dto = Dto.populate(PayByNewCardDto, {
      ...this.createCardDto(form, cryptogram),
      transactionId,
    });

    const { data } = await this.paymentApi.payByNewCard(dto);

    // Необходимо подтвердить платеж

    // по Cloudpayments
    if ((data?.data as any)?.needConfirm === true) {
      return modelFactory.create(NeedConfirmCard, data.data);
    }

    // по Stripe
    if ((data?.data as any)?.url) {
      return modelFactory.create(TransactionConfirmation, data.data);
    }
  };

  payBySavedCard = async (dto: TransactionDto): Promise<TransactionConfirmation | boolean> => {
    const { data } = await this.paymentApi.payBySavedCard(dto);

    if ((data?.data as any)?.url) {
      return modelFactory.create(TransactionConfirmation, data.data);
    }

    return true;
  };

  confirmCP3DsTransaction = async (data: NeedConfirmCard) => {
    const dto = await this.createCP3DsConfirmDto(data);

    return this.paymentApi.confirmCP3DsTransaction(dto);
  };

  // OTHERS

  getCPCryptogram = async (cardForm: ICardForm): Promise<string> => {
    const { key } = await this.getCPPublicKey();

    return await RNCloudPayment.createCryptogram(
      NumberHelper.getDigits(cardForm.number),
      cardForm.extDate,
      cardForm.cvvCode,
      key,
    ).catch(() => {});
  };

  createNewCard = (): Card => {
    return modelFactory.create<Card>(Card, { cardType: CardType.NEW_CARD });
  };

  createCardDto = (form: ICardForm, cryptogram?: string): CardDto => {
    return Dto.populate(CardDto, {
      cardNumber: form.number,
      expireMonth: Number(form.extDate?.slice(0, 2)),
      expireYear: Number(form.extDate?.slice(3)),
      secretCode: form.cvvCode,
      cardHolderName: form.name,
      cryptogram: cryptogram || null,
    });
  };

  createCP3DsConfirmDto = async (data: NeedConfirmCard): Promise<CP3DsConfirmDto> => {
    const { PaRes, MD } = await RNCloudPayment.show3DS(data?.url, data?.token, data?.transactionId);

    return Dto.populate<CP3DsConfirmDto>(CP3DsConfirmDto, { PaRes, MD });
  };
}
