import { useEffect } from 'react';
import { RouterProvider, useRouter, matchPattern } from './router/Router';
import { initializeDatabase } from './db/database';
import { useGameStore } from './store/gameStore';
import { AudioInitializer } from './components/common/AudioInitializer';

// Hub Pages
import { MainHubPage } from './pages/MainHubPage';
import { GameSetupHubPage } from './pages/GameSetupHubPage';
import { HubHostPage } from './pages/HubHostPage';
import { HubDisplayPage } from './pages/HubDisplayPage';
import { GameHistoryPage } from './pages/GameHistoryPage';
import { GlobalSettingsPage } from './pages/GlobalSettingsPage';

// Feud Pages (Preserved 100%)
import { MainMenuPage } from './pages/MainMenuPage';
import { GameSetupPage } from './pages/GameSetupPage';
import { HostConsolePage } from './pages/HostConsolePage';
import { DisplayPage } from './pages/DisplayPage';
import { PackLibraryPage } from './pages/PackLibraryPage';
import { PackEditorPage } from './pages/PackEditorPage';
import { GameResultsPage } from './pages/GameResultsPage';

function AppContent() {
  const { currentPath } = useRouter();
  const { loadGlobalSettings } = useGameStore();

  useEffect(() => {
    initializeDatabase().then(() => {
      loadGlobalSettings();
    });
  }, [loadGlobalSettings]);

  // 1. Hub Homepage & Game Library
  if (currentPath === '/' || currentPath === '' || currentPath === '/games') {
    return <MainHubPage />;
  }

  // 2. Hub Game Setup: /games/:id/setup
  const hubSetupMatch = matchPattern('/games/:id/setup', currentPath);
  if (hubSetupMatch.matches) {
    if (hubSetupMatch.params.id === 'family-feud') {
      return <GameSetupPage />;
    }
    return <GameSetupHubPage gameId={hubSetupMatch.params.id} />;
  }

  // 3. Hub Host Runner: /games/:id/host
  const hubHostMatch = matchPattern('/games/:id/host', currentPath);
  if (hubHostMatch.matches) {
    return <HubHostPage gameId={hubHostMatch.params.id} />;
  }

  // 4. Hub TV Display: /display/hub/:id
  const hubDisplayMatch = matchPattern('/display/hub/:id', currentPath);
  if (hubDisplayMatch.matches) {
    return <HubDisplayPage gameId={hubDisplayMatch.params.id} />;
  }

  // 5. Game History & Global Settings
  if (currentPath === '/history') {
    return <GameHistoryPage />;
  }

  if (currentPath === '/settings') {
    return <GlobalSettingsPage />;
  }

  // 6. Preserved Family Feud Routes
  if (currentPath === '/feud') {
    return <MainMenuPage />;
  }

  if (currentPath === '/setup') {
    return <GameSetupPage />;
  }

  const feudHostMatch = matchPattern('/game/:id', currentPath);
  if (feudHostMatch.matches) {
    return <HostConsolePage gameId={feudHostMatch.params.id} />;
  }

  const feudDisplayMatch = matchPattern('/display/:id', currentPath);
  if (feudDisplayMatch.matches) {
    return <DisplayPage gameId={feudDisplayMatch.params.id} />;
  }

  if (currentPath === '/packs') {
    return <PackLibraryPage />;
  }

  const packEditMatch = matchPattern('/packs/:id/edit', currentPath);
  if (packEditMatch.matches) {
    return <PackEditorPage packId={packEditMatch.params.id} />;
  }

  const resultsMatch = matchPattern('/results/:id', currentPath);
  if (resultsMatch.matches) {
    return <GameResultsPage gameId={resultsMatch.params.id} />;
  }

  // Fallback to Family Game Hub
  return <MainHubPage />;
}

export default function App() {
  return (
    <RouterProvider>
      <AudioInitializer />
      <AppContent />
    </RouterProvider>
  );
}
