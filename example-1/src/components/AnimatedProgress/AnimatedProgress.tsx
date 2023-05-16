import React, { useState } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Colors } from '../../styles/Colors';
import useAnimatedProgress from '../../hooks/useAnimatedProgress';

interface IAnimatedProgressProps {
  current: number;
  total: number;
  height?: number;
  fillColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  trackStyle?: StyleProp<ViewStyle>;
  progressStyle?: StyleProp<ViewStyle>;
}

export const AnimatedProgress: React.FC<IAnimatedProgressProps> = (props) => {
  const percent = props.current / props.total;

  const [layoutWidth, setLayoutWidth] = useState(0);
  const translateX = useAnimatedProgress(layoutWidth, percent);

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[{ height: props.height }, props.containerStyle]}>
      <View style={[styles.track, props.trackStyle]} onLayout={handleLayout}>
        <Animated.View style={[styles.progress, { transform: [{ translateX }] }, props.progressStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    position: 'relative',
    flex: 1,
    borderRadius: 2,
    backgroundColor: Colors.outline,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary.default,
    borderRadius: 2,
  },
});
