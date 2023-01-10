import {StyleProp, ViewStyle} from 'react-native';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';

export type Edge = 'top' | 'bottom' | 'left' | 'right';
export type Side = 'start' | 'end';

export type PointerType = {
  edge: Edge;
  offset?: {
    value: number;
    side: Side;
  };
};

export type CalloutProps = {
  style?: StyleProp<ViewStyle>;
  title: string;
  titleFontDimension?: FontDimensions;
  titleFontWeight?: FontWeights;
  content?: string;
  contentFontDimension?: FontDimensions;
  contentFontWeight?: FontWeights;
  footerButtonFontDimension?: FontDimensions;
  leftButtonText?: string;
  rightButtonText?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  onPressClose?: () => void;
  pointer?: PointerType;
  index?: string;
};
