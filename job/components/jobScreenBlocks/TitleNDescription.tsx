import React from 'react';
import {StyleSheet, View} from 'react-native';
import Part from '../Part/Part';
import JobStatus from '../../../../components/JobStatus';
import {IPopulatedWorkOrder} from '../../../../types/work-order';
import Archivo from '../../../../components/labels/Archivo';
import MarkdownView from '../MarkdownView';

const styles = StyleSheet.create({
  statusContainer: {
    marginLeft: -8,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  status: {
    paddingHorizontal: 8,
  },
  statusText: {fontFamily: 'Archivo-Bold'},
  descriptionText: {
    marginBottom: 10,
    marginTop: 9,
    marginRight: 2,
  },
  line: {marginHorizontal: 20},
});

type Props = {job: IPopulatedWorkOrder};

export default function TitleNDescription(props: Props) {
  const {job} = props;

  return (
    <Part line>
      <View style={styles.statusContainer}>
        <JobStatus
          status={job.status}
          style={styles.status}
          textStyle={styles.statusText}
        />
      </View>
      <Archivo testID={'jobTitle'}>{job.title}</Archivo>
      {Boolean(job.description) && (
        <MarkdownView>{job.description}</MarkdownView>
      )}
    </Part>
  );
}
