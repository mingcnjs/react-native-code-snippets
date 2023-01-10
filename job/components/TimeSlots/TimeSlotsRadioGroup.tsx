import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {TimeSlot} from '../../../../types/work-order';
import {isActualTimeSlot} from '../../../../utils/workOrderUtils/workOrder';
import TimeSlotRadioButton from './TimeSlotRadioButton';
import {RadioGroupDisplayTypes, RadioTimeSlot} from './types';

const styles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
});

type Props = {
  selected?: TimeSlot | undefined;
  setSelected?: Dispatch<SetStateAction<TimeSlot | undefined>>;
  timeSlots: TimeSlot[];
  readonly?: boolean;
  display?: RadioGroupDisplayTypes;
};

export default function TimeSlotsRadioGroup(props: Props) {
  const {
    timeSlots,
    setSelected,
    selected,
    readonly = false,
    display = RadioGroupDisplayTypes.ROW,
  } = props;

  const [gridContainerWidth, setGridContainerWidth] = useState(0);

  const data: RadioTimeSlot[] = useMemo(
    () =>
      timeSlots.map(timeSlot => ({
        ...timeSlot,
        isAvailable: isActualTimeSlot(timeSlot),
      })),
    [timeSlots],
  );

  if (display === RadioGroupDisplayTypes.ROW) {
    return (
      <FlatList
        horizontal
        contentContainerStyle={styles.contentContainer}
        data={data}
        renderItem={({item}) => {
          return (
            <TimeSlotRadioButton
              readonly={readonly}
              timeSlot={item}
              selectedTimeSlot={selected}
              setSelectedTimeSlot={setSelected}
            />
          );
        }}
        keyExtractor={item => item.startDate + item.endDate}
      />
    );
  }
  return (
    <View
      style={styles.gridContainer}
      onLayout={event => {
        setGridContainerWidth(event.nativeEvent.layout.width);
      }}>
      {data.map(timeSlot => {
        return (
          <TimeSlotRadioButton
            key={timeSlot.startDate + timeSlot.endDate}
            timeSlot={timeSlot}
            readonly={readonly}
            selectedTimeSlot={selected}
            setSelectedTimeSlot={setSelected}
            display={display}
            containerWidth={gridContainerWidth}
          />
        );
      })}
    </View>
  );
}
