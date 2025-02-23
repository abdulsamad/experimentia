import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import Markdown from 'react-markdown';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { TerminalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface IText {
  isUser: boolean;
  messageClassNames: string;
  message?: string;
}

const Text = ({ isUser, messageClassNames, message }: IText) => {
  const fallbackRender = ({ error }: FallbackProps) => (
    <Alert>
      <TerminalIcon className="h-4 w-4" />
      <AlertTitle>Error Rendering Message</AlertTitle>
      <AlertDescription>
        <p>Unable to display this message due to an error:</p>
        <pre style={{ color: 'red' }}>{error.message}</pre>
        <p className="text-sm text-muted-foreground mt-2">
          This could be due to invalid markdown formatting or unsupported content in the response.
          You can still copy the raw message using the copy button.
        </p>
      </AlertDescription>
    </Alert>
  );

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <div className="relative">
        <span
          className={`message relative inline-block max-w-[400px] py-1.5 px-3 rounded-xl before:content-[''] before:block before:h-0 before:w-0 before:border-y-8 before:border-y-transparent before:border-l-[14px] before:border-l-primary before:absolute before:top-1/2 before:-translate-y-1/2 ${messageClassNames}`}>
          <Markdown components={{ div: ({ children }) => <span>{children}</span> }}>
            {message || ''}
          </Markdown>
        </span>
        <CopyToClipboard text={message as string} onCopy={() => toast.success('Copied!')}>
          <Button
            title="Copy"
            size="icon"
            className={`h-6 w-6 -translate-y-1/2 group-hover/chat:visible invisible absolute bottom-0 ${
              isUser ? '-left-8' : '-right-8'
            }`}>
            <Copy className="h-4 w-4" />
          </Button>
        </CopyToClipboard>
      </div>
    </ErrorBoundary>
  );
};

export default Text;
