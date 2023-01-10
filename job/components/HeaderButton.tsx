import React, {FC, MutableRefObject} from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {layoutColors} from '../../../constants/colors';
import IconButton from '../../../components/buttons/IconButton';

const styles = StyleSheet.create({
  button: {
    borderRadius: 40,
  },
  buttonBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: layoutColors.white,
    borderRadius: 35,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowColor: `rgba(${layoutColors.black100RGB}, ${
      Platform.OS === 'ios' ? '0.1' : '0.3'
    })`,
    elevation: 9,
  },
});

type Props = TouchableOpacityProps & {
  innerRef?: MutableRefObject<TouchableOpacity>;
  opacityAnimation?: Animated.AnimatedInterpolation | Animated.AnimatedValue;
};

const HeaderButton: FC<Props> = React.memo(props => {
  const {innerRef, opacityAnimation, style, children, ...touchableProps} =
    props;

  return (
    <IconButton
      {...touchableProps}
      innerRef={innerRef}
      style={[styles.button, style]}>
      <Animated.View
        style={[
          styles.buttonBackground,
          opacityAnimation && {opacity: opacityAnimation},
        ]}
      />
      {children}
    </IconButton>
  );
});

export default HeaderButton;
