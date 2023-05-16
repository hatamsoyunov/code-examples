import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FastImageProps } from 'react-native-fast-image';

import { DataShower } from '../../components/DataShower';
import FastImageWithLoader from '../../components/FastImageWithLoader';
import { Grid } from '../../components/Grid';
import { Loader } from '../../components/Loader';
import { PriceView } from '../../components/PriceView';
import { Row } from '../../components/Row';
import { Switch } from '../../components/Switch';
import { Ag, Align, Text } from '../../components/Text';
import { View } from '../../components/View/View';
import { Button } from '../../components/buttons/Button';
import { IconFilled } from '../../components/icons/IconFilled';
import { BonusPointsIcon } from '../../components/icons/svg/BonusPointsIcon';
import { ISwipeableModalProps, SwipeableModal } from '../../components/modals/SwipeableModal';
import PriceHelper from '../../helpers/PriceHelper';
import { useRootStore } from '../../hooks/useRootStore';
import { IPurchaseForm, PurchaseFormFields } from '../../modules/payment/form/PurchaseForm';
import { PaymentRenderHelper } from '../../modules/payment/helpers/PaymentRenderHelper';
import Card from '../../modules/payment/models/Card';
import { Colors } from '../../styles/Colors';
import { PromoCodeInput } from './components/PromoCodeInput';
import { PurchaseWidgetCardsList } from './components/PurchaseWidgetCardsList';

interface IProductPurchaseWidgetProps extends Omit<ISwipeableModalProps, 'children'> {
  imageSource: FastImageProps['source'];
  title: string;
  price: number | null | undefined;
  currency: string | null | undefined;
  refreshPriceLoading: boolean;
  onRefreshPrice: (purchaseForm: IPurchaseForm) => void;
  paymentLoading: boolean;
  onGoToPayment: () => void;
  oldPrice?: number | null;
  bonusesToSpend?: number | null;
  usedPromoCode?: string | null;
  AdditionalContent?: React.ReactNode;
  enableRefreshingPriceOnCardChange?: boolean;
  errorMessages?: any;
  onDeleteErrorMessage?: (fieldName: string) => void;
}

export const ProductPurchaseWidget: React.FC<IProductPurchaseWidgetProps> = observer(props => {
  const { paymentStore } = useRootStore();

  const { t } = useTranslation('payment');
  const { width } = useWindowDimensions();

  const newCard = useMemo(() => paymentStore.createNewCard(), []);

  // Handlers

  const handleClose = () => {
    props.modalizeRef.current?.close();
  };

  const handleApplyCode = (value: string) => {
    Keyboard.dismiss();
    paymentStore.changePurchaseForm(PurchaseFormFields.promoCode, value);
    props.onRefreshPrice(paymentStore.purchaseForm);
  };

  const handleDeleteCode = () => {
    Keyboard.dismiss();
    paymentStore.changePurchaseForm(PurchaseFormFields.promoCode, '');
    props.onRefreshPrice(paymentStore.purchaseForm);
  };

  const handleDeleteErrorCode = (fieldName: string) => {
    props.onDeleteErrorMessage && props.onDeleteErrorMessage(fieldName);
  };

  const handleBonusSwitchChange = (value: boolean) => {
    paymentStore.changePurchaseForm(PurchaseFormFields.spendPoints, value);
    props.onRefreshPrice(paymentStore.purchaseForm);
  };

  const handleChangeCard = (value: Card) => {
    paymentStore.changePurchaseForm(PurchaseFormFields.card, value);

    if (props.enableRefreshingPriceOnCardChange) {
      props.onRefreshPrice(paymentStore.purchaseForm);
    }
  };

  // Renders

  const renderModalHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleClose} style={styles.closeBtn}>
          <IconFilled name={'ic_fluent_dismiss_circle_32_filled'} size={32} color={Colors.onSurface.secondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBonusCheckbox = () => {
    if (!props.bonusesToSpend) {
      return;
    }

    return (
      <Row pv={8} mt={16}>
        <Row flex={1} jc="flex-start">
          <Text>{t('payment.input.useBonuses.label')}</Text>
          <Row ml={12}>
            <Text ag={Ag.GolosTextH2}>{PriceHelper.getPriceString(props.bonusesToSpend)}</Text>
            <BonusPointsIcon />
          </Row>
        </Row>
        <Switch
          active={paymentStore.purchaseForm.spendPoints}
          onValueChange={value => handleBonusSwitchChange(value)}
        />
      </Row>
    );
  };

  const renderPrice = () => {
    if (props.refreshPriceLoading) {
      return <Loader minHeight={96} size="small" />;
    }

    if (!props.price || !props.currency) {
      return;
    }

    const showOldPrice = PaymentRenderHelper.showOldPrice(props.oldPrice, props.price);

    return (
      <View mv={16} pv={16}>
        <Grid container ai="center" jc="center" spacing={16}>
          <Grid item w="50%" spacing={16}>
            <PriceView price={props.price} currency={props.currency} />
          </Grid>

          {showOldPrice && (
            <Grid item w="50%" spacing={16}>
              <PriceView isOldPrice price={props.oldPrice} currency={props.currency} />
            </Grid>
          )}
        </Grid>
      </View>
    );
  };

  return (
    <SwipeableModal
      scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}
      HeaderComponent={renderModalHeader()}
      {...props}
    >
      <View pt={16} ph={16}>
        <View mb={16}>
          <FastImageWithLoader
            source={props.imageSource}
            resizeMode="contain"
            style={[styles.img, { width: width - 32, backgroundColor: Colors.white }]}
          />

          <Text ag={Ag.GolosTextH2} align={Align.Center}>
            {props.title}
          </Text>

          {props.AdditionalContent}
        </View>

        <View
          minH={270} // подобранная минимальная высота контента, чтобы контент не прыгал при ошибке
        >
          <DataShower
            loading={false}
            success={true}
            updateAction={() => props.onRefreshPrice(paymentStore.purchaseForm)}
          >
            <View mb={24}>
              <PromoCodeInput
                loading={props.refreshPriceLoading}
                usedPromoCode={props.usedPromoCode || ''}
                onApplyCode={handleApplyCode}
                onDeleteCode={handleDeleteCode}
                onDeleteErrorMessage={() => handleDeleteErrorCode(PurchaseFormFields.promoCode)}
                errorMessage={props.errorMessages[PurchaseFormFields.promoCode]}
              />
            </View>

            <PurchaseWidgetCardsList
              loading={paymentStore.cardsListLoading}
              cards={[...paymentStore.cardsList, newCard]}
              label={t('payment.input.paymentMethod.label')}
              value={paymentStore.purchaseForm.card}
              onChange={handleChangeCard}
            />

            {renderBonusCheckbox()}
            {renderPrice()}

            <View mb={12}>
              <Button
                title={t('payment.button.proceedToPayment')}
                loading={props.paymentLoading}
                disabled={
                  !paymentStore.purchaseForm.isValidForm(paymentStore.purchaseForm) || props.refreshPriceLoading
                }
                onPress={props.onGoToPayment}
              />
            </View>
          </DataShower>
        </View>
      </View>
    </SwipeableModal>
  );
});

const styles = StyleSheet.create({
  img: {
    height: 188,
    marginTop: 4,
    marginBottom: 16,
  },
  header: {
    position: 'relative',
    zIndex: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
});
