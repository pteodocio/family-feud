import { useState } from 'react';
import { Home, Gamepad2, History, Settings, Users, Volume2, HelpCircle, Menu, X } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { soundManager } from '../../audio/soundManager';

interface HubNavbarProps {
  onOpenPlayerManager?: () => void;
  onOpenHowToPlay?: () => void;
}

export function HubNavbar({ onOpenPlayerManager, onOpenHowToPlay }: HubNavbarProps) {
  const { currentPath, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const handleTestAudio = () => {
    soundManager.init();
    soundManager.playPartyCue('fanfare');
    setIsAudioActive(true);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'All Games', path: '/games', icon: Gamepad2 },
    { label: 'Game History', path: '/history', icon: History },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="w-full bg-[#070e1e]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-amber-400 p-[1.5px] shadow-lg shadow-blue-950/50">
            <div className="w-full h-full bg-[#0a1226] rounded-[10px] flex items-center justify-center text-amber-400 font-display font-black text-lg group-hover:scale-105 transition-transform">
              F
            </div>
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-tight text-white flex items-center gap-1.5">
              Family Game Hub
            </span>
            <span className="text-[10px] text-blue-300/70 font-semibold hidden sm:block leading-none">
              One Place. Endless Family Fun.
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (item.path === '/games' && currentPath.startsWith('/games/'));

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}

          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              How to Play
            </button>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          {onOpenPlayerManager && (
            <button
              onClick={onOpenPlayerManager}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-200 transition-colors shadow-sm"
              title="Manage Players & Teams"
            >
              <Users className="w-4 h-4 text-blue-400" />
              Roster
            </button>
          )}

          <button
            onClick={handleTestAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isAudioActive
                ? 'bg-blue-900/60 border-blue-500 text-blue-300'
                : 'bg-amber-400/10 border-amber-400/40 text-amber-300 hover:bg-amber-400/20'
            }`}
            title="Initialize Web Audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
            {isAudioActive ? 'Audio On' : 'Test Sound'}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenPlayerManager && (
            <button
              onClick={onOpenPlayerManager}
              className="p-2 rounded-xl bg-slate-800 text-blue-400"
            >
              <Users className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070e1e] p-4 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/80"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}

          {onOpenHowToPlay && (
            <button
              onClick={() => {
                onOpenHowToPlay();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/80"
            >
              <HelpCircle className="w-4 h-4" />
              How to Play
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={handleTestAudio}
              className="flex items-center gap-2 text-xs font-bold text-amber-300 py-1.5 px-3 rounded-lg bg-amber-400/10 border border-amber-400/40"
            >
              <Volume2 className="w-4 h-4" />
              Test Game Sound
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
