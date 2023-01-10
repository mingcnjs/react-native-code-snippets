import React from 'react';
import Part from '../Part/Part';
import PartTitle from '../Part/PartTitle';
import Lato from '../../../../components/labels/Lato';
import {FontDimensions} from '../../../../components/labels/CustomText/types';
import {layoutColors} from '../../../../constants/colors';
import {StyleSheet} from 'react-native';
import {
  IPopulatedWorkOrder,
  IWorkOrderStatus,
} from '../../../../types/work-order';
import FormButton from '../../../shiftInProgress/components/jobTasksComponents/CompleteWorkForm/FormButton';
import useHomeStackNavigation from '../../../../hooks/useHomeStackNavigation';

const styles = StyleSheet.create({
  formButton: {
    paddingVertical: 6,
    marginBottom: -6,
  },
  bottomMargin28: {marginBottom: 22},
  bottomMargin0: {marginBottom: 0},
});

interface Props {
  job: IPopulatedWorkOrder;
}

export default function JobForm({job}: Props) {
  const navigation = useHomeStackNavigation();

  if (job.formInstances && job.formInstances.length) {
    const jobIsSubmittedOrApproved =
      job.status === IWorkOrderStatus.SUBMITTED ||
      job.status === IWorkOrderStatus.APPROVED;

    const title = jobIsSubmittedOrApproved
      ? 'Review form'
      : 'Forms for this job';

    return (
      <Part line>
        <PartTitle>{title}</PartTitle>
        {!jobIsSubmittedOrApproved && (
          <Lato
            fontDimensions={FontDimensions.BODY1}
            color={layoutColors.boulder}
            style={styles.bottomMargin28}>
            Preview the forms you will have to fill out for this job.
          </Lato>
        )}

        {job.formInstances.map(form => (
          <FormButton
            key={form.id}
            preview={job.status !== IWorkOrderStatus.IN_PROGRESS}
            formInstance={form}
            onPress={() => {
              navigation.navigate('JobFormModalScreen', {
                workOrderId: job.id,
                formInstanceId: form.id,
                readonly: true,
              });
            }}
          />
        ))}
      </Part>
    );
  }
  return null;
}
