import { ViewStyle } from 'react-native';

import { styleProps } from '../types/ViewTypes';

export default class ViewHelper {
  static getStyles = (props?: { [key: string]: any }): ViewStyle => {
    let cssProperties: ViewStyle = {};

    if (!props) {
      return {};
    }

    Object.keys(props).forEach(prop => {
      const cssProperty = (styleProps as any)[prop];
      const cssPropertyValue = props[prop];

      if (cssProperty && cssPropertyValue !== undefined) {
        (cssProperties as any)[cssProperty] = cssPropertyValue;
      }
    });

    return cssProperties;
  };
}
