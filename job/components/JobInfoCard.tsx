import React from 'react';
import InfoBlock from './InfoBlock';
import {StyleSheet, View} from 'react-native';
import BackgroundColor from '../../../components/BackgroundColor';
import {layoutColors} from '../../../constants/colors';
import WorkOrderIcon from '../../../assets/icons/WorkOrderIcon';
import Lato from '../../../components/labels/Lato';
import {FontDimensions} from '../../../components/labels/CustomText/types';
import JobPaymentDetails from '../../../components/JobPaymentDetails';
import {IPopulatedWorkOrder} from '../../../types/work-order';

const styles = StyleSheet.create({
  jobIcon: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  jobTitle: {
    marginBottom: 2,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Lato-SemiBold',
    color: layoutColors.black100,
  },
  bottomMargin2: {marginBottom: 2},
});

type Props = {
  job: IPopulatedWorkOrder;
};

export default function JobInfoCard(props: Props) {
  const {job} = props;

  return (
    <InfoBlock
      title={job.title}
      Icon={
        <View style={styles.jobIcon}>
          <BackgroundColor color={layoutColors.green100} opacity={0.1} />
          <WorkOrderIcon />
        </View>
      }
      contentTopOffset={false}
      border
      textStyle={styles.jobTitle}>
      {Boolean(job.formInstances?.length) && (
        <Lato
          fontDimensions={FontDimensions.CAPTION1}
          color={layoutColors.boulder}
          style={styles.bottomMargin2}>
          {job.formInstances.map(instance => instance.form.title).join(', ')}
        </Lato>
      )}
      <JobPaymentDetails paymentDetails={job.paymentDetails} />
    </InfoBlock>
  );
}
