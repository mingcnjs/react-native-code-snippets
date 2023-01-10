import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Card from '../../../components/Card';
import {layoutColors, WRENO_GRADIENT} from '../../../constants/colors';
import JobStatus from '../../../components/JobStatus';
import {IPopulatedWorkOrder} from '../../../types/work-order';
import {getLocationString} from '../../../utils/workOrderUtils/getLocationString';
import {format, isSameDay} from 'date-fns';
import {MONTH} from '../../../constants/constants';
import Lato from '../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import Archivo from '../../../components/labels/Archivo';
import JobPaymentDetails from '../../../components/JobPaymentDetails';

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginHorizontal: 15,
    padding: 0,
    paddingTop: 13,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 13,
    backgroundColor: layoutColors.white,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradient: {
    borderRadius: 40,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  boxShadow: {
    shadowOffset: {height: 5, width: 5},
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowColor: '#53805F',
    elevation: 4,
  },

  row: {flexDirection: 'row'},
  rightMargin4: {marginRight: 4},
  bottomMargin5: {marginBottom: 5},
  bottomMargin20: {marginBottom: 20},
  spacingLetter1: {letterSpacing: 1},
});

type Props = {
  workOrder: IPopulatedWorkOrder;
  selectedDate?: Date;
  onPressCard?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  isNew?: boolean;
};

export default function JobCard(props: Props) {
  const {workOrder, selectedDate, onPressCard, containerStyle, isNew} = props;

  const timeSlot = selectedDate
    ? workOrder.availableTimeSlots.find(t =>
        isSameDay(new Date(t.startDate), selectedDate),
      )!
    : workOrder.startTime && workOrder.endTime
    ? {startDate: workOrder.startTime, endDate: workOrder.endTime}
    : workOrder.acceptedTimeSlot
    ? workOrder.acceptedTimeSlot
    : workOrder.availableTimeSlots[0];

  const startDate = new Date(timeSlot.startDate);

  const month = MONTH[startDate.getMonth()].slice(0, 3);
  const startTime = format(startDate, 'h:mm aa');
  const endTime = format(new Date(timeSlot.endDate), 'h:mm aa');

  return (
    <Card
      testID={'availableJobCard'}
      button
      style={[styles.card, containerStyle]}
      onPress={onPressCard}>
      <View style={styles.cardHeader}>
        <View style={styles.row}>
          <Lato
            fontDimensions={FontDimensions.CAPTION1}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.deep100}
            style={styles.rightMargin4}>
            {`${month} ${startDate.getDate()}`}
          </Lato>
          <Archivo
            fontDimensions={FontDimensions.CALLOUT2}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.deep100}
            style={styles.rightMargin4}>
            •
          </Archivo>
          <Lato
            fontDimensions={FontDimensions.CAPTION1}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.deep100}>
            {`${startTime} - ${endTime}`}
          </Lato>
        </View>
        <JobStatus status={workOrder.status} />
      </View>
      <Archivo
        fontDimensions={FontDimensions.HEADLINE}
        style={styles.bottomMargin5}
        color={layoutColors.black}>
        {workOrder.title}
      </Archivo>
      <Lato
        fontDimensions={FontDimensions.CAPTION1}
        color={layoutColors.boulder}
        style={styles.bottomMargin20}>
        {getLocationString(workOrder)}
      </Lato>
      {isNew ? (
        <View style={styles.cardFooter}>
          <Archivo
            fontDimensions={FontDimensions.CALLOUT1}
            fontWeight={FontWeights.BOLD}
            style={styles.spacingLetter1}>
            <JobPaymentDetails paymentDetails={workOrder.paymentDetails} />
          </Archivo>
          <View style={styles.boxShadow}>
            <LinearGradient style={styles.gradient} {...WRENO_GRADIENT}>
              <Lato
                fontDimensions={FontDimensions.CAPTION1}
                color={layoutColors.black100}>
                New
              </Lato>
            </LinearGradient>
          </View>
        </View>
      ) : (
        <Archivo
          fontDimensions={FontDimensions.CALLOUT1}
          fontWeight={FontWeights.BOLD}
          style={styles.spacingLetter1}>
          <JobPaymentDetails paymentDetails={workOrder.paymentDetails} />
        </Archivo>
      )}
    </Card>
  );
}
