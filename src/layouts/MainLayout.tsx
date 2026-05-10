import { ReactNode } from 'react';
import Sidebar from '../components/UI/Sidebar';
import TopBar from '../components/UI/TopBar';

interface MainLayoutProps {
  activePage: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
}

export default function MainLayout({ activePage, onNavigate, children }: MainLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="main">
        <TopBar activePage={activePage} />
        <div className="page">{children}</div>
      </div>
    </div>
  );
}
