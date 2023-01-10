import React, {ReactElement, useCallback, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  HomeStackParamList,
  TabNavigatorParamList,
} from '../../types/paramlists';
import UpDownModal from '../../components/modals/UpDownModal';
import {layoutColors} from '../../constants/colors';
import {TimeSlot} from '../../types/work-order';
import FooterWithButton from './components/FooterWithButton';
import {
  useClaimWorkOrderMutation,
  useGetAssignedWorkOrdersQuery,
  useGetWorkOrderQuery,
} from '../../services/endpoints/workOrders';
import {
  isAvailableTimeSlot,
  isUnclaimed,
} from '../../utils/workOrderUtils/workOrder';
import ClaimJobModalContent from './components/ClaimJobModalContent';
import JobClaimedModalContent from './components/JobClaimedModalContent';
import Loading from '../../components/Loading';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import testId from '../../constants/testId';
import detoxText from '../../constants/detoxText';
import JobClaimTimeConflictModal from './components/JobClaimTimeConflictModal';

const styles = StyleSheet.create({
  modal: {backgroundColor: layoutColors.lightBeige},
  jobClaimedFooter: {
    backgroundColor: layoutColors.white,
    paddingTop: 11,
    paddingHorizontal: 20,
  },
  confirmButtonText: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: 'Archivo-SemiBold',
    color: layoutColors.everglade,
  },
});

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'ClaimJobModalScreen'>,
  BottomTabScreenProps<TabNavigatorParamList>
>;

export default function ClaimJobModalScreen(props: Props) {
  const {navigation, route} = props;
  const {workOrderId} = route.params;

  const [claimWorkOrder, {isLoading}] = useClaimWorkOrderMutation();

  function closeModal() {
    navigation.goBack();
  }

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>();
  const [showTimeConflictModal, setShowTimeConflictModal] = useState(false);

  const closeTimeConflictModal = useCallback(
    () => setShowTimeConflictModal(false),
    [],
  );

  const {data: job} = useGetWorkOrderQuery(workOrderId);
  const {data: claimedOrders, isLoading: claimedOrdersLoading} =
    useGetAssignedWorkOrdersQuery();

  const onClaimWorkOrder = useCallback(
    (timeSlot: TimeSlot) => {
      return claimWorkOrder({
        id: workOrderId,
        timeSlotId: timeSlot.id,
      })
        .unwrap()
        .catch(err => {
          console.log(err);
        });
    },
    [claimWorkOrder, workOrderId],
  );

  function onPressAccept() {
    if (selectedTimeSlot && claimedOrders) {
      if (isAvailableTimeSlot(selectedTimeSlot, claimedOrders)) {
        onClaimWorkOrder(selectedTimeSlot);
      } else {
        setShowTimeConflictModal(true);
      }
    } else {
      Alert.alert(
        'Job claiming',
        'Please, select working time slot to claim job',
      );
    }
  }

  function renderContent() {
    if (!job) {
      return <Loading />;
    }
    if (isUnclaimed(job)) {
      return (
        <ClaimJobModalContent
          job={job}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
        />
      );
    }
    return (
      <JobClaimedModalContent
        job={job}
        selectedTimeSlot={selectedTimeSlot}
        onPressCloseButton={closeModal}
      />
    );
  }

  function renderFooter(): ReactElement | undefined {
    if (!job) {
      return undefined;
    }
    if (isUnclaimed(job)) {
      return (
        <FooterWithButton
          title={detoxText.claimJobButtonText}
          buttonIsDisabled={Boolean(!selectedTimeSlot)}
          onPressButton={onPressAccept}
          isLoading={isLoading || claimedOrdersLoading}
          buttonDisabledCoverTestID={testId.claimJobButtonDisabledCover}
        />
      );
    }

    return (
      <FooterWithButton
        title={'View My Jobs'}
        secondary
        buttonIsDisabled={Boolean(!selectedTimeSlot)}
        onPressButton={() => {
          navigation.navigate('MyJobNavigator', {screen: 'MyJobScreen'});
        }}
        isLoading={isLoading}
      />
    );
  }

  return (
    <>
      <UpDownModal
        closeModal={closeModal}
        style={styles.modal}
        header={job ? isUnclaimed(job) : false}
        ModalFooter={renderFooter()}>
        {renderContent()}
      </UpDownModal>
      {showTimeConflictModal && (
        <JobClaimTimeConflictModal
          closeModal={closeTimeConflictModal}
          cancelJobClaiming={closeModal}
          acceptJob={() => {
            closeTimeConflictModal();
            onClaimWorkOrder(selectedTimeSlot!);
          }}
          claimedJobs={claimedOrders!}
          timeslot={selectedTimeSlot!}
        />
      )}
    </>
  );
}
