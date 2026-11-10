import { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  Shuffle,
  Printer,
} from 'lucide-react';
import {
  generateTriviaContent,
  generateCharadesContent,
  generatePictionaryContent,
  generateBingoContent,
  generateGuessWordContent,
  regenerateSingleTriviaItem,
  regenerateSingleCharadesItem,
  regenerateSinglePictionaryItem,
  regenerateSingleGuessWordItem,
  generatePasswordContent,
  generateCatchphraseContent,
  generateTabooContent,
  generateJeopardyContent,
  generateWheelContent,
  generateBluffContent,
  generateHeadsUpContent,
  generateWordHuntContent,
  generateScattergoriesContent,
  generateEliminationContent,
  getEngineStatus,
  clearContentHistory,
  type EngineStatus,
} from '../../services/contentEngine';
import { BINGO_THEMES, type GeneratedBingoCard } from '../../services/localGenerators/bingoGenerator';

interface DynamicContentGeneratorSectionProps {
  gameId: string;
  gameTitle: string;
  onContentReady: (items: any[]) => void;
}

export function DynamicContentGeneratorSection({
  gameId,
  gameTitle,
  onContentReady,
}: DynamicContentGeneratorSectionProps) {
  const [engineStatus, setEngineStatus] = useState<EngineStatus>({
    hasAiKey: false,
    activeMode: 'local',
    historyCount: 0,
  });

  const [category, setCategory] = useState<string>('All');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [count, setCount] = useState<number>(gameId === 'family-bingo' ? 4 : 5);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [topicPrompt, setTopicPrompt] = useState<string>('');
  const [preferAi, setPreferAi] = useState<boolean>(false);

  const [generatedItems, setGeneratedItems] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSource, setGenerationSource] = useState<'ai' | 'local'>('local');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedBingoCardIdx, setSelectedBingoCardIdx] = useState<number>(0);

  const loadStatus = async () => {
    const status = await getEngineStatus(gameId);
    setEngineStatus(status);
    if (status.hasAiKey) {
      setPreferAi(true);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [gameId]);

  // Available categories based on game
  const getCategories = () => {
    switch (gameId) {
      case 'family-trivia':
        return ['All', 'General Knowledge', 'Science & Nature', 'History & Geography', 'Philippine Trivia'];
      case 'charades':
        return ['All', 'Actions & Verbs', 'Animals & Nature', 'Movies & TV Characters', 'Professions & Jobs', 'Filipino Daily Life & Culture', 'Funny Scenarios & Mishaps'];
      case 'pictionary':
        return ['All', 'Everyday Objects', 'Animals & Creatures', 'Food & Drinks', 'Places & Nature', 'Actions & Sports', 'Fun Compound Prompts'];
      case 'family-bingo':
        return [...BINGO_THEMES];
      case 'guess-the-word':
        return ['All', 'Everyday Objects', 'Animals & Nature', 'Food & Snacks', 'Famous Places & Geography', 'Professions & Roles', 'Philippine Culture & Traditions', 'Science & Technology'];
      case 'password':
        return ['All', 'Pinoy Culture', 'Pinoy Food', 'Nature', 'Animals', 'Professions', 'Everyday Life'];
      case 'catchphrase':
        return ['All', 'Sayings', 'Pop Culture', 'Everyday Life', 'Pinoy Sayings', 'Pinoy Culture'];
      case 'taboo':
        return ['All', 'Pinoy Culture', 'Pinoy Food', 'Travel', 'Celebration', 'Technology'];
      case 'jeopardy':
        return ['All', 'TV Quiz Championship'];
      case 'wheel-of-fortune':
        return ['All', 'Pinoy Habit', 'Food & Drink', 'Travel', 'Movie Quote', 'Everyday Reality'];
      case 'bluff-the-answer':
        return ['All', 'Bizarre Real Trivia'];
      case 'heads-up':
        return ['All', 'Movies & Characters', 'Celebrities', 'Pinoy Celebrities', 'Animals', 'Actions'];
      case 'word-hunt':
        return ['All', '4x4 Boggle Board'];
      case 'scattergories':
        return ['All', 'General & Pinoy Mix'];
      case 'trivia-elimination':
        return ['All', 'Survival Science & History'];
      default:
        return ['All'];
    }
  };

  const handleGenerate = async (itemCount = count) => {
    setIsGenerating(true);
    setStatusMessage(null);

    try {
      if (gameId === 'family-trivia') {
        const res = await generateTriviaContent({
          category: category === 'All' ? undefined : category,
          difficulty,
          count: itemCount,
          language,
          preferAi,
          topicPrompt,
        });
        setGeneratedItems(res.questions);
        setGenerationSource(res.source);
        onContentReady(res.questions);
      } else if (gameId === 'charades') {
        const res = await generateCharadesContent({
          category: category === 'All' ? undefined : category,
          difficulty,
          count: itemCount,
          language,
          preferAi,
          topicPrompt,
        });
        setGeneratedItems(res.words);
        setGenerationSource(res.source);
        onContentReady(res.words);
      } else if (gameId === 'pictionary') {
        const res = await generatePictionaryContent({
          category: category === 'All' ? undefined : category,
          difficulty,
          count: itemCount,
          language,
          preferAi,
          topicPrompt,
        });
        setGeneratedItems(res.words);
        setGenerationSource(res.source);
        onContentReady(res.words);
      } else if (gameId === 'family-bingo') {
        const res = generateBingoContent({
          theme: category === 'All' ? 'Classic 75-Ball Numbers' : category,
          cardCount: itemCount,
        });
        setGeneratedItems(res.cards);
        setGenerationSource(res.source);
        onContentReady(res.cards);
      } else if (gameId === 'guess-the-word') {
        const res = await generateGuessWordContent({
          category: category === 'All' ? undefined : category,
          difficulty,
          count: itemCount,
          language,
          preferAi,
          topicPrompt,
        });
        setGeneratedItems(res.puzzles);
        setGenerationSource(res.source);
        onContentReady(res.puzzles);
      } else if (gameId === 'password') {
        const res = await generatePasswordContent({ count: itemCount, category: category === 'All' ? undefined : category });
        setGeneratedItems(res.words);
        setGenerationSource(res.source);
        onContentReady(res.words);
      } else if (gameId === 'catchphrase') {
        const res = await generateCatchphraseContent({ count: itemCount, category: category === 'All' ? undefined : category });
        setGeneratedItems(res.phrases);
        setGenerationSource(res.source);
        onContentReady(res.phrases);
      } else if (gameId === 'taboo') {
        const res = await generateTabooContent({ count: itemCount, category: category === 'All' ? undefined : category });
        setGeneratedItems(res.cards);
        setGenerationSource(res.source);
        onContentReady(res.cards);
      } else if (gameId === 'jeopardy') {
        const res = await generateJeopardyContent();
        setGeneratedItems(res.categories);
        setGenerationSource('local');
        onContentReady(res.categories);
      } else if (gameId === 'wheel-of-fortune') {
        const res = await generateWheelContent({ count: itemCount, category: category === 'All' ? undefined : category });
        setGeneratedItems(res.puzzles);
        setGenerationSource(res.source);
        onContentReady(res.puzzles);
      } else if (gameId === 'bluff-the-answer') {
        const res = await generateBluffContent({ count: itemCount });
        setGeneratedItems(res.items);
        setGenerationSource(res.source);
        onContentReady(res.items);
      } else if (gameId === 'heads-up') {
        const res = await generateHeadsUpContent({ count: itemCount, category: category === 'All' ? undefined : category });
        setGeneratedItems(res.cards);
        setGenerationSource(res.source);
        onContentReady(res.cards);
      } else if (gameId === 'word-hunt') {
        const res = await generateWordHuntContent();
        setGeneratedItems([res]);
        setGenerationSource('local');
        onContentReady([res]);
      } else if (gameId === 'scattergories') {
        const res = await generateScattergoriesContent();
        setGeneratedItems(res.categories.map((c) => ({ letter: res.letter, category: c })));
        setGenerationSource('local');
        onContentReady(res.categories);
      } else if (gameId === 'trivia-elimination') {
        const res = await generateEliminationContent({ count: itemCount });
        setGeneratedItems(res.questions);
        setGenerationSource(res.source);
        onContentReady(res.questions);
      }

      await loadStatus();
      setStatusMessage('Content generated successfully! Review below before starting.');
    } catch (err: any) {
      setStatusMessage(`Generation notice: ${err?.message || 'Error generating items'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateItem = async (index: number) => {
    try {
      if (gameId === 'family-trivia') {
        const replacement = await regenerateSingleTriviaItem({
          category: category === 'All' ? undefined : category,
          difficulty,
          language,
          preferAi,
        });
        if (replacement) {
          const updated = [...generatedItems];
          updated[index] = replacement;
          setGeneratedItems(updated);
          onContentReady(updated);
        }
      } else if (gameId === 'charades') {
        const replacement = await regenerateSingleCharadesItem({
          category: category === 'All' ? undefined : category,
          difficulty,
          language,
          preferAi,
        });
        if (replacement) {
          const updated = [...generatedItems];
          updated[index] = replacement;
          setGeneratedItems(updated);
          onContentReady(updated);
        }
      } else if (gameId === 'pictionary') {
        const replacement = await regenerateSinglePictionaryItem({
          category: category === 'All' ? undefined : category,
          difficulty,
          language,
          preferAi,
        });
        if (replacement) {
          const updated = [...generatedItems];
          updated[index] = replacement;
          setGeneratedItems(updated);
          onContentReady(updated);
        }
      } else if (gameId === 'guess-the-word') {
        const replacement = await regenerateSingleGuessWordItem({
          category: category === 'All' ? undefined : category,
          difficulty,
          language,
          preferAi,
        });
        if (replacement) {
          const updated = [...generatedItems];
          updated[index] = replacement;
          setGeneratedItems(updated);
          onContentReady(updated);
        }
      }
    } catch (err) {
      console.warn('Failed to regenerate single item:', err);
    }
  };

  const handleRemoveItem = (index: number) => {
    const updated = generatedItems.filter((_, idx) => idx !== index);
    setGeneratedItems(updated);
    onContentReady(updated);
  };

  const handleClearHistory = async () => {
    if (confirm(`Clear content history for ${gameTitle}? Previously used items may appear again.`)) {
      await clearContentHistory(gameId);
      await loadStatus();
      setStatusMessage('History cleared.');
    }
  };

  // Initial automatic generation so the preview is immediately playable
  useEffect(() => {
    handleGenerate();
  }, [gameId]);

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-[#0a1329] border border-slate-800 shadow-xl space-y-6 mb-8">
      {/* Header with Mode Badge & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-black text-lg text-white">
              Dynamic Content Generator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unlimited procedural generation. Preview and replace items before players see them.
          </p>
        </div>

        {/* Engine status pill */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              engineStatus.hasAiKey && preferAi
                ? 'bg-purple-950/80 text-purple-300 border border-purple-700/60'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                engineStatus.hasAiKey && preferAi ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            {engineStatus.hasAiKey && preferAi ? 'Gemini AI Active' : 'Local Procedural Engine (Offline)'}
          </span>

          {engineStatus.historyCount > 0 && (
            <button
              onClick={handleClearHistory}
              title="Clear used items history to allow replays"
              className="text-[11px] text-slate-400 hover:text-slate-200 underline decoration-slate-600 transition-colors"
            >
              Clear History ({engineStatus.historyCount})
            </button>
          )}
        </div>
      </div>

      {/* Generator Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Category Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Category / Theme
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getCategories().map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Selector (Non-Bingo) */}
        {gameId !== 'family-bingo' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Mixed (All Difficulties)</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}

        {/* Item Count Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            {gameId === 'family-bingo' ? 'Number of Cards' : 'Number of Items'}
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {gameId === 'family-bingo' ? (
              <>
                <option value={2}>2 Player Cards</option>
                <option value={4}>4 Player Cards</option>
                <option value={6}>6 Player Cards</option>
                <option value={8}>8 Player Cards</option>
                <option value={12}>12 Player Cards</option>
              </>
            ) : (
              <>
                <option value={5}>5 Items</option>
                <option value={10}>10 Items</option>
                <option value={15}>15 Items</option>
                <option value={20}>20 Items</option>
              </>
            )}
          </select>
        </div>

        {/* Language Selector (Non-Bingo) */}
        {gameId !== 'family-bingo' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Language / Style
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English (Universal)</option>
              <option value="fil">Filipino / Taglish Relatable</option>
            </select>
          </div>
        )}
      </div>

      {/* AI Custom Topic prompt (if Gemini key configured) */}
      {engineStatus.hasAiKey && (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-purple-950/40 border border-purple-900/60 p-3 rounded-2xl">
          <input
            type="text"
            placeholder="Optional custom topic (e.g., '90s Cartoons', 'Filipino Christmas', 'World Landmarks')..."
            value={topicPrompt}
            onChange={(e) => setTopicPrompt(e.target.value)}
            className="w-full sm:flex-1 bg-slate-950/80 border border-purple-800/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="flex items-center gap-2 text-xs text-purple-200 cursor-pointer">
              <input
                type="checkbox"
                checked={preferAi}
                onChange={(e) => setPreferAi(e.target.checked)}
                className="rounded border-purple-700 bg-slate-900 text-purple-500 focus:ring-purple-500"
              />
              Use Gemini AI
            </label>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => handleGenerate(count)}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating Content...' : 'Generate Fresh Set'}
        </button>

        <button
          onClick={() => handleGenerate(count)}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-400" />
          Regenerate All
        </button>

        {statusMessage && (
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 ml-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {statusMessage}
          </span>
        )}
      </div>

      {/* Content Preview & Review Deck */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            Host Review & Customization ({generatedItems.length} items ready)
          </h3>
          <span className="text-[11px] text-slate-400">
            Source: <strong className="text-slate-200 uppercase">{generationSource}</strong>
          </span>
        </div>

        {/* Trivia Preview */}
        {gameId === 'family-trivia' && (
          <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {generatedItems.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      Q{idx + 1} · {q.category}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">
                      Answer: {q.options[q.correctOptionIndex]}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white">{q.prompt}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {q.options.map((opt: string, optIdx: number) => (
                      <span
                        key={optIdx}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border ${
                          optIdx === q.correctOptionIndex
                            ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="text-[10px] text-slate-400 italic">Host info: {q.explanation}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleRegenerateItem(idx)}
                    title="Regenerate this item"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    title="Remove item"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charades Preview */}
        {gameId === 'charades' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {generatedItems.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                      {c.difficulty || 'medium'} · {c.points || 2} pts
                    </span>
                    <span className="text-[10px] text-slate-400">{c.category}</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-white mt-1">{c.word}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRegenerateItem(idx)}
                    title="Regenerate item"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    title="Remove item"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pictionary Preview */}
        {gameId === 'pictionary' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {generatedItems.map((p, idx) => (
              <div
                key={p.id || idx}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {p.difficulty || 'easy'}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.category}</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-white mt-1">{p.word}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRegenerateItem(idx)}
                    title="Regenerate item"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    title="Remove item"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guess the Word Preview */}
        {gameId === 'guess-the-word' && (
          <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {generatedItems.map((puzzle, idx) => (
              <div
                key={puzzle.id || idx}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                      Puzzle {idx + 1} · {puzzle.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Word: {puzzle.word}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRegenerateItem(idx)}
                      title="Regenerate item"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      title="Remove item"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {puzzle.clues.map((clue: string, cIdx: number) => (
                    <div
                      key={cIdx}
                      className="text-[11px] p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300"
                    >
                      <strong className="text-sky-400 mr-1">Clue {cIdx + 1}:</strong>
                      {clue}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Family Bingo Cards Viewer */}
        {gameId === 'family-bingo' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Select Card to Inspect:</span>
              {generatedItems.map((card: GeneratedBingoCard, idx) => (
                <button
                  key={card.id || idx}
                  onClick={() => setSelectedBingoCardIdx(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    selectedBingoCardIdx === idx
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {card.playerName}
                </button>
              ))}
            </div>

            {generatedItems[selectedBingoCardIdx] && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {generatedItems[selectedBingoCardIdx].playerName}'s Card
                    </h4>
                    <span className="text-[11px] text-amber-400">
                      {generatedItems[selectedBingoCardIdx].themeName}
                    </span>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Cards
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 max-w-lg mx-auto">
                  {['B', 'I', 'N', 'G', 'O'].map((letter) => (
                    <div
                      key={letter}
                      className="text-center font-display font-black text-sm text-amber-400 py-1 bg-slate-900 rounded-lg border border-slate-800"
                    >
                      {letter}
                    </div>
                  ))}

                  {generatedItems[selectedBingoCardIdx].grid.map(
                    (row: any[], rIdx: number) =>
                      row.map((cell: any, cIdx: number) => (
                        <div
                          key={`${rIdx}_${cIdx}`}
                          className={`aspect-square p-1 flex items-center justify-center text-center rounded-xl text-[10px] font-bold border transition-colors ${
                            cell.isFree
                              ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                              : 'bg-slate-900 text-slate-200 border-slate-800'
                          }`}
                        >
                          <span className="line-clamp-3">{cell.text}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
