import React from 'react';
import Part from '../Part/Part';
import PartTitle from '../Part/PartTitle';
import {StyleSheet, View} from 'react-native';
import {layoutColors} from '../../../../constants/colors';
import Lato from '../../../../components/labels/Lato';
import {FontDimensions} from '../../../../components/labels/CustomText/types';
import LoadingButton from '../../../../components/buttons/LoadingButton';
import LineHorizontal from '../LineHorizontal';
import RejectJobButton from './RejectJobButton';
import CoordinatorInfo from './CoordinatorInfo';
import useHomeStackNavigation from '../../../../hooks/useHomeStackNavigation';
import {getChannelId} from '../../../../utils/chat';
import {CHAT_TYPES} from '../../../../types/chat';
import {IPopulatedWorkOrder} from '../../../../types/work-order';
import {useAppSelector} from '../../../../redux/store';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinator: {marginLeft: 15},
  bottomMargin5: {marginBottom: 5},
  bottomMargin20: {marginBottom: 20},
  bottomMargin27: {marginBottom: 27},
  verticalPadding10: {paddingVertical: 10},
  topMargin25: {marginTop: 25},
});

type Props = {
  onPressReject?: () => void;
  canReject: boolean;
  isUnclaimed: boolean;
  job: IPopulatedWorkOrder;
};

export default function Coordinator(props: Props) {
  const {onPressReject, canReject, isUnclaimed, job} = props;
  const navigation = useHomeStackNavigation();
  const {user} = useAppSelector(state => state.auth);

  return (
    <Part>
      <PartTitle>Need Help?</PartTitle>
      <Lato
        fontDimensions={FontDimensions.BODY1}
        color={layoutColors.boulder}
        style={styles.bottomMargin27}>
        Contact your Wreno Coordinator to request any edits to your job or ask a
        question.
      </Lato>
      <CoordinatorInfo coordinator={job.creator} />

      <LoadingButton
        type={'outline'}
        style={styles.verticalPadding10}
        color={layoutColors.green50}
        onPress={() => {
          navigation.navigate('ChatScreen', {
            chatId: getChannelId(
              CHAT_TYPES.JOB_CHAT,
              job.id,
              job.creator.id,
              user.id,
            ),
            title: job.title,
          });
        }}>
        <Lato
          fontDimensions={FontDimensions.BODY1}
          color={layoutColors.deep100}>
          {isUnclaimed ? 'Ask questions about this job' : 'Contact Coordinator'}
        </Lato>
      </LoadingButton>

      {canReject && (
        <View style={styles.topMargin25}>
          <LineHorizontal />
          <RejectJobButton onPress={onPressReject} />
        </View>
      )}
    </Part>
  );
}
