import React, {useCallback} from 'react';
import UpDownModal from '../../components/modals/UpDownModal';
import {
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
  WRENO_GRADIENT,
} from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import Archivo from '../../components/labels/Archivo';
import {
  FontDimensions,
  FontWeights,
} from '../../components/labels/CustomText/types';
import BackgroundColor from '../../components/BackgroundColor';
import WorkOrderIcon from '../../assets/icons/WorkOrderIcon';
import Lato from '../../components/labels/Lato';
import InfoBlock from './components/InfoBlock';
import {
  useClockInWorkOrderMutation,
  useGetWorkOrderQuery,
} from '../../services/endpoints/workOrders';
import AcceptedJobTimeInfo from './components/jobScreenBlocks/Time/AcceptedJobTimeInfo';
import JobLocation from './components/jobScreenBlocks/JobLocation';
import LoadingButton from '../../components/buttons/LoadingButton';
import isJobVirtual from '../../utils/workOrderUtils/isJobVirtual';
import VirtualJobLocation from './components/jobScreenBlocks/VirtualJobLocation';

const clockImage = require('../../assets/images/clockPerspective.png');

const styles = StyleSheet.create({
  modal: {backgroundColor: layoutColors.brown},
  gradient: {
    flex: 1,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
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
  scrollView: {flex: 1},
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  clockImage: {
    width: 68,
    height: 68,
    marginBottom: 10,
  },
  bottomMargin15: {marginBottom: 15},
  bottomMargin35: {marginBottom: 35},
  border: {
    borderWidth: 1,
    borderColor: layoutColors.black10,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 25,
    paddingTop: 15,
    marginBottom: 20,
  },
  jobIcon: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  borderBottom: {
    width: '100%',
    height: 1,
    backgroundColor: layoutColors.black10,
    marginTop: 13,
  },
  leftPadding5: {paddingLeft: 5},
  flexRow: {flexDirection: 'row'},
});

type Props = NativeStackScreenProps<
  HomeStackParamList,
  'ClockInJobModalScreen'
>;

export default function ClockInJobModalScreen(props: Props) {
  const {navigation, route} = props;
  const {workOrderId} = route.params;

  const {data: job} = useGetWorkOrderQuery(workOrderId);
  const [clockIn, {isLoading}] = useClockInWorkOrderMutation();

  const clockInJob = useCallback(() => {
    return clockIn(workOrderId).unwrap();
  }, [workOrderId, clockIn]);

  function closeModal() {
    navigation.goBack();
  }

  async function onPressStart() {
    try {
      await clockInJob();
      closeModal();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <UpDownModal closeModal={closeModal} style={styles.modal} header={false}>
      <LinearGradient style={styles.gradient} {...WRENO_GRADIENT}>
        <LinearGradient
          style={styles.gradient}
          {...WHITE_TO_TRANSPARENT_GRADIENT}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={closeModal}
              style={styles.closeButton}>
              <CloseIcon size={13} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}>
            <Image
              source={clockImage}
              style={styles.clockImage}
              resizeMode={'contain'}
            />

            <Archivo
              fontDimensions={FontDimensions.LARGE_TITLE}
              fontWeight={FontWeights.MEDIUM}
              style={styles.bottomMargin15}>
              Clocking in to...
            </Archivo>

            <View style={styles.border}>
              <InfoBlock
                title={job!.title}
                Icon={
                  <View style={styles.jobIcon}>
                    <BackgroundColor
                      color={layoutColors.green100}
                      opacity={0.1}
                    />
                    <WorkOrderIcon />
                  </View>
                }
                contentTopOffset={false}>
                {Boolean(job?.formInstances.length) && (
                  <Lato
                    fontDimensions={FontDimensions.CAPTION1}
                    color={layoutColors.boulder}>
                    {job?.formInstances.map(instances => instances.form.title)}
                  </Lato>
                )}
                <View style={styles.borderBottom} />
              </InfoBlock>
              <View style={styles.leftPadding5}>
                <AcceptedJobTimeInfo job={job!} />
              </View>
              <View style={styles.leftPadding5}>
                {isJobVirtual(job!) ? (
                  <VirtualJobLocation />
                ) : (
                  <JobLocation job={job!} withShowButton={false} />
                )}
              </View>
            </View>
            <View style={styles.flexRow}>
              <LoadingButton onPress={onPressStart} loading={isLoading}>
                <Archivo
                  fontDimensions={FontDimensions.BUTTON}
                  color={layoutColors.deep100}>
                  Start timer
                </Archivo>
              </LoadingButton>
            </View>
          </ScrollView>
        </LinearGradient>
      </LinearGradient>
    </UpDownModal>
  );
}
