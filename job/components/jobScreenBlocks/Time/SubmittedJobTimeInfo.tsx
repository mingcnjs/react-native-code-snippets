import React from 'react';
import {IPopulatedWorkOrder} from '../../../../../types/work-order';
import InfoBlock from '../../InfoBlock';
import Lato from '../../../../../components/labels/Lato';
import AlarmIcon from '../../../../../assets/icons/AlarmIcon';
import {
  FontDimensions,
  FontWeights,
} from '../../../../../components/labels/CustomText/types';
import {StyleSheet} from 'react-native';
import {getDateString} from '../../../../../utils/utils';
import {formatHoursMinutes} from '../../../../../utils/workOrderUtils/workOrder';

const styles = StyleSheet.create({
  bottomMargin6: {marginBottom: 6},
  bottomMargin10: {marginBottom: 10},
});

type Props = {
  job: IPopulatedWorkOrder;
};

export default function SubmittedJobTimeInfo(props: Props) {
  const {job} = props;

  const startDate = new Date(job.startTime!);
  const endDate = new Date(job.endTime!);

  const startTime = getDateString(startDate, 'HOUR_MINUTE_AMPM');
  const startDateString = getDateString(startDate, 'MONTH_SHORT_DATE_YEAR');

  const endTime = getDateString(endDate, 'HOUR_MINUTE_AMPM');
  const endDateString = getDateString(endDate, 'MONTH_SHORT_DATE_YEAR');

  return (
    <>
      <InfoBlock
        Icon={<AlarmIcon />}
        Title={
          <Lato
            fontDimensions={FontDimensions.BODY1}
            fontWeight={FontWeights.BOLD}
            style={styles.bottomMargin6}>
            Started time
          </Lato>
        }>
        <Lato
          fontDimensions={FontDimensions.BODY1}
          style={styles.bottomMargin10}>
          {`${startTime},  ${startDateString}`}
        </Lato>

        {job?.endTime && (
          <>
            <Lato
              fontDimensions={FontDimensions.BODY1}
              fontWeight={FontWeights.BOLD}
              style={styles.bottomMargin6}>
              Ended time
            </Lato>

            <Lato fontDimensions={FontDimensions.BODY1}>
              {`${endTime},  ${endDateString}`}
            </Lato>
          </>
        )}
      </InfoBlock>

      {typeof job?.workHours === 'number' && (
        <InfoBlock
          Title={
            <Lato
              fontDimensions={FontDimensions.BODY1}
              fontWeight={FontWeights.BOLD}
              style={styles.bottomMargin6}>
              Total work hours
            </Lato>
          }
          Icon={<AlarmIcon />}>
          <Lato fontDimensions={FontDimensions.BODY1}>
            {formatHoursMinutes(job!.workHours! * 60)}
          </Lato>
        </InfoBlock>
      )}
    </>
  );
}
