import React, { FC } from 'react';
import { View as RNView, ViewProps } from 'react-native';

import ViewHelper from './helpers/ViewHelper';
import { StylePropsKeys } from './types/ViewTypes';

export interface IViewProps extends ViewProps, StylePropsKeys {
  opacity?: number;
}

export const View: FC<IViewProps> = props => {
  const { style, children, ...otherProps } = props;

  return (
    <RNView style={[ViewHelper.getStyles(otherProps), style]} {...otherProps}>
      {children}
    </RNView>
  );
};
