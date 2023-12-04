import Image from 'next/image';
import dayjs from 'dayjs';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

import { IChat } from '@/store';
import { Button } from '@/components/ui/button';

interface ExtraProps {
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
  messageClassNames,
  userImageSrc,
  time,
  format,
  message,
  image,
  type,
}: ChatProps) => {
  const isImage = format === 'image';
  const isUser = type === 'user';

  return (
    <motion.div
      initial={isUser ? { translateY: '10px', scaleX: 0.5 } : { translateY: '-10px', scaleX: 0.5 }}
      animate={{ translateY: 0, scaleX: 1 }}
      className={`chat flex my-4 scroll-mb-10 ${isUser ? 'origin-right' : 'origin-left'}`}
      data-type={type}>
      <div className={`${isUser ? 'ml-auto' : ''}`}>
        {/* Name and Time */}
        <div
          className={`flex items-center gap-x-1 ${
            isImage ? 'mb-1' : isUser ? 'mr-[45px]' : 'ml-[55px]'
          }`}>
          <div className="text-sm">{!isImage && <span className="capitalize">{name}</span>}</div>
          <time className="text-xs italic opacity-60 ml-1">{dayjs(time).format('hh:mm A')}</time>
        </div>
        <div
          className={`flex justify-start items-center gap-x-3 ${isUser ? 'flex-row-reverse' : ''}`}>
          {/* User or Variation Image */}
          {!isImage && (
            <div className="min-w-[40px] rounded-[100px] overflow-hidden">
              <Image src={userImageSrc} alt={name as string} height={40} width={40} />
            </div>
          )}
          {/* Image or Message */}
          {isImage ? (
            <div className="group max-w-[400px] relative">
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image?.url}
                  alt={image?.alt}
                  className="rounded-xl"
                  height={300}
                  width={300}
                />
                <figcaption>{image?.alt}</figcaption>
              </figure>
              <Button variant="outline" size="icon" asChild>
                <a
                  href={image?.url}
                  className="group-hover:flex hidden absolute bottom-0 right-0 m-3 items-center justify-center"
                  download>
                  <Download />
                  <span className="sr-only">Download image</span>
                </a>
              </Button>
            </div>
          ) : (
            <span
              className={`message relative inline-block max-w-[400px] py-1.5 px-3 rounded-xl before:content-[''] before:block before:h-0 before:w-0 before:border-y-8 before:border-y-transparent before:border-l-[14px] before:border-l-primary before:absolute before:top-1/2 before:-translate-y-1/2 ${messageClassNames}`}
              dangerouslySetInnerHTML={{ __html: message as string }}></span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
