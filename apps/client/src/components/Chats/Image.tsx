import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'sonner';
import { Download, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface IImage {
  src?: string;
  alt?: string;
}

const Image = ({ src, alt }: IImage) => {
  return (
    <div className="group max-w-[400px]">
      <figure>
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="rounded-xl" height={300} width={300} />
          <Button variant="outline" size="icon" asChild>
            <a
              href={src}
              title="Download"
              className="group-hover:flex hidden m-3 absolute bottom-0 right-0 items-center justify-center"
              download>
              <Download />
              <span className="sr-only">Download image</span>
            </a>
          </Button>
        </div>
        <Accordion type="single" className="w-[300px]" collapsible>
          <AccordionItem value="prompt">
            <AccordionTrigger>Prompt</AccordionTrigger>
            <AccordionContent className="group/prompt relative">
              {alt ? (
                <>
                  <figcaption>{alt}</figcaption>
                  <CopyToClipboard text={alt as string} onCopy={() => toast.success('Copied!')}>
                    <Button
                      title="Copy"
                      size="icon"
                      className="h-6 w-6 absolute right-0 bottom-0 m-3 group-hover/prompt:visible invisible">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CopyToClipboard>
                </>
              ) : (
                <div className="text-center p-2">
                  <h1>No prompt to show!</h1>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </figure>
    </div>
  );
};

export default Image;
