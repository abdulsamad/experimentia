import { motion } from 'motion/react';

import { SidebarTrigger } from '@/components/ui/sidebar';

import SettingsDropdown from './SettingsDropdown';

const Nav = () => (
  <nav className="h-[50px] w-full flex gap-2 items-center justify-between relative px-3 py-1">
    <SidebarTrigger />
    <motion.h1
      initial={{ translateY: '-10px' }}
      animate={{ translateY: '0' }}
      className="text-lg lg:text-xl italic font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent leading-6">
      Experimentia
    </motion.h1>
    <SettingsDropdown />
  </nav>
);

export default Nav;
