import { EditorContent } from '@tiptap/react';
import { useAtomValue } from 'jotai';
import { SendHorizonal } from 'lucide-react';

import { chatLoading } from '@/store';
import useCustomTiptapEditor from '@/hooks/useCustomTiptapEditor';
import { Button } from '@/components/ui/button';

const Text = () => {
  const { editor, handleSubmit } = useCustomTiptapEditor();
  const isChatResponseLoading = useAtomValue(chatLoading);

  return (
    <div className="flex gap-5 items-center p-5">
      <div className="flex-1 px-4 border-2 rounded-[99px] h-[50px] overflow-x-auto bg-slate-850 [scrollbar-width:none]">
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center">
        <Button
          size="lg"
          className="rounded-3xl px-3 hover:text-gray-400 hover:shadow-xl"
          onClick={handleSubmit}
          disabled={isChatResponseLoading}>
          <SendHorizonal />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default Text;
