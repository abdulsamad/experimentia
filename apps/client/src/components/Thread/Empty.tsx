import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { variations } from 'utils';

import { configAtom } from '@/store';
import { Button } from '../ui/button';

interface IEmpty {
  nickname: string | null | undefined;
  textInput: boolean;
}

const Empty = ({ nickname, textInput }: IEmpty) => {
  const { variation } = useAtomValue(configAtom);

  const hints = useMemo(
    () => variations.find(({ code }) => code === variation)?.hints,
    [variation]
  );
  const description = useMemo(
    () => variations.find(({ code }) => code === variation)?.description,
    [variation]
  );

  return (
    <div className="flex justify-center items-center min-h-[250px] bg-base-200">
      <div className="text-center">
        <div className="max-w-md mx-auto mt-16">
          <h1 className="text-5xl font-bold capitalize break-all">
            Hello {nickname || 'there'},{' '}
            <span className="animate-wave origin-[70%_70%] inline-block">👋</span>
          </h1>
          <h2 className="py-6 italic break-words [text-wrap:pretty]">
            {textInput
              ? `Type in the input box in the bottom and start chatting. You can also change settings from the hamburger menu in the top left corner.`
              : `Tap the mic button in the bottom right corner and start speaking. You can also change settings from the hamburger menu in the top left corner.`}
          </h2>
        </div>
        {description && hints?.length && (
          <>
            <blockquote className="mt-6 mb-3 italic">{description}</blockquote>
            <h3 className="my-3 font-semibold">Query Hints:&nbsp;</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {hints.map((hint) => (
                <CopyToClipboard key={hint} text={hint} onCopy={() => toast.success('Copied!')}>
                  <div className="bg-[rgba(_255,_255,_255,_0.25)] [box-shadow:0_8px_32px_0_rgba(_31,_38,_135,_0.37)] backdrop-filter backdrop-blur-sm rounded-[10px] border border-solid border-[rgba(255,255,255,0.18)] cursor-default">
                    <p className="my-3 px-2 whitespace-nowrap max-w-full">{hint}</p>
                  </div>
                </CopyToClipboard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Empty;
