import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Archivo from '../../../components/labels/Archivo';
import {layoutColors} from '../../../constants/colors';
import {FontDimensions} from '../../../components/labels/CustomText/types';
import IconButton from '../../../components/buttons/IconButton';
import CloseIcon from '../../../assets/icons/CloseIcon';
import Lato from '../../../components/labels/Lato';
import {IPopulatedWorkOrder, TimeSlot} from '../../../types/work-order';
import {getTimeIntersectedJobs} from '../../../utils/workOrderUtils/workOrder';
import JobInfoCard from './JobInfoCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 40,
    justifyContent: 'center',
    backgroundColor: `rgba(${layoutColors.black100RGB}, 0.3)`,
  },
  modal: {
    backgroundColor: layoutColors.white,
    borderRadius: 10,
  },
  header: {
    alignItems: 'flex-end',
    padding: 6,
  },
  content: {
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 23,
    borderRadius: 4,
  },
  acceptButton: {
    backgroundColor: layoutColors.green100,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: layoutColors.green20,
  },
  bottomMargin26: {marginBottom: 26},
  bottomMargin10: {marginBottom: 10},
});

type Props = {
  acceptJob: () => void;
  closeModal: () => void;
  claimedJobs: IPopulatedWorkOrder[];
  cancelJobClaiming: () => void;
  timeslot: TimeSlot;
};

export default function JobClaimTimeConflictModal(props: Props) {
  const {acceptJob, closeModal, timeslot, claimedJobs, cancelJobClaiming} =
    props;

  const timeConflictedJobs = getTimeIntersectedJobs(timeslot, claimedJobs);

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <Modal visible transparent>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <IconButton onPress={closeModal}>
                <CloseIcon />
              </IconButton>
            </View>

            <View style={styles.content}>
              <Archivo
                fontDimensions={FontDimensions.TITLE2}
                color={layoutColors.red3}
                style={styles.bottomMargin26}>
                Warning - Double booking!
              </Archivo>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                style={styles.bottomMargin26}>
                During the time you selected you are already booked for:
              </Lato>
              <ScrollView bounces={false} style={styles.bottomMargin10}>
                {timeConflictedJobs.map(job => {
                  return <JobInfoCard key={job.id} job={job} />;
                })}
              </ScrollView>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                style={styles.bottomMargin26}>
                If you continue, please make sure you can perform all the jobs
                assigned to you!
              </Lato>
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={cancelJobClaiming}
                  style={[styles.footerButton, styles.cancelButton]}>
                  <Archivo
                    fontDimensions={FontDimensions.BUTTON1}
                    color={layoutColors.green100}>
                    Cancel
                  </Archivo>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={acceptJob}
                  style={[styles.footerButton, styles.acceptButton]}>
                  <Archivo
                    fontDimensions={FontDimensions.BUTTON1}
                    color={layoutColors.white}>
                    Accept
                  </Archivo>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
