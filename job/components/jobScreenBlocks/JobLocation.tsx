import React, {useCallback} from 'react';
import {isUnclaimed} from '../../../../utils/workOrderUtils/workOrder';
import Lato from '../../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import MapIcon from '../../../../assets/icons/MapIcon';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {layoutColors} from '../../../../constants/colors';
import InfoBlock from '../InfoBlock';
import {IPopulatedWorkOrder} from '../../../../types/work-order';
import {showLocation} from 'react-native-map-link';
import {getLocationString} from '../../../../utils/workOrderUtils/getLocationString';

const styles = StyleSheet.create({
  bottomMargin27: {marginBottom: 27},
  bottomMargin10: {marginBottom: 10},
  topMargin6: {marginTop: 6},
  link: {
    paddingVertical: 6,
    marginTop: 4,
  },
  linkText: {textDecorationLine: 'underline'},
});

type Props = {
  job: IPopulatedWorkOrder;
  withShowButton?: boolean;
};

export default function JobLocation(props: Props) {
  const {job, withShowButton = true} = props;

  const showLocationOnMap = useCallback(() => {
    showLocation({
      latitude: job.location.lat,
      longitude: job.location.lng,
      title: getLocationString(job),
    });
  }, [job]);

  return (
    <InfoBlock
      containerStyle={[
        isUnclaimed(job) ? styles.bottomMargin10 : styles.bottomMargin27,
      ]}
      Title={
        <Lato
          fontDimensions={FontDimensions.BODY1}
          fontWeight={FontWeights.BOLD}>
          Location
        </Lato>
      }
      Icon={<MapIcon />}
      iconSize={26}>
      <Lato
        testID={'jobLocationText'}
        style={styles.topMargin6}
        fontDimensions={FontDimensions.BODY1}>
        {getLocationString(job)}
      </Lato>
      {withShowButton && (
        <TouchableOpacity style={styles.link}>
          <Lato
            onPress={showLocationOnMap}
            fontDimensions={FontDimensions.LINK}
            color={layoutColors.green100}
            style={styles.linkText}>
            Show on map
          </Lato>
        </TouchableOpacity>
      )}
    </InfoBlock>
  );
}
