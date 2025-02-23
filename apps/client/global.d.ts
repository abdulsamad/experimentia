declare namespace NodeJS {
  interface ProcessEnv {
    AUTH0_BASE_URL: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_AUDIENCE: string;
    AUTH0_SECRET: string;
    AUTH0_ISSUER_BASE_URL: string;
    NEXT_PUBLIC_SERVER_ENDPOINT: string;
  }
}

// react-image-gallery
declare module 'react-image-gallery' {
  import { Component } from 'react';
  export default class ReactImageGallery extends Component<any> {
    props: any;
    constructor(props: any);
    render(): JSX.Element;
  }
}

// use-sound
declare module 'use-sound' {
  export const useSound = (filepath: string) => [(play = () => null)];
}

// react-copy-to-clipboard
declare module 'react-copy-to-clipboard' {
  import * as React from 'react';
  export const CopyToClipboard = ({
    children,
    text,
    onCopy,
  }: {
    children: React.Node;
    text: string;
    onCopy: func;
  }) => children;
}
