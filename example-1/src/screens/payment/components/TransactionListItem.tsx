import React from 'react';

import { Row } from '../../../components/Row';
import { Ag, Text } from '../../../components/Text';
import { View } from '../../../components/View/View';
import { Icon } from '../../../components/icons/Icon';
import DateHelper from '../../../helpers/DateHelper';
import PriceHelper from '../../../helpers/PriceHelper';
import { Transaction } from '../../../modules/payment/modules/transaction/models/Transaction';
import { TransactionStatus } from '../../../modules/payment/modules/transaction/types/TransactionTypes';
import { Colors } from '../../../styles/Colors';

interface ITransactionListItemProps {
  transaction: Transaction;
}

export const TransactionListItem: React.FC<ITransactionListItemProps> = (props) => {
  const renderStatusIcon = () => {
    switch (props.transaction.status) {
      case TransactionStatus.SUCCESS:
        return <Icon name="ic_fluent_checkmark_24_regular" size={24} />;

      case TransactionStatus.IDLE:
        return <Icon name="ic_fluent_clock_24_regular" size={24} />;

      case TransactionStatus.FAILED:
        return <Icon name="ic_fluent_error_circle_24_regular" size={24} />;
    }
  };

  return (
    <Row ai="flex-start" pv={16}>
      <Row flex={1} ai="flex-start">
        <View mr={12}>{renderStatusIcon()}</View>

        <View flex={1}>
          <View mb={4}>
            <Text ag={Ag.Body2}>{props.transaction.title || '-'}</Text>
          </View>
          <Text ag={Ag.Caption2} color={Colors.onSurface.secondary}>
            {DateHelper.format(props.transaction.createdAt) || '-'}
          </Text>
        </View>
      </Row>

      <View>
        <Text ag={Ag.ButtonMedium}>
          - {PriceHelper.getPriceString(props.transaction.amount, props.transaction.currency)}
        </Text>
      </View>
    </Row>
  );
};
