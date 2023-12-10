import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import parse from 'html-react-parser';

import { Button } from '@/components/ui/button';

interface IMessage {
  isUser: boolean;
  messageClassNames: string;
  message?: string;
}

const Message = ({ isUser, messageClassNames, message }: IMessage) => {
  return (
    <div className="relative">
      <span
        className={`message relative inline-block max-w-[400px] py-1.5 px-3 rounded-xl before:content-[''] before:block before:h-0 before:w-0 before:border-y-8 before:border-y-transparent before:border-l-[14px] before:border-l-primary before:absolute before:top-1/2 before:-translate-y-1/2 ${messageClassNames}`}>
        {parse(message as string)}
      </span>
      {!isUser && (
        <CopyToClipboard text={message as string} onCopy={() => toast.success('Copied!')}>
          <Button
            title="Copy"
            size="icon"
            className="h-6 w-6 absolute bottom-0 -right-8 -translate-y-1/2 group-hover/chat:visible invisible">
            <Copy className="h-4 w-4" />
          </Button>
        </CopyToClipboard>
      )}
    </div>
  );
};

export default Message;
