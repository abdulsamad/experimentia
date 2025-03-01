import { motion } from 'motion/react';

import { SidebarTrigger } from '@/components/ui/sidebar';

import SettingsDropdown from './SettingsDropdown';

const Nav = () => {
  return (
    <nav className="h-[80px] w-full flex gap-2 items-center justify-center relative">
      <SidebarTrigger className="absolute top-0 left-0 ml-5 mt-5 py-1 px-2.5" />
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
