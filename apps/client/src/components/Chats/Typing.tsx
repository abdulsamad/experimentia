const Typing = () => (
  <div className="chat chat-start">
    <div className="chat-bubble chat-bubble-primary">
      <div className="flex items-center justify-center gap-1 h-6">
        <div className="w-1 h-1 bg-slate-200 rounded-[50%] animate-typing"></div>
        <div className="w-1 h-1 bg-slate-200 rounded-[50%] animate-typing [animation-delay:150ms]"></div>
        <div className="w-1 h-1 bg-slate-200 rounded-[50%] animate-typing [animation-delay:300ms]"></div>
      </div>
    </div>
  </div>
);

export default Typing;
