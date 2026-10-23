import { useEffect, useState } from 'react';
import { Play, ArrowLeft, Shuffle, Check, Settings2 } from 'lucide-react';
import { useRouter } from '../router/Router';
import { useGameStore } from '../store/gameStore';
import { listQuestionPacks, loadSettings, saveGameSession, initializeDatabase } from '../db/database';
import type { QuestionPack, GameConfig, Question } from '../types/game';
import { createGameSession } from '../engine/gameEngine';

export function GameSetupPage() {
  const { navigate } = useRouter();
  const { setSession } = useGameStore();

  const [packs, setPacks] = useState<QuestionPack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<string>('');
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
    initializeDatabase().then(async () => {
      const loadedPacks = await listQuestionPacks();
      setPacks(loadedPacks);
      if (loadedPacks.length > 0) {
        setSelectedPackId(loadedPacks[0].id);
      }
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

    // Split questions into regular rounds and 5 Fast Money questions
    const regularQuestions = availableQuestions.slice(0, roundsCount);

    // Pick 5 questions for Fast Money (or fallback to whatever is available)
    const fastMoneyQuestions =
      availableQuestions.length >= roundsCount + 5
        ? availableQuestions.slice(roundsCount, roundsCount + 5)
        : availableQuestions.slice(0, 5);

    const multipliers = [1, 1, 2, 3, 3, 3].slice(0, roundsCount);

    const config: GameConfig = {
      roundsCount,
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
              <span className="text-xs font-bold uppercase text-feud-gold block mb-2">
                Select Question Pack ({packs.length} Available)
              </span>

              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[380px] pr-1">
                {packs.map((pack) => {
                  const isSelected = pack.id === selectedPackId;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => setSelectedPackId(pack.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0f2c69] border-feud-gold shadow-gold-glow'
                          : 'bg-[#05112e] border-blue-900 hover:border-blue-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{pack.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-feud-gold" />}
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2 mb-2">
                        {pack.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span className="bg-blue-950 px-2 py-0.5 rounded border border-blue-800 text-blue-300">
                          {pack.category}
                        </span>
                        <span>{pack.questions.length} Questions</span>
                        {pack.isBuiltIn && (
                          <span className="text-feud-gold">★ Built-In</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* LAUNCH BUTTON BAR */}
        <div className="bg-[#071638] border-2 border-feud-gold rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-gold-glow">
          <div className="text-xs text-gray-300">
            Selected: <span className="font-bold text-white">{selectedPack?.title}</span> (
            {selectedPack?.questions.length} questions) · Ready for TV and Laptop
          </div>

          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto bg-gradient-to-r from-feud-gold via-feud-goldLight to-feud-gold hover:brightness-110 text-feud-dark font-display font-black text-xl py-3 px-8 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            START GAME NOW
          </button>
        </div>
      </div>
    </div>
  );
}
