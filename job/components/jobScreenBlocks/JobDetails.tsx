import React from 'react';
import Part from '../Part/Part';
import InfoBlock from '../InfoBlock';
import CashIcon from '../../../../assets/icons/CashIcon';
import ToolsIcon from '../../../../assets/icons/ToolsIcon';
import {StyleSheet, View} from 'react-native';
import {IPopulatedWorkOrder} from '../../../../types/work-order';
import SuitcaseIcon from '../../../../assets/icons/SuitcaseIcon';
import TagList from '../../../../components/TagList';
import {layoutColors} from '../../../../constants/colors';
import PartTitle from '../Part/PartTitle';
import JobPaymentDetails from '../../../../components/JobPaymentDetails';

const styles = StyleSheet.create({
  line: {marginHorizontal: 20},
  bottomMargin0: {marginBottom: 0},
  topMargin12: {marginTop: 12},
  text: {
    color: '#000',
  },
});

type Props = {
  job: IPopulatedWorkOrder;
};

export default function JobDetails(props: Props) {
  const {job} = props;
  return (
    <Part testID={'jobDetails'} line>
      <PartTitle marginBottom={21}>Job Details</PartTitle>

      {Boolean(job.formInstances?.length) && (
        <InfoBlock
          title={job.formInstances
            .map(instance => instance.form.title)
            .join(', ')}
          Icon={<ToolsIcon />}
        />
      )}

      <InfoBlock
        Title={
          <JobPaymentDetails
            style={styles.text}
            paymentDetails={job.paymentDetails}
          />
        }
        Icon={<CashIcon />}
      />

      <InfoBlock
        title={'One of these specialties required:'}
        Icon={<SuitcaseIcon />}>
        <View style={styles.topMargin12}>
          <TagList
            tags={job.specialties.map(s => `${s.title}`)}
            tagColor={layoutColors.green10}
          />
        </View>
      </InfoBlock>

      <InfoBlock
        title={'Skills required:'}
        Icon={<SuitcaseIcon />}
        containerStyle={styles.bottomMargin0}>
        <View style={styles.topMargin12}>
          <TagList
            tags={job.skillRequests.map(
              s => `${s.categoryTitle} - ${s.itemTitle} - ${s.title}`,
            )}
            tagColor={layoutColors.brown}
          />
        </View>
      </InfoBlock>
    </Part>
  );
}
