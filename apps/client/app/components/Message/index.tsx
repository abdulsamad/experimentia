import { format as dFnsFormat } from 'date-fns';
import { motion } from 'motion/react';

import { IMessageCommons, ITextMessage, IImageMessage } from '@/store';
import { UserInfo } from '@/components/Thread';

import Image from './Image';
import Text from './Text';

interface ExtraProps extends IMessageCommons {
  message?: ITextMessage['message'];
  image?: IImageMessage['image'];
  size?: IImageMessage['size'];
}

type MessageProps = ExtraProps & UserInfo['user' | 'assistant'] & (ITextMessage | IImageMessage);

const Message = ({
  name,
  messageClassNames,
  avatarImageSrc,
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
  const nameTimeMargin = isUser ? 'mr-[85px]' : 'ml-[75px]';
  const chatOrigin = isUser ? 'origin-right' : 'origin-left';

  return (
    <motion.div
      // initial={isUser ? { translateY: '10px', scaleX: 0.5 } : { translateY: '-10px', scaleX: 0.5 }}
      animate={{ translateY: 0, scaleX: 1 }}
      className={`chat relative flex my-4 scroll-mb-10 ${chatOrigin}`}
      data-type={type}
      layout>
      <div className={`${isUser ? 'ml-auto' : ''}`}>
        <div
          className={`flex justify-start items-center gap-x-3 ${isUser ? 'flex-row-reverse' : ''}`}>
          {/* Name and User or Variation Image */}
          {!isImage && (
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="min-w-[40px] rounded-[999px] overflow-hidden">
                <img src={avatarImageSrc} alt={name!} height={40} width={40} />
              </div>
              {!isImage && (
                <span className="text-xs w-[70px] capitalize truncate text-center overflow-hidden">
                  {name}
                </span>
              )}
            </div>
          )}
          {/* Image or Message */}
          {isImage && image && size ? (
            <Image key={image.url} image={image} size={size} />
          ) : (
            <Text isUser={isUser} messageClassNames={messageClassNames} message={message} />
          )}
        </div>
        {/* Time */}
        <div
          className={`flex items-center gap-x-1 pt-2 pl-2 ${isUser ? 'justify-end' : 'justify-start'} ${isImage ? 'mb-1' : nameTimeMargin}`}>
          <time className="text-xs italic opacity-60">
            {dFnsFormat(new Date(timestamp), 'hh:mm a')}
          </time>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
