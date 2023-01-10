import React from 'react';
import InfoBlock from '../InfoBlock';
import Lato from '../../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import MapIcon from '../../../../assets/icons/MapIcon';

export default function VirtualJobLocation() {
  return (
    <InfoBlock
      Title={
        <Lato fontDimensions={FontDimensions.BODY1}>
          This is a virtual assessment.{' '}
          <Lato
            fontDimensions={FontDimensions.BODY1}
            fontWeight={FontWeights.BOLD}>
            No on-site visit required.
          </Lato>
        </Lato>
      }
      Icon={<MapIcon />}
      iconSize={26}
    />
  );
}
