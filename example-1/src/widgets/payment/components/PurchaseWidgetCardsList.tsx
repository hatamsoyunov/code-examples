import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Loader } from '../../../components/Loader';
import { Ag, Text } from '../../../components/Text';
import { View } from '../../../components/View/View';
import { CardIcon } from '../../../components/icons/CardIcon';
import { PaymentRenderHelper } from '../../../modules/payment/helpers/PaymentRenderHelper';
import Card from '../../../modules/payment/models/Card';
import { Colors } from '../../../styles/Colors';

interface IPurchaseWidgetCardsListProps {
  cards: Card[];
  label: string;
  value: Card | null;
  onChange: (value: Card) => void;
  loading?: boolean;
}

export const PurchaseWidgetCardsList: React.FC<IPurchaseWidgetCardsListProps> = props => {
  const { t } = useTranslation('payment');

  // Renders

  const renderCard = (card: Card) => {
    return (
      <TouchableOpacity
        key={card.id}
        activeOpacity={0.7}
        style={[styles.card, PaymentRenderHelper.isActiveCard(props.value?.id, card.id) && styles.activeCard]}
        onPress={() => props.onChange(card)}
      >
        <View ai="center" mb={2}>
          <CardIcon type={card.cardType} />
        </View>

        {PaymentRenderHelper.isNewCard(card.cardType) ? (
          <Text ag={Ag.Caption2}>{t('payment.newCard.label')}</Text>
        ) : (
          <Text ag={Ag.Caption2}>*{card.lastFour || '-'}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View mb={8}>
        <Text ag={Ag.Caption1} color={Colors.onSurface.primary}>
          {props.label}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.listContainerContent}
      >
        {props.loading && <Loader size="small" minHeight={52} fullScreen />}
        <View style={styles.cardList}>{props.cards.map(card => renderCard(card))}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: -16,
  },
  listContainerContent: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 8,
  },
  cardList: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 52,
    paddingTop: 8,
    paddingBottom: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  activeCard: {
    borderColor: Colors.primary.default,
  },
});
