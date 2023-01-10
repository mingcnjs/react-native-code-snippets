import React, {useEffect, useState} from 'react';
import UpDownModal from '../../components/modals/UpDownModal';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CloseIcon from '../../assets/icons/CloseIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../types/paramlists';
import {
  layoutColors,
  WHITE_TO_TRANSPARENT_GRADIENT,
} from '../../constants/colors';
import {getTimeFrame} from '../../utils/workOrderUtils/workOrder';
import InfoBlock from './components/InfoBlock';
import BackgroundColor from '../../components/BackgroundColor';
import WorkOrderIcon from '../../assets/icons/WorkOrderIcon';
import {differenceInHours, format} from 'date-fns';
import Lato from '../../components/labels/Lato';
import Archivo from '../../components/labels/Archivo';
import CalendarMonthIcon from '../../assets/icons/CalendarMonthIcon';
import CoordinatorInfo from './components/jobScreenBlocks/CoordinatorInfo';
import TextLink from './components/jobScreenBlocks/TextLink';
import LineHorizontal from './components/LineHorizontal';
import LinearGradient from 'react-native-linear-gradient';
import {
  FontDimensions,
  FontWeights,
} from '../../components/labels/CustomText/types';
import Loading from '../../components/Loading';
import {
  useGetWorkOrderQuery,
  useRejectWorkOrderMutation,
} from '../../services/endpoints/workOrders';
import LoadingButton from '../../components/buttons/LoadingButton';
import {getChannelId} from '../../utils/chat';
import {CHAT_TYPES} from '../../types/chat';
import {useAppSelector} from '../../redux/store';
import useBottomInset from '../../hooks/useBottomInset';

const CalendarClock = require('../../assets/images/calendarClock.png');
const ErrorPerspective = require('../../assets/images/errorPerspective.png');

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  flex1: {flex: 1},
  border: {
    paddingTop: 15,
    paddingHorizontal: 10,
    paddingBottom: 25,
    borderColor: layoutColors.gallery,
    borderWidth: 1,
    borderRadius: 6,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: 16,
    paddingRight: 12,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  modal: {backgroundColor: layoutColors.brown},
  bottomMargin10: {marginBottom: 10},
  bottomMargin12: {marginBottom: 12},
  bottomMargin15: {marginBottom: 15},
  bottomMargin35: {marginBottom: 35},
  leftMargin45: {marginLeft: 45},
  jobIcon: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  heightLine20: {lineHeight: 20},
  jobInfoText: {
    marginBottom: 13,
    marginTop: 6,
  },
  jobRejectedContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  jobRejectedFooter: {
    backgroundColor: layoutColors.white,
    paddingTop: 11,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  coordinatorContainer: {marginBottom: 15},
  coordinator: {marginLeft: 13},
});

function checkIfCanReject(jobStartDate: Date): Promise<boolean> {
  return new Promise(resolve => {
    const now = new Date();
    const hours = differenceInHours(jobStartDate, now);
    resolve(hours >= 48);
  });
}

type Props = NativeStackScreenProps<HomeStackParamList, 'RejectJobModalScreen'>;

