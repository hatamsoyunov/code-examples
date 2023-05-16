import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

import { Loader } from '../../components/Loader';
import { PresentationModalHeader } from '../../components/PresentationModalHeader';
import { View } from '../../components/View/View';
import { useRootStore } from '../../hooks/useRootStore';
import { PaymentNavigationHelper } from '../../modules/payment/helpers/PaymentNavigationHelper';
import { Stripe3DsConfirmRouteProps } from '../../navigation/types/RootStackTypes';
import { Colors } from '../../styles/Colors';

export const Stripe3DsConfirmScreen: React.FC = () => {
  const { apiUrlStore } = useRootStore();

  const { params } = useRoute<Stripe3DsConfirmRouteProps>();

  const [isLoading, setIsLoading] = useState(false);

  // Handlers

  const handlerNavigationStateChange = (navState: WebViewNavigation) => {
    setIsLoading(navState.loading);

    if (apiUrlStore.apiUrl && navState.url?.indexOf(apiUrlStore.apiUrl) !== -1) {
      PaymentNavigationHelper.navigationAfterSuccessPayment(params.transactionType);
    }
  };

  // Renders

  return (
    <View flex={1}>
      <View ph={16}>
        <PresentationModalHeader />
      </View>

      {isLoading && <Loader fullScreen size={'small'} fullScreenBackgroundColor={Colors.onPrimary.secondary} />}

      <WebView
        source={{ uri: params.url }}
        onNavigationStateChange={handlerNavigationStateChange}
        style={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
});
