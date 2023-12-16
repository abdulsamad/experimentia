import NextImage from 'next/image';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

import { IMessageCommons, ITextMessage, IImageMessage } from '@/store';

import Image from './Image';
import Text from './Text';

interface ExtraProps extends IMessageCommons {
  messageClassNames: string;
  userImageSrc: string;
  name: string | null | undefined;
  message: never;
  image: never;
  size: never;
}

type MessageProps = ExtraProps & (ITextMessage | IImageMessage);

const Message = ({
  name,
  messageClassNames,
  userImageSrc,
  timestamp,
  format,
  type,
  message,
  image,
  size,
}: MessageProps) => {
  const isImage = format === 'image';
  const isUser = type === 'user';

  // Contional classes
  const nameTimeMargin = isUser ? 'mr-[45px]' : 'ml-[55px]';
  const chatOrigin = isUser ? 'origin-right' : 'origin-left';

  return (
    <motion.div
      initial={isUser ? { translateY: '10px', scaleX: 0.5 } : { translateY: '-10px', scaleX: 0.5 }}
      animate={{ translateY: 0, scaleX: 1 }}
      className={`chat relative group/chat flex my-4 scroll-mb-10 ${chatOrigin}`}
      data-type={type}>
      <div className={`${isUser ? 'ml-auto' : ''}`}>
        {/* Name and Time */}
        <div className={`flex items-center gap-x-1 ${isImage ? 'mb-1' : nameTimeMargin}`}>
          <div className="text-sm">{!isImage && <span className="capitalize">{name}</span>}</div>
          <time className="text-xs italic opacity-60 ml-1">
            {dayjs(timestamp).format('hh:mm A')}
          </time>
        </div>
        <div
          className={`flex justify-start items-center gap-x-3 ${isUser ? 'flex-row-reverse' : ''}`}>
          {/* User or Variation Image */}
          {!isImage && (
            <div className="min-w-[40px] rounded-[999px] overflow-hidden">
              <NextImage src={userImageSrc} alt={name as string} height={40} width={40} />
            </div>
          )}
          {/* Image or Message */}
          {isImage && image ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image image={image} size={size} />
          ) : (
            <Text isUser={isUser} messageClassNames={messageClassNames} message={message} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
