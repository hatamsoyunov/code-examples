import { useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Platform, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import Navigation from '../../base/Navigation';
import { isTrue } from '../../base/utils/baseUtil';
import { ContainerView } from '../../components/ContainerView';
import { Grid } from '../../components/Grid';
import { Header } from '../../components/Header';
import { InputOutlined } from '../../components/InputOutlined';
import { Ag, Align, Text } from '../../components/Text';
import { View } from '../../components/View/View';
import { Button } from '../../components/buttons/Button';
import PriceHelper from '../../helpers/PriceHelper';
import { useRootStore } from '../../hooks/useRootStore';
import { CardErrorsFormFields } from '../../modules/payment/form/CardErrorsForm';
import { CardFormFields } from '../../modules/payment/form/CardForm';
import CardFormHelper from '../../modules/payment/helpers/CardFormHelper';
import { PaymentNavigationHelper } from '../../modules/payment/helpers/PaymentNavigationHelper';
import { CardFormRouteProps } from '../../navigation/types/PaymentStackTypes';
import { Colors } from '../../styles/Colors';

export const CardFormScreen: React.FC = observer(() => {
  const { paymentStore, subscriptionStore } = useRootStore();

  const { params } = useRoute<CardFormRouteProps>();

  const { t } = useTranslation(['payment', 'common']);

  const buttonText = useMemo(() => {
    if (params?.transaction) {
      return t('payment.button.pay', {
        amount: PriceHelper.getPriceString(params?.transaction.amount, params?.transaction.currency),
      });
    }

    return t('common:button.save');
  }, []);

  // Effects

  useEffect(() => {
    return () => {
      paymentStore.resetCardForms();
    };
  }, []);

  // Handlers

  const handleBackPress = () => {
    Keyboard.dismiss();

    if (params?.transaction) {
      // открываем виджет повторно, так как до перехода на этот экран его закрываем
      subscriptionStore.openPaymentModal();
    }

    Navigation.pop();
  };

  const handleChangeForm = (key: CardFormFields, value: any) => {
    if (paymentStore.cardErrorsForm[key as unknown as CardErrorsFormFields]) {
      paymentStore.changeCardErrorsForm({ [key]: [''] });
    }

    if (paymentStore.cardErrorsForm?.common) {
      paymentStore.changeCardErrorsForm({ [CardErrorsFormFields.common]: [''] });
    }

    paymentStore.changeCardForm(key, value);
  };

  const handlePress = async () => {
    const isValidCardExpirationDate = await CardFormHelper.isValidCardExpirationDate(paymentStore.cardForm.extDate);

    if (!isValidCardExpirationDate) {
      paymentStore.changeCardErrorsForm({
        [CardErrorsFormFields.extDate]: [t('addNewCard.input.expirationDate.validation.incorrect')],
      });
      return;
    }

    if (params?.transaction) {
      paymentStore.payByNewCard(params.transaction, handlePaySuccess);
      return;
    }

    paymentStore.addCard();
  };

  const handlePaySuccess = () => {
    if (!params?.transaction?.type) {
      return;
    }

    PaymentNavigationHelper.navigationAfterSuccessPayment(params.transaction.type);
  };

  // Renders

  return (
    <ContainerView>
      <Header showBack onBackPress={handleBackPress} title={t('addNewCard.title')} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <Grid container spacing={16} mt={24} mb={24}>
          <Grid item w="100%" spacing={16}>
            <InputOutlined
              isRequired
              maxLength={19}
              keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
              renderInput={params => (
                <TextInputMask type={'credit-card'} options={{ issuer: 'visa-or-mastercard' }} {...params} />
              )}
              label={t('addNewCard.input.number.label')}
              placeholder={t('addNewCard.input.number.placeholder')}
              value={paymentStore.cardForm.number}
              onChangeText={text => handleChangeForm(CardFormFields.number, text)}
            />
          </Grid>
          <Grid item w="50%" spacing={16}>
            <InputOutlined
              isRequired
              maxLength={5}
              keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
              renderInput={params => <TextInputMask type={'datetime'} options={{ format: 'MM/YY' }} {...params} />}
              label={t('addNewCard.input.expirationDate.label')}
              placeholder={t('addNewCard.input.expirationDate.placeholder')}
              value={paymentStore.cardForm.extDate}
              onChangeText={text => handleChangeForm(CardFormFields.extDate, text)}
              errorMessage={paymentStore.cardErrorsForm.extDate}
            />
          </Grid>
          <Grid item w="50%" spacing={16}>
            <InputOutlined
              isRequired
              maxLength={3}
              secureTextEntry={true}
              keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
              renderInput={params => <TextInputMask type={'only-numbers'} {...params} />}
              label={t('addNewCard.input.verificationCode.label')}
              placeholder={t('addNewCard.input.verificationCode.placeholder')}
              value={paymentStore.cardForm.cvvCode}
              onChangeText={text => handleChangeForm(CardFormFields.cvvCode, text)}
            />
          </Grid>
          <Grid item w="100%" spacing={16}>
            <InputOutlined
              isRequired
              label={t('addNewCard.input.cartHolderName.label')}
              placeholder={t('addNewCard.input.cartHolderName.placeholder')}
              value={paymentStore.cardForm.name}
              onChangeText={text => handleChangeForm(CardFormFields.name, text)}
            />
          </Grid>

          {/* {params?.transaction && (
            <Grid item w="100%" spacing={16}>
              <Row pv={8}>
                <View flex={1} mr={8}>
                  <Text>{t('addNewCard.input.saveCard.label')}</Text>
                  <Text ag={Ag.Caption2} color={Colors.onSurface.secondary}>
                    {t('addNewCard.input.saveCard.caption')}
                  </Text>
                </View>
                <Switch
                  active={paymentStore.cardForm.saveCard}
                  onValueChange={value => handleChangeForm(CardFormFields.saveCard, value)}
                />
              </Row>
            </Grid>
          )} */}
        </Grid>

        {isTrue(paymentStore.cardErrorsForm?.common) && (
          <View mt={-16} mb={16}>
            <Text ag={Ag.Body2} align={Align.Center} color={Colors.error}>
              {paymentStore.cardErrorsForm.common}
            </Text>
          </View>
        )}

        <Button
          title={buttonText}
          loading={paymentStore.addCardLoading || paymentStore.payByNewCardLoading || paymentStore.open3DSLoading}
          disabled={!paymentStore.cardForm.isValidForm(paymentStore.cardForm)}
          onPress={handlePress}
        />

        {params?.transaction && (
          <View mt={24}>
            <Text ag={Ag.Caption1} align={Align.Center} color={Colors.onSurface.secondary}>
              {t('addNewCard.caption')}
            </Text>
          </View>
        )}
      </ScrollView>
    </ContainerView>
  );
});
