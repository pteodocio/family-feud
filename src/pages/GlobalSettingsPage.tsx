import { useState, useEffect } from 'react';
import { Settings, Volume2, Tv, ArrowLeft, Check, Keyboard, HardDrive, RefreshCw, Sparkles, Key } from 'lucide-react';
import { useRouter } from '../router/Router';
import { HubNavbar } from '../components/common/HubNavbar';
import { loadSettings, saveSettings, type AppSettings, DEFAULT_SETTINGS, initializeDatabase } from '../db/database';
import { soundManager } from '../audio/soundManager';
import { getStoredApiKey, setStoredApiKey, testAiConnection } from '../services/aiGenerator';
import { clearContentHistory, getContentHistoryCount } from '../services/contentHistory';

export function GlobalSettingsPage() {
  const { navigate } = useRouter();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [geminiKeyInput, setGeminiKeyInput] = useState<string>('');
  const [isTestingAi, setIsTestingAi] = useState<boolean>(false);
  const [historyCount, setHistoryCount] = useState<number>(0);

  useEffect(() => {
    loadSettings().then((s) => {
      if (s) setSettings(s);
    });
    setGeminiKeyInput(getStoredApiKey());
    getContentHistoryCount().then(setHistoryCount);
  }, []);

  const handleSaveGeminiKey = () => {
    setStoredApiKey(geminiKeyInput);
    setNotification(geminiKeyInput.trim() ? 'Gemini API key saved!' : 'Gemini API key cleared.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTestAi = async () => {
    setIsTestingAi(true);
    const res = await testAiConnection(geminiKeyInput);
    setIsTestingAi(false);
    setNotification(res.message);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleClearHistoryAll = async () => {
    if (confirm('Clear content history across all Hub party games? (Family Feud remains untouched)')) {
      const deleted = await clearContentHistory();
      setHistoryCount(0);
      setNotification(`Cleared ${deleted} content history records.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleChange = (key: keyof AppSettings, val: any) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);

    // Apply live audio settings to soundManager
    if (key === 'masterVolume') soundManager.setMasterVolume(val);
    if (key === 'effectsVolume') soundManager.setEffectsVolume(val);
    if (key === 'bgmVolume') soundManager.setBgmVolume(val);
    if (key === 'soundEnabled') soundManager.setMuted(!val);
    if (key === 'effectsEnabled') soundManager.setEffectsEnabled(val);
    if (key === 'bgmEnabled') soundManager.setBgmEnabled(val);

    saveSettings(updated).then(() => {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
    });
  };

  const handleTestSound = () => {
    soundManager.init();
    soundManager.playPartyCue('correct');
  };

  const handlePlayFanfare = () => {
    soundManager.init();
    soundManager.playPartyCue('fanfare');
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset starter packs and settings to defaults? Your custom question packs and game history will be kept.')) {
      await initializeDatabase();
      setNotification('Starter packs re-seeded successfully.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col justify-between select-none">
      <HubNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
              title="Return to Hub Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-400 font-mono">
                SETTINGS & RULES
              </div>
              <h1 className="font-display font-black text-2xl text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-400" />
                Global Platform Settings
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Sound synthesizer, display mirroring, game shortcuts, and device preferences.
              </p>
            </div>
          </div>

          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-full animate-in fade-in duration-200">
              <Check className="w-3.5 h-3.5" />
              Settings Saved
            </span>
          )}
        </div>

        {notification && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {notification}
          </div>
        )}

        <div className="space-y-6">
          {/* AUDIO CONTROLS SECTION */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="font-display font-black text-lg text-white">Audio & Sound Synthesis</h2>
                  <p className="text-xs text-slate-400">Controls synthesized Web Audio volume and television sound effects.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestSound}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-colors"
                >
                  Test Sound FX
                </button>
                <button
                  onClick={handlePlayFanfare}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold hover:bg-blue-500/30 transition-colors flex items-center gap-1.5"
                >
                  🎺 Intro Fanfare
                </button>
              </div>
            </div>

            {/* Master Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-bold">Master Volume</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => handleChange('masterVolume', parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Sound FX Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-bold">Sound Effects Volume</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round(settings.effectsVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.effectsVolume}
                onChange={(e) => handleChange('effectsVolume', parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Audio Destination */}
            <div className="pt-2">
              <label className="text-xs text-slate-300 font-bold block mb-1.5">
                Audio Output Target:
              </label>
              <select
                value={settings.audioDestination}
                onChange={(e) => handleChange('audioDestination', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="auto">Auto (Smart Speaker Routing)</option>
                <option value="both">Play on Both Laptop & TV Screen</option>
                <option value="tv_only">Play on TV / Projector Display Only</option>
                <option value="host_only">Play on Host Laptop Only</option>
              </select>
            </div>
          </div>

          {/* HOST KEYBOARD SHORTCUTS SECTION */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <Keyboard className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-display font-bold text-base text-white">Host Keyboard Shortcuts</h3>
                <p className="text-xs text-slate-400">Quick keys available on the Host Control screen for smooth showrunning.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Reveal Answers</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-amber-300 font-bold">1 - 8</kbd>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Strike Buzzer</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-red-300 font-bold">X</kbd>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Clear Strike</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-emerald-300 font-bold">Z</kbd>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Undo Action</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-blue-300 font-bold">U</kbd>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Start / Pause Timer</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-purple-300 font-bold">Space</kbd>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Next Question</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-cyan-300 font-bold">→</kbd>
              </div>
            </div>
          </div>

          {/* TV DISPLAY PREFERENCES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <Tv className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm text-white">TV / Projector Display Preferences</h3>
                <p className="text-xs text-slate-400">Settings for the secondary monitor audience board.</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">High Contrast TV Mode</span>
                <span className="text-[11px] text-slate-400">Boosts text outlines and contrast for distant viewing.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrastMode}
                onChange={(e) => handleChange('highContrastMode', e.target.checked)}
                className="w-5 h-5 accent-blue-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Aspect Ratio</span>
                <span className="text-[11px] text-slate-400">Default aspect ratio for secondary display window.</span>
              </div>
              <select
                value={settings.tvAspectRatio}
                onChange={(e) => handleChange('tvAspectRatio', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1 text-xs text-white"
              >
                <option value="16:9">16:9 Widescreen (Modern TV)</option>
                <option value="4:3">4:3 Standard (Classroom Projector)</option>
                <option value="auto">Auto Fit Viewport</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC CONTENT GENERATION & AI ENGINE */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="font-display font-black text-lg text-white">Dynamic Content Generation & AI Engine</h2>
                  <p className="text-xs text-slate-400">Offline procedural generation and optional Google Gemini AI connection.</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Offline Procedural Engine Active
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The 5 party games (<strong>Family Trivia</strong>, <strong>Charades</strong>, <strong>Pictionary</strong>, <strong>Family Bingo</strong>, and <strong>Guess the Word</strong>) use a comprehensive local procedural generation engine that creates thousands of playable prompts and questions with <strong>zero internet or API key required</strong>.
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              Optionally, enter a <strong>Google Gemini API key</strong> below to enable AI-powered custom themes and custom prompts on demand. Your key is stored solely in your local browser and is never committed to source code.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <div className="relative w-full sm:flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Enter Google Gemini API Key (e.g. AIzaSy...)"
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveGeminiKey}
                  className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow"
                >
                  Save Key
                </button>

                <button
                  onClick={handleTestAi}
                  disabled={isTestingAi}
                  className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  {isTestingAi ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </div>

            {/* Content History Management */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Content History Tracking</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                    {historyCount} items recorded
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Previously played questions and prompts are recorded locally to avoid repetitive questions.
                </p>
              </div>

              {historyCount > 0 && (
                <button
                  onClick={handleClearHistoryAll}
                  className="text-xs text-rose-300 hover:text-rose-200 bg-rose-950/60 border border-rose-800/80 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>

          {/* DATA & STARTER PACKS */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-slate-400" />
              <div>
                <h3 className="font-bold text-sm text-white">Starter Question Packs</h3>
                <p className="text-xs text-slate-400">Re-seed built-in Filipino trivia packs if any were accidentally modified.</p>
              </div>
            </div>
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Starter Packs
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-800/80 bg-[#040813] py-4 px-4 text-center text-xs text-slate-500">
        <span>Family Game Hub · Preferences Saved in Browser</span>
      </footer>
    </div>
  );
}
