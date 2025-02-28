import { useEffect, useCallback, useState, type HTMLAttributes, type MouseEvent } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import { useAtom } from 'jotai';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { LogOutIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { useAuth, useUser } from '@clerk/react-router';

import {
  chatAtom,
  currentThreadIdAtom,
  IMessage,
  IThread,
  sidebarAtom,
  type IThreads,
} from '@/store';
import { lforage, threadsKey } from '@/utils/config';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { getName } from '@/utils';

export const sidebarVariants: Variants = {
  hidden: {
    opacity: 0,
    translateX: '-300px',
    transition: {
      bounce: 11,
    },
  },
  show: {
    opacity: 1,
    translateX: 0,
    transition: {
      bounce: 1,
    },
  },
};

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);
  const [currentThreadId, setCurrentThreadId] = useAtom(currentThreadIdAtom);
  const setChat = useSetAtom(chatAtom);
  const [threads, setThreads] = useState<IThreads>([]);

  const { user } = useUser();
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const threadId = searchParams.get('threadId');

  const fetchThreads = useCallback(async () => {
    // Retrieve saved threads
    const threads = (await lforage.getItem(threadsKey)) as IThreads;
    setThreads(threads);
  }, []);

  useEffect(() => {
    // Fetch latest threads
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    // Check and update threads from query params
    if (!threadId) return;

    const thread = threads?.find(({ id }) => id === threadId);

    if (thread) {
      setCurrentThreadId(thread.id);
      setChat(thread.thread as any, true as any);
    }
  }, [setChat, setCurrentThreadId, threadId, threads]);

  useEffect(() => {
    if (sidebarOpen) {
      fetchThreads();
    }
  }, [fetchThreads, sidebarOpen]);

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set(name, value);
  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  const updateCurrentChatId = useCallback(
    (id: ReturnType<typeof crypto.randomUUID>, thread: IMessage[]) => {
      setChat(thread as any, true as any);
      setCurrentThreadId(id);

      // Set params
      setSearchParams({ threadId: id });
    },
    [setChat, setCurrentThreadId, setSearchParams]
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
    setSidebarOpen(false);

    setChat([] as any, true as any);
    setCurrentThreadId(crypto.randomUUID());

    // Clear params
    setSearchParams({});
  }, [setChat, setCurrentThreadId, setSidebarOpen, setSearchParams]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <div
          className="absolute inset-0 w-screen min-h-[100svh] backdrop-blur-md z-40 overflow-hidden **:[li]:px-4"
          onClick={(ev) => {
            if (ev.currentTarget === ev.target) setSidebarOpen(false);
          }}>
          <motion.aside
            className="h-full w-[300px] pb-10 pt-5 flex flex-col justify-between overflow-x-hidden overflow-y-auto shadow-2xl bg-accent"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={sidebarVariants}>
            <div>
              <ul className="space-y-3 mb-5">
                <li className="">
                  <div className="flex items-center space-x-3">
                    <img
                      className="rounded-full size-[40px] object-cover"
                      src={user?.imageUrl!}
                      alt={user?.fullName!}
                      height={40}
                      width={40}
                    />
                    <div>
                      <p className="text-sm opacity-75">Hello 👋</p>
                      <p className="text-lg font-semibold opacity-75 capitalize">{getName(user)}</p>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <hr className="border-gray-700" />
                </li>
                <li className="mb-4 w-full">
                  <Button
                    variant="default"
                    className="w-full text-white bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 hover:from-purple-600 hover:via-purple-500 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    onClick={addNewChat}>
                    <PlusIcon className="mr-2" />
                    New Chat
                  </Button>
                </li>
              </ul>
              {!threads?.length || !Array.isArray(threads) ? null : (
                <div className="space-y-2 overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-245px)]">
                    {threads.map(({ id, thread, timestamp, name }) => {
                      const isSelected = id === currentThreadId;
                      const rootClasses: HTMLAttributes<HTMLButtonElement>['className'] = isSelected
                        ? `relative before:content-[''] before:absolute before:-left-0 before:top-1/2 before:-translate-y-1/2 before:w-24 before:h-24 before:rounded-[10px] before:bg-purple-500 before:rotate-45 before:-translate-x-[105px]`
                        : '';
                      const backgroundClasses: HTMLAttributes<HTMLButtonElement>['className'] =
                        isSelected ? 'bg-[rgba(255, 255, 255, 0.15)]' : '';

                      return (
                        <div
                          key={id}
                          className={`w-full px-4 rounded-none cursor-default hover:bg-transparent ${rootClasses}`}
                          onClick={() => {
                            setSidebarOpen(false);
                            updateCurrentChatId(id, thread);
                          }}>
                          <div
                            className={`flex items-center justify-between gap-2 w-full p-2 rounded-[8px] ${backgroundClasses}`}>
                            <p className={`truncate w-[22ch] text-left`}>
                              {name || dayjs(timestamp).format('hh:mm A - DD/MM/YY')}
                            </p>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  className="h-7 w-6"
                                  variant="destructive"
                                  size="icon"
                                  onClick={(ev) => ev.stopPropagation()}>
                                  <TrashIcon className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    thread.
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
                        </div>
                      );
                    })}
                  </ScrollArea>
                </div>
              )}
            </div>
            <ul className="space-y-5">
              <li>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => signOut({ redirectUrl: window.location.origin })}>
                  <span className="dark:text-slate-50 text-slate-700 flex items-center gap-2">
                    <LogOutIcon className="size-4" />
                    Logout
                  </span>
                </Button>
              </li>
            </ul>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
