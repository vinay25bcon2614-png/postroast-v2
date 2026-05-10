import { useMemo, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import FormatLibraryPage from './pages/FormatLibrary';
import StyleDNAPage from './pages/StyleDNA';
import LeaderboardPage from './pages/Leaderboard';
import StreakTracker from './components/UI/StreakTracker';
import './styles/global.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const page = useMemo(() => {
    if (activePage === 'format-library') return <FormatLibraryPage />;
    if (activePage === 'style-dna') return <StyleDNAPage />;
    if (activePage === 'leaderboard') return <LeaderboardPage />;
    if (activePage === 'analytics') return <StreakTracker />;
    if (activePage === 'settings') return <SettingsPage />;
    return <DashboardPage />;
  }, [activePage]);

  return (
    <MainLayout activePage={activePage} onNavigate={setActivePage}>
      {page}
    </MainLayout>
  );
}

export default App;
