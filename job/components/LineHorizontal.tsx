import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {layoutColors} from '../../../constants/colors';

type Props = {
  color?: string;
  depth?: number;
  style?: StyleProp<ViewStyle>;
};

export default function LineHorizontal(props: Props) {
  const {color = layoutColors.brown, style, depth = 1} = props;

  return <View style={[{height: depth, backgroundColor: color}, style]} />;
}
