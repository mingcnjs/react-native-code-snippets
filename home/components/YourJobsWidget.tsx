import React, {useCallback, useMemo} from 'react';
import {FlatList, Text, StyleSheet, View} from 'react-native';
import Widget from '../../../components/Widget';
import {layoutColors} from '../../../constants/colors';
import Loading from '../../../components/Loading';
import ClaimedJobCard from './ClaimedJobCard';
import {useGetUpcomingWorkOrdersQuery} from '../../../services/endpoints/workOrders';
import {IPopulatedWorkOrder, IWorkOrderStatus} from '../../../types/work-order';
import useHomeStackNavigation from '../../../hooks/useHomeStackNavigation';
import {sortByAcceptedTimeSlot} from '../../../utils/utils';
import detoxText from '../../../constants/detoxText';
import testId from '../../../constants/testId';

const styles = StyleSheet.create({
  yourJobsWidget: {
    paddingTop: 15,
    paddingBottom: 30,
    backgroundColor: layoutColors.white,
    shadowColor: `rgba(${layoutColors.black100RGB}, 0.05)`,
    shadowOpacity: 1,
    shadowRadius: 5,
    zIndex: 2,
    elevation: 9,
    minHeight: 270,
  },
  noUpcoming: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobs: {paddingLeft: 21, paddingTop: 10, overflow: 'visible'},
  loading: {backgroundColor: 'rgba(255,255,255,0.6)'},
});

export function useSortedWorkOrders(
  workOrders: IPopulatedWorkOrder[],
  sortBy: (a: IPopulatedWorkOrder, b: IPopulatedWorkOrder) => number,
) {
  return useMemo(() => workOrders.slice().sort(sortBy), [sortBy, workOrders]);
}

export default function YourJobsWidget() {
  const navigation = useHomeStackNavigation();

  const {
    data: workOrders = [],
    isLoading,
    isFetching,
  } = useGetUpcomingWorkOrdersQuery();

  const onSelectJob = useCallback(
    (workOrder: IPopulatedWorkOrder) => {
      navigation.navigate('JobNavigator', {workOrderId: workOrder.id});
    },
    [navigation],
  );

  const sortedWorkOrders = useSortedWorkOrders(
    workOrders,
    sortByAcceptedTimeSlot,
  );

  return (
    <Widget title={detoxText.upcoming} style={styles.yourJobsWidget}>
      <FlatList
        testID={testId.upcomingJobs}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={sortedWorkOrders}
        contentContainerStyle={styles.jobs}
        renderItem={({item, index}) => {
          return (
            <ClaimedJobCard
              isActive={
                index === 0 || item.status === IWorkOrderStatus.IN_PROGRESS
              }
              workOrder={item}
              onSelectJob={onSelectJob}
            />
          );
        }}
        keyExtractor={item => `${item.id}`}
      />
      {Boolean(!sortedWorkOrders.length && !isLoading && !isFetching) && (
        <View style={[StyleSheet.absoluteFill, styles.noUpcoming]}>
          <Text>{detoxText.noUpcomingJobs}</Text>
        </View>
      )}
      {(isLoading || isFetching) && (
        <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <Loading />
        </View>
      )}
    </Widget>
  );
}
