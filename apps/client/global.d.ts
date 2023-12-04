declare namespace NodeJS {
  interface ProcessEnv {
    AUTH0_BASE_URL: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_ISSUER_BASE_URL: string;
    AUTH0_SECRET: string;
    NEXT_PUBLIC_CONFIGCAT_API_KEY: string;
    NEXT_PUBLIC_SERVER_ENDPOINT: string;
    OPENAI_API_KEY: string;
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
