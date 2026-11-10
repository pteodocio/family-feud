import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Music,
  Radio,
  Play,
  Square,
  Tv,
  Monitor,
  Speaker,
  Keyboard,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Key,
} from 'lucide-react';
import { useRouter } from '../router/Router';
import { useGameStore } from '../store/gameStore';
import { exportUserData, importUserData, initializeDatabase } from '../db/database';
import { getStoredApiKey, setStoredApiKey, testAiConnection } from '../services/aiGenerator';
import { clearContentHistory, getContentHistoryCount } from '../services/contentHistory';

export function SettingsPage() {
  const { navigate } = useRouter();
  const { settings, updateSettings, playSound, playBgm, stopBgm } = useGameStore();

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activePreviewBgm, setActivePreviewBgm] = useState<string | null>(null);
  const [geminiKeyInput, setGeminiKeyInput] = useState<string>('');
  const [isTestingAi, setIsTestingAi] = useState<boolean>(false);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGeminiKeyInput(getStoredApiKey());
    getContentHistoryCount().then(setHistoryCount);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveGeminiKey = () => {
    setStoredApiKey(geminiKeyInput);
    showNotification(geminiKeyInput.trim() ? 'Gemini API key saved!' : 'Gemini API key cleared.');
  };

  const handleTestAi = async () => {
    setIsTestingAi(true);
    const res = await testAiConnection(geminiKeyInput);
    setIsTestingAi(false);
    showNotification(res.message, res.success ? 'success' : 'error');
  };

  const handleClearHistoryAll = async () => {
    if (confirm('Clear content history across all Hub party games? (Family Feud remains untouched)')) {
      const deleted = await clearContentHistory();
      setHistoryCount(0);
      showNotification(`Cleared ${deleted} content history records.`);
    }
  };

  const handleExportBackup = async () => {
    const data = await exportUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `family_feud_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Backup exported successfully.');
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const res = await importUserData(event.target?.result as string);
      if (res.success) {
        showNotification(`Restored ${res.count} question packs and settings!`);
      } else {
        showNotification(`Restore failed: ${res.error}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset to default built-in starter packs? Your custom packs will be kept.')) {
      await initializeDatabase();
      showNotification('Starter packs re-seeded successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-feud-dark text-white stage-background p-4 sm:p-8 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900 border border-blue-800 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Menu
            </button>
            <h1 className="font-display font-black text-2xl text-feud-gold tracking-wide">
              SETTINGS & RULES
            </h1>
          </div>
        </div>

        {/* NOTIFICATION */}
        {notification && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
              notification.type === 'success'
                ? 'bg-green-950/80 border-green-500 text-green-200'
                : 'bg-red-950/80 border-red-500 text-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {notification.message}
          </div>
        )}

        {/* SOUND SETTINGS SECTION */}
        <div className="bg-[#071638] border border-blue-900 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/80 pb-3">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-6 h-6 text-feud-gold" />
              <div>
                <h2 className="font-display font-black text-lg text-white">Audio & Sound Synthesis</h2>
                <p className="text-xs text-gray-400">Television game show sound effects, orchestral music, and multi-screen sync</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                settings.soundEnabled
                  ? 'bg-blue-950 border-blue-700 text-blue-300 hover:bg-blue-900'
                  : 'bg-red-950/80 border-red-700 text-red-300 hover:bg-red-900'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
              {settings.soundEnabled ? 'Master: Unmuted' : 'Master: Muted'}
            </button>
          </div>

          {/* Volume Sliders & Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Master Volume */}
            <div className="bg-black/30 border border-blue-950 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Speaker className="w-3.5 h-3.5 text-feud-gold" /> Master Volume
                </span>
                <span className="text-xs font-mono font-bold text-feud-gold">
                  {Math.round(settings.masterVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => updateSettings({ masterVolume: parseFloat(e.target.value) })}
                className="w-full accent-feud-gold"
              />
            </div>

            {/* Sound Effects Volume & Toggle */}
            <div className="bg-black/30 border border-blue-950 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Sound Effects
                </span>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {settings.effectsEnabled !== false ? `${Math.round(settings.effectsVolume * 100)}%` : 'Disabled'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.effectsVolume}
                disabled={settings.effectsEnabled === false}
                onChange={(e) => updateSettings({ effectsVolume: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 disabled:opacity-40"
              />
              <label className="flex items-center gap-2 text-[11px] text-gray-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={settings.effectsEnabled !== false}
                  onChange={(e) => updateSettings({ effectsEnabled: e.target.checked })}
                  className="rounded border-blue-700 text-feud-gold"
                />
                Enable Sound Effects
              </label>
            </div>

            {/* Background Music Volume & Toggle */}
            <div className="bg-black/30 border border-blue-950 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-purple-400" /> Background Music
                </span>
                <span className="text-xs font-mono font-bold text-purple-400">
                  {settings.bgmEnabled !== false ? `${Math.round((settings.bgmVolume ?? 0.5) * 100)}%` : 'Disabled'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.bgmVolume ?? 0.5}
                disabled={settings.bgmEnabled === false}
                onChange={(e) => updateSettings({ bgmVolume: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 disabled:opacity-40"
              />
              <label className="flex items-center gap-2 text-[11px] text-gray-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={settings.bgmEnabled !== false}
                  onChange={(e) => updateSettings({ bgmEnabled: e.target.checked })}
                  className="rounded border-blue-700 text-feud-gold"
                />
                Enable Background Music
              </label>
            </div>
          </div>

          {/* Audio Destination Routing (Multi-Screen TV / Host Mode) */}
          <div className="bg-blue-950/40 border border-blue-900/80 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-feud-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
                  Audio Destination Routing (Multi-Screen Mode)
                </span>
              </div>
              <span className="text-[11px] text-feud-gold font-bold">
                Eliminates Speaker Echo & Delay
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  id: 'auto',
                  title: 'Auto (Recommended)',
                  desc: 'TV speakers when connected; laptop when standalone',
                  icon: Radio,
                },
                {
                  id: 'tv_only',
                  title: 'TV Display Only',
                  desc: 'Host laptop stays silent; all audio from TV monitor',
                  icon: Tv,
                },
                {
                  id: 'host_only',
                  title: 'Host Screen Only',
                  desc: 'TV remains silent; all audio from host laptop',
                  icon: Monitor,
                },
                {
                  id: 'both',
                  title: 'Both Screens',
                  desc: 'Play simultaneously on both TV and host device',
                  icon: Speaker,
                },
              ].map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => updateSettings({ audioDestination: dest.id as any })}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    (settings.audioDestination || 'auto') === dest.id
                      ? 'bg-blue-900/60 border-feud-gold text-white shadow-gold-glow'
                      : 'bg-black/40 border-blue-950 text-gray-400 hover:border-blue-800 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-bold text-xs">
                    <dest.icon className="w-3.5 h-3.5 text-feud-gold" />
                    <span>{dest.title}</span>
                  </div>
                  <span className="text-[11px] leading-tight text-gray-400">{dest.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Music Live Preview */}
          <div className="bg-black/40 border border-blue-950 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-purple-400" /> Family Feud Theme Music Preview
              </span>
              {activePreviewBgm && (
                <span className="text-[11px] font-bold text-green-400 animate-pulse">
                  ● Playing Theme Song
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  playBgm('theme');
                  setActivePreviewBgm('theme');
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 border transition-all ${
                  activePreviewBgm === 'theme'
                    ? 'bg-purple-900 border-purple-500 text-white shadow-gold-glow'
                    : 'bg-purple-950/60 hover:bg-purple-900 border-purple-800 text-purple-200'
                }`}
              >
                <Play className="w-3 h-3" /> ▶ Play Theme Song
              </button>

              <button
                onClick={() => {
                  stopBgm();
                  setActivePreviewBgm(null);
                }}
                className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300"
              >
                <Square className="w-3 h-3 text-red-400" /> ■ Stop Music
              </button>
            </div>
          </div>

          {/* Sound Testing Station */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Core Game Sound Effects:
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => playSound('reveal')}
                className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🎴 Survey Says (Reveal)
              </button>
              <button
                onClick={() => playSound('correct')}
                className="bg-green-950 hover:bg-green-900 border border-green-700 text-green-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🔔 Board Ding
              </button>
              <button
                onClick={() => playSound('strike')}
                className="bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                ❌ Strike Buzzer
              </button>
              <button
                onClick={() => playSound('strike3')}
                className="bg-red-950 hover:bg-red-900 border border-red-600 text-red-100 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                💥 3 Strikes (Double Buzzer)
              </button>
              <button
                onClick={() => playSound('wrong')}
                className="bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🛑 Wrong / Mistake Buzzer
              </button>
              <button
                onClick={() => playSound('round_win')}
                className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🎉 Round Win
              </button>
              <button
                onClick={() => playSound('game_win')}
                className="bg-feud-gold/20 hover:bg-feud-gold/30 border border-feud-gold/60 text-feud-gold text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🏆 Champion Victory
              </button>
              <button
                onClick={() => playSound('intro')}
                className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🎺 Intro Fanfare
              </button>
            </div>
          </div>
        </div>

        {/* KEYBOARD SHORTCUTS REFERENCE */}
        <div className="bg-[#071638] border border-blue-900 rounded-2xl p-5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-blue-900/80 pb-2">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-feud-gold" />
              <h2 className="font-display font-black text-lg text-white">Host Keyboard Shortcuts</h2>
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={settings.keyboardShortcutsEnabled}
                onChange={(e) =>
                  updateSettings({ keyboardShortcutsEnabled: e.target.checked })
                }
                className="rounded border-blue-700 text-feud-gold"
              />
              Enable Shortcuts
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#0b1f4c] border border-blue-900 rounded-xl p-2.5">
              <div className="font-bold text-feud-gold font-mono text-sm">Key: 1 to 8</div>
              <div className="text-gray-300 text-[11px] mt-0.5">Reveal answer slot 1–8</div>
            </div>

            <div className="bg-[#0b1f4c] border border-blue-900 rounded-xl p-2.5">
              <div className="font-bold text-red-400 font-mono text-sm">Key: X</div>
              <div className="text-gray-300 text-[11px] mt-0.5">Record Strike (1, 2, 3)</div>
            </div>

            <div className="bg-[#0b1f4c] border border-blue-900 rounded-xl p-2.5">
              <div className="font-bold text-blue-300 font-mono text-sm">Key: Z</div>
              <div className="text-gray-300 text-[11px] mt-0.5">Clear strike / mistake</div>
            </div>

            <div className="bg-[#0b1f4c] border border-blue-900 rounded-xl p-2.5">
              <div className="font-bold text-amber-300 font-mono text-sm">Key: U</div>
              <div className="text-gray-300 text-[11px] mt-0.5">Undo last host action</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 italic">
            * Note: Shortcuts are automatically suppressed when typing inside an input box or search field.
          </p>
        </div>

        {/* DYNAMIC CONTENT GENERATION & AI CONFIGURATION */}
        <div className="bg-[#071638] border border-blue-900 rounded-2xl p-5 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-blue-900/80 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-black text-lg text-white">
                Dynamic Content Generation & AI Engine
              </h2>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Offline Procedural Engine Active
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            The 5 party games (<strong>Family Trivia</strong>, <strong>Charades</strong>, <strong>Pictionary</strong>, <strong>Family Bingo</strong>, and <strong>Guess the Word</strong>) use a comprehensive local procedural generation engine that creates thousands of playable prompts and questions with <strong>zero internet or API key required</strong>.
          </p>

          <p className="text-xs text-gray-300 leading-relaxed">
            Optionally, you can enter a <strong>Google Gemini API key</strong> below to enable AI-powered custom themes and custom prompts on demand. Your key is stored solely in your local browser and is never committed to source code.
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
                className="w-full bg-[#0a1b42] border border-blue-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
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
          <div className="mt-2 pt-3 border-t border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Content History Tracking</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  {historyCount} items recorded
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
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

        {/* LOCAL STORAGE & BACKUP */}
        <div className="bg-[#071638] border border-blue-900 rounded-2xl p-5 shadow-md flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-blue-900/80 pb-2">
            <HardDrive className="w-5 h-5 text-feud-gold" />
            <h2 className="font-display font-black text-lg text-white">
              Data Persistence & Offline Backup
            </h2>
          </div>

          <p className="text-xs text-gray-300">
            All custom question packs, settings, and game progress are saved directly into your browser's IndexedDB database. You can export a backup file to move questions to another laptop or keep a safe copy.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportBackup}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow"
            >
              <Download className="w-4 h-4" />
              Download All Data Backup (JSON)
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Restore Backup from File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportBackup}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={handleResetDefaults}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 ml-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Re-seed Starter Packs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
