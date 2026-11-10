import { useState, useEffect } from 'react';
import { Play, Tv, Users, ArrowLeft, CheckCircle2, UserPlus } from 'lucide-react';
import { useRouter } from '../router/Router';
import { HubNavbar } from '../components/common/HubNavbar';
import { getGameById } from '../games/registry';
import { listHubPlayers, listHubTeams } from '../db/hubDatabase';
import { PlayerManagerModal } from '../components/shared/PlayerManagerModal';
import { DynamicContentGeneratorSection } from '../components/shared/DynamicContentGeneratorSection';
import type { HubPlayer, HubTeam } from '../types/hub';
import type { ScoreboardParticipant } from '../components/shared/SharedScoreboard';

interface GameSetupHubPageProps {
  gameId: string;
}

export function GameSetupHubPage({ gameId }: GameSetupHubPageProps) {
  const { navigate } = useRouter();
  const game = getGameById(gameId);

  const [players, setPlayers] = useState<HubPlayer[]>([]);
  const [teams, setTeams] = useState<HubTeam[]>([]);
  const [mode, setMode] = useState<'team' | 'individual'>('team');
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [isPlayerManagerOpen, setIsPlayerManagerOpen] = useState(false);
  const [isTvWindowOpened, setIsTvWindowOpened] = useState(false);

  const handleContentReady = (items: any[]) => {
    sessionStorage.setItem(`hub_custom_content_${gameId}`, JSON.stringify(items));
  };

  const loadRoster = async () => {
    const [pList, tList] = await Promise.all([listHubPlayers(), listHubTeams()]);
    setPlayers(pList);
    setTeams(tList);

    // Auto-select first two teams or players if available
    if (tList.length >= 2 && selectedTeamIds.length === 0) {
      setSelectedTeamIds([tList[0].id, tList[1].id]);
    }
    if (pList.length >= 2 && selectedPlayerIds.length === 0) {
      setSelectedPlayerIds(pList.slice(0, 4).map((p) => p.id));
    }
  };

  useEffect(() => {
    loadRoster();
  }, [gameId]);

  if (!game) {
    return (
      <div className="min-h-screen bg-[#060b18] text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold">Game Not Found</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  const handleOpenTvDisplay = () => {
    const url = `${window.location.origin}${window.location.pathname}#/display/hub/${gameId}`;
    window.open(url, `hub_tv_${gameId}`, 'width=1280,height=720');
    setIsTvWindowOpened(true);
  };

  const handleStartGame = () => {
    // Generate active participant array
    let participants: ScoreboardParticipant[] = [];

    if (mode === 'team') {
      const activeTeams = teams.filter((t) => selectedTeamIds.includes(t.id));
      if (activeTeams.length === 0) {
        // Fallback default teams
        participants = [
          { id: 't1', name: 'Team Blue', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Red', score: 0, color: 'red' },
        ];
      } else {
        participants = activeTeams.map((t) => ({
          id: t.id,
          name: t.name,
          score: 0,
          color: t.color,
        }));
      }
    } else {
      const activePlayers = players.filter((p) => selectedPlayerIds.includes(p.id));
      if (activePlayers.length === 0) {
        participants = [
          { id: 'p1', name: 'Player 1', score: 0, color: 'blue' },
          { id: 'p2', name: 'Player 2', score: 0, color: 'red' },
        ];
      } else {
        participants = activePlayers.map((p) => ({
          id: p.id,
          name: p.name,
          score: 0,
          color: 'blue',
        }));
      }
    }

    // Persist chosen setup in sessionStorage for the host session
    sessionStorage.setItem(`hub_participants_${gameId}`, JSON.stringify(participants));
    navigate(`/games/${gameId}/host`);
  };

  const toggleTeamSelect = (id: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const togglePlayerSelect = (id: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col justify-between select-none">
      <HubNavbar onOpenPlayerManager={() => setIsPlayerManagerOpen(true)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Back Link & Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${game.accentColor}25`,
                  color: game.accentColor,
                }}
              >
                {game.category}
              </span>
              <span className="text-xs text-slate-400">Game Setup</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              {game.name}
            </h1>
          </div>
        </div>

        {/* Game Info Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1329] border border-slate-800 mb-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {game.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1 text-sky-400">
                <Users className="w-3.5 h-3.5" /> {game.minPlayers}–{game.maxPlayers} players
              </span>
              <span>{game.estimatedMinutes}</span>
            </div>
          </div>

          <button
            onClick={handleOpenTvDisplay}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              isTvWindowOpened
                ? 'bg-blue-900/60 border-blue-500 text-blue-300'
                : 'bg-slate-900 border-slate-700 hover:border-blue-500 text-white'
            }`}
          >
            <Tv className="w-4 h-4 text-blue-400" />
            {isTvWindowOpened ? 'TV Display Connected' : 'Open TV Screen'}
          </button>
        </div>

        {/* DYNAMIC CONTENT GENERATION & PREVIEW (EXCLUDING FAMILY FEUD) */}
        {gameId !== 'family-feud' && (
          <DynamicContentGeneratorSection
            gameId={gameId}
            gameTitle={game.name}
            onContentReady={handleContentReady}
          />
        )}

        {/* ROSTER SELECTION SECTION */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 mb-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Select Participating Teams / Players
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose who is competing in this session.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mode switch */}
              <div className="flex p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setMode('team')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    mode === 'team' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Teams
                </button>
                <button
                  onClick={() => setMode('individual')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    mode === 'individual' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Solo
                </button>
              </div>

              <button
                onClick={() => setIsPlayerManagerOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Names
              </button>
            </div>
          </div>

          {/* Teams list */}
          {mode === 'team' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {teams.map((t) => {
                const isSelected = selectedTeamIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleTeamSelect(t.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-400/50'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: t.color === 'gold' ? '#f59e0b' : t.color }}
                      />
                      <span className="font-bold text-xs sm:text-sm">{t.name}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                );
              })}
              {teams.length === 0 && (
                <div className="col-span-full text-center py-4 text-xs text-slate-500 italic">
                  No custom teams saved. Default "Team Blue" vs "Team Red" will be used.
                </div>
              )}
            </div>
          )}

          {/* Individual Players list */}
          {mode === 'individual' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {players.map((p) => {
                const isSelected = selectedPlayerIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePlayerSelect(p.id)}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-400/50'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-950"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-xs truncate max-w-[90px]">{p.name}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                );
              })}
              {players.length === 0 && (
                <div className="col-span-full text-center py-4 text-xs text-slate-500 italic">
                  No individual players added. Click "Add Names" to add players.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary Start Game CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            TV Display can be opened now or anytime during the game.
          </div>

          <button
            onClick={handleStartGame}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-display font-black text-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-xl shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Game Console →
          </button>
        </div>
      </main>

      <PlayerManagerModal
        isOpen={isPlayerManagerOpen}
        onClose={() => {
          setIsPlayerManagerOpen(false);
          loadRoster();
        }}
      />

      <footer className="w-full border-t border-slate-800/80 bg-[#040813] py-4 px-4 text-center text-xs text-slate-500">
        <span>Family Game Hub · Multi-Screen Party Mode</span>
      </footer>
    </div>
  );
}
