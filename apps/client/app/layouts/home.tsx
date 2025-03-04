import { Outlet } from 'react-router';

import Nav from '@/components/Nav';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

const Home = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-svh w-full conic-gradient(at right center, rgb(199, 210, 254), rgb(71, 85, 105), rgb(199, 210, 254)) overflow-hidden">
        <Nav />
        <div>
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Home;
