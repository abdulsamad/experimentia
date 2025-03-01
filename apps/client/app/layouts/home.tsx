import { Outlet } from 'react-router';

import Nav from '@/components/Nav';
import Sidebar from '@/components/Sidebar';

const Home = () => {
  return (
    <main className="h-[100svh] conic-gradient(at right center, rgb(199, 210, 254), rgb(71, 85, 105), rgb(199, 210, 254))">
      <Nav />
      <Sidebar />
      <div className="lg:container">
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
