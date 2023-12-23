import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { ChevronDown, Trash } from 'lucide-react';
import dayjs from 'dayjs';

import { IThreads, chatAtom, currentThreadIdAtom } from '@/store';
import { lforage, threadsKey } from '@/utils/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const ThreadsButton = () => {
  const [currentChatId, setCurrentChatId] = useAtom(currentThreadIdAtom);
  const setChat = useSetAtom(chatAtom);
  const [threads, setThreads] = useState<IThreads>([]);

  const fetchThreads = useCallback(async () => {
    // Retrieve saved threads
    const threads = (await lforage.getItem(threadsKey)) as IThreads;
    setThreads(threads);
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        fetchThreads();
      }
    },
    [fetchThreads]
  );

  const updateCurrentChatId = useCallback(
    (id: string, chats: any) => {
      setChat(chats, true as any);
      setCurrentChatId(id);
    },
    [setChat, setCurrentChatId]
  );

  const deleteChats = useCallback(
    async (ev: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, threadId: string) => {
      ev.stopPropagation();

      if (currentChatId === threadId) {
        setChat([] as any, true as any);
      }

      const threads: IThreads | null = await lforage.getItem(threadsKey);
      const filterThreads = threads?.filter(({ id }) => id !== threadId);
      await lforage.setItem(threadsKey, filterThreads);

      // Reset
      fetchThreads();
    },
    [currentChatId, fetchThreads, setChat]
  );

  if (!threads || !Array.isArray(threads)) return null;

  return (
    <div className="absolute right-0 top-0 mr-5 mt-5">
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronDown />
            <span className="sr-only">Toggle thread dropdown</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {threads.map(({ id, thread, timestamp, name }) => (
            <DropdownMenuItem
              key={id}
              className={`max-w-screen ${id === currentChatId ? 'bg-accent' : ''}`}
              onClick={() => updateCurrentChatId(id, thread)}>
              <div className="flex items-center gap-2 w-[200px]">
                <p className="truncate w-[22ch]">
                  {name || dayjs(timestamp).format('hh:mm A - DD/MM/YY')}
                </p>
                <Button
                  className="h-7 w-7"
                  variant="destructive"
                  size="icon"
                  onClick={(ev) => deleteChats(ev, id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThreadsButton;
