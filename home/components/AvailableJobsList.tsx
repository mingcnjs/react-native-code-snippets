import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import JobCard from './JobCard';
import {layoutColors} from '../../../constants/colors';
import {IPopulatedWorkOrder} from '../../../types/work-order';
import {compareAsc} from 'date-fns';
import {getTodayDate} from '../../../utils/utils';

const styles = StyleSheet.create({
  availableShifts: {
    paddingTop: 20,
  },
  emptyListItem: {
    paddingTop: 65,
    paddingBottom: 65,
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Archivo-Regular',
    color: layoutColors.doveGray,
  },
});

type Props = {
  availableJobsByDate: IPopulatedWorkOrder[] | undefined;
  onPressAvailableJob?: (id: number) => void;
  selectedDate: Date;
};

const AvailableJobsList = React.memo((props: Props) => {
  const {availableJobsByDate = [], onPressAvailableJob, selectedDate} = props;

  if (availableJobsByDate.length > 0) {
    return (
      <View style={styles.availableShifts}>
        {availableJobsByDate.map(availableJob => (
          <JobCard
            key={availableJob.id}
            workOrder={availableJob}
            selectedDate={selectedDate}
            onPressCard={() => {
              if (onPressAvailableJob) {
                onPressAvailableJob(availableJob.id);
              }
            }}
          />
        ))}
      </View>
    );
  }

  const isPastDay = compareAsc(getTodayDate(), selectedDate) > 0;

  if (isPastDay) {
    return (
      <View style={styles.availableShifts}>
        <View style={styles.emptyListItem}>
          <Text style={styles.emptyListText}>This date is in the past.</Text>
          <Text style={styles.emptyListText}>
            You didn’t take any job on this date.
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.availableShifts}>
      <View style={styles.emptyListItem}>
        <Text style={styles.emptyListText}>There are no available jobs</Text>
      </View>
    </View>
  );
});

export default AvailableJobsList;
