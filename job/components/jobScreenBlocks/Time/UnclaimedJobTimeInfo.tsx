import {compareAsc, format} from 'date-fns';
import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {IPopulatedWorkOrder, TimeSlot} from '../../../../../types/work-order';
import InfoBlock from '../../InfoBlock';
import MapIcon from '../../../../../assets/icons/MapIcon';
import Lato from '../../../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../../../components/labels/CustomText/types';
import {layoutColors} from '../../../../../constants/colors';
import {RadioTimeSlot} from '../../TimeSlots/types';
import {isActualTimeSlot} from '../../../../../utils/workOrderUtils/workOrder';
import CheckmarkCircleIcon from '../../../../../assets/icons/CheckmarkCircleIcon';
import CancelIcon from '../../../../../assets/icons/CancelIcon';

const styles = StyleSheet.create({
  timeSlot: {flexDirection: 'row', alignItems: 'center'},
  bottomMargin10: {marginBottom: 10},
  bottomMargin0: {marginBottom: 0},
  rightMargin12: {marginRight: 12},
});

type Props = {
  timeSlots: TimeSlot[];
  job: IPopulatedWorkOrder;
};

export default function UnclaimedJobTimeInfo(props: Props) {
  const {timeSlots, job} = props;

  const sortedTimeSlots = useMemo(() => {
    const today = new Date();
    const beforeToday = timeSlots
      ?.filter(t => compareAsc(new Date(t.startDate), today) < 0)
      .sort((a, b) => compareAsc(new Date(b.startDate), new Date(a.startDate)));
    const afterToday = timeSlots
      ?.filter(t => compareAsc(new Date(t.startDate), today) >= 0)
      .sort((a, b) => compareAsc(new Date(a.startDate), new Date(b.startDate)));
    return [...afterToday, ...beforeToday];
  }, [timeSlots]);

  const data: RadioTimeSlot[] = useMemo(
    () =>
      sortedTimeSlots.map(timeSlot => ({
        ...timeSlot,
        isAvailable: isActualTimeSlot(timeSlot),
      })),
    [sortedTimeSlots],
  );

  return (
    <View testID={'unclaimedJobTimeSlots'}>
      <InfoBlock
        Icon={<MapIcon />}
        Title={
          <Lato
            fontDimensions={FontDimensions.BODY1}
            fontWeight={FontWeights.BOLD}
            style={styles.bottomMargin10}>
            Estimated work hours
          </Lato>
        }>
        <Lato
          fontDimensions={FontDimensions.BODY1}
          color={layoutColors.black80}>
          {`within ${job.estimatedWorkHours} hours`}
        </Lato>
      </InfoBlock>
      <InfoBlock
        Icon={<MapIcon />}
        containerStyle={styles.bottomMargin0}
        Title={
          <Lato
            fontDimensions={FontDimensions.BODY1}
            fontWeight={FontWeights.BOLD}
            style={styles.bottomMargin10}>
            Available time slots
          </Lato>
        }>
        <>
          {data.map((timeSlot, index, array) => (
            <View
              key={timeSlot.id}
              style={[
                styles.timeSlot,
                index !== array.length - 1 && styles.bottomMargin10,
              ]}>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                fontWeight={
                  timeSlot.isAvailable ? FontWeights.BOLD : FontWeights.REGULAR
                }
                color={
                  timeSlot.isAvailable
                    ? layoutColors.black80
                    : layoutColors.black40
                }
                style={styles.rightMargin12}>
                {`${format(
                  new Date(timeSlot.startDate),
                  'MMM d, h:mmaa',
                )} - ${format(new Date(timeSlot.endDate), 'h:mmaa')}`}
              </Lato>
              {timeSlot.isAvailable ? <CheckmarkCircleIcon /> : <CancelIcon />}
            </View>
          ))}
        </>
      </InfoBlock>
    </View>
  );
}
