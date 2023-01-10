import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import JobScreen from './JobScreen';
import {HomeStackParamList, JobParamList} from '../../types/paramlists';
import ShiftInProgressScreen from '../shiftInProgress/ShiftInProgressScreen';
import {StyleSheet} from 'react-native';
import BackArrowIcon from '../../assets/icons/BackArrowIcon';
import ChatHomeIcon from '../../assets/icons/ChatHomeIcon';
import {layoutColors} from '../../constants/colors';
import {useGetWorkOrderQuery} from '../../services/endpoints/workOrders';
import Loading from '../../components/Loading';
import {IWorkOrderStatus} from '../../types/work-order';
import IconButton from '../../components/buttons/IconButton';
import NoAvailableJobModalScreen from './NoAvailableJobModalScreen';
import {getChannelId} from '../../utils/chat';
import {CHAT_TYPES} from '../../types/chat';
import {useAppSelector} from '../../redux/store';
import {Error} from '../../types/error';

const styles = StyleSheet.create({
  header: {backgroundColor: layoutColors.white},
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Archivo-SemiBold',
    color: layoutColors.black100,
  },
});

const Stack = createNativeStackNavigator<JobParamList>();
type Props = NativeStackScreenProps<HomeStackParamList, 'JobNavigator'>;

export default function JobNavigator(props: Props) {
  const {navigation, route} = props;

  const {workOrderId} = route.params;
  const {
    data: job,
    isLoading,
    error,
  } = useGetWorkOrderQuery(workOrderId, {
    pollingInterval: 120000,
  });
  const {user} = useAppSelector(state => state.auth);

  if ((error as Error)?.status === 400) {
    return <NoAvailableJobModalScreen onClose={() => navigation.goBack()} />;
  }

  function renderJobScreen() {
    if (job && job.status === IWorkOrderStatus.IN_PROGRESS) {
      return (
        <Stack.Screen
          name={'ShiftInProgressScreen'}
          component={ShiftInProgressScreen}
          options={({navigation: nav}) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerStyle: styles.header,
            title: 'Shift in progress',
            headerTitleStyle: styles.headerTitle,
            headerLeft: () => {
              return (
                <IconButton onPress={() => nav.goBack()}>
                  <BackArrowIcon />
                </IconButton>
              );
            },
            headerRight: () => {
              return (
                <IconButton
                  onPress={() => {
                    navigation.navigate('ChatScreen', {
                      chatId: getChannelId(
                        CHAT_TYPES.JOB_CHAT,
                        job!.id,
                        job!.creator.id,
                        user.id,
                      ),
                      title: job!.title,
                    });
                  }}>
                  <ChatHomeIcon />
                </IconButton>
              );
            },
          })}
          initialParams={{workOrderId}}
        />
      );
    }
    return (
      <Stack.Screen
        name={'JobScreen'}
        component={JobScreen}
        initialParams={{workOrderId}}
      />
    );
  }

  if (isLoading || !job) {
    return <Loading />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {renderJobScreen()}
    </Stack.Navigator>
  );
}
