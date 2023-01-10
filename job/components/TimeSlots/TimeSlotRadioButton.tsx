import React, {Dispatch, SetStateAction, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getDateString, getTime} from '../../../../utils/utils';
import BackgroundColor from '../../../../components/BackgroundColor';
import {layoutColors} from '../../../../constants/colors';
import {RadioGroupDisplayTypes, RadioTimeSlot} from './types';
import {TimeSlot} from '../../../../types/work-order';

const styles = StyleSheet.create({
  slot: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 41,
    borderWidth: 1,
    borderColor: layoutColors.pampas,
    borderRadius: 6,
    backgroundColor: layoutColors.white,
    marginRight: 10,
  },
  gridSlot: {
    marginBottom: 20,
    paddingRight: 15,
  },
  selectedSlot: {
    borderColor: layoutColors.soyaBean,
    backgroundColor: layoutColors.lightBeige,
  },
  notAvailableSlot: {
    opacity: 0.6,
  },
  date: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Lato-SemiBold',
    color: layoutColors.black100,
    marginBottom: 2,
  },
  timeFrame: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Lato-Regular',
    color: layoutColors.boulder,
    marginBottom: 12,
  },
  isAvailableContainer: {
    flexDirection: 'row',
    flexShrink: 1,
    flexGrow: 0,
  },
  isAvailable: {
    paddingVertical: 1,
    paddingLeft: 6,
    paddingRight: 4,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  isAvailableText: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: 'Archivo-Bold',
    color: layoutColors.deep100,
    letterSpacing: 1,
  },
  notAvailableText: {color: layoutColors.red2},
  isAvailablePoint: {
    marginLeft: 6,
    height: 9,
    aspectRatio: 1,
    borderRadius: 9,
    backgroundColor: layoutColors.atlantis,
  },
  notAvailablePoint: {backgroundColor: layoutColors.fuzzyWuzzyBrown},
  radio: {
    position: 'absolute',
    top: 6,
    right: 6,
    height: 23,
    aspectRatio: 1,
    borderRadius: 23,
    backgroundColor: layoutColors.white,
    padding: 2,
    overflow: 'hidden',
  },
  radioTick: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: layoutColors.white,
  },
});

type Props = {
  readonly?: boolean;
  timeSlot: RadioTimeSlot;
  selectedTimeSlot?: TimeSlot | undefined;
  setSelectedTimeSlot?: Dispatch<SetStateAction<TimeSlot | undefined>>;
  display?: RadioGroupDisplayTypes;
  containerWidth?: number;
};

export default function TimeSlotRadioButton(props: Props) {
  const {
    readonly = false,
    timeSlot,
    selectedTimeSlot,
    setSelectedTimeSlot,
    display = RadioGroupDisplayTypes.ROW,
    containerWidth = 0,
  } = props;

  const isSelected = useMemo(
    () =>
      selectedTimeSlot
        ? selectedTimeSlot.startDate === timeSlot.startDate &&
          selectedTimeSlot.endDate === timeSlot.endDate
        : false,
    [timeSlot, selectedTimeSlot],
  );

  const startDate = new Date(timeSlot.startDate);
  const endDate = new Date(timeSlot.endDate);

  const onPress =
    !readonly && setSelectedTimeSlot
      ? () => setSelectedTimeSlot(timeSlot)
      : undefined;

  const marginRight = 15;
  const gridSlotStyles = {
    width: containerWidth! * 0.5 - marginRight,
    marginRight,
    ...styles.gridSlot,
  };

  function renderContent() {
    return (
      <>
        <Text style={[styles.date]}>
          {getDateString(startDate, 'MONTH_DATE_YEAR')}
        </Text>
        <Text style={[styles.timeFrame]}>
          {`${getTime(startDate)} - ${getTime(endDate)}`}
        </Text>
        <View style={styles.isAvailableContainer}>
          <View style={styles.isAvailable}>
            <BackgroundColor
              color={
                timeSlot.isAvailable
                  ? layoutColors.riceFlower
                  : layoutColors.fuzzyWuzzyBrown
              }
              opacity={timeSlot.isAvailable ? 1 : 0.1}
            />
            <Text
              testID={'timeSlotAvailabilityStatus'}
              style={[
                styles.isAvailableText,
                !timeSlot.isAvailable && styles.notAvailableText,
              ]}>
              {`${!timeSlot.isAvailable ? 'NOT ' : ''}AVAILABLE`}
            </Text>
            <View
              style={[
                styles.isAvailablePoint,
                !timeSlot.isAvailable && styles.notAvailablePoint,
              ]}
            />
          </View>
        </View>
      </>
    );
  }

  if (!timeSlot.isAvailable || readonly || isSelected) {
    return (
      <View
        testID={'timeSlotCard'}
        style={[
          styles.slot,
          isSelected && styles.selectedSlot,
          !timeSlot.isAvailable && styles.notAvailableSlot,
          display === RadioGroupDisplayTypes.GRID && gridSlotStyles,
        ]}>
        {renderContent()}
      </View>
    );
  }
  return (
    <TouchableOpacity
      testID={'timeSlotCard'}
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.slot,
        display === RadioGroupDisplayTypes.GRID && gridSlotStyles,
      ]}>
      {renderContent()}
    </TouchableOpacity>
  );
}
