import React, {FC} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import Archivo from '../../../../components/labels/Archivo';
import {FontDimensions} from '../../../../components/labels/CustomText/types';

type Props = {
  style?: StyleProp<TextStyle>;
  marginBottom?: number;
};

const PartTitle: FC<Props> = props => {
  const {children, marginBottom = 11, style} = props;

  return (
    <Archivo
      fontDimensions={FontDimensions.TITLE2}
      style={[{marginBottom}, style]}>
      {children}
    </Archivo>
  );
};

export default PartTitle;