export default function RejectJobModalScreen(props: Props) {
  const {navigation, route} = props;
  const {workOrderId} = route.params;

  const bottomInset = useBottomInset();

  const [isLoading, setIsLoading] = useState(true);
  const [canReject, setCanReject] = useState(false);

  const {user} = useAppSelector(state => state.auth);

  const {data: job} = useGetWorkOrderQuery(workOrderId);
  const [rejectJobById, {isLoading: isRejecting}] =
    useRejectWorkOrderMutation();

  useEffect(() => {
    if (job && job.acceptedTimeSlot) {
      checkIfCanReject(new Date(job.acceptedTimeSlot.startDate))
        .then(response => {
          setCanReject(response);
        })
        .finally(() => setIsLoading(false));
    }
  }, [job]);

  function closeModal() {
    navigation.goBack();
  }

  async function onConfirmRejection() {
    try {
      await rejectJobById(workOrderId).unwrap();
      closeModal();
    } catch (e: any) {
      console.log(e);
      if (e.data && e.data.message && e.status === 400) {
        Alert.alert('Error', e.data.message);
      }
    }
  }

  function renderFooter() {
    if (isLoading || !job) {
      return <></>;
    }
    if (canReject) {
      return (
        <LoadingButton
          loading={isRejecting}
          type={'outline'}
          onPress={onConfirmRejection}>
          <Archivo
            fontDimensions={FontDimensions.BUTTON}
            color={layoutColors.deep100}>
            Confirm Rejection
          </Archivo>
        </LoadingButton>
      );
    }
    return (
      <LoadingButton type={'outline'} onPress={closeModal}>
        <Archivo
          fontDimensions={FontDimensions.BUTTON}
          color={layoutColors.deep100}>
          Cancel
        </Archivo>
      </LoadingButton>
    );
  }

  function renderContent() {
    if (isLoading || !job) {
      return <Loading />;
    }

    return (
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.jobRejectedContent}>
        <Image
          source={canReject ? ErrorPerspective : CalendarClock}
          style={styles.bottomMargin10}
        />
        <Archivo
          fontDimensions={FontDimensions.LARGE_TITLE}
          fontWeight={FontWeights.MEDIUM}
          style={styles.bottomMargin15}>
          {canReject ? 'Do you want to make the change?' : 'Oops...'}
        </Archivo>

        <Lato
          fontDimensions={FontDimensions.BODY1}
          style={styles.bottomMargin35}>
          {canReject ? (
            'You can reject this job, or contact Wreno Coordinator to edit your shift if you wish to work at another available time.'
          ) : (
            <>
              You cannot Reject within{' '}
              <Lato
                fontDimensions={FontDimensions.BODY1}
                fontWeight={FontWeights.BOLD}>
                48 hours
              </Lato>{' '}
              of your Job Start Time.
            </>
          )}
        </Lato>

        <Lato
          fontDimensions={FontDimensions.CAPTION1}
          fontWeight={FontWeights.BOLD}
          style={styles.bottomMargin12}>
          {canReject
            ? 'Your job details'
            : 'Please contact the Wreno Coordinator to arrange:'}
        </Lato>

        <View style={styles.border}>
          <InfoBlock
            Title={
              <Lato
                fontDimensions={FontDimensions.BODY1}
                fontWeight={FontWeights.BOLD}>
                {job.title}
              </Lato>
            }
            Icon={
              <View style={styles.jobIcon}>
                <BackgroundColor color={layoutColors.green100} opacity={0.1} />
                <WorkOrderIcon />
              </View>
            }
            contentTopOffset={false}
            textStyle={styles.heightLine20}>
            {Boolean(job?.formInstances.length) && (
              <Lato
                fontDimensions={FontDimensions.CAPTION1}
                color={layoutColors.boulder}
                style={styles.jobInfoText}>
                {job.formInstances.map(instance => instance.form.title)}
              </Lato>
            )}
            <LineHorizontal />
          </InfoBlock>
          <InfoBlock
            Title={
              <Lato
                fontDimensions={FontDimensions.CAPTION1}
                fontWeight={FontWeights.BOLD}>
                Working Time Slot
              </Lato>
            }
            Icon={<CalendarMonthIcon />}
            contentTopOffset={false}
            textStyle={styles.heightLine20}>
            {Boolean(job.acceptedTimeSlot) && (
              <Lato
                fontDimensions={FontDimensions.CAPTION1}
                style={styles.jobInfoText}>
                {`${format(
                  new Date(job.acceptedTimeSlot!.startDate),
                  'LLL dd, yyyy',
                )}  ${getTimeFrame(job.acceptedTimeSlot)}`}
              </Lato>
            )}
          </InfoBlock>
          <CoordinatorInfo
            coordinator={job.creator}
            size={32}
            containerStyle={styles.coordinatorContainer}
            coordinatorStyle={styles.coordinator}
          />
          <View style={styles.leftMargin45}>
            <TextLink
              title={'Contact Coordinator'}
              arrow
              onPress={() => {
                navigation.replace('ChatScreen', {
                  chatId: getChannelId(
                    CHAT_TYPES.JOB_CHAT,
                    job.id,
                    job.creator.id,
                    user.id,
                  ),
                  title: job.title,
                });
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <UpDownModal
      closeModal={closeModal}
      style={styles.modal}
      header={false}
      ModalFooter={
        <View style={[styles.jobRejectedFooter, bottomInset]}>
          {renderFooter()}
        </View>
      }>
      <LinearGradient style={styles.flex1} {...WHITE_TO_TRANSPARENT_GRADIENT}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={closeModal}
            style={styles.closeButton}>
            <CloseIcon size={13} />
          </TouchableOpacity>
        </View>
        {renderContent()}
      </LinearGradient>
    </UpDownModal>
  );
}
