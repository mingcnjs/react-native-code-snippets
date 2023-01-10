import React, {ReactNode} from 'react';
import Markdown from 'react-native-markdown-display';
import {markdownStyles} from '../../../utils/markDownStyles';

type Prop = {
  children: ReactNode;
};

const MarkdownView = ({children}: Prop) => {
  return <Markdown style={markdownStyles}>{children}</Markdown>;
};

export default MarkdownView;
