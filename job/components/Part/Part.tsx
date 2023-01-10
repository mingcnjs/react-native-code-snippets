import React, {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {layoutColors} from '../../../../constants/colors';

const styles = StyleSheet.create({
  part: {
    paddingHorizontal: 20,
    paddingTop: 25,
    backgroundColor: layoutColors.white,
  },
  bottomLine: {
    height: 1,
    backgroundColor: layoutColors.black30,
    marginTop: 30,
  },
  bottomPadding30: {paddingBottom: 30},
});

type Props = {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  line?: boolean;
};

export default function Part(props: PropsWithChildren<Props>) {
  const {children, style, testID, line = false} = props;

  return (
    <View
      testID={testID}
      style={[styles.part, style, !line && styles.bottomPadding30]}>
      {children}
      {line && <View style={styles.bottomLine} />}
    </View>
  );
}
