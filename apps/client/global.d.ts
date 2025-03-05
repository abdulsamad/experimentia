// react-image-gallery
declare module 'react-image-gallery' {
  import { Component } from 'react';
  export default class ReactImageGallery extends Component<any> {}
}

// react-copy-to-clipboard
declare module 'react-copy-to-clipboard' {
  import * as React from 'react';

  interface CopyToClipboardProps {
    children: React.ReactNode;
    text: string;
    onCopy?: (text: string, result: boolean) => void;
  }

  export class CopyToClipboard extends React.Component<CopyToClipboardProps> {}
}
