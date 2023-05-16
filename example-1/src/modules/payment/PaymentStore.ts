import { makeAutoObservable } from 'mobx';

import { Dto } from '../../base/Dto';
import Navigation from '../../base/Navigation';
import { IBaseStore, IErrorFromParam, Nullable } from '../../base/types/BaseTypes';
import FormHelper from '../../helpers/FormHelper';
import { Screens } from '../../navigation/consts/screens';
import DictionaryHelper from '../dictionary/helpers/DictionaryHelper';
import PaymentService from './PaymentService';
import { CardErrorsForm, CardErrorsFormFields, ICardErrorsForm } from './form/CardErrorsForm';
import { CardForm, CardFormFields } from './form/CardForm';
import { IPurchaseForm, PurchaseForm, PurchaseFormFields } from './form/PurchaseForm';
import Card from './models/Card';
import NeedConfirmCard from './models/NeedConfirmCard';
import { TransactionDto } from './models/TransactionsDto';
import { Transaction } from './modules/transaction/models/Transaction';
import { TransactionConfirmation } from './modules/transaction/models/TransactionConfirmation';
import { CardError } from './types/CardTypes';

export class PaymentStore implements IBaseStore {
  open3DSLoading = false;
  addCardLoading: boolean = false;
  payByNewCardLoading: boolean = false;
  payBySavedCardLoading: boolean = false;
  deleteCardLoading: boolean = false;

  cardsList: Card[] = [];
  cardsListLoading: boolean = false;
  cardsListRefreshLoading: boolean = false;
  isCardsListLoaded: boolean = true;

  cardForm = CardForm;
  cardErrorsForm = CardErrorsForm;

  purchaseForm = PurchaseForm;

  private paymentService: PaymentService;

  constructor() {
    makeAutoObservable(this);
    this.paymentService = new PaymentService();
  }

  // FORM

  changeCardForm = (key: CardFormFields, value: any) => {
    this.cardForm = FormHelper.updateForm(this.cardForm, key, value);
  };

  changeCardErrorsForm = (errors: Nullable<IErrorFromParam>) => {
    this.cardErrorsForm = FormHelper.updateErrorForm<ICardErrorsForm>(this.cardErrorsForm, errors);
  };

  changePurchaseForm = (key: PurchaseFormFields, value: any) => {
    this.purchaseForm = FormHelper.updateForm(this.purchaseForm, key, value);
  };

  // API

  getCards = (isRefresh = false) => {
    this.setCardsListLoading(isRefresh, true);

    return this.paymentService
      .getCards()
      .then(items => {
        this.setCardsList(items);
        this.setIsCardsListLoaded(true);
      })
      .catch(() => {
        this.setIsCardsListLoaded(false);
      })
      .finally(() => {
        this.setCardsListLoading(isRefresh, false);
      });
  };

  addCard = async () => {
    this.setAddCardLoading(true);

    const { needCryptogram } = await this.paymentService.getPaymentSystem();
    const cryptogram = needCryptogram ? await this.paymentService.getCPCryptogram(this.cardForm) : undefined;

    return this.paymentService
      .addCard(this.cardForm, cryptogram)
      .then(async res => {
        if (res instanceof NeedConfirmCard && res?.needConfirm === true) {
          this.confirmCP3DsAddingCard(res, () => {
            this.getCards();
          });
        } else if (res instanceof Card) {
          this.setCardsList([...this.cardsList, res]);
        }

        Navigation.pop();
      })
      .catch(() => {
        // нет необходимости в обработке, валидация карты на фронте
      })
      .finally(() => {
        this.setAddCardLoading(false);
      });
  };

  confirmCP3DsAddingCard = async (data: NeedConfirmCard, onSuccess: () => void) => {
    this.setOpen3DSLoading(true);

    this.paymentService
      .confirmCP3DsAddingCard(data)
      .then(() => {
        onSuccess();
      })
      .catch(error => {
        if (error?.response?.data?.errors?.[0] === CardError.PAYMENT_EXCEPTION) {
          this.changeCardErrorsForm({
            [CardErrorsFormFields.common]: [error?.response?.data?.message],
          });
        }
      })
      .finally(() => {
        this.setOpen3DSLoading(false);
      });
  };

