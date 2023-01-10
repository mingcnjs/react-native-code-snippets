import React from 'react';
import Part from '../Part/Part';
import PartTitle from '../Part/PartTitle';
import {IPopulatedWorkOrder} from '../../../../types/work-order';
import {StyleSheet} from 'react-native';
import InfoBlock from '../InfoBlock';
import PersonPinIcon from '../../../../assets/icons/PersonPinIcon';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import Lato from '../../../../components/labels/Lato';
import {isUnclaimed} from '../../../../utils/workOrderUtils/workOrder';
import JobLocation from './JobLocation';
import isJobVirtual from '../../../../utils/workOrderUtils/isJobVirtual';
import {layoutColors} from '../../../../constants/colors';

const styles = StyleSheet.create({
  map: {
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 25,
    marginTop: 20,
  },
  tenantIcon: {
    overflow: 'hidden',
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  topMargin6: {marginTop: 6},
  heightLine20: {lineHeight: 20},
  bottomMargin13: {marginBottom: 13},
});

type Props = {
  job: IPopulatedWorkOrder;
  withTitle?: boolean;
  withShowOnMapButton?: boolean;
};

export default function GettingThere(props: Props) {
  const {job, withShowOnMapButton = true, withTitle = true} = props;

  const isVirtualAssessment = isJobVirtual(job);

  const title = isVirtualAssessment ? 'Property Location' : 'Getting there';

  return (
    <Part testID={'jobLocation'} line>
      {withTitle && <PartTitle marginBottom={5}>{title}</PartTitle>}
      {isVirtualAssessment && (
        <Lato
          fontDimensions={FontDimensions.BODY1}
          color={layoutColors.black70}
          style={styles.bottomMargin13}>
          This is a{' '}
          <Lato
            fontDimensions={FontDimensions.BODY1}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.black70}>
            virtual
          </Lato>{' '}
          assessment.{' '}
          <Lato
            fontDimensions={FontDimensions.BODY1}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.black70}>
            Do not show up at the property!
          </Lato>
        </Lato>
      )}

      <JobLocation job={job} withShowButton={withShowOnMapButton} />

      {Boolean(job.tenantInformation) && !isUnclaimed(job) && (
        <InfoBlock
          Title={
            <Lato
              fontDimensions={FontDimensions.BODY1}
              fontWeight={FontWeights.BOLD}>
              Tenant Information
            </Lato>
          }
          Icon={<PersonPinIcon />}>
          <Lato fontDimensions={FontDimensions.BODY1} style={styles.topMargin6}>
            {job.tenantInformation}
          </Lato>
        </InfoBlock>
      )}
    </Part>
  );
}
