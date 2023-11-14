import Image from 'next/image';
import dayjs from 'dayjs';

interface ChatProps {
	containerClassNames: string;
	imageSrc: string;
	name: string | null | undefined;
	time: dayjs.Dayjs;
	messageClassNames: string;
	message: string;
}

const Chat = ({
	containerClassNames,
	imageSrc,
	name,
	time,
	messageClassNames,
	message,
}: ChatProps) => {
	return (
		<div className={`chat ${containerClassNames}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<Image src={imageSrc} alt={name as string} height={40} width={40} />
				</div>
			</div>
			<div className='chat-header'>
				<span className='capitalize'>{name}</span>
				<time className='text-xs opacity-50 ml-1'>
					{dayjs(time).format('hh:mm A')}
				</time>
			</div>
			<div className={`chat-bubble ${messageClassNames}`}>{message}</div>
		</div>
	);
};

export default Chat;
