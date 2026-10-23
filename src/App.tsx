import { useEffect } from 'react';
import { RouterProvider, useRouter, matchPattern } from './router/Router';
import { initializeDatabase } from './db/database';
import { useGameStore } from './store/gameStore';
import { AudioInitializer } from './components/common/AudioInitializer';

// Pages
import { MainMenuPage } from './pages/MainMenuPage';
import { GameSetupPage } from './pages/GameSetupPage';
import { HostConsolePage } from './pages/HostConsolePage';
import { DisplayPage } from './pages/DisplayPage';
import { PackLibraryPage } from './pages/PackLibraryPage';
import { PackEditorPage } from './pages/PackEditorPage';
import { SettingsPage } from './pages/SettingsPage';
import { GameResultsPage } from './pages/GameResultsPage';

function AppContent() {
  const { currentPath } = useRouter();
  const { loadGlobalSettings } = useGameStore();

  useEffect(() => {
    initializeDatabase().then(() => {
      loadGlobalSettings();
    });
  }, [loadGlobalSettings]);

  // Route Matching
  if (currentPath === '/' || currentPath === '') {
    return <MainMenuPage />;
  }

  if (currentPath === '/setup') {
    return <GameSetupPage />;
  }

  const hostMatch = matchPattern('/game/:id', currentPath);
  if (hostMatch.matches) {
    return <HostConsolePage gameId={hostMatch.params.id} />;
  }

  const displayMatch = matchPattern('/display/:id', currentPath);
  if (displayMatch.matches) {
    return <DisplayPage gameId={displayMatch.params.id} />;
  }

  if (currentPath === '/packs') {
    return <PackLibraryPage />;
  }

  const packEditMatch = matchPattern('/packs/:id/edit', currentPath);
  if (packEditMatch.matches) {
    return <PackEditorPage packId={packEditMatch.params.id} />;
  }

  if (currentPath === '/settings') {
    return <SettingsPage />;
  }

  const resultsMatch = matchPattern('/results/:id', currentPath);
  if (resultsMatch.matches) {
    return <GameResultsPage gameId={resultsMatch.params.id} />;
  }

  // Fallback to Main Menu
  return <MainMenuPage />;
}

export default function App() {
  return (
    <RouterProvider>
      <AudioInitializer />
      <AppContent />
    </RouterProvider>
  );
}
