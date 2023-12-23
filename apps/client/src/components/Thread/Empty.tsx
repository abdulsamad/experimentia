import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import { variations } from 'utils';

import { configAtom } from '@/store';

interface IEmpty {
  nickname: string | null | undefined;
  textInput: boolean;
}

const Empty = ({ nickname, textInput }: IEmpty) => {
  const { variation } = useAtomValue(configAtom);

  const hint = useMemo(() => variations.find(({ code }) => code === variation)?.hint, [variation]);

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
        {hint && <div className="my-6">{hint}</div>}
      </div>
    </div>
  );
};

export default Empty;
