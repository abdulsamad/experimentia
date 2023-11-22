interface IEmpty {
	nickname: string | null | undefined;
	textInput: boolean;
}

const Empty = ({ nickname, textInput }: IEmpty) => {
	return (
		<div className='hero min-h-[250px] bg-base-200 text-sky-200 border-2 rounded-3xl border-sky-200 shadow-[0_0_1px_#fff,inset_0_0_1px_#fff,0_0_2px_#08f,0_0_6px_#08f,0_0_15px_#08f]'>
			<div className='hero-content text-center'>
				<div className='max-w-md'>
					<h1 className='text-5xl font-bold capitalize break-all'>
						Hello {nickname || 'there'},{' '}
						<span className='animate-wave'>👋</span>
					</h1>
					<h1 className='py-6 italic break-words [text-wrap:pretty]'>
						{textInput
							? `Type in the input box in the bottom and start chatting. You can also change settings from the hamburger menu in the top left corner.`
							: `Tap the mic button in the bottom right corner and start speaking. You can also change settings from the hamburger menu in the top left corner.`}
					</h1>
				</div>
			</div>
		</div>
	);
};

export default Empty;
