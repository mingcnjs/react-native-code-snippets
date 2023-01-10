import React from 'react';
import JobCard from '../../home/components/JobCard';
import {StyleSheet, View} from 'react-native';
import {layoutColors} from '../../../constants/colors';
import {useGetWorkOrderQuery} from '../../../services/endpoints/workOrders';
import useHomeStackNavigation from '../../../hooks/useHomeStackNavigation';

const styles = StyleSheet.create({
  jobDetailsContainer: {
    backgroundColor: layoutColors.white,
    paddingHorizontal: 15,
  },
  jobDetails: {
    borderColor: layoutColors.black10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 0,
    marginHorizontal: 0,
  },
});

type Props = {
  workOrderId: number;
};

export default function JobChatDetails(props: Props) {
  const {workOrderId} = props;

  const navigation = useHomeStackNavigation();
  const {data: workOrder} = useGetWorkOrderQuery(workOrderId);

  if (!workOrder) {
    return null;
  }

  return (
    <View style={styles.jobDetailsContainer}>
      <JobCard
        workOrder={workOrder}
        containerStyle={styles.jobDetails}
        onPressCard={() => {
          navigation.navigate('JobNavigator', {workOrderId});
        }}
      />
    </View>
  );
}
