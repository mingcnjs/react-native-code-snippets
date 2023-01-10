import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {layoutColors} from '../../constants/colors';
import YourJobsWidget from './components/YourJobsWidget';
import AvailableJobsWidget from './components/AvailableJobsWidget';
import {setUserAction} from '../../redux/slices/authSlice';
import IconButton from '../../components/buttons/IconButton';
import {useGetUserQuery} from '../../services/endpoints/auth';
import NotificationBellIcon from '../../assets/icons/NotificationBellIcon';
import Lato from '../../components/labels/Lato';
import {FontDimensions} from '../../components/labels/CustomText/types';
import {
  useGetUnclaimedWorkOrdersQuery,
  useGetUpcomingWorkOrdersQuery,
} from '../../services/endpoints/workOrders';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeParamList, HomeStackParamList} from '../../types/paramlists';
import {useGetNotificationsQuery} from '../../services/endpoints/notifications';
import {INotificationItem} from '../../types/notification';
import {useMount} from '../../hooks/useMount';
import HomeScreenCallouts from './components/Callouts/HomeScreenCallouts';
import {setBadgeCount} from 'react-native-notification-badge';
import {hasNotificationPermission} from '../../utils/notifications';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: layoutColors.white,
  },
  scrollView: {backgroundColor: layoutColors.lightBeige},
  header: {
    backgroundColor: layoutColors.white,
    paddingLeft: 21,
    paddingRight: 11,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: layoutColors.white,
  },
});

function getGreeting(now: Date) {
  const timeString = now.toTimeString();
  const hour = Number(timeString.split(' ')[0].split(':')[0]);
  if (hour >= 5 && hour <= 11) {
    return 'Good Morning';
  }
  if (hour >= 12 && hour <= 16) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

function newNotificationsExist(notifications: INotificationItem[] | undefined) {
  if (notifications && notifications.length) {
    return notifications.some(notification => !notification.read);
  }
  return false;
}

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeParamList, 'HomeScreen'>,
  NativeStackScreenProps<HomeStackParamList>
>;

export default function HomeScreen(props: Props) {
  const {navigation} = props;
  const dispatch = useAppDispatch();

  const [dateNow, setDateNow] = useState(new Date());

  const user = useAppSelector(state => state.auth.user);
  const firstSignIn = useAppSelector(state => state.appData.firstSignIn);

  const {data, isLoading, refetch: refetchUser} = useGetUserQuery();
  const {refetch: refetchUnclaimedWorkOrders} =
    useGetUnclaimedWorkOrdersQuery();
  const {refetch: refetchClaimedWorkOrders} = useGetUpcomingWorkOrdersQuery();
  const {data: notifications, refetch: refetchNotifications} =
    useGetNotificationsQuery();

  const refreshFunction = useCallback(() => {
    setDateNow(new Date());
    refetchUser();
    refetchUnclaimedWorkOrders();
    refetchClaimedWorkOrders();
    refetchNotifications();
    if (data) {
      dispatch(setUserAction(data));
    }
  }, [
    data,
    dispatch,
    refetchUser,
    refetchClaimedWorkOrders,
    refetchUnclaimedWorkOrders,
    refetchNotifications,
  ]);

  useMount(() => {
    hasNotificationPermission().then(isGranted => {
      if (isGranted) {
        setBadgeCount(0).catch(e => console.log(e));
      }
    });
  });

  useFocusEffect(refreshFunction);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Lato
          fontDimensions={FontDimensions.BODY1}
          testID={'homeScreenGreeting'}>
          {`${getGreeting(dateNow)}, ${user.firstName}!`}
        </Lato>
        <IconButton
          onPress={() => navigation.navigate('NotificationNavigator')}>
          <NotificationBellIcon marked={newNotificationsExist(notifications)} />
        </IconButton>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshFunction} />
        }>
        <YourJobsWidget />

        <AvailableJobsWidget />
      </ScrollView>
      {firstSignIn && <HomeScreenCallouts />}
    </SafeAreaView>
  );
}
