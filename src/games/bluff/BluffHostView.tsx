import { useState, useEffect } from 'react';
import { Shuffle, Eye, MessageSquareQuote } from 'lucide-react';
import { generateProceduralBluff, type BluffItem } from '../../services/localGenerators/bluffGenerator';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface BluffHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

interface BluffChoice {
  id: string;
  text: string;
  authorTeamId: string | 'TRUE_ANSWER';
  votes: string[]; // array of teamIds who voted for this
}

export function BluffHostView({ teams: initialTeams, onEndGame, onReturnToHub }: BluffHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [items, setItems] = useState<BluffItem[]>([]);
  const [itemIdx, setItemIdx] = useState(0);
  const [teamBluffs, setTeamBluffs] = useState<Record<string, string>>({});
  const [shuffledChoices, setShuffledChoices] = useState<BluffChoice[]>([]);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    generateProceduralBluff({ count: 5 }).then((res) => {
      setItems(res);
    });
  }, []);

  const currentItem = items[itemIdx] || {
    id: 'bluff_default',
    question: 'In 2008, Norway officially knighted a penguin. What is his official rank today?',
    trueAnswer: 'Major General',
    explanation: 'Brigadier Sir Nils Olav III is the mascot of the Norwegian King’s Guard.',
    suggestedBluffs: ['First Lieutenant', 'Navy Captain'],
  };

  // Broadcast to TV
  useEffect(() => {
    hubSyncBus.broadcastStateUpdate({
      gameId: 'bluff-the-answer',
      question: currentItem.question,
      explanation: isRevealed ? currentItem.explanation : null,
      choices: shuffledChoices.map((c, idx) => ({
        id: c.id,
        letter: String.fromCharCode(65 + idx), // A, B, C, D...
        text: c.text,
        isTrue: isRevealed ? c.authorTeamId === 'TRUE_ANSWER' : false,
        authorTeamName: isRevealed
          ? c.authorTeamId === 'TRUE_ANSWER'
            ? 'THE TRUTH'
            : teams.find((t) => t.id === c.authorTeamId)?.name || 'Bluff'
          : null,
        votesCount: isRevealed ? c.votes.length : 0,
      })),
      isVotingActive,
      isRevealed,
      teams,
      isGameFinished,
    });
  }, [currentItem, shuffledChoices, isVotingActive, isRevealed, teams, isGameFinished]);

  const handleStartVoting = () => {
    const choices: BluffChoice[] = [
      {
        id: 'true_ans',
        text: currentItem.trueAnswer,
        authorTeamId: 'TRUE_ANSWER',
        votes: [],
      },
    ];

    teams.forEach((t) => {
      const bluffText = teamBluffs[t.id] || currentItem.suggestedBluffs?.[0] || 'Deceptive answer';
      choices.push({
        id: `bluff_${t.id}`,
        text: bluffText,
        authorTeamId: t.id,
        votes: [],
      });
    });

    const shuffled = choices.sort(() => Math.random() - 0.5);
    setShuffledChoices(shuffled);
    setIsVotingActive(true);
    setIsRevealed(false);

    soundManager.playPartyCue('whistle');
    hubSyncBus.broadcastSoundTrigger('whistle');
  };

  const handleVoteForChoice = (teamId: string, choiceId: string) => {
    setShuffledChoices((prev) =>
      prev.map((c) => {
        // remove existing vote from this team across all choices
        const cleanedVotes = c.votes.filter((v) => v !== teamId);
        if (c.id === choiceId) {
          return { ...c, votes: [...cleanedVotes, teamId] };
        }
        return { ...c, votes: cleanedVotes };
      })
    );
  };

  const handleRevealAndScore = () => {
    setIsRevealed(true);
    soundManager.playPartyCue('round_win');
    hubSyncBus.broadcastSoundTrigger('round_win');

    // Tally points
    const pointsDelta: Record<string, number> = {};
    teams.forEach((t) => (pointsDelta[t.id] = 0));

    shuffledChoices.forEach((c) => {
      if (c.authorTeamId === 'TRUE_ANSWER') {
        // Each team that voted for truth gets 200 pts
        c.votes.forEach((voterId) => {
          pointsDelta[voterId] = (pointsDelta[voterId] || 0) + 200;
        });
      } else {
        // Author of this bluff gets 100 pts per team tricked (excluding self)
        const authorId = c.authorTeamId;
        const trickedCount = c.votes.filter((v) => v !== authorId).length;
        pointsDelta[authorId] = (pointsDelta[authorId] || 0) + trickedCount * 100;
      }
    });

    setTeams((prev) =>
      prev.map((t) => ({ ...t, score: t.score + (pointsDelta[t.id] || 0) }))
    );
  };

  const handleNextQuestion = () => {
    if (itemIdx >= items.length - 1) {
      setIsGameFinished(true);
      onEndGame(teams);
      return;
    }
    setItemIdx((prev) => prev + 1);
    setTeamBluffs({});
    setShuffledChoices([]);
    setIsVotingActive(false);
    setIsRevealed(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Bluff the Answer Console</h2>
            <p className="text-xs text-slate-400">Collect team bluffs · Anonymously vote on truth</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsGameFinished(true);
            onEndGame(teams);
          }}
          className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
        >
          End Game
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Question Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-purple-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400">
                Question {itemIdx + 1} of {items.length || 5}
              </span>
              <span className="text-xs text-amber-400 font-bold">
                Truth: +200 pts · Bluff Trick: +100 pts
              </span>
            </div>

            <p className="font-display font-black text-xl sm:text-2xl text-white">
              "{currentItem.question}"
            </p>

            <div className="p-3 bg-purple-950/60 border border-purple-800 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-purple-300 font-bold block">True Answer (Host Eye):</span>
                <span className="font-black text-white text-sm">{currentItem.trueAnswer}</span>
              </div>
            </div>

            {/* Team Bluff Inputs (Step 1) */}
            {!isVotingActive && (
              <div className="space-y-3 pt-3">
                <span className="text-xs font-bold uppercase text-slate-400 block">
                  Step 1: Enter Fake Answers from Teams
                </span>

                {teams.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className="w-28 text-xs font-bold text-slate-300 truncate">{t.name}:</span>
                    <input
                      type="text"
                      placeholder={`Enter ${t.name}'s believable bluff...`}
                      value={teamBluffs[t.id] || ''}
                      onChange={(e) =>
                        setTeamBluffs((prev) => ({ ...prev, [t.id]: e.target.value }))
                      }
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                ))}

                <button
                  onClick={handleStartVoting}
                  className="w-full mt-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-transform active:scale-95"
                >
                  <Shuffle className="w-4 h-4" />
                  Shuffle & Show Choices on TV Screen
                </button>
              </div>
            )}

            {/* Voting & Reveal Tally (Step 2) */}
            {isVotingActive && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400 block">
                  Step 2: Collect Team Votes
                </span>

                <div className="space-y-2">
                  {shuffledChoices.map((choice, idx) => (
                    <div
                      key={choice.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-purple-900 text-purple-200 text-xs font-black flex items-center justify-center">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-bold text-sm text-white">{choice.text}</span>
                        {isRevealed && (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              choice.authorTeamId === 'TRUE_ANSWER'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {choice.authorTeamId === 'TRUE_ANSWER'
                              ? 'TRUE ANSWER'
                              : `Bluff by ${teams.find((t) => t.id === choice.authorTeamId)?.name}`}
                          </span>
                        )}
                      </div>

                      {/* Vote Buttons per team */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {teams.map((t) => {
                          const hasVoted = choice.votes.includes(t.id);
                          return (
                            <button
                              key={t.id}
                              onClick={() => handleVoteForChoice(t.id, choice.id)}
                              disabled={isRevealed}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                hasVoted
                                  ? 'bg-purple-600 text-white border-purple-400'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                            >
                              {t.name} {hasVoted ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  {!isRevealed ? (
                    <button
                      onClick={handleRevealAndScore}
                      className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow"
                    >
                      <Eye className="w-4 h-4" />
                      Reveal Truth & Calculate Scores!
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow"
                    >
                      Next Question →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <SharedScoreboard
            participants={teams}
            onUpdateScore={(id, newScore) => {
              setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, score: newScore } : t)));
            }}
          />
        </div>
      </div>

      {isGameFinished && (
        <WinnerPodiumModal
          isOpen={isGameFinished}
          onClose={() => setIsGameFinished(false)}
          participants={teams}
          gameTitle="Bluff the Answer Champions"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setItemIdx(0);
            setTeamBluffs({});
            setShuffledChoices([]);
            setIsVotingActive(false);
            setIsRevealed(false);
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
