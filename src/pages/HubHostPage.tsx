import { useState, useEffect } from 'react';
import { ArrowLeft, Tv } from 'lucide-react';
import { useRouter } from '../router/Router';
import { TriviaHostView } from '../games/trivia/TriviaHostView';
import { CharadesHostView } from '../games/charades/CharadesHostView';
import { PictionaryHostView } from '../games/pictionary/PictionaryHostView';
import { BingoHostView } from '../games/bingo/BingoHostView';
import { GuessWordHostView } from '../games/guessWord/GuessWordHostView';
import { recordGameHistory } from '../db/hubDatabase';
import { getGameById } from '../games/registry';
import type { ScoreboardParticipant } from '../components/shared/SharedScoreboard';

interface HubHostPageProps {
  gameId: string;
}

export function HubHostPage({ gameId }: HubHostPageProps) {
  const { navigate } = useRouter();
  const game = getGameById(gameId);
  const [participants, setParticipants] = useState<ScoreboardParticipant[]>([]);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    const raw = sessionStorage.getItem(`hub_participants_${gameId}`);
    if (raw) {
      try {
        setParticipants(JSON.parse(raw));
      } catch {}
    }
  }, [gameId]);

  const handleEndGame = async (finalScores: ScoreboardParticipant[]) => {
    const sorted = [...finalScores].sort((a, b) => b.score - a.score);
    const winner = sorted[0];
    const duration = Math.round((Date.now() - startTime) / 1000);

    await recordGameHistory({
      id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      gameId,
      gameTitle: game?.name || gameId,
      datePlayed: new Date().toISOString(),
      durationSeconds: duration,
      gameMode: 'team',
      participants: sorted.map((p, idx) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        isWinner: idx === 0,
      })),
      winnerName: winner ? winner.name : 'Everyone',
      winnerScore: winner ? winner.score : 0,
    });
  };

  const handleOpenTv = () => {
    const url = `${window.location.origin}${window.location.pathname}#/display/hub/${gameId}`;
    window.open(url, `hub_tv_${gameId}`, 'width=1280,height=720');
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-white flex flex-col justify-between select-none">
      {/* Top Runner Navigation Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Game Hub
          </button>
          <span className="font-display font-black text-sm sm:text-base text-white">
            {game?.name || 'Party Game'} Host Console
          </span>
        </div>

        <button
          onClick={handleOpenTv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 border border-blue-600/80 text-xs font-bold text-blue-200 transition-colors shadow"
          title="Open TV Audience Display"
        >
          <Tv className="w-4 h-4 text-blue-400" />
          <span>Mirror to TV</span>
        </button>
      </header>

      {/* Main Game Host Runner */}
      <main className="flex-1 py-4">
        {gameId === 'family-trivia' && (
          <TriviaHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
        {gameId === 'charades' && (
          <CharadesHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
        {gameId === 'pictionary' && (
          <PictionaryHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
        {gameId === 'family-bingo' && (
          <BingoHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
        {gameId === 'guess-the-word' && (
          <GuessWordHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-[#040813] py-2.5 px-4 text-center text-xs text-slate-500">
        <span>Family Game Hub Host Mode · Live Broadcast Synchronized</span>
      </footer>
    </div>
  );
}
