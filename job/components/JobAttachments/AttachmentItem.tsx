import React from 'react';
import {IAttachment} from '../../../../types/work-order';
import {StyleSheet, View} from 'react-native';
import AttachmentImage from './AttachmentImage';

export type ImageSize = {height: number; width: number};

const IMAGE_SIZE: ImageSize = {
  height: 100,
  width: 140,
};

const styles = StyleSheet.create({
  attachment: {
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

type Props = {
  attachment: IAttachment;
  imageAttachmentSize?: ImageSize;
};

export default function AttachmentItem(props: Props) {
  const {attachment, imageAttachmentSize} = props;

  return (
    <View style={styles.attachment}>
      {attachment.type === 'PHOTO' && (
        <AttachmentImage
          attachment={attachment}
          imageSize={imageAttachmentSize || IMAGE_SIZE}
        />
      )}
    </View>
  );
}
