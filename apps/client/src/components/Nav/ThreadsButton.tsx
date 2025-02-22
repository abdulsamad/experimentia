import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { ChevronDown, Trash, Plus } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ThreadsButton = () => {
  const [currentThreadId, setCurrentThreadId] = useAtom(currentThreadIdAtom);
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
      setCurrentThreadId(id);
    },
    [setChat, setCurrentThreadId]
  );

  const deleteChats = useCallback(
    async (ev: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, threadId: string) => {
      ev.stopPropagation();

      if (currentThreadId === threadId) {
        setChat([] as any, true as any);
      }

      const threads: IThreads | null = await lforage.getItem(threadsKey);
      const filterThreads = threads?.filter(({ id }) => id !== threadId);
      await lforage.setItem(threadsKey, filterThreads);

      // Reset
      fetchThreads();
    },
    [currentThreadId, fetchThreads, setChat]
  );

  const addNewChat = useCallback(() => {
    setChat([] as any, true as any);
    setCurrentThreadId(crypto.randomUUID());
  }, [setChat, setCurrentThreadId]);

  if (!threads || !Array.isArray(threads)) return null;

  return (
    <div className="absolute right-0 top-0 mr-5 mt-5">
      <Button variant="outline" size="icon" onClick={addNewChat}>
        <Plus />
      </Button>
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
              className={`max-w-screen ${id === currentThreadId ? 'bg-accent' : ''}`}
              onClick={() => updateCurrentChatId(id, thread)}>
              <div className="flex items-center gap-2 w-[200px]">
                <p className="truncate w-[22ch]">
                  {name || dayjs(timestamp).format('hh:mm A - DD/MM/YY')}
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="h-7 w-7"
                      variant="destructive"
                      size="icon"
                      onClick={(ev) => ev.stopPropagation()}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your thread.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={(ev) => ev.stopPropagation()}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          className="bg-red-600 text-white"
                          onClick={(ev) => deleteChats(ev, id)}>
                          Delete
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThreadsButton;
