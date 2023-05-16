import { Linking } from 'react-native';

export default class LinkingHelper {
  static openLink = async (link: string) => {
    Linking.canOpenURL(link).then(supported => {
      if (!supported) {
        return;
      }

      Linking.openURL(link);
    });
  };

  static openSettings = () => {
    return Linking.openSettings();
  };
}
