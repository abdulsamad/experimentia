import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { ChevronDown, Trash } from 'lucide-react';
import dayjs from 'dayjs';

import { IThreads, chatAtom, currentChatIdAtom } from '@/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { lforage } from '@/utils';

const ThreadsButton = () => {
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const setChats = useSetAtom(chatAtom);
  const [threads, setThreads] = useState<IThreads>([]);

  const fetchThreads = useCallback(async () => {
    // Retrieve saved threads
    const threads = (await lforage.getItem('threads')) as IThreads;
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
      setChats(chats, true as any);
      setCurrentChatId(id);
    },
    [setChats, setCurrentChatId]
  );

  const deleteChats = useCallback(
    (ev: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: string) => {
      ev.stopPropagation();

      window?.alert('Delete is not implemented yet! \nYou can clear site data to delete the chats');
      if (currentChatId === id) {
        //
        return;
      }
    },
    [currentChatId]
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
              <div className="flex items-center gap-2">
                <p className="truncate max-w-[250px] lg:max-w-[500px]">
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
