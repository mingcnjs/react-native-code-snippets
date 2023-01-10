import React from 'react';
import Part from '../Part/Part';
import PartTitle from '../Part/PartTitle';
import {StyleSheet, Text, View} from 'react-native';
import JobAttachments from '../JobAttachments/JobAttachments';
import {layoutColors} from '../../../../constants/colors';
import {IAttachment} from '../../../../types/work-order';

const styles = StyleSheet.create({
  attachmentsContainer: {
    marginHorizontal: -20,
    marginBottom: 23,
  },
  additionalText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Lato-Regular',
    color: layoutColors.boulder,
  },
  line: {marginHorizontal: 20},
  bottomMargin2: {marginBottom: 2},
  bottomMargin15: {marginBottom: 15},
});

type Props = {
  attachments: IAttachment[] | undefined;
};

export default function Attachments(props: Props) {
  const {attachments} = props;

  if (attachments && attachments.length > 0) {
    return (
      <Part line>
        <PartTitle style={styles.bottomMargin2}>What we know</PartTitle>
        <Text style={[styles.additionalText, styles.bottomMargin15]}>
          Additional information from site to help you understand this job
          request
        </Text>
        <View style={styles.attachmentsContainer}>
          <JobAttachments attachments={attachments} />
        </View>
      </Part>
    );
  }
  return null;
}
