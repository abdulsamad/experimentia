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
import {
  LogOutIcon,
  PlusIcon,
  TrashIcon,
  ChevronsUpDownIcon,
  LanguagesIcon,
  SunMoonIcon,
  UserRoundPenIcon,
  CheckIcon,
  ArrowUpRightIcon,
} from 'lucide-react';
import { useSetAtom } from 'jotai';
import { useClerk, useAuth, useUser } from '@clerk/react-router';
import { format } from 'date-fns';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

import { languages } from 'utils';

import { threadAtom, currentThreadIdAtom, type IThreads, configAtom } from '@/store';
import { getName } from '@/utils';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AppSidebar = () => {
  const [config, setConfig] = useAtom(configAtom);
  const { open, setOpen, setOpenMobile, isMobile } = useSidebar();
  const [currentThreadId, setCurrentThreadId] = useAtom(currentThreadIdAtom);
  const setThread = useSetAtom(threadAtom);
  const [threads, setThreads] = useState<IThreads>([]);

  const navigate = useNavigate();
  const clerk = useClerk();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language } = config;

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
    setOpenMobile(false);

    setThread([] as any, true as any);
    setCurrentThreadId(crypto.randomUUID());

    navigate('/');
  }, [setThread, setCurrentThreadId, setOpen]);

  const updateCurrentChatId = useCallback(
    (threadId: ReturnType<typeof crypto.randomUUID>) => {
      setCurrentThreadId(threadId);

      navigate(`/${threadId}`);
    },
    [setThread, setCurrentThreadId]
  );

  const updateSetting = useCallback(
    (name: string, value: string) => {
      setConfig({ ...config, [name]: value });
    },
    [config, setConfig]
  );

  return (
    <aside>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <ul className="flex flex-col mb-3 overflow-hidden">
                <li className="mt-5">
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
                  <ScrollArea className="h-[calc(100svh-210px)]">
                    <SidebarGroup>
                      <SidebarGroupLabel>Threads</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {threads.map(({ id, timestamp, name }) => {
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
                                  setOpenMobile(false);
                                  updateCurrentChatId(id);
                                }}>
                                <SidebarMenuButton asChild>
                                  <a
                                    className={clsx(
                                      'flex items-center justify-between gap-2 w-full p-2 rounded-[8px]',
                                      backgroundClasses
                                    )}>
                                    <p className="truncate w-fit text-foreground text-left">
                                      {name || format(new Date(timestamp), 'hh:mm A - DD/MM/YY')}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.imageUrl} alt={getName(user)} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{getName(user)}</span>
                      <span className="truncate text-xs">
                        {user?.emailAddresses[0].emailAddress}
                      </span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{getName(user)}</span>
                        <span className="truncate text-xs">
                          {user?.emailAddresses[0].emailAddress}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={clerk.redirectToUserProfile}>
                      <UserRoundPenIcon className="size-4 mr-2" />
                      My Profile
                      <ArrowUpRightIcon className="size-4 ml-auto mr-1" />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full flex items-center p-2 data-[state=open]:bg-accent">
                          <LanguagesIcon className="size-4 mr-2 text-muted-foreground" />
                          <span className="flex-1 text-left text-sm ml-2">Language</span>
                          <ChevronsUpDownIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="top"
                          align="end"
                          className="w-[160px] translate-x-16">
                          {languages.map(({ code, text }) => (
                            <DropdownMenuItem
                              key={code}
                              className={code === language ? 'font-semibold' : ''}
                              onClick={() => updateSetting('language', code)}>
                              {text}
                              <CheckIcon
                                className={clsx(
                                  'ml-auto h-4 w-4',
                                  code === language
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'opacity-0'
                                )}
                              />
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full flex items-center p-2 data-[state=open]:bg-accent">
                          <SunMoonIcon className="size-4 mr-2 text-muted-foreground" />
                          <span className="flex-1 text-left text-sm ml-2">Theme</span>
                          <ChevronsUpDownIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="top"
                          align="end"
                          className="w-[160px] translate-x-16">
                          {['light', 'dark', 'system'].map((themeOption) => (
                            <DropdownMenuItem
                              key={themeOption}
                              className={clsx(theme === themeOption && 'font-semibold')}
                              onClick={() => setTheme(themeOption)}>
                              {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                              <CheckIcon
                                className={clsx(
                                  'ml-auto h-4 w-4',
                                  theme === themeOption
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'opacity-0'
                                )}
                              />
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ redirectUrl: window.location.origin })}>
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </aside>
  );
};

export default AppSidebar;
