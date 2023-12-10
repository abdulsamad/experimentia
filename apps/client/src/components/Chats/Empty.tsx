import React from 'react';

interface IEmpty {
  nickname: string | null | undefined;
  textInput: boolean;
}

const Empty = ({ nickname, textInput }: IEmpty) => {
  return (
    <div className="flex justify-center items-center min-h-[250px] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
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
      </div>
    </div>
  );
};

export default Empty;
