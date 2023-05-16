import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl } from 'react-native';

import Navigation from '../../base/Navigation';
import { Nullable } from '../../base/types/BaseTypes';
import { arrayHasItems } from '../../base/utils/baseUtil';
import { ContainerView } from '../../components/ContainerView';
import { DataShower } from '../../components/DataShower';
import { Divider } from '../../components/Divider';
import { Header } from '../../components/Header';
import { ListLoader } from '../../components/ListLoader';
import { Row } from '../../components/Row';
import { Ag, Align, Text } from '../../components/Text';
import { View } from '../../components/View/View';
import { Button, ButtonSize, ButtonType } from '../../components/buttons/Button';
import { Icon } from '../../components/icons/Icon';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { useRootStore } from '../../hooks/useRootStore';
import Card from '../../modules/payment/models/Card';
import { Transaction } from '../../modules/payment/modules/transaction/models/Transaction';
import { Screens } from '../../navigation/consts/screens';
import { Colors } from '../../styles/Colors';
import { CardListItem } from './components/CardListItem';
import { TransactionListItem } from './components/TransactionListItem';

export const PaymentSettingsScreen: React.FC = observer(() => {
  const { paymentStore, transactionStore } = useRootStore();

  const [deletingCard, setDeletingCard] = useState<Nullable<Card>>(null);
  const [isVisibleDeleteCardModal, setIsVisibleDeleteCardModal] = useState(false);

  const { t } = useTranslation(['payment', 'common']);

  // Effects
  useEffect(() => {
    paymentStore.getCards();
    transactionStore.getTransactions();

    return () => {
      paymentStore.resetCardsList();
      transactionStore.resetTransactionsList();
    };
  }, []);

  // Handlers

  const handleRefreshScreen = () => {
    paymentStore.getCards(true);
    transactionStore.refreshTransactions();
  };

  // Cards
  const handleCardsUpdate = () => {
    paymentStore.resetCardsList();
    paymentStore.getCards();
  };

  const handleAddNewCard = () => {
    Navigation.navigate(Screens.CARD_FORM);
  };

  const handleDeleteCard = (card: Card) => {
    setDeletingCard(card);
    setIsVisibleDeleteCardModal(true);
  };

  const handleAcceptCardDelete = () => {
    if (deletingCard) {
      paymentStore.deleteCard(deletingCard);
    }

    setDeletingCard(null);
    setIsVisibleDeleteCardModal(false);
  };

  const handleRejectCardDelete = () => {
    setDeletingCard(null);
    setIsVisibleDeleteCardModal(false);
  };

  // Transactions
  const handleTransactionsLoadMore = () => {
    transactionStore.getTransactions(true);
  };

  const handleTransactionsUpdate = () => {
    transactionStore.resetTransactionsList();
    transactionStore.getTransactions();
  };

  // Renders

  const renderHeader = () => {
    return (
      <>
        <View mt={16} mb={16}>
          <Row pv={10}>
            <View flex={1} mr={8}>
              <Text ag={Ag.CormorantH3}>{t('settings.paymentMethods.title')}</Text>
            </View>

            <Button
              type={ButtonType.Secondary}
              size={ButtonSize.Small}
              title={t('settings.paymentMethods.button.add')}
              startIcon={<Icon name="ic_fluent_add_circle_20_regular" size={20} color={Colors.primary.default} />}
              onPress={handleAddNewCard}
              disabled={paymentStore.cardsListLoading}
            />
          </Row>

          <View minH={56}>
            <DataShower
              loading={paymentStore.cardsListLoading}
              success={paymentStore.isCardsListLoaded}
              loaderProps={{ size: 'small' }}
              updateAction={handleCardsUpdate}
            >
              {arrayHasItems(paymentStore.cardsList) ? (
                paymentStore.cardsList.map(card => (
                  <View key={card.id} mb={4}>
                    <CardListItem card={card} onDeletePress={() => handleDeleteCard(card)} />
                  </View>
                ))
              ) : (
                <View flex={1} jc="center">
                  <Text align={Align.Center}>{t('settings.paymentMethods.empty')}</Text>
                </View>
              )}
            </DataShower>
          </View>
        </View>

        <View pv={10} mr={8}>
          <Text ag={Ag.CormorantH3}>{t('settings.transactions.title')}</Text>
        </View>
      </>
    );
  };

  const renderFooter = () => {
    return <ListLoader isLoading={transactionStore.transactionsListMoreLoading} withTopSafeAreaOffset />;
  };

  const renderEmptyTransactions = () => {
    return (
      <View mt={24}>
        <DataShower
          loading={transactionStore.transactionsListLoading}
          loaderProps={{ size: 'small', minHeight: 66 }}
          success={transactionStore.isTransactionsListLoaded}
          updateAction={handleTransactionsUpdate}
        >
          <Text align={Align.Center}>{t('settings.transactions.empty')}</Text>
        </DataShower>
      </View>
    );
  };

  const renderTransactionItem = (item: Transaction) => {
    return (
      <View key={item.id}>
        <TransactionListItem transaction={item} />
        <Divider mv={1} />
      </View>
    );
  };

  return (
    <ContainerView withoutBottomSafeAreaOffset>
      <Header showBack title={t('settings.title')} />

      <FlatList
        data={transactionStore.transactionsList}
        keyExtractor={item => `transaction_${item.id}`}
        renderItem={({ item }) => renderTransactionItem(item)}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={renderFooter()}
        ListEmptyComponent={renderEmptyTransactions()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        onEndReached={handleTransactionsLoadMore}
        refreshControl={
          <RefreshControl
            refreshing={paymentStore.cardsListRefreshLoading || transactionStore.transactionsListRefreshLoading}
            onRefresh={handleRefreshScreen}
          />
        }
      />

      <ConfirmModal
        isVisible={isVisibleDeleteCardModal}
        title={t('settings.paymentMethods.deleteCard.title', { lastCard4Number: deletingCard?.lastFour })}
        confirmText={t('common:button.delete')}
        onConfirm={handleAcceptCardDelete}
        onReject={handleRejectCardDelete}
        loading={paymentStore.deleteCardLoading}
      />
    </ContainerView>
  );
});
