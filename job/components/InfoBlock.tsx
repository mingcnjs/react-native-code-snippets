import React, {FC, ReactElement} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {layoutColors} from '../../../constants/colors';
import Lato from '../../../components/labels/Lato';
import {FontDimensions} from '../../../components/labels/CustomText/types';

const LINE_HEIGHT = 20;
const ICON_HEIGHT = 32;

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  border: {
    padding: 15,
    borderColor: layoutColors.gallery,
    borderWidth: 1,
    borderRadius: 6,
  },
  icon: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

type Props = {
  Icon?: ReactElement;
  Title?: ReactElement;
  iconSize?: number;
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  contentTopOffset?: boolean;
  border?: boolean;
};

const InfoBlock: FC<Props> = props => {
  const {
    Icon,
    Title,
    title = '',
    iconSize,
    containerStyle,
    textStyle,
    children,
    contentTopOffset = true,
    border = false,
  } = props;

  // @ts-ignore
  const {lineHeight} = textStyle || {};

  const height = iconSize || ICON_HEIGHT;

  const marginTop =
    ((iconSize || ICON_HEIGHT) - (lineHeight || LINE_HEIGHT)) / 2;

  return (
    <View style={[styles.block, border && styles.border, containerStyle]}>
      {Boolean(Icon) && <View style={[styles.icon, {height}]}>{Icon}</View>}
      <View style={styles.content}>
        <View style={[contentTopOffset && {marginTop}]}>
          {Title || (
            <Lato fontDimensions={FontDimensions.BODY1} style={textStyle}>
              {title}
            </Lato>
          )}
        </View>
        {children}
      </View>
    </View>
  );
};

export default InfoBlock;
