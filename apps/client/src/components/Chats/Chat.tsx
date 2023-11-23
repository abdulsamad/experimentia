import Image from 'next/image';
import dayjs from 'dayjs';

import { IChat } from '@/store';

interface ExtraProps {
  containerClassNames: string;
  messageClassNames: string;
  userImageSrc: string;
  name: string | null | undefined;
  message?: string;
  image?: {
    url: string;
    alt: string;
  };
}

type ChatProps = IChat & ExtraProps;

const Chat = ({
  name,
  containerClassNames,
  messageClassNames,
  userImageSrc,
  time,
  format,
  message,
  image,
}: ChatProps) => {
  const isImage = format === 'image';

  return (
    <div className={`chat ${containerClassNames}`}>
      {!isImage && (
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image src={userImageSrc} alt={name as string} height={40} width={40} />
          </div>
        </div>
      )}
      <div className="chat-header">
        {!isImage && <span className="capitalize">{name}</span>}
        <time className="text-xs opacity-50 ml-1">{dayjs(time).format('hh:mm A')}</time>
      </div>
      <div className={`chat-bubble ${messageClassNames}`}>
        {isImage ? (
          <div className="group max-w-[300px]">
            <figure>
              <img src={image?.url} height={300} width={300} alt={image?.alt} />
              {/* <figcaption>{image?.alt}</figcaption> */}
            </figure>
            <a
              href={image?.url}
              className="group-hover:flex hidden btn btn-sm btn-circle absolute bottom-0 right-0 m-3 items-center justify-center"
              download>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </a>
          </div>
        ) : (
          message
        )}
      </div>
    </div>
  );
};

export default Chat;
