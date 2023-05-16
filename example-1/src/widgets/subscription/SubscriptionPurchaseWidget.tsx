import { observer } from 'mobx-react-lite';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Navigation from '../../base/Navigation';
import { ITabItem, TabSwitch } from '../../components/TabSwitch';
import { View } from '../../components/View/View';
import { useRootStore } from '../../hooks/useRootStore';
import { IPurchaseForm, PurchaseFormFields } from '../../modules/payment/form/PurchaseForm';
import { PaymentNavigationHelper } from '../../modules/payment/helpers/PaymentNavigationHelper';
import { PaymentRenderHelper } from '../../modules/payment/helpers/PaymentRenderHelper';
import { Transaction } from '../../modules/payment/modules/transaction/models/Transaction';
import { TransactionConfirmation } from '../../modules/payment/modules/transaction/models/TransactionConfirmation';
import { SubscriptionHelper } from '../../modules/subscription/helpers/SubscriptionHelper';
import { SubscriptionPriceType } from '../../modules/subscription/types/SubscriptionTypes';
import { Screens } from '../../navigation/consts/screens';
import { Stacks } from '../../navigation/consts/stacks';
import { ProductPurchaseWidget } from '../payment/ProductPurchaseWidget';

export const SubscriptionPurchaseWidget: React.FC = observer(() => {
  const { subscriptionStore, paymentStore } = useRootStore();

  const { t } = useTranslation('main');

  // Стейт для приостановки дефолтных событий инициализации и сброса в процессе оплаты новой картой
  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);

  const price = useMemo(() => {
    if (paymentStore.purchaseForm.type?.id === SubscriptionPriceType.ANNUAL) {
      return subscriptionStore.price?.annualPayment?.value;
    }

    if (subscriptionStore.isSubscriptionStarted) {
      return subscriptionStore.price?.monthlyPayment?.value;
    }

    return subscriptionStore.price?.firstPayment?.value;
  }, [paymentStore.purchaseForm.type, subscriptionStore.isSubscriptionStarted, subscriptionStore.price]);

  // Handlers

  const handleOpen = () => {
    if (isTemporarilyClosed) {
      // сбрасываем флаг при повторном открытии
      setIsTemporarilyClosed(false);

      return;
    }

    subscriptionStore.getPurchasePrice(paymentStore.purchaseForm);
    paymentStore.getCards();
  };

  const handleClosed = () => {
    if (isTemporarilyClosed) {
      return;
    }

    subscriptionStore.resetPurchasePrice();
    subscriptionStore.resetPurchaseErrorForm();
    paymentStore.resetPaymentForm();
    paymentStore.resetCardsList();
  };

  const handleRefreshPrice = (purchaseForm: IPurchaseForm) => {
    subscriptionStore.getPurchasePrice(purchaseForm);
  };

  const handleDeleteErrorMessage = (fieldName: string) => {
    subscriptionStore.changePurchaseErrorForm({ [fieldName]: [''] });
  };

  const handleChangePriceType = (tab: ITabItem<SubscriptionPriceType>) => {
    paymentStore.changePurchaseForm(PurchaseFormFields.type, tab);
    handleRefreshPrice(paymentStore.purchaseForm);
  };

  // Purchase
  const handleGoToPayment = () => {
    subscriptionStore.purchase(paymentStore.purchaseForm, handlePayTransaction);
  };

  const handlePayTransaction = (transaction: Transaction, purchaseForm: IPurchaseForm) => {
    if (PaymentRenderHelper.isNewCard(purchaseForm.card?.cardType)) {
      setIsTemporarilyClosed(true);

      // дожидаемся завершение микротасков и ререндеров
      setTimeout(() => {
        subscriptionStore.closePaymentModal();

        Navigation.navigate(Stacks.PAYMENT, {
          screen: Screens.CARD_FORM,
          params: { transaction },
        });
      }, 0);

      return;
    }

    paymentStore.payBySavedCard(transaction, purchaseForm, handlePurchaseResult);
  };

  const handlePurchaseResult = (res: TransactionConfirmation | boolean, transaction: Transaction) => {
    // явно указываем `false`, что закрываемся окончательно, чтобы сбросился стейт виджета
    setIsTemporarilyClosed(false);

    // дожидаемся завершение микротасков и ререндеров
    setTimeout(() => {
      subscriptionStore.closePaymentModal();

      if (!transaction?.type) {
        return;
      }

      // открываем подтверждение stripe
      if (res instanceof TransactionConfirmation && res?.url) {
        Navigation.navigate(Screens.STRIPE_3DS_CONFIRM, {
          url: res.url,
          transactionType: transaction.type,
        });

        return;
      }

      // подтверждение не требуется
      PaymentNavigationHelper.navigationAfterSuccessPayment(transaction.type);
    }, 0);
  };

  // Renders

  const renderAdditionalContent = () => {
    return (
      <View mt={16}>
        <TabSwitch
          fullWidth
          value={paymentStore.purchaseForm.type}
          tabs={SubscriptionHelper.getSubscriptionPriceTypes(t)}
          onChange={(value) => handleChangePriceType(value)}
        />
      </View>
    );
  };

  return (
    <ProductPurchaseWidget
      enableRefreshingPriceOnCardChange
      modalizeRef={subscriptionStore.subscriptionPurchaseWidgetRef}
      imageSource={require('../../assets/images/vegetables.png')}
      title={t('subscription.title')}
      AdditionalContent={renderAdditionalContent()}
      price={subscriptionStore.purchasePrice?.price}
      oldPrice={price}
      currency={subscriptionStore.purchasePrice?.currency}
      bonusesToSpend={subscriptionStore.purchasePrice?.bonusesToSpend}
      usedPromoCode={subscriptionStore.purchasePrice?.usedPromoCode}
      refreshPriceLoading={subscriptionStore.purchasePriceLoading}
      paymentLoading={subscriptionStore.purchaseLoading || paymentStore.payBySavedCardLoading}
      errorMessages={subscriptionStore.purchaseErrorForm}
      onOpen={handleOpen}
      onClosed={handleClosed}
      onRefreshPrice={handleRefreshPrice}
      onDeleteErrorMessage={handleDeleteErrorMessage}
      onGoToPayment={handleGoToPayment}
    />
  );
});
