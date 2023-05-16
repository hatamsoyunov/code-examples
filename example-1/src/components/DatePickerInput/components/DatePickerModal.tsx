import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';

import { Colors } from '../../../styles/Colors';
import { Row } from '../../Row';
import { View } from '../../View/View';
import { Button, ButtonSize, ButtonType } from '../../buttons/Button';

interface IDatePickerModalProps extends Partial<ModalProps> {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const DatePickerModal: React.FC<IDatePickerModalProps> = props => {
  const { t } = useTranslation();

  return (
    <Modal {...props}>
      <View style={styles.modal}>
        {props.children}

        <Row style={styles.modalFooter}>
          <Button
            title={t('common:button.cancel')}
            type={ButtonType.Flat}
            size={ButtonSize.Small}
            style={styles.modalBtn}
            onPress={props.onClose}
          />

          <Button
            title={t('common:button.save')}
            type={ButtonType.Flat}
            size={ButtonSize.Small}
            style={styles.modalBtn}
            onPress={props.onSave}
          />
        </Row>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    borderRadius: 16,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  modalFooter: {
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingTop: 24,
    paddingBottom: 16,
  },
  modalBtn: {
    paddingHorizontal: 16,
  },
});
