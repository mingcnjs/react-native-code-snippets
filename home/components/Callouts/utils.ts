import {Edge, PointerType, Side} from './types';
import {StyleProp, ViewStyle} from 'react-native';

function getPointerRotateDeg(edge: Edge) {
  switch (edge) {
    case 'bottom':
      return '0deg';
    case 'left':
      return '90deg';
    case 'top':
      return '180deg';
    case 'right':
      return '270deg';
  }
}

function getPointerOffsetField(edge: Edge, side: Side) {
  switch (edge) {
    case 'left':
    case 'right':
      return side === 'start' ? 'top' : 'bottom';
    case 'top':
    case 'bottom':
      return side === 'start' ? 'left' : 'right';
  }
}

function getPointerPositionValue(edge: Edge) {
  switch (edge) {
    case 'left':
    case 'right':
      return -16;
    case 'top':
    case 'bottom':
      return -9;
  }
}

export function getPointerStyles(pointer: PointerType) {
  const pointerStyles: StyleProp<ViewStyle> = {};
  pointerStyles[pointer.edge] = getPointerPositionValue(pointer.edge);
  pointerStyles.transform = [{rotate: getPointerRotateDeg(pointer.edge)}];
  if (pointer.offset) {
    pointerStyles[getPointerOffsetField(pointer.edge, pointer.offset.side)] =
      pointer.offset.value;
  }
  return pointerStyles;
}
