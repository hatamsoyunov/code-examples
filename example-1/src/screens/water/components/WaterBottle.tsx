import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import { OnProgressData } from 'react-native-video';
import VideoPlayer from 'react-native-video-player';

import { View } from '../../../components/View/View';
import { useAnimationWaterBottle } from '../../../hooks/useAnimationWaterBottle';
import { WaterHelper } from '../../../modules/water/helpers/WaterHelper';

interface IWaterBottleProps {
  progress?: number;
  isFullBottle?: boolean;
}

const CONTAINER_WIDTH = Dimensions.get('window').width;
const BOTTLE_WIDTH = Math.floor(CONTAINER_WIDTH * 0.704);
const END_VIDE_FRAME_DURATION = 1.2; // конечный кадр продолжается еще 1 сек

export const WaterBottle: React.FC<IWaterBottleProps> = props => {
  const playerRef = useRef<VideoPlayer>(null);

  const [isReady, setIsReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [isFirstAnimation, setIsFirstAnimation] = useState(true);
  const animatedStyle = useAnimationWaterBottle(isReady, isComplete);

  // Effects

  useEffect(() => {
    if (props.progress === undefined || playerRef.current?.state.progress === undefined) {
      return;
    }

    if (playerRef.current?.state.progress < props.progress) {
      playerRef.current?.resume();
    } else {
      playerRef.current?.stop();
      playerRef.current?.resume();
    }
  }, [props.progress]);

  // Handlers

  const handleReadyForDisplay = () => {
    setIsReady(true);
  };

  const handlePause = (isComplete?: boolean) => {
    playerRef.current?.pause();

    if (isComplete) {
      setIsComplete(true);
    }

    setIsFirstAnimation(false);
  };

  const handleProgress = (progressData: OnProgressData) => {
    // Убираем с конца указанное время, это делается для остановки воспроизведение до окончания видео,
    // чтобы progress не сбросился и видео не перешло на первый кадр
    const duration = progressData.seekableDuration - END_VIDE_FRAME_DURATION;

    if (props.progress !== undefined) {
      const timeToPause = props.progress * duration;

      // приостанавливаем воспроизведение видео / заполнение бутылки
      if (progressData.currentTime > timeToPause) {
        handlePause(props.progress === 1);
      }

      return;
    }

    // по умолчанию бутылка заполняется полностью
    if (progressData.currentTime > duration) {
      handlePause(true);
    }
  };

  // Renders

  return (
    <View
      w={CONTAINER_WIDTH}
      h={CONTAINER_WIDTH}
      style={props.isFullBottle ? styles.fullBottleContainer : styles.container}
    >
      <FastImage
        pointerEvents="none"
        source={
          props.isFullBottle
            ? require('../../../assets/images/water-screen-bg-leaves.png')
            : require('../../../assets/images/water-screen-bg-leaves2.png')
        }
        style={styles.bgLeaves}
      />

      <Animated.View style={animatedStyle}>
        <VideoPlayer
          ref={playerRef}
          video={require('../../../assets/videos/water-bottle.mp4')}
          controls={false}
          defaultMuted
          autoplay
          rate={WaterHelper.getPlayerSpeed(isFirstAnimation, props.progress, props.isFullBottle)}
          onProgress={handleProgress}
          onReadyForDisplay={handleReadyForDisplay}
          customStyles={{
            controls: { display: 'none' },
            seekBar: { display: 'none' },
          }}
          style={{
            width: BOTTLE_WIDTH,
            height: BOTTLE_WIDTH,
          }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  fullBottleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgLeaves: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
