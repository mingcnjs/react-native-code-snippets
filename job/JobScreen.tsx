import React, {useCallback, useMemo, useRef} from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList, JobParamList} from '../../types/paramlists';
import {layoutColors} from '../../constants/colors';
import {PAST} from '../../constants/constants';
import FooterWithButton from './components/FooterWithButton';
import Loading from '../../components/Loading';
import Map from './components/Map/Map';
import Header from './components/jobScreenBlocks/Header';
import {isUnclaimed} from '../../utils/workOrderUtils/workOrder';
import TitleNDescription from './components/jobScreenBlocks/TitleNDescription';
import JobDetails from './components/jobScreenBlocks/JobDetails';
import GettingThere from './components/jobScreenBlocks/GettingThere';
import Tasks from './components/jobScreenBlocks/Tasks';
import Attachments from './components/jobScreenBlocks/Attachments';
import Coordinator from './components/jobScreenBlocks/Coordinator';
import JobForm from './components/jobScreenBlocks/JobForm';
import {useGetWorkOrderQuery} from '../../services/endpoints/workOrders';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import Time from './components/jobScreenBlocks/Time/Time';
import {IWorkOrderStatus} from '../../types/work-order';
import {getLocationString} from '../../utils/workOrderUtils/getLocationString';
import testId from '../../constants/testId';

const styles = StyleSheet.create({
  flex: {flex: 1},
  scrollView: {backgroundColor: layoutColors.white},
  contentContainer: {paddingBottom: 20},
});

const MAP_HEIGHT = 200;

type Props = CompositeScreenProps<
  NativeStackScreenProps<JobParamList, 'JobScreen'>,
  NativeStackScreenProps<HomeStackParamList>
>;

export default function JobScreen(props: Props) {
  const {route, navigation} = props;
  const {workOrderId} = route.params;
  const headerAnimation = useRef(new Animated.Value(0)).current;

  const {
    data: job,
    refetch,
    isLoading,
    isFetching,
  } = useGetWorkOrderQuery(workOrderId);

  const onPressBack = useCallback(() => {
    const parent = navigation.getParent();
    if (parent && parent.canGoBack()) {
      parent.goBack();
    }
  }, [navigation]);

  const refetchJob = useCallback(() => {
    refetch();
  }, [refetch]);

  useFocusEffect(refetchJob);

  const onScroll = useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: headerAnimation,
              },
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    [headerAnimation],
  );

  const onPressClaimButton = useCallback(() => {
    navigation.navigate('ClaimJobModalScreen', {workOrderId});
  }, [workOrderId, navigation]);

  function onPressClockInButton() {
    navigation.navigate('ClockInJobModalScreen', {workOrderId});
  }

  if (isLoading) {
    return <Loading />;
  }

  if (job) {
    const jobIsUnclaimed = isUnclaimed(job);
    const jobIsAccepted = job.status === IWorkOrderStatus.ACCEPTED;
    const jobIsUnclaimedOrAccepted =
      job.status === IWorkOrderStatus.UNCLAIMED ||
      job.status === IWorkOrderStatus.ACCEPTED;
    const availableWorkOrderStatusMap = [
      IWorkOrderStatus.UNCLAIMED,
      IWorkOrderStatus.UNACCEPTED,
      IWorkOrderStatus.ACCEPTED,
    ];

    function renderFooter() {
      if (jobIsUnclaimed) {
        return (
          <FooterWithButton
            title={
              job!.status === IWorkOrderStatus.UNACCEPTED
                ? 'Accept This Job'
                : 'Claim This Job'
            }
            onPressButton={onPressClaimButton}
          />
        );
      }
      if (jobIsAccepted) {
        return (
          <FooterWithButton
            title={'Clock in'}
            onPressButton={onPressClockInButton}
          />
        );
      }
      return null;
    }

    const {lat, lng} = job.location;

    return (
      <View style={styles.flex}>
        <ScrollView
          testID={testId.jobScreenScrollView}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetchJob} />
          }
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}>
          <Map
            height={MAP_HEIGHT}
            address={getLocationString(job)}
            latitude={lat}
            longitude={lng}
          />

          <TitleNDescription job={job} />

          <JobDetails job={job} />

          {[...availableWorkOrderStatusMap, ...PAST].includes(job!.status) && (
            <Time job={job} />
          )}

          <GettingThere job={job} />

          {jobIsUnclaimedOrAccepted && <Tasks tasks={job.tasks} />}

          {jobIsUnclaimedOrAccepted && (
            <Attachments attachments={job.attachments} />
          )}

          <JobForm job={job} />

          {Boolean(job.creator) && (
            <Coordinator
              canReject={jobIsAccepted}
              isUnclaimed={jobIsUnclaimed}
              onPressReject={() =>
                navigation.navigate('RejectJobModalScreen', {
                  workOrderId,
                })
              }
              job={job}
            />
          )}
        </ScrollView>

        <Header animation={headerAnimation} onPressBackButton={onPressBack} />

        {renderFooter()}
      </View>
    );
  }
  return null;
}
