import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { Row } from '../../../components/Row';
import { Text } from '../../../components/Text';
import { View } from '../../../components/View/View';
import { CardIcon } from '../../../components/icons/CardIcon';
import { Icon } from '../../../components/icons/Icon';
import Card from '../../../modules/payment/models/Card';
import { Colors } from '../../../styles/Colors';

interface ICardListItemProps {
  card: Card;
  onDeletePress: (card: Card) => void;
}

export const CardListItem: React.FC<ICardListItemProps> = props => {
  const { t } = useTranslation('payment');

  // Renders
  return (
    <Row>
      <Row flex={1}>
        <CardIcon type={props.card.cardType} />
        <View flex={1} ml={20}>
          <Text>
            {t('settings.paymentMethods.card')} *{props.card.lastFour || '-'}
          </Text>
        </View>
      </Row>

      <TouchableOpacity activeOpacity={0.07} onPress={() => props.onDeletePress(props.card)}>
        <View p={12}>
          <Icon name="ic_fluent_delete_24_regular" size={24} color={Colors.primary.default} />
        </View>
      </TouchableOpacity>
    </Row>
  );
};
