import { type HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'sonner';
import { CopyIcon, TerminalIcon } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { clsx } from 'clsx';
import '@fontsource/fira-code';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableFooter,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface IText {
  isUser: boolean;
  messageClassNames: HTMLAttributes<HTMLSpanElement>['className'];
  message?: string;
}

const Text = ({ isUser, messageClassNames, message }: IText) => {
  return (
    <Card
      className={`message group/message relative inline-block py-1.5 px-3 rounded-xl before:content-[''] before:block before:h-0 before:w-0 before:border-y-8 before:border-y-transparent before:border-l-[14px] before:border-l-primary before:absolute before:top-1/2 before:-translate-y-1/2] w-[min(70%,_600px)] ${messageClassNames} [&_p:has(code)]:leading-8 [&_div:has(code)]:leading-8 [&_span:has(code)]:leading-8`}>
      {isUser ? (
        message
      ) : (
        <ErrorBoundary fallbackRender={fallbackRender}>
          <Markdown
            remarkPlugins={[[remarkGfm]]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');

                return (
                  <>
                    {match ? (
                      <div className="leading-relaxed ligatures [font-family:_Fira_Code]">
                        <div className="flex justify-end items-center">
                          {/* @ts-ignore */}
                          <CopyToClipboard
                            text={children!?.toString()}
                            onCopy={() => toast.success('Copied!')}>
                            <Button
                              title="Copy"
                              size="default"
                              className="h-6 w-20 font-sans ml-auto mr-[11px] rounded-t-lg rounded-b-none transition-all duration-300 opacity-0 translate-y-1 group-hover/message:opacity-100 group-hover/message:translate-y-0">
                              <span>Copy</span> <CopyIcon className="h-4 w-4" />
                            </Button>
                          </CopyToClipboard>
                        </div>
                        <div className="font-bold">
                          {/* @ts-ignore */}
                          <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            customStyle={{ margin: 0 }}
                            language={match[1]}
                            style={vscDarkPlus}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    ) : (
                      <code
                        {...rest}
                        className={clsx(
                          className,
                          `bg-[#1E1E1E] text-slate-50 py-1 px-2 rounded-xl font-medium select-all [font-family:_Fira_Code]`
                        )}>
                        {children?.toString().trim()}
                      </code>
                    )}
                  </>
                );
              },
              p: ({ children }) => <p>{children}</p>,
              span: ({ children }) => <span>{children}</span>,
              div: ({ children }) => <div>{children}</div>,
              table: ({ children }) => <Table>{children}</Table>,
              thead: ({ children }) => <TableHeader>{children}</TableHeader>,
              tbody: ({ children }) => <TableBody>{children}</TableBody>,
              tfoot: ({ children }) => <TableFooter>{children}</TableFooter>,
              tr: ({ children }) => <TableRow>{children}</TableRow>,
              th: ({ children }) => <TableHead>{children}</TableHead>,
              td: ({ children }) => <TableCell>{children}</TableCell>,
            }}>
            {message || ''}
          </Markdown>
        </ErrorBoundary>
      )}
    </Card>
  );
};

const fallbackRender = ({ error }: FallbackProps) => (
  <Alert>
    <TerminalIcon className="h-4 w-4" />
    <AlertTitle>Error Rendering Message</AlertTitle>
    <AlertDescription>
      <p>Unable to display this message due to an error:</p>
      {/* <pre style={{ color: 'red' }}>{error.message}</pre> */}
      <p className="text-sm text-muted-foreground mt-2">
        This could be due to invalid markdown formatting or unsupported content in the response. You
        can still copy the raw message using the copy button.
      </p>
    </AlertDescription>
  </Alert>
);

export default Text;
