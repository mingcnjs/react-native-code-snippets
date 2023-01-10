import React, {FC} from 'react';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {layoutColors} from '../../../constants/colors';

const styles = StyleSheet.create({
  shadowPart: {
    marginBottom: 10,
    shadowOffset: {height: 0, width: 0},
    shadowRadius: 5,
    shadowOpacity: 0.05,
    shadowColor:
      Platform.OS === 'android'
        ? `rgba(${layoutColors.black100RGB},0.2)`
        : layoutColors.black100,
    elevation: 4,
    backgroundColor: layoutColors.white,
  },
});

type Props = {
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const BoxShadow: FC<Props> = props => {
  const {children, style, testID} = props;

  return (
    <View testID={testID} style={[styles.shadowPart, style]}>
      {children}
    </View>
  );
};

export default BoxShadow;
