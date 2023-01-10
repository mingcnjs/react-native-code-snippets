import React, {Dispatch, SetStateAction, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BoxShadow from './BoxShadow';
import Part from './Part/Part';
import Archivo from '../../../components/labels/Archivo';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import InfoBlock from './InfoBlock';
import {layoutColors} from '../../../constants/colors';
import Lato from '../../../components/labels/Lato';
import PartTitle from './Part/PartTitle';
import TimeSlotsRadioGroup from './TimeSlots/TimeSlotsRadioGroup';
import {RadioGroupDisplayTypes} from './TimeSlots/types';
import AlarmIcon from '../../../assets/icons/AlarmIcon';
import {IPopulatedWorkOrder, TimeSlot} from '../../../types/work-order';
import {compareAsc} from 'date-fns';
import detoxText from '../../../constants/detoxText';
import JobInfoCard from './JobInfoCard';

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: layoutColors.gallery,
  },
  contentContainer: {paddingBottom: 10},
  bottomMargin25: {marginBottom: 25},
  policyText: {
    marginLeft: 1,
    marginRight: 6,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Lato-Regular',
    color: layoutColors.black100,
  },
  heightLine20: {lineHeight: 20},
  topMargin5: {marginTop: 5},
});

type Props = {
  job: IPopulatedWorkOrder;
  selectedTimeSlot: TimeSlot | undefined;
  setSelectedTimeSlot: Dispatch<SetStateAction<TimeSlot | undefined>>;
};

export default function ClaimJobModalContent(props: Props) {
  const {job, setSelectedTimeSlot, selectedTimeSlot} = props;

  const workHours = `within ${job.estimatedWorkHours} hours`;

  const sortedTimeSlots = useMemo(() => {
    const today = new Date();
    const beforeToday = job.availableTimeSlots
      ?.filter(t => compareAsc(new Date(t.startDate), today) < 0)
      .sort((a, b) => compareAsc(new Date(b.startDate), new Date(a.startDate)));
    const afterToday = job.availableTimeSlots
      ?.filter(t => compareAsc(new Date(t.startDate), today) >= 0)
      .sort((a, b) => compareAsc(new Date(a.startDate), new Date(b.startDate)));
    return [...afterToday, ...beforeToday];
  }, [job.availableTimeSlots]);

  return (
    <>
      <View style={styles.line} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="handled"
        extraHeight={140}
        enableOnAndroid>
        <BoxShadow>
          <Part>
            <Archivo
              fontDimensions={FontDimensions.TITLE1}
              style={styles.bottomMargin25}>
              {detoxText.claimJobModalTitle}
            </Archivo>

            <JobInfoCard job={job} />

            <PartTitle>Select your preferred working time slot</PartTitle>

            <TimeSlotsRadioGroup
              timeSlots={sortedTimeSlots}
              display={RadioGroupDisplayTypes.GRID}
              selected={selectedTimeSlot}
              setSelected={setSelectedTimeSlot}
            />

            <InfoBlock
              Title={
                <Lato
                  fontDimensions={FontDimensions.BODY1}
                  fontWeight={FontWeights.BOLD}>
                  Estimated work hours
                </Lato>
              }
              textStyle={styles.heightLine20}
              Icon={<AlarmIcon />}
              iconSize={26}>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                style={styles.topMargin5}>
                {workHours}
              </Lato>
            </InfoBlock>
          </Part>
        </BoxShadow>
        <BoxShadow>
          <Part>
            <PartTitle>Reschedule Policy</PartTitle>
            <Text style={styles.policyText}>
              Contact your job coordinator for rescheduling or rejecting a job
              within 48 hours of Job Start Time.
            </Text>
          </Part>
        </BoxShadow>
      </KeyboardAwareScrollView>
    </>
  );
}
