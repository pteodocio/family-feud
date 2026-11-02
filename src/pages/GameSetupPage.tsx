import { useEffect, useState } from 'react';
import { Play, ArrowLeft, Shuffle, Check, Settings2, FolderKanban, Plus } from 'lucide-react';
import { useRouter } from '../router/Router';
import { useGameStore } from '../store/gameStore';
import { listQuestionPacks, loadSettings, saveGameSession, initializeDatabase } from '../db/database';
import type { QuestionPack, GameConfig, Question } from '../types/game';
import { createGameSession } from '../engine/gameEngine';

export function GameSetupPage() {
  const { navigate } = useRouter();
  const { setSession } = useGameStore();

  const [packs, setPacks] = useState<QuestionPack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackId, setSelectedPackId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [team1Name, setTeam1Name] = useState('Santos Family');
  const [team2Name, setTeam2Name] = useState('Reyes Family');
  const [gameTitle, setGameTitle] = useState('Family Game Night');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);

  // Config options
  const [roundsCount, setRoundsCount] = useState(4);
  const [fastMoneyTarget, setFastMoneyTarget] = useState(200);
  const [fastMoneyTimer1, setFastMoneyTimer1] = useState(20);
  const [fastMoneyTimer2, setFastMoneyTimer2] = useState(25);

  useEffect(() => {
    setIsLoading(true);
    initializeDatabase().then(async () => {
      const loadedPacks = await listQuestionPacks();
      setPacks(loadedPacks);
      if (loadedPacks.length > 0) {
        setSelectedPackId(loadedPacks[0].id);
      }
      setIsLoading(false);
    });

    loadSettings().then((s) => {
      setRoundsCount(s.defaultConfig.roundsCount);
      setFastMoneyTarget(s.defaultConfig.fastMoneyTarget);
      setFastMoneyTimer1(s.defaultConfig.fastMoneyTimer1);
      setFastMoneyTimer2(s.defaultConfig.fastMoneyTimer2);
    });
  }, []);

  const handleLaunch = async () => {
    const pack = packs.find((p) => p.id === selectedPackId) || packs[0];
    if (!pack) return;

    let availableQuestions: Question[] = [...pack.questions];

    if (shuffleQuestions) {
      availableQuestions = availableQuestions.sort(() => Math.random() - 0.5);
    }

    const actualRoundsCount = Math.min(roundsCount, availableQuestions.length);

    // Split questions into regular rounds and 5 Fast Money questions
    const regularQuestions = availableQuestions.slice(0, actualRoundsCount);

    // Pick 5 questions for Fast Money (or fallback to whatever is available)
    const fastMoneyQuestions =
      availableQuestions.length >= actualRoundsCount + 5
        ? availableQuestions.slice(actualRoundsCount, actualRoundsCount + 5)
        : availableQuestions.slice(0, 5);

    const multipliers = [1, 1, 2, 3, 3, 3].slice(0, actualRoundsCount);

    const config: GameConfig = {
      roundsCount: actualRoundsCount,
      multipliers,
      targetScore: 300,
      fastMoneyTimer1,
      fastMoneyTimer2,
      fastMoneyTarget,
      faceOffTieRule: 'hostDecision',
    };

    const sessionId = `game_${Date.now()}`;

    const newSession = createGameSession({
      id: sessionId,
      title: gameTitle.trim() || 'Family Game Night',
      team1Name: team1Name.trim() || 'Team 1',
      team2Name: team2Name.trim() || 'Team 2',
      config,
      regularQuestions,
      fastMoneyQuestions,
      packId: pack.id,
    });

    await saveGameSession(newSession);
    setSession(newSession);

    // Navigate to host console
    navigate(`/game/${sessionId}`);
  };

  const selectedPack = packs.find((p) => p.id === selectedPackId);
  const categories = ['all', ...Array.from(new Set(packs.map((p) => p.category)))];
  const filteredPacks = packs.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-feud-dark text-white stage-background p-4 sm:p-8 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900 border border-blue-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Menu
          </button>

          <h1 className="font-display font-black text-2xl text-feud-gold tracking-wide">
            GAME SETUP
          </h1>
        </div>

        {/* SETUP FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: TEAMS & SESSION TITLE */}
          <div className="flex flex-col gap-4">
            {/* Game Title */}
            <div className="bg-[#071638] border border-blue-900 rounded-2xl p-4 shadow-md">
              <label className="block text-xs font-bold uppercase text-feud-gold mb-1">
                Game Session Title
              </label>
              <input
                type="text"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                className="w-full bg-black/50 border border-blue-700/60 rounded-xl px-3.5 py-2 text-white font-bold text-sm focus:outline-none focus:border-feud-gold"
                placeholder="e.g. Christmas Gathering 2026"
              />
            </div>

            {/* Team Names */}
            <div className="bg-[#071638] border border-blue-900 rounded-2xl p-4 shadow-md flex flex-col gap-4">
              <span className="text-xs font-bold uppercase text-feud-gold">
                Competing Families / Teams
              </span>

              {/* Team 1 */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-blue-300 mb-1">
                  Team 1 Name (Blue Pod)
                </label>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="w-full bg-[#0a1e4a] border border-blue-500/60 rounded-xl px-3.5 py-2 text-white font-bold text-sm focus:outline-none"
                  placeholder="e.g. Team Santos"
                />
              </div>

              {/* Team 2 */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-red-300 mb-1">
                  Team 2 Name (Red Pod)
                </label>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="w-full bg-[#3d0f0f] border border-red-500/60 rounded-xl px-3.5 py-2 text-white font-bold text-sm focus:outline-none"
                  placeholder="e.g. Team Reyes"
                />
              </div>
            </div>

            {/* Rules & Round Settings */}
            <div className="bg-[#071638] border border-blue-900 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-feud-gold">
                <Settings2 className="w-4 h-4" />
                Game Rules Configuration
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-300 text-[11px] mb-1 font-semibold">
                    Regular Rounds
                  </label>
                  <select
                    value={roundsCount}
                    onChange={(e) => setRoundsCount(Number(e.target.value))}
                    className="w-full bg-black/60 border border-blue-700 rounded-lg p-2 text-white font-bold"
                  >
                    <option value={3}>3 Rounds (1x, 2x, 3x)</option>
                    <option value={4}>4 Rounds (1x, 1x, 2x, 3x)</option>
                    <option value={5}>5 Rounds (1x, 1x, 2x, 3x, 3x)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-[11px] mb-1 font-semibold">
                    Fast Money Target
                  </label>
                  <input
                    type="number"
                    value={fastMoneyTarget}
                    onChange={(e) => setFastMoneyTarget(Number(e.target.value))}
                    className="w-full bg-black/60 border border-blue-700 rounded-lg p-2 text-white font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-[11px] mb-1 font-semibold">
                    Player 1 Timer (sec)
                  </label>
                  <input
                    type="number"
                    value={fastMoneyTimer1}
                    onChange={(e) => setFastMoneyTimer1(Number(e.target.value))}
                    className="w-full bg-black/60 border border-blue-700 rounded-lg p-2 text-white font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-[11px] mb-1 font-semibold">
                    Player 2 Timer (sec)
                  </label>
                  <input
                    type="number"
                    value={fastMoneyTimer2}
                    onChange={(e) => setFastMoneyTimer2(Number(e.target.value))}
                    className="w-full bg-black/60 border border-blue-700 rounded-lg p-2 text-white font-bold font-mono"
                  />
                </div>
              </div>

              {/* Shuffle Toggle */}
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="rounded border-blue-700 text-feud-gold focus:ring-0"
                />
                <Shuffle className="w-3.5 h-3.5 text-feud-gold" />
                Randomize question order each game
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN: QUESTION PACK SELECTOR */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#071638] border border-blue-900 rounded-2xl p-4 shadow-md flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-feud-gold">
                  Select Question Pack {packs.length > 0 && `(${filteredPacks.length} shown of ${packs.length})`}
                </span>
              </div>

              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-blue-200 text-xs">
                  Loading question packs...
                </div>
              ) : packs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-blue-800 rounded-xl my-4">
                  <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-700 flex items-center justify-center mb-3 text-feud-gold">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-lg text-white mb-1">
                    No question packs available yet.
                  </h3>
                  <p className="text-gray-300 text-xs mb-4 max-w-xs">
                    Please create or import a question pack before starting a game.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/packs')}
                    className="bg-feud-gold hover:bg-feud-goldLight text-feud-dark font-black text-xs px-4 py-2 rounded-xl shadow-gold-glow flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Pack
                  </button>
                </div>
              ) : (
                <>
                  {/* Category Filter Pills */}
                  {categories.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 scrollbar-thin">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            const matching = packs.filter((p) => cat === 'all' || p.category === cat);
                            if (matching.length > 0 && !matching.some((m) => m.id === selectedPackId)) {
                              setSelectedPackId(matching[0].id);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                            selectedCategory === cat
                              ? 'bg-feud-gold text-[#071638] shadow-sm'
                              : 'bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800/80'
                          }`}
                        >
                          {cat === 'all' ? '★ All Categories' : cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Pack list */}
                  {filteredPacks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-400 text-xs">
                      No question packs match the selected category.
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[260px] pr-1">
                      {filteredPacks.map((pack) => {
                        const isSelected = pack.id === selectedPackId;
                        return (
                          <div
                            key={pack.id}
                            onClick={() => setSelectedPackId(pack.id)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#0f2c69] border-feud-gold shadow-gold-glow'
                                : 'bg-[#05112e] border-blue-900 hover:border-blue-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-white">{pack.title}</span>
                              {isSelected && <Check className="w-4 h-4 text-feud-gold shrink-0" />}
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-2 mb-2">
                              {pack.description}
                            </p>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="bg-blue-950 px-2 py-0.5 rounded border border-blue-800 text-blue-300 font-semibold">
                                {pack.category}
                              </span>
                              <span className="text-gray-300 font-mono">{pack.questions.length} Questions</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Question Preview for Selected Pack */}
                  {selectedPack && (
                    <div className="bg-[#040e24] border border-blue-800/80 rounded-xl p-3 mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-feud-gold uppercase tracking-wider">
                          Question Preview ({selectedPack.questions.length} Questions):
                        </span>
                        <span className="text-[10px] text-blue-300 font-mono">
                          Pack: {selectedPack.title}
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 text-xs">
                        {selectedPack.questions.map((q, qIdx) => (
                          <div key={q.id} className="flex items-start gap-1.5 text-gray-200">
                            <span className="text-feud-gold font-bold font-mono text-[11px] shrink-0">
                              {qIdx + 1}.
                            </span>
                            <span className="leading-snug flex-1">
                              "{q.prompt}"
                              {q.scriptureReference && (
                                <span className="ml-1.5 text-[10px] text-amber-400 font-mono font-bold bg-amber-950/60 px-1 py-0.2 rounded border border-amber-800">
                                  📖 {q.scriptureReference}
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-1">
                              ({q.answers.length} ans · {q.answers.reduce((s, a) => s + a.points, 0)} pts)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* LAUNCH BUTTON BAR */}
        <div className="bg-[#071638] border-2 border-feud-gold rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-gold-glow">
          <div className="text-xs text-gray-300">
            {selectedPack ? (
              <>
                Selected: <span className="font-bold text-white">{selectedPack.title}</span> (
                {selectedPack.questions.length} questions) · Ready for TV and Laptop
              </>
            ) : (
              <span className="text-amber-400 font-semibold">
                No question pack selected. Create or import a question pack to begin.
              </span>
            )}
          </div>

          <button
            onClick={handleLaunch}
            disabled={!selectedPack || selectedPack.questions.length === 0}
            className="w-full sm:w-auto bg-gradient-to-r from-feud-gold via-feud-goldLight to-feud-gold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-feud-dark font-display font-black text-xl py-3 px-8 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            START GAME NOW
          </button>
        </div>
      </div>
    </div>
  );
}
