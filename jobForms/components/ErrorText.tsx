import React, {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import ErrorIcon2 from '../../../assets/icons/ErrorIcon2';
import Lato from '../../../components/labels/Lato';
import {FontDimensions} from '../../../components/labels/CustomText/types';
import {layoutColors} from '../../../constants/colors';

const styles = StyleSheet.create({
  error: {
    flexDirection: 'row',
    marginTop: 8,
  },
  leftMargin6: {marginLeft: 6},
});

type Props = PropsWithChildren<{
  isInvalid: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export default function ErrorText(props: Props) {
  const {isInvalid, children, style} = props;
  if (isInvalid) {
    return (
      <View style={[styles.error, style]}>
        <ErrorIcon2 />
        <Lato
          fontDimensions={FontDimensions.CAPTION1}
          color={layoutColors.red3}
          style={styles.leftMargin6}>
          {children}
        </Lato>
      </View>
    );
  }
  return null;
}
