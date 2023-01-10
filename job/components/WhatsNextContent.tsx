import React from 'react';
import {View, StyleSheet} from 'react-native';
import CheckmarkIcon from '../../../assets/icons/CheckmarkIcon';
import StepperIcon from '../../../assets/icons/StepperIcon';
import Archivo from '../../../components/labels/Archivo';
import {FontDimensions} from '../../../components/labels/CustomText/types';
import Lato from '../../../components/labels/Lato';
import {layoutColors} from '../../../constants/colors';
import isJobVirtual from '../../../utils/workOrderUtils/isJobVirtual';
import {IPopulatedWorkOrder} from '../../../types/work-order';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: layoutColors.black10,
    borderRadius: 6,
    backgroundColor: layoutColors.white,
  },
  content: {flexDirection: 'row'},
  icons: {width: 24, alignItems: 'center', marginTop: 10},
  marginTop15: {
    marginTop: 15,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 19 / 2,
    backgroundColor: layoutColors.green100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  round: {
    width: 19,
    height: 19,
    borderRadius: 19 / 2,
    borderWidth: 1,
    borderColor: layoutColors.green40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {width: 231, marginLeft: 20},
});

type Props = {
  step: number;
  job: IPopulatedWorkOrder;
};

const steps = [
  'You can revisit details about this job just accepted in “My Jobs” section.',
  'Once your job date comes closer we will send you a reminder to get to the property.',
  'Once at the property, we prompt you to clock into your job and take before photos.',
  'We will guide you through our form that you will have to fill out after you finished your job.',
];

const stepsVA = [
  'You can revisit details about this virtual assessment in the “My Jobs” section.',
  'You can start assessing right away. Simply clock in and fill out the form.',
  'Once you have submitted your form, we will review it and get back to you as soon as possible.',
];

const WhatsNextContent = ({step, job}: Props) => {
  const data = isJobVirtual(job) ? stepsVA : steps;

  return (
    <View style={styles.container}>
      <Archivo fontDimensions={FontDimensions.TITLE2}>What's Next?</Archivo>
      <View style={styles.marginTop15}>
        {data.map((item, index, array) => (
          <View key={item + index} style={styles.content}>
            <View style={styles.icons}>
              {index <= step ? (
                <View style={styles.checkbox}>
                  <CheckmarkIcon color={layoutColors.white} />
                </View>
              ) : (
                <View style={styles.round} />
              )}
              {index !== array.length - 1 && (
                <View style={styles.marginTop15}>
                  <StepperIcon />
                </View>
              )}
            </View>
            <View style={styles.label}>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                color={layoutColors.black80}>
                {item}
              </Lato>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WhatsNextContent;
