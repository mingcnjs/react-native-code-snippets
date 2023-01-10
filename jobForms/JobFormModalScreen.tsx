import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../types/paramlists';
import UpDownModal from '../../components/modals/UpDownModal';
import {StyleSheet, View} from 'react-native';
import {useGetWorkOrderQuery} from '../../services/endpoints/workOrders';
import Loading from '../../components/Loading';
import FormListContainer from './components/FormList/FormListContainer';

type Props = NativeStackScreenProps<HomeStackParamList, 'JobFormModalScreen'>;

export default function JobFormModalScreen(props: Props) {
  const {navigation, route} = props;
  const {workOrderId, formInstanceId, readonly = false} = route.params;

  const {data: job} = useGetWorkOrderQuery(workOrderId);

  function closeModal() {
    navigation.goBack();
  }

  function renderContent() {
    if (!job) {
      return (
        <View style={StyleSheet.absoluteFill}>
          <Loading />
        </View>
      );
    }

    return (
      <FormListContainer
        job={job}
        formInstanceId={formInstanceId}
        closeModal={closeModal}
        readonly={readonly}
      />
    );
  }

  return (
    <UpDownModal closeModal={closeModal} headerBottomLine>
      {renderContent()}
    </UpDownModal>
  );
}
