import React, {useCallback, useMemo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {layoutColors, WRENO_GRADIENT} from '../../../constants/colors';
import {MONTH} from '../../../constants/constants';
import {IPopulatedWorkOrder, IWorkOrderStatus} from '../../../types/work-order';
import {getTimeFrame} from '../../../utils/workOrderUtils/workOrder';
import {compareAsc, differenceInDays} from 'date-fns';
import {getTodayDate} from '../../../utils/utils';
import Archivo from '../../../components/labels/Archivo';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import Lato from '../../../components/labels/Lato';
import testId from '../../../constants/testId';
import detoxText from '../../../constants/detoxText';

const WIDTH = 200;
const HEIGHT = 170;

const styles = StyleSheet.create({
  job: {
    backgroundColor: layoutColors.saltpan,
    width: WIDTH,
    height: HEIGHT,
    marginRight: 15,
    overflow: 'visible',
    borderRadius: 14,
  },
  gradient: {
    height: HEIGHT,
    borderRadius: 14,
  },
  content: {
    display: 'flex',
    height: HEIGHT,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  monthName: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  jobNameContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    marginVertical: 7,
  },
  sticker: {
    position: 'absolute',
    top: -8,
    right: -6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: layoutColors.kournikova,
    shadowColor: '#53805F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    elevation: 4,
  },
  stickerText: {
    textTransform: 'capitalize',
    letterSpacing: 1,
  },
});

type Props = {
  workOrder: IPopulatedWorkOrder;
  isActive: boolean;
  onSelectJob: (job: IPopulatedWorkOrder) => void;
};

export default function ClaimedJobCard(props: Props) {
  const {onSelectJob, isActive, workOrder} = props;

  const onPress = useCallback(() => {
    onSelectJob(workOrder);
  }, [onSelectJob, workOrder]);

  const [stickerText, monthName, day] = useMemo(() => {
    if (workOrder.acceptedTimeSlot) {
      const startDate = new Date(workOrder.acceptedTimeSlot.startDate);
      const month = startDate.getMonth();
      let stickerText1 = '';
      if (isActive) {
        if (workOrder.status === IWorkOrderStatus.IN_PROGRESS) {
          stickerText1 = detoxText.inProgress;
        } else {
          const today = getTodayDate();
          if (compareAsc(startDate, today) >= 0) {
            const diff = differenceInDays(startDate, today);
            stickerText1 = 'Today';

            if (diff === 1) {
              stickerText1 = 'Tomorrow';
            } else if (diff > 0) {
              stickerText1 = `in ${diff} days`;
            }
          }
        }
      }
      return [
        stickerText1,
        MONTH[Number(month)],
        startDate.getDate().toString(),
      ];
    }
    return ['', '', ''];
  }, [workOrder, isActive]);

  const CardContent = (
    <View style={[styles.content]}>
      <View>
        <Archivo
          fontDimensions={FontDimensions.CALLOUT2}
          fontWeight={FontWeights.BOLD}
          color={layoutColors.deep100}
          style={styles.monthName}>
          {monthName}
        </Archivo>
        <Archivo
          fontDimensions={FontDimensions.LARGE_TITLE}
          fontWeight={FontWeights.MEDIUM}
          color={layoutColors.green100}>
          {day}
        </Archivo>
      </View>
      <View style={[styles.jobNameContainer]}>
        <Archivo
          fontDimensions={FontDimensions.TITLE3}
          numberOfLines={3}
          color={layoutColors.deep100}>
          {workOrder.title}
        </Archivo>
      </View>
      <Lato
        fontDimensions={FontDimensions.BODY2}
        fontWeight={FontWeights.MEDIUM}
        color={layoutColors.deep100}
        style={styles.textUppercase}>
        {getTimeFrame(workOrder.acceptedTimeSlot)}
      </Lato>
    </View>
  );
  return (
    <TouchableOpacity
      testID={testId.upcomingJobCard}
      style={[styles.job]}
      activeOpacity={0.7}
      onPress={onPress}>
      {isActive ? (
        <LinearGradient style={styles.gradient} {...WRENO_GRADIENT}>
          {CardContent}
        </LinearGradient>
      ) : (
        CardContent
      )}
      {isActive && Boolean(stickerText) && (
        <View style={styles.sticker} testID={'jobCardSticker'}>
          <Lato
            fontDimensions={FontDimensions.CAPTION1}
            color={layoutColors.black100}
            style={styles.stickerText}>
            {stickerText}
          </Lato>
        </View>
      )}
    </TouchableOpacity>
  );
}
