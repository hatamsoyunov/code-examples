import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ContainerView } from '../../components/ContainerView';
import { DataShower } from '../../components/DataShower';
import { Grid } from '../../components/Grid';
import { Ag, Align, Text } from '../../components/Text';
import { View } from '../../components/View/View';
import { Button } from '../../components/buttons/Button';
import { useRootStore } from '../../hooks/useRootStore';
import { UserStatusHelper } from '../../modules/profile/modules/user/helpers/UserStatusHelper';
import { WaterFormFields } from '../../modules/water/forms/WaterForm';
import { WaterHelper } from '../../modules/water/helpers/WaterHelper';
import { WaterRenderHelper } from '../../modules/water/helpers/WaterRenderHelper';
import { Colors } from '../../styles/Colors';
import { SubscriptionPurchaseWidget } from '../../widgets/subscription/SubscriptionPurchaseWidget';
import { WaterAchievementBlock } from './components/WaterAchievementBlock';
import { WaterBottle } from './components/WaterBottle';
import { WaterCounterBlock } from './components/WaterCounterBlock';
import { WaterCustomVolumeFormModal } from './components/WaterCustomVolumeFormModal';
import { WaterVessel } from './components/WaterVessel';

interface IWaterScreenProps {}

export const WaterScreen: React.FC<IWaterScreenProps> = observer(() => {
  const { authStore, waterStore, subscriptionStore, userStore } = useRootStore();

  const loadings = waterStore.waterInfoLoading || userStore.userLoading || subscriptionStore.purchaseInfoLoading;

  const { t } = useTranslation(['water', 'common']);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisibleBottle, setIsVisibleBottle] = useState<boolean>(false);
  const [isVisibleCustomVolumeModal, setIsVisibleCustomVolumeModal] = useState<boolean>(false);

  const vessels = useMemo(() => WaterRenderHelper.getWaterVessels(t), [t]);

  // Effects
  useEffect(() => {
    if (UserStatusHelper.isActiveUser(userStore.user?.status) && subscriptionStore.isSubscriptionActive) {
      waterStore.getWaterInfo();
    }

    return () => {
      waterStore.reset();
    };
  }, [userStore.user, subscriptionStore.isSubscriptionActive]);

  useEffect(() => {
    setTimeout(() => setIsLoading(loadings), 100);
  }, [loadings]);

  // Для ререндера компонента бутылки
  // На андроид плеер сбрасывается при переключении экрана, возможно такое будет и на слабых IOS
  // и теряется состояние наполненности бутылки
  // пробовал изнутри перезапускать, есть нюансы, это самый лучший вариант
  useFocusEffect(
    useCallback(() => {
      setIsVisibleBottle(true);

      return () => {
        setIsVisibleBottle(false);
      };
    }, []),
  );

  // Handlers

  const handleUpdateScreen = () => {
    waterStore.reset();
    waterStore.getWaterInfo();
  };

  const handleRefresh = () => {
    waterStore.getWaterInfo(true);
  };

  const handleSubscriptionBtnPress = () => {
    if (!authStore.isAuth) {
      authStore.navigateToAuth();
      return;
    }

    subscriptionStore.openPaymentModal();
  };

  const handleVolumeChange = (volume: string) => {
    waterStore.changeForm(WaterFormFields.waterVolume, volume);
  };

  const handleOpenCustomVolumeModal = () => {
    setIsVisibleCustomVolumeModal(true);
  };

  const handleCloseCustomVolumeModal = () => {
    setIsVisibleCustomVolumeModal(false);
  };

  const handleSaveAndAddCustomValue = async (volume: string) => {
    handleVolumeChange(volume);

    const isAdded = await waterStore.addWaterDrunk();

    if (isAdded) {
      handleCloseCustomVolumeModal();
    }
  };

  const handleAddWaterDrunk = async () => {
    waterStore.addWaterDrunk();
  };

  // Renders

  const renderContent = () => {
    if (!subscriptionStore.isSubscriptionActive) {
      return (
        <ContainerView withoutBottomSafeAreaOffset>
          <View flex={1} ai="center" jc="center">
            {isVisibleBottle && <WaterBottle isFullBottle />}

            <View mb={16}>
              <Text align={Align.Center}>{t('baseContent.desc')}</Text>
            </View>
            <Button title={t('baseContent.button.connectService')} onPress={handleSubscriptionBtnPress} />
          </View>
        </ContainerView>
      );
    }

    return (
      <>
        <WaterCounterBlock
          current={waterStore.waterInfo?.currentValue ?? 0}
          dailyNorm={waterStore.waterInfo?.dailyNorm ?? 0}
          isDailyNormCompleted={!!waterStore.waterInfo?.currentDayCompleted}
        />

        <View zI={-1}>
          {isVisibleBottle && <WaterBottle progress={WaterHelper.getProgress(waterStore.waterInfo)} />}
        </View>

        <View
          mt={-56} // чтобы поднять контент над пустой областью контейнера бутылки
          ph={16}
        >
          <View mb={8}>
            <WaterAchievementBlock daysCount={waterStore.waterInfo?.completedDaysCount ?? 0} />
          </View>

          <Grid container spacing={8} mb={8}>
            {vessels.map(vessel => (
              <Grid key={vessel.id} item w="33.33%" spacing={8}>
                <WaterVessel
                  icon={vessel.icon}
                  label={vessel.label}
                  volume={vessel.volume}
                  onChange={handleVolumeChange}
                  isSelected={waterStore.waterForm.waterVolume === vessel.volume}
                />
              </Grid>
            ))}
          </Grid>

          <View mb={8}>
            <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={handleOpenCustomVolumeModal}>
              <Text>{t('customValue.button.customValue')}</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={t('button.drinkWater')}
            loading={waterStore.addWaterDrankLoading}
            disabled={!waterStore.waterForm.isValidForm(waterStore.waterForm)}
            onPress={handleAddWaterDrunk}
          />

          <View mv={24}>
            <View mb={16}>
              <Text ag={Ag.CormorantH2}>{t('info.title')}</Text>
            </View>
            <View mb={4}>
              <Text>{t('info.desc.p1')}</Text>
            </View>
            <Text>{t('info.desc.p2')}</Text>
          </View>
        </View>

        <WaterCustomVolumeFormModal
          isVisible={isVisibleCustomVolumeModal}
          onClose={handleCloseCustomVolumeModal}
          loading={waterStore.addWaterDrankLoading}
          errorMessage={waterStore.waterErrorsForm.waterVolume}
          onSave={handleSaveAndAddCustomValue}
        />
      </>
    );
  };

  return (
    <ContainerView withoutHOffsets withoutBottomSafeAreaOffset>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={waterStore.waterInfoRefreshLoading} onRefresh={handleRefresh} />}
      >
        <DataShower
          isFullScreenError
          flexGrow={1}
          loading={isLoading}
          success={waterStore.isWaterInfoLoaded}
          updateAction={handleUpdateScreen}
        >
          {renderContent()}
        </DataShower>
      </ScrollView>

      <SubscriptionPurchaseWidget />
    </ContainerView>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
});
