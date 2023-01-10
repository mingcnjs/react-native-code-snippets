import React from 'react';
import {
  IPopulatedWorkOrder,
  IWorkOrderStatus,
} from '../../../../../types/work-order';
import Part from '../../Part/Part';
import PartTitle from '../../Part/PartTitle';
import AcceptedJobTimeInfo from './AcceptedJobTimeInfo';
import UnclaimedJobTimeInfo from './UnclaimedJobTimeInfo';
import SubmittedJobTimeInfo from './SubmittedJobTimeInfo';

type Props = {
  job: IPopulatedWorkOrder;
};

type WrapperProp = {
  children: React.ReactNode;
};

export default function Time(props: Props) {
  const {job} = props;

  const Wrapper = ({children}: WrapperProp) => (
    <Part line>
      <PartTitle>Time</PartTitle>
      {children}
    </Part>
  );

  function renderContent() {
    switch (job.status) {
      case IWorkOrderStatus.UNACCEPTED:
      case IWorkOrderStatus.UNCLAIMED:
        return (
          <Wrapper>
            <UnclaimedJobTimeInfo
              timeSlots={job.availableTimeSlots}
              job={job}
            />
          </Wrapper>
        );
      case IWorkOrderStatus.ACCEPTED:
        return job?.acceptedTimeSlot?.startDate ? (
          <Wrapper>
            <AcceptedJobTimeInfo job={job} />
          </Wrapper>
        ) : (
          <></>
        );

      case IWorkOrderStatus.SUBMITTED:
      case IWorkOrderStatus.APPROVED:
      case IWorkOrderStatus.IN_REVIEW:
      case IWorkOrderStatus.REWORK:
      case IWorkOrderStatus.TRIP_FEE_ONLY:
      case IWorkOrderStatus.PAID:
      case IWorkOrderStatus.REJECTED:
      case IWorkOrderStatus.CANT_SERVICE:
        return !job?.startTime && !job?.endTime && !job?.workHours ? (
          <></>
        ) : (
          <Wrapper>
            <SubmittedJobTimeInfo job={job} />
          </Wrapper>
        );
    }
  }

  return <>{renderContent()}</>;
}
