import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { InputOutlined } from '../../../components/InputOutlined';
import { View } from '../../../components/View/View';
import { Button } from '../../../components/buttons/Button';
import { ISimpleModalProps, SimpleModal } from '../../../components/modals/SimpleModal';

interface IWaterCustomVolumeFormModalProps extends ISimpleModalProps {
  loading: boolean;
  errorMessage: string;
  onSave: (volume: string) => void;
}

export const WaterCustomVolumeFormModal: React.FC<IWaterCustomVolumeFormModalProps> = props => {
  const [volume, setVolume] = useState('');

  const { t } = useTranslation(['water', 'common']);

  // Handlers

  const handleClose = () => {
    Keyboard.dismiss();

    props.onClose();
  };

  const handleClosed = () => {
    setVolume('');
  };

  const handleChange = (text: string) => {
    setVolume(text);
  };

  const handleSave = () => {
    props.onSave(volume);
  };

  // Renders

  return (
    <SimpleModal
      title={t('customValue.button.customValue')}
      onModalHide={handleClosed}
      avoidKeyboard
      {...props}
      onClose={handleClose}
    >
      <View pt={8} ph={16}>
        <View mb={12}>
          <InputOutlined
            isRequired
            keyboardType="number-pad"
            maxLength={6}
            label={`${t('customValue.input.label')}, ${t('common:measurements.ml')}`}
            placeholder={t('customValue.input.placeholder')}
            value={volume}
            onChangeText={handleChange}
            renderInput={params => <TextInputMask type={'only-numbers'} {...params} />}
            errorMessage={props.errorMessage}
          />
        </View>

        <Button
          title={t('customValue.button.add')}
          loading={props.loading}
          disabled={!volume.length}
          onPress={handleSave}
        />
      </View>
    </SimpleModal>
  );
};
