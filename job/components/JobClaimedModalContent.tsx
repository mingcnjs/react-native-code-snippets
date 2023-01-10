import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  WHITE_TO_TRANSPARENT_GRADIENT,
  WRENO_GRADIENT,
} from '../../../constants/colors';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {format} from 'date-fns';
import {getLocationString} from '../../../utils/workOrderUtils/getLocationString';
import {IPopulatedWorkOrder, TimeSlot} from '../../../types/work-order';
import Archivo from '../../../components/labels/Archivo';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import Lato from '../../../components/labels/Lato';
import CloseIcon from '../../../assets/icons/CloseIcon';
import IconButton from '../../../components/buttons/IconButton';
import testId from '../../../constants/testId';
import WhatsNextContent from './WhatsNextContent';
import ScheduleIcon from '../../../assets/icons/ScheduleIcon';
import MapIcon from '../../../assets/icons/MapIcon';
import isJobVirtual from '../../../utils/workOrderUtils/isJobVirtual';
import VirtualJobLocation from './jobScreenBlocks/VirtualJobLocation';

const jobClaimedImage = require('../../../assets/images/jobClaimedImage.png');

const styles = StyleSheet.create({
  gradient1: {
    flex: 1,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
  },
  gradient2: {flex: 1},
  scrollView: {flexGrow: 1},
  content: {
    paddingHorizontal: 24,
    paddingTop: 93,
    paddingBottom: 50,
  },
  imageStyle: {width: 75},
  bottomMargin15: {marginBottom: 30},
  flexRow: {flexDirection: 'column'},
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  icon: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 17,
    marginTop: 3,
  },
  block: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  location: {
    width: 250,
  },
});

type Props = {
  job: IPopulatedWorkOrder;
  selectedTimeSlot: TimeSlot | undefined;
  onPressCloseButton: () => void;
};

export default function JobClaimedModalContent(props: Props) {
  const {job, selectedTimeSlot, onPressCloseButton} = props;

  return (
    <LinearGradient style={styles.gradient1} {...WRENO_GRADIENT}>
      <LinearGradient
        style={styles.gradient2}
        {...WHITE_TO_TRANSPARENT_GRADIENT}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.content}>
          <Image
            source={jobClaimedImage}
            style={styles.imageStyle}
            resizeMode={'contain'}
          />

          <Archivo
            fontDimensions={FontDimensions.LARGE_TITLE}
            fontWeight={FontWeights.MEDIUM}
            style={styles.bottomMargin15}>
            Job Claimed!
          </Archivo>

          {selectedTimeSlot && (
            <View style={styles.block}>
              <View style={styles.icon}>
                <ScheduleIcon />
              </View>
              <View style={styles.flexRow}>
                <Lato fontDimensions={FontDimensions.BODY1}>
                  {format(new Date(selectedTimeSlot.startDate), 'MMM d, y')}{' '}
                </Lato>
                <Lato fontDimensions={FontDimensions.BODY1}>
                  {format(new Date(selectedTimeSlot.startDate), 'h:mm aa')} -{' '}
                  {format(new Date(selectedTimeSlot.endDate), 'h:mm aa')}
                </Lato>
              </View>
            </View>
          )}

          {isJobVirtual(job) ? (
            <VirtualJobLocation />
          ) : (
            <View style={[styles.block, styles.bottomMargin15]}>
              <View style={styles.icon}>
                <MapIcon />
              </View>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                style={styles.location}>
                {getLocationString(job)}.
              </Lato>
            </View>
          )}

          <WhatsNextContent step={0} job={job} />
        </ScrollView>
        <IconButton
          testID={testId.closeJobClaimedModalButton}
          style={styles.closeButton}
          onPress={onPressCloseButton}>
          <CloseIcon />
        </IconButton>
      </LinearGradient>
    </LinearGradient>
  );
}
