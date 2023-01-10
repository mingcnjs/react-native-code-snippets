import Svg, {Path} from 'react-native-svg';
import React from 'react';

export default function CalloutPointer() {
  return (
    <Svg width={24} height={10} viewBox="0 0 24 10" fill="none">
      <Path d="M0 0l10.89 9.65a1.933 1.933 0 002.22 0L24 0H0z" fill="#28733C" />
    </Svg>
  );
}
