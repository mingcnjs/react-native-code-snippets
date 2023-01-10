import React from 'react';
import HeaderButton from '../HeaderButton';
import BackArrowIcon from '../../../../assets/icons/BackArrowIcon';
import OpacityAnimatedHeader from '../../../../components/OpacityAnimatedHeader';
import {Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import testId from '../../../../constants/testId';

const TOP_OFFSET = 100;

type Props = {
  animation: Animated.AnimatedValue;
  onPressBackButton?: () => void;
};

export default function Header(props: Props) {
  const {animation, onPressBackButton} = props;
  const {top} = useSafeAreaInsets();

  const opacity = animation.interpolate({
    inputRange: [TOP_OFFSET, TOP_OFFSET + top],
    outputRange: [0, 1],
  });

  const invertedOpacity = animation.interpolate({
    inputRange: [TOP_OFFSET, TOP_OFFSET + top],
    outputRange: [1, 0],
  });

  return (
    <OpacityAnimatedHeader
      opacityAnimation={opacity}
      LeftButtons={
        <HeaderButton
          testID={testId.headerBackButton}
          opacityAnimation={invertedOpacity}
          onPress={onPressBackButton}>
          <BackArrowIcon />
        </HeaderButton>
      }
    />
  );
}
