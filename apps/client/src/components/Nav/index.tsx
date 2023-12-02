import React from 'react';
import { useSetAtom } from 'jotai';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

import { sidebarAtom } from '@/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Nav = () => {
  const setSidebarOpen = useSetAtom(sidebarAtom);

  const { setTheme } = useTheme();

  return (
    <nav className="h-[80px] w-full flex items-center justify-center relative">
      <Button
        className="absolute top-0 left-0 ml-5 mt-5 py-1 px-2.5"
        onClick={() => setSidebarOpen(true)}>
        <Menu />
      </Button>
      <h1 className="text-3xl italic text-center font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent">
        Experimentia
      </h1>
      <div className="absolute right-0 top-0 mr-5 mt-5">
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
      </div>
    </nav>
  );
};

export default Nav;
