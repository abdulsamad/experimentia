import React from 'react';
import { useSetAtom } from 'jotai';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

import { sidebarAtom } from '@/store';
import { Button } from '@/components/ui/button';

import SettingsDropdown from './SettingsDropdown';

const Nav = () => {
  const setSidebarOpen = useSetAtom(sidebarAtom);

  return (
    <nav className="h-[80px] w-full flex gap-2 items-center justify-center relative">
      <Button
        className="absolute top-0 left-0 ml-5 mt-5 py-1 px-2.5"
        onClick={() => setSidebarOpen(true)}>
        <Menu />
      </Button>
      <motion.h1
        initial={{ translateY: '-10px' }}
        animate={{ translateY: 0 }}
        className="text-2xl lg:text-3xl italic text-center font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent">
        Experimentia
      </motion.h1>
      <SettingsDropdown />
    </nav>
  );
};

export default Nav;
