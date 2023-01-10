import React from 'react';
import {IAttachment} from '../../../../types/work-order';
import {FlatList, StyleSheet} from 'react-native';
import AttachmentItem from './AttachmentItem';

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
});

type Props = {
  attachments: IAttachment[];
};

export default function JobAttachments(props: Props) {
  const {attachments} = props;

  return (
    <FlatList
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={attachments}
      renderItem={({item}) => <AttachmentItem attachment={item} />}
      keyExtractor={item => item.filePath}
    />
  );
}
