import {
  useEffect,
  useCallback,
  useState,
  Suspense,
  type HTMLAttributes,
  type MouseEvent,
} from 'react';
import { useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import { LogOutIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useSetAtom } from 'jotai';
import { useAuth, useUser } from '@clerk/react-router';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { threadAtom, currentThreadIdAtom, IMessage, type IThreads } from '@/store';
import { getThreads, lforage, threadsKey } from '@/utils/lforage';
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { getName } from '@/utils';

const AppSidebar = () => {
  const { open, setOpen, setOpenMobile } = useSidebar();
  const [currentThreadId, setCurrentThreadId] = useAtom(currentThreadIdAtom);
  const setThread = useSetAtom(threadAtom);
  const [threads, setThreads] = useState<IThreads>([]);

  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const fetchThreads = useCallback(async () => {
    // Retrieve saved threads
    const threads = await getThreads();
    setThreads(threads);
  }, []);

  useEffect(() => {
    // Fetch latest threads
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    if (open) {
      fetchThreads();
    }
  }, [fetchThreads, open]);

  const deleteChats = useCallback(
    async (ev: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, threadId: string) => {
      ev.stopPropagation();

      if (currentThreadId === threadId) {
        setThread([] as any, true as any);
      }

      const threads: IThreads | null = await lforage.getItem(threadsKey);
      const filterThreads = threads?.filter(({ id }) => id !== threadId);
      await lforage.setItem(threadsKey, filterThreads);

      // Reset
      fetchThreads();
    },
    [currentThreadId, fetchThreads, setThread]
  );

  const addNewChat = useCallback(() => {
    setOpen(false);
    setOpenMobile(false);

    setThread([] as any, true as any);
    setCurrentThreadId(crypto.randomUUID());

    navigate('/');
  }, [setThread, setCurrentThreadId, setOpen]);

  const updateCurrentChatId = useCallback(
    (threadId: ReturnType<typeof crypto.randomUUID>, thread: IMessage[]) => {
      // setThread(thread as any, true as any);
      setCurrentThreadId(threadId);

      navigate(`/${threadId}`);
    },
    [setThread, setCurrentThreadId]
  );

  return (
    <aside>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <ul className="space-y-2 mb-3">
                <li>
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
                <li className="pt-2 pb-3">
                  <hr className="border-gray-700" />
                </li>
                <li>
                  <Button
                    variant="default"
                    className="w-full text-white bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 hover:from-purple-600 hover:via-purple-500 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    onClick={addNewChat}>
                    <PlusIcon className="mr-2" />
                    New Chat
                  </Button>
                </li>
              </ul>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <div className="h-full w-full flex flex-col justify-between overflow-x-hidden overflow-y-auto box-border">
            <Suspense fallback={'Loading......'}>
              {!threads?.length || !Array.isArray(threads) ? null : (
                <div className="space-y-2 overflow-hidden">
                  <ScrollArea className="h-[calc(100svh-245px)]">
                    <SidebarGroup>
                      <SidebarGroupLabel>Threads</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {threads.map(({ id, thread, timestamp, name }) => {
                            type ButtonClassNames = HTMLAttributes<HTMLButtonElement>['className'];
                            const isSelected = id === currentThreadId;
                            const rootClasses: ButtonClassNames = isSelected
                              ? `relative before:content-[''] before:absolute before:-left-0 before:top-1/2 before:-translate-y-1/2 before:w-24 before:h-24 before:rounded-[10px] before:bg-purple-500 before:rotate-45 before:-translate-x-[105px]`
                              : '';
                            const backgroundClasses: ButtonClassNames = isSelected
                              ? 'bg-[rgba(255, 255, 255, 0.15)]'
                              : '';

                            return (
                              <SidebarMenuItem
                                key={id}
                                className={clsx(
                                  'flex w-full px-4 rounded-none cursor-default hover:bg-transparent',
                                  rootClasses
                                )}
                                onClick={() => {
                                  setOpen(false);
                                  setOpenMobile(false);
                                  updateCurrentChatId(id, thread);
                                }}>
                                <SidebarMenuButton asChild>
                                  <a
                                    className={clsx(
                                      'flex items-center justify-between gap-2 w-full p-2 rounded-[8px]',
                                      backgroundClasses
                                    )}>
                                    <p className="truncate w-fit text-foreground text-left">
                                      {name || dayjs(timestamp).format('hh:mm A - DD/MM/YY')}
                                    </p>
                                  </a>
                                </SidebarMenuButton>
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
                                        This action cannot be undone. This will permanently delete
                                        your thread.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={(ev) => ev.stopPropagation()}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction asChild>
                                        <Button
                                          variant="destructive"
                                          className="bg-red-500 hover:bg-red-400 transition-transform ease-in-out duration-300 text-white hover:scale-95 active:scale-90"
                                          onClick={(ev) => deleteChats(ev, id)}>
                                          Delete
                                        </Button>
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </ScrollArea>
                </div>
              )}
            </Suspense>
          </div>
        </SidebarContent>

        <SidebarFooter className="px-2 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signOut({ redirectUrl: window.location.origin })}>
                <span className="dark:text-slate-50 text-slate-700 flex items-center gap-2">
                  <LogOutIcon className="size-4" />
                  Logout
                </span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </aside>
  );
};

export default AppSidebar;
