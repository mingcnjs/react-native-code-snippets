import React, {useState} from 'react';
import Part from '../Part/Part';
import PartTitle from '../Part/PartTitle';
import TaskList from '../TaskList';
import TextLink from './TextLink';

type Props = {
  tasks: string[] | undefined;
};

export default function Tasks(props: Props) {
  const {tasks} = props;

  const [showMore, setShowMore] = useState(false);

  if (tasks && tasks.length) {
    return (
      <Part line>
        <PartTitle>Task List</PartTitle>
        <TaskList taskList={tasks} showAll={showMore} />
        {tasks.length > 3 && (
          <TextLink
            arrow={!showMore}
            title={showMore ? 'Hide' : 'Show more'}
            onPress={() => setShowMore(prevState => !prevState)}
          />
        )}
      </Part>
    );
  }
  return null;
}
