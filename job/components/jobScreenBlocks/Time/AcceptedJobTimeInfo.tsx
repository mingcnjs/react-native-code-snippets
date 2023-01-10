import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import InfoBlock from '../../InfoBlock';
import CalendarMonthIcon from '../../../../../assets/icons/CalendarMonthIcon';
import {IPopulatedWorkOrder} from '../../../../../types/work-order';
import {format, isSameDay} from 'date-fns';
import AlarmIcon from '../../../../../assets/icons/AlarmIcon';
import Lato from '../../../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../../../components/labels/CustomText/types';

const styles = StyleSheet.create({
  block: {marginBottom: 25},
  textStyle: {lineHeight: 20},
  topMargin5: {marginTop: 5},
});

const TIME = 'h:mm aa';
const DATE = `MMM d, y ${TIME}`;

type Props = {job: IPopulatedWorkOrder};

export default function AcceptedJobTimeInfo(props: Props) {
  const {job} = props;

  const [timeSlot, workHours] = useMemo(() => {
    if (job.acceptedTimeSlot) {
      const startDate = new Date(job.acceptedTimeSlot.startDate);
      const endDate = new Date(job.acceptedTimeSlot.endDate);

      const start = format(startDate, DATE);
      const end = format(endDate, isSameDay(startDate, endDate) ? TIME : DATE);

      const timeSlotString = `${start} - ${end}`;

      const workHoursString = `within ${job.estimatedWorkHours} hours`;

      return [timeSlotString, workHoursString];
    }
    return ['', ''];
  }, [job]);

  return (
    <>
      {Boolean(timeSlot) && (
        <InfoBlock
          containerStyle={styles.block}
          Title={
            <Lato
              fontDimensions={FontDimensions.BODY1}
              fontWeight={FontWeights.BOLD}>
              Working Time Slot
            </Lato>
          }
          textStyle={styles.textStyle}
          Icon={<CalendarMonthIcon />}
          iconSize={26}>
          <Lato fontDimensions={FontDimensions.BODY1} style={styles.topMargin5}>
            {timeSlot}
          </Lato>
        </InfoBlock>
      )}
      {Boolean(workHours) && (
        <InfoBlock
          Title={
            <Lato
              fontDimensions={FontDimensions.BODY1}
              fontWeight={FontWeights.BOLD}>
              Estimated work hours
            </Lato>
          }
          textStyle={styles.textStyle}
          Icon={<AlarmIcon />}
          iconSize={26}>
          <Lato fontDimensions={FontDimensions.BODY1} style={styles.topMargin5}>
            {workHours}
          </Lato>
        </InfoBlock>
      )}
    </>
  );
}