  deleteCard = (card: Card) => {
    this.setDeleteCardLoading(true);

    this.paymentService
      .deleteCard(card.id!)
      .then(() => {
        this.setCardsList(DictionaryHelper.removeItemFromArray(this.cardsList, card, 'id'));
      })
      .catch(() => {})
      .finally(() => {
        this.setDeleteCardLoading(false);
      });
  };

  // Pay

  payByNewCard = async (transaction: Transaction, onSuccess: () => void) => {
    if (!transaction?.id) {
      return;
    }

    this.setPayByNewCardLoading(true);

    const { needCryptogram } = await this.paymentService.getPaymentSystem();
    const cryptogram = needCryptogram ? await this.paymentService.getCPCryptogram(this.cardForm) : undefined;

    this.paymentService
      .payByNewCard(this.cardForm, transaction.id, cryptogram)
      .then(async res => {
        if (res instanceof NeedConfirmCard && res?.needConfirm === true) {
          // CloudPayments 3Ds
          this.confirmCP3DsTransaction(res, onSuccess);
        } else if (res instanceof TransactionConfirmation && res?.url && transaction.type) {
          // Stripe 3Ds
          Navigation.navigate(Screens.STRIPE_3DS_CONFIRM, {
            url: res.url,
            transactionType: transaction.type,
          });
        } else {
          // без подтверждение
          onSuccess();
        }
      })
      .catch(() => {
        // нет необходимости в обработке, валидация карты на фронте
      })
      .finally(() => {
        this.setPayByNewCardLoading(false);
      });
  };

  payBySavedCard = async (
    transaction: Transaction,
    purchaseForm: IPurchaseForm,
    callback: (res: TransactionConfirmation | boolean, transaction: Transaction) => void,
  ) => {
    this.setPayBySavedCardLoading(true);

    const dto = Dto.populate(TransactionDto, {
      transactionId: transaction.id || null,
      tokenId: purchaseForm.card?.id || null,
    });

    return this.paymentService
      .payBySavedCard(dto)
      .then(res => {
        callback(res, transaction);
      })
      .catch(() => {
        // бэк не передает ошибок для обработки
      })
      .finally(() => {
        this.setPayBySavedCardLoading(false);
      });
  };

  confirmCP3DsTransaction = async (data: NeedConfirmCard, onSuccess: () => void) => {
    this.setOpen3DSLoading(true);

    this.paymentService
      .confirmCP3DsTransaction(data)
      .then(() => {
        onSuccess();
      })
      .catch(error => {
        if (error?.response?.data?.errors?.[0] === CardError.PAYMENT_EXCEPTION) {
          this.changeCardErrorsForm({
            [CardErrorsFormFields.common]: [error?.response?.data?.message],
          });
        }
      })
      .finally(() => {
        this.setOpen3DSLoading(false);
      });
  };

  // OTHERS

  createNewCard = () => {
    return this.paymentService.createNewCard();
  };

  // RESET

  resetCardForms = () => {
    this.cardForm = CardForm;
    this.cardErrorsForm = CardErrorsForm;
  };

  resetPaymentForm = () => {
    this.purchaseForm = PurchaseForm;
  };

  resetCardsList = () => {
    this.cardsList = [];
    this.cardsListLoading = false;
    this.cardsListRefreshLoading = false;
    this.isCardsListLoaded = true;
  };

  reset = () => {
    this.open3DSLoading = false;
    this.addCardLoading = false;
    this.payByNewCardLoading = false;
    this.payBySavedCardLoading = false;
    this.deleteCardLoading = false;

    this.resetCardForms();
    this.resetPaymentForm();
    this.resetCardsList();
  };

  // SETTERS

  private setCardsList = (list: Card[]) => {
    this.cardsList = list;
  };

  private setCardsListLoading = (isRefresh: boolean, value: boolean) => {
    if (isRefresh) {
      this.cardsListRefreshLoading = value;
    } else {
      this.cardsListLoading = value;
    }
  };

  private setIsCardsListLoaded = (value: boolean) => {
    this.isCardsListLoaded = value;
  };

  private setAddCardLoading = (value: boolean) => {
    this.addCardLoading = value;
  };

  private setPayByNewCardLoading = (value: boolean) => {
    this.payByNewCardLoading = value;
  };

  private setPayBySavedCardLoading = (value: boolean) => {
    this.payBySavedCardLoading = value;
  };

  private setOpen3DSLoading = (value: boolean) => {
    this.open3DSLoading = value;
  };

  private setDeleteCardLoading = (value: boolean) => {
    this.deleteCardLoading = value;
  };
}
