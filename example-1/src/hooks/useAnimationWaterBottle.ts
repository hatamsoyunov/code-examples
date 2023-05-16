import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export const useAnimationWaterBottle = (isShow: boolean, isComplete: boolean) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const rotate = useSharedValue(7);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    };
  }, []);

  useEffect(() => {
    if (isShow) {
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withTiming(1, { duration: 350 });
      rotate.value = withTiming(0, { duration: 350 });
    }
  }, [isShow]);

  useEffect(() => {
    if (isComplete) {
      scale.value = withSequence(withTiming(1.07, { duration: 70 }), withTiming(1, { duration: 350 }));
    }
  }, [isComplete]);

  return animatedStyle;
};
