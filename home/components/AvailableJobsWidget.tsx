import React, {useMemo, useState} from 'react';
import Widget from '../../../components/Widget';
import {getCurrentWeek, getTodayDate} from '../../../utils/utils';
import {useGetUnclaimedWorkOrdersQuery} from '../../../services/endpoints/workOrders';
import HorizontalRowCalendar from '../../../components/HorizontalRowCalendar/HorizontalRowCalendar';
import {IWeek} from '../../../components/HorizontalRowCalendar/types';
import {compareAsc, isSameDay} from 'date-fns';
import AvailableJobsList from './AvailableJobsList';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {layoutColors} from '../../../constants/colors';
import BackgroundColor from '../../../components/BackgroundColor';
import {MONTH} from '../../../constants/constants';
import useHomeStackNavigation from '../../../hooks/useHomeStackNavigation';
import {
  getDaysWithAvailableJobs,
  getMajorMonth,
} from '../../../utils/availableJobsWidget';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    backgroundColor: layoutColors.lightBeige,
  },
  month: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 4,
    paddingHorizontal: 7,
    borderRadius: 4,
    backgroundColor: layoutColors.green10,
  },
  monthText: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: 'Archivo-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: layoutColors.black100,
  },
  loading: {
    alignItems: 'center',
    paddingTop: 80,
  },
});

export default function AvailableJobsWidget() {
  const navigation = useHomeStackNavigation();
  const today = getTodayDate();

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentWeek, setCurrentWeek] = useState<IWeek>(getCurrentWeek());

  const {
    data: availableJobs,
    isLoading,
    isFetching,
  } = useGetUnclaimedWorkOrdersQuery();

  const availableJobsByDate = useMemo(() => {
    if (compareAsc(getTodayDate(), selectedDate) > 0) {
      return [];
    }
    if (availableJobs) {
      return availableJobs.filter(availableJob =>
        availableJob.availableTimeSlots.some(timeSlot =>
          isSameDay(new Date(timeSlot.startDate), selectedDate),
        ),
      );
    }
    return undefined;
  }, [availableJobs, selectedDate]);

  const markedDays = useMemo(
    () => getDaysWithAvailableJobs(availableJobs, currentWeek),
    [availableJobs, currentWeek],
  );

  const month = useMemo(() => {
    return getMajorMonth(selectedDate);
  }, [selectedDate]);

  return (
    <Widget title={'Available Jobs'} style={[styles.container]}>
      <View style={styles.month}>
        <Text style={styles.monthText}>{MONTH[month]}</Text>
      </View>
      <HorizontalRowCalendar
        selectedDate={selectedDate}
        markedDays={markedDays}
        onChangeWeek={week => {
          setCurrentWeek(week);
          setSelectedDate(
            week.weekId === 0 ? today : new Date(week.startOfWeek),
          );
        }}
        onPressDay={date => setSelectedDate(date)}
      />
      <View>
        <AvailableJobsList
          availableJobsByDate={availableJobsByDate}
          selectedDate={selectedDate}
          onPressAvailableJob={workOrderId =>
            navigation.navigate('JobNavigator', {workOrderId})
          }
        />
        {(isLoading || isFetching) && (
          <View style={[StyleSheet.absoluteFill, styles.loading]}>
            <BackgroundColor color={layoutColors.lightBeige} opacity={0.7} />
            <ActivityIndicator color={layoutColors.black100} />
          </View>
        )}
      </View>
    </Widget>
  );
}
