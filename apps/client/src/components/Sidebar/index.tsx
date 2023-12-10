import { useCallback, useLayoutEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useTheme } from 'next-themes';
import { LogOut, X, Moon, Sun } from 'lucide-react';

import { languages, variations } from 'utils';

import { configAtom, flagsAtom, identifierAtom, sidebarAtom } from '@/store';
import { cn, IS_SPEECH_RECOGNITION_SUPPORTED, IS_SPEECH_SYNTHESIS_SUPPORTED } from '@/utils';
import imageSizes from '@/utils/image-sizes';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [config, setConfig] = useAtom(configAtom);
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);
  const flags = useAtomValue(flagsAtom);
  const setIdentifier = useSetAtom(identifierAtom);
  const { user } = useUser();
  const { setTheme } = useTheme();

  const { language, model, variation, imageSize, textInput, speakResults, style, quality } = config;
  const isImageModelSelected = ['dall-e-2', 'dall-e-3'].includes(model);
  const isDallE3Selected = model === 'dall-e-3';

  useLayoutEffect(() => {
    if (!user?.email) return;

    setIdentifier(user?.email);
  }, [user?.email, setIdentifier]);

  const updateSetting = useCallback(
    (name: string, value: string) => {
      setConfig({ ...config, [name]: value });
    },
    [config, setConfig]
  );

  const updateCheckSetting = useCallback(
    (name: string, checked: boolean) => {
      setConfig({ ...config, [name]: checked });
    },
    [config, setConfig]
  );

  const setImageSizeValue = useCallback(() => {
    if (!imageSizes(model).options.includes(imageSize)) {
      const defaultSize = imageSizes(model).default;
      updateSetting('imageSize', defaultSize);
      return defaultSize;
    }

    return imageSize;
  }, [imageSize, model, updateSetting]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <div
          className="absolute inset-0 w-screen h-[100vh] backdrop-blur-md z-40 overflow-hidden"
          onClick={(ev) => {
            if (ev.currentTarget === ev.target) setSidebarOpen(false);
          }}>
          <motion.aside
            className="h-full w-[300px] pb-10 pt-5 px-4 flex flex-col justify-between overflow-x-hidden overflow-y-auto shadow-2xl bg-white dark:bg-black"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={sidebarVariants}>
            <div>
              <div className="flex justify-between mb-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="px-2" variant="ghost" onClick={() => setSidebarOpen(false)}>
                  <X />
                </Button>
              </div>
              <ul className="space-y-10 mb-5">
                <li>
                  <div className="flex flex-col space-y-2">
                    <label className="ml-1">Model</label>
                    <Select value={model} onValueChange={(value) => updateSetting('model', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Text</SelectLabel>
                          <SelectItem value="gpt-3.5-turbo">GPT 3.5 (Chat GPT)</SelectItem>
                          <SelectItem value="gpt-4" disabled={!flags?.gpt4Enabled}>
                            <span className="mr-2">GPT 4</span>
                            <Badge
                              variant="outline"
                              className="dark:bg-slate-50 dark:text-slate-900">
                              Special
                            </Badge>
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Image</SelectLabel>
                          <SelectItem value="dall-e-2">DALL.E</SelectItem>
                          <SelectItem value="dall-e-3" disabled={!flags?.dallE3Enabled}>
                            <span className="mr-2">DALL.E 3</span>
                            <Badge
                              variant="outline"
                              className="dark:bg-slate-50 dark:text-slate-900">
                              Special
                            </Badge>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </li>
                {!isImageModelSelected && (
                  <li>
                    <div className="flex flex-col space-y-2">
                      <label className="ml-1">Variation</label>
                      <Select
                        value={variation}
                        onValueChange={(value) => updateSetting('variation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Variation" />
                        </SelectTrigger>
                        <SelectContent>
                          {variations.map(({ code, text }) => (
                            <SelectItem key={code} value={code}>
                              {text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </li>
                )}
                {isImageModelSelected && (
                  <li>
                    <div className="flex flex-col space-y-2">
                      <label className="ml-1">Image Size</label>
                      <Select
                        value={setImageSizeValue()}
                        onValueChange={(value) => updateSetting('imageSize', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Image Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {imageSizes(model).options.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </li>
                )}
                {isDallE3Selected && (
                  <>
                    <li>
                      <div className="flex flex-col space-y-2">
                        <label className="ml-1">Quality</label>
                        <Select
                          value={quality}
                          onValueChange={(value) => updateSetting('quality', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="hd">HD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-col space-y-2">
                        <label className="ml-1">Style</label>
                        <Select
                          value={style}
                          onValueChange={(value) => updateSetting('style', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vivid">Vivid</SelectItem>
                            <SelectItem value="natural">Natural</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </li>
                  </>
                )}
                <li>
                  <div className="flex flex-col space-y-2">
                    <label className="ml-1">Language</label>
                    <Select
                      value={language}
                      onValueChange={(value) => updateSetting('language', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(({ code, text }) => (
                          <SelectItem key={code} value={code}>
                            {text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
                {IS_SPEECH_RECOGNITION_SUPPORTED() && (
                  <li>
                    <div className="flex flex-col items-center justify-center space-y-3.5">
                      <h3 className="text-md">Input Type</h3>
                      <div className="flex items-center space-x-3 text-sm">
                        <span>Voice</span>
                        <Switch
                          checked={textInput}
                          onCheckedChange={(value) => updateCheckSetting('textInput', value)}
                        />
                        <span>Text</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-xs italic">
                        How you want to give input to GPT?
                      </p>
                    </div>
                  </li>
                )}
                {IS_SPEECH_SYNTHESIS_SUPPORTED() && !textInput && (
                  <li>
                    <div className="flex justify-center space-x-2">
                      <Checkbox
                        id="terms1"
                        checked={speakResults}
                        onCheckedChange={(value) =>
                          updateCheckSetting('speakResults', value as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Speak Results
                        </label>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <ul className="space-y-5">
                <li className="mb-6">
                  <div className="space-y-1">
                    <Image
                      className="rounded-full mx-auto mb-5"
                      src={user?.picture as string}
                      alt={user?.name as string}
                      height={96}
                      width={96}
                    />
                    <div className="truncate space-x-1">
                      <span className="font-semibold">Name:</span>
                      <span className="capitalize truncate">{user?.nickname}</span>
                    </div>
                    <div className="truncate space-x-1">
                      <span className="font-semibold">Email:</span>
                      <span className="italic truncate">{user?.email}</span>
                    </div>
                  </div>
                </li>
                <li>
                  <a href="/api/auth/logout" className={cn(buttonVariants(), 'w-full')}>
                    <LogOut />
                    Logout
                  </a>
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
