import { useEffect, useState } from 'react';
import Animated, { EasingNode } from 'react-native-reanimated';

export default function useAnimatedProgress(width: number, percent: number): Animated.Node<number> {
  const [translateX] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: width * percent,
      duration: 500,
      easing: EasingNode.inOut(EasingNode.cubic),
    }).start();
  }, [percent, width]);

  return translateX;
}
