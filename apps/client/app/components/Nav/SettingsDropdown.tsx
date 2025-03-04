import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { SettingsIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { languages, variations, supportedImageModels, supportedTextModels } from 'utils';

import { configAtom } from '@/store';
import { IS_SPEECH_RECOGNITION_SUPPORTED, IS_SPEECH_SYNTHESIS_SUPPORTED } from '@/utils';
import { Button } from '@/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { imageSizes } from 'utils';

const SettingsDropdown = () => {
  const [config, setConfig] = useAtom(configAtom);
  const { theme, setTheme } = useTheme();

  const { language, model, variation, imageSize, textInput, speakResults, style, quality } = config;
  const hasImageModels = supportedImageModels.length;
  const isImageModelSelected = supportedImageModels.map(({ name }) => name).includes(model);
  const isDallE3Selected = model === 'dall-e-3';

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
    if (!imageSizes(model).options.includes(imageSize as any)) {
      const defaultSize = imageSizes(model).default;
      updateSetting('imageSize', defaultSize);
      return defaultSize;
    }

    return imageSize;
  }, [imageSize, model, updateSetting]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="size-[18px]" />
          <span className="sr-only">Toggle thread dropdown</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl max-w-72" align="end">
        <ul className="space-y-5 lg:space-y-8 p-4">
          <li>
            <div className="flex flex-col space-y-2">
              <label className="ml-1">Theme</label>
              <Select value={theme} onValueChange={(value) => setTheme(value)}>
                <SelectTrigger className="capitalize">
                  {theme}
                  <span className="sr-only">Toggle theme</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </li>
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
                    {supportedTextModels.map(({ name, text, isSpecial, isExperimental }) => (
                      <SelectItem key={name} value={name}>
                        <div className="flex items-center gap-2">
                          {text}
                          {isSpecial && (
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                              special
                            </Badge>
                          )}
                          {isExperimental && (
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                              experimental
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  {hasImageModels ? (
                    <SelectGroup>
                      <SelectLabel>Image</SelectLabel>
                      {supportedImageModels.map(({ name, text, isSpecial, isExperimental }) => (
                        <SelectItem key={name} value={name} className="gap-2">
                          <div className="flex items-center gap-2">
                            {text}
                            {isSpecial && (
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                                special
                              </Badge>
                            )}
                            {isExperimental && (
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                experimental
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ) : null}
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
                  <Select value={style} onValueChange={(value) => updateSetting('style', value)}>
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
              <Select value={language} onValueChange={(value) => updateSetting('language', value)}>
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
                <p className="text-slate-700 text-center dark:text-slate-300 text-xs italic">
                  How you want to interact with GPT - <br />
                  {textInput
                    ? `type messages for more precise input`
                    : `use your voice for hands-free
                  conversation`}
                </p>
                <div className="flex items-center space-x-3 text-sm">
                  <span>Voice</span>
                  <Switch
                    checked={textInput}
                    onCheckedChange={(value) => updateCheckSetting('textInput', value)}
                  />
                  <span>Text</span>
                </div>
              </div>
            </li>
          )}
          {IS_SPEECH_SYNTHESIS_SUPPORTED() && !textInput && (
            <li>
              <div className="flex justify-center space-x-2">
                <Checkbox
                  id="terms1"
                  checked={speakResults}
                  onCheckedChange={(value) => updateCheckSetting('speakResults', value as boolean)}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;
