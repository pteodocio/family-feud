import { useState, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  Keyboard,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from '../router/Router';
import { useGameStore } from '../store/gameStore';
import { exportUserData, importUserData, initializeDatabase } from '../db/database';

export function SettingsPage() {
  const { navigate } = useRouter();
  const { settings, updateSettings, playSound } = useGameStore();

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
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
        <div className="bg-[#071638] border border-blue-900 rounded-2xl p-5 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-blue-900/80 pb-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-feud-gold" />
              <h2 className="font-display font-black text-lg text-white">Audio & Sound Synthesis</h2>
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="rounded border-blue-700 text-feud-gold"
              />
              Enable Sound Effects
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                Master Volume: {Math.round(settings.masterVolume * 100)}%
              </label>
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

            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                Effects Volume: {Math.round(settings.effectsVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.effectsVolume}
                onChange={(e) => updateSettings({ effectsVolume: parseFloat(e.target.value) })}
                className="w-full accent-feud-gold"
              />
            </div>
          </div>

          {/* Sound Testing Buttons */}
          <div>
            <span className="text-xs font-bold uppercase text-gray-400 block mb-2">
              Sound Test (Royalty-free Web Audio Synthesizer):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => playSound('intro')}
                className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🎺 Intro Fanfare
              </button>
              <button
                onClick={() => playSound('reveal')}
                className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🎴 Card Flip
              </button>
              <button
                onClick={() => playSound('correct')}
                className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🔔 Correct Ding
              </button>
              <button
                onClick={() => playSound('strike')}
                className="bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                ❌ Strike Buzzer
              </button>
              <button
                onClick={() => playSound('strike3')}
                className="bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                💥 Triple Strike
              </button>
              <button
                onClick={() => playSound('steal_success')}
                className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                ⭐ Steal Win
              </button>
              <button
                onClick={() => playSound('game_win')}
                className="bg-feud-gold/20 hover:bg-feud-gold/30 border border-feud-gold/60 text-feud-gold text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                🏆 Victory Fanfare
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
