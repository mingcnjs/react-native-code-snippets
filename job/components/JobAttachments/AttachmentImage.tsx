import React, {useState} from 'react';
import ImageModal from 'react-native-image-modal';
import CoverLayer from '../../../../components/CoverLayer';
import {layoutColors} from '../../../../constants/colors';
import Loading from '../../../../components/Loading';
import {IAttachment} from '../../../../types/work-order';
import {ImageSize} from './AttachmentItem';

type Props = {
  attachment: IAttachment;
  imageSize: ImageSize;
};

export default function AttachmentImage(props: Props) {
  const {attachment, imageSize} = props;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <ImageModal
        resizeMode={'cover'}
        modalImageResizeMode={'contain'}
        style={imageSize}
        source={{uri: attachment.filePath}}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <CoverLayer color={layoutColors.lightBeige} opacity={0.5}>
          <Loading />
        </CoverLayer>
      )}
    </>
  );
}
