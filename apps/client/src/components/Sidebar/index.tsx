import { useCallback, useLayoutEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';

import { languages, variations } from 'utils';

import { configAtom, flagsAtom, identifierAtom, sidebarAtom } from '@/store';
import { cn } from '@/utils';
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
import { LogOut, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const Sidebar = () => {
  const [config, setConfig] = useAtom(configAtom);
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);
  const flags = useAtomValue(flagsAtom);
  const setIdentifier = useSetAtom(identifierAtom);
  const { user } = useUser();

  const { language, model, variation, imageSize, textInput, speakResults } = config;
  const isImageModelSelected = ['dall-e-2', 'dall-e-3'].includes(model);

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

  if (!sidebarOpen) return null;

  return (
    <div
      className="absolute inset-0 w-screen h-screen backdrop-blur-md z-40"
      onClick={(ev) => {
        if (ev.currentTarget === ev.target) setSidebarOpen(false);
      }}>
      <aside className="min-h-screen w-[300px] pb-10 pt-5 px-4 flex flex-col justify-between overflow-hidden shadow-2xl bg-white dark:bg-black">
        <div>
          <div className="flex justify-end mb-5">
            <Button className="px-2" variant="ghost" onClick={() => setSidebarOpen(false)}>
              <X />
            </Button>
          </div>
          <ul className="space-y-10">
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
                        <Badge variant="outline" className="dark:bg-slate-50 dark:text-slate-900">
                          Special
                        </Badge>
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Image</SelectLabel>
                      <SelectItem value="dall-e-2">DALL.E</SelectItem>
                      <SelectItem value="dall-e-3" disabled={!flags?.dallE3Enabled}>
                        <span className="mr-2">DALL.E 3</span>
                        <Badge variant="outline" className="dark:bg-slate-50 dark:text-slate-900">
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
                    value={imageSize}
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
            {'speechSynthesis' in window && !textInput && (
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
                  className="rounded-full mx-auto"
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
      </aside>
    </div>
  );
};

export default Sidebar;
