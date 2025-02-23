import { HTMLAttributes, useCallback, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { LogOutIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useEffect, MouseEvent } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useSetAtom } from 'jotai';
import dayjs from 'dayjs';

import { chatAtom, currentThreadIdAtom } from '@/store';
import { lforage, threadsKey } from '@/utils/config';

import { IThreads, sidebarAtom } from '@/store';
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
  const { user } = useUser();

  const [currentThreadId, setCurrentThreadId] = useAtom(currentThreadIdAtom);
  const setChat = useSetAtom(chatAtom);
  const [threads, setThreads] = useState<IThreads>([]);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const updateCurrentChatId = useCallback(
    (id: string, thread: any) => {
      setChat(thread, true as any);
      setCurrentThreadId(id);

      // Set params
      router.replace(`${pathname}?${createQueryString('threadId', id)}`, { scroll: false });
    },
    [createQueryString, pathname, router, setChat, setCurrentThreadId]
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

    // Set params
    router.replace(pathname, { scroll: false });
  }, [pathname, router, setChat, setCurrentThreadId, setSidebarOpen]);

  if (!threads?.length || !Array.isArray(threads)) return null;

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <div
          className="absolute inset-0 w-screen min-h-[100svh] backdrop-blur-md z-40 overflow-hidden"
          onClick={(ev) => {
            if (ev.currentTarget === ev.target) setSidebarOpen(false);
          }}>
          <motion.aside
            className="h-full w-[300px] pb-10 pt-5 flex flex-col justify-between overflow-x-hidden overflow-y-auto shadow-2xl bg-white dark:bg-black"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={sidebarVariants}>
            <div>
              <ul className="space-y-3 mb-5">
                <li>
                  <div className="flex items-center space-x-3">
                    <Image
                      className="rounded-full size-[40px] object-cover"
                      src={user?.picture as string}
                      alt={user?.name as string}
                      height={40}
                      width={40}
                    />
                    <div>
                      <p className="text-sm text-white opacity-75">Hello 👋</p>
                      <p className="text-lg font-semibold text-white opacity-75">
                        {user?.name?.includes('@') ? (
                          <span>{user.name}</span>
                        ) : (
                          <span>{user?.nickname || user?.email}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="py-2 px-4">
                  <hr className="border-gray-700" />
                </li>
                <li className="px-4 mb-4 w-full">
                  <Button
                    variant="default"
                    className="w-full bg-purple-500 text-white"
                    onClick={addNewChat}>
                    <PlusIcon className="mr-2" />
                    New Chat
                  </Button>
                </li>
              </ul>
              <div className="space-y-2 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-245px)]">
                  {threads.map(({ id, thread, timestamp, name }) => {
                    const isSelected = id === currentThreadId;
                    const rootClasses: HTMLAttributes<HTMLButtonElement>['className'] = isSelected
                      ? `relative before:content-[''] before:absolute before:-left-0 before:top-1/2 before:-translate-y-1/2 before:w-24 before:h-24 before:rounded-[10px] before:bg-blue-500 before:rotate-45 before:-translate-x-[103px]`
                      : '';
                    const backgroundClasses: HTMLAttributes<HTMLButtonElement>['className'] =
                      isSelected ? 'bg-[rgba(255,255,255,0.15)]' : '';

                    return (
                      <div
                        key={id}
                        className={`w-full rounded-none cursor-default hover:bg-transparent ${rootClasses}`}
                        onClick={() => {
                          setSidebarOpen(false);
                          updateCurrentChatId(id, thread);
                        }}>
                        <div
                          className={`flex items-center justify-around gap-2 w-full py-2 rounded-[8px] ${backgroundClasses}`}>
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
            </div>
            <div className="px-4">
              <ul className="space-y-5">
                <li>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border border-slate-800 text-slate-50"
                    asChild>
                    <Link href="/api/auth/logout">
                      <LogOutIcon className="size-4 mr-2" />
                      Logout
                    </Link>
                  </Button>
                </li>
              </ul>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
