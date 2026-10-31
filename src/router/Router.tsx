import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
  openDisplayWindow: (gameId: string) => Promise<Window | null>;
  closeDisplayWindow: () => void;
  isDisplayWindowOpen: () => boolean;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parsePath(): string {
  if (typeof window === 'undefined') return '/';
  // Prefer hash if present (e.g. #/display/xyz), else pathname
  const hash = window.location.hash;
  if (hash.startsWith('#/')) {
    return hash.slice(1);
  } else if (hash.startsWith('#')) {
    return hash.slice(1) || '/';
  }
  return window.location.pathname || '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(parsePath);
  const displayWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(parsePath());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    if (to.startsWith('/')) {
      // Update hash so it always works offline and across reloads
      window.location.hash = `#${to}`;
      setCurrentPath(to);
      window.scrollTo(0, 0);
    }
  };

  const openDisplayWindow = async (gameId: string): Promise<Window | null> => {
    const url = `${window.location.origin}${window.location.pathname}#/display/${gameId}`;
    let windowFeatures = 'width=1280,height=720,left=100,top=100,menubar=no,toolbar=no,location=no,status=no';

    try {
      if (typeof window !== 'undefined' && 'getScreenDetails' in window) {
        const screenDetails = await (window as any).getScreenDetails();
        if (screenDetails?.screens?.length > 1) {
          const secondary =
            screenDetails.screens.find((s: any) => s !== screenDetails.currentScreen) ||
            screenDetails.screens[1];
          if (secondary) {
            windowFeatures = `left=${secondary.availLeft},top=${secondary.availTop},width=${secondary.availWidth},height=${secondary.availHeight},menubar=no,toolbar=no,location=no,status=no`;
          }
        }
      }
    } catch {
      // Fallback to default dimensions if Window Management API fails or permission denied
    }

    const targetName = `feud_display_${gameId}`;
    const win = window.open(url, targetName, windowFeatures);
    if (win) {
      win.focus();
      displayWindowRef.current = win;
    }
    return win;
  };

  const closeDisplayWindow = () => {
    if (displayWindowRef.current && !displayWindowRef.current.closed) {
      try {
        displayWindowRef.current.close();
      } catch (err) {
        console.warn('Could not close window directly:', err);
      }
    }
    displayWindowRef.current = null;
  };

  const isDisplayWindowOpen = () => {
    return Boolean(displayWindowRef.current && !displayWindowRef.current.closed);
  };

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        navigate,
        openDisplayWindow,
        closeDisplayWindow,
        isDisplayWindowOpen,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}

export function Link({
  to,
  children,
  className = '',
  title,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const { navigate } = useRouter();

  return (
    <a
      href={`#${to}`}
      title={title}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

/**
 * Matches path against route pattern, e.g. "/game/:id" vs "/game/123"
 */
export function matchPattern(
  pattern: string,
  pathname: string
): { matches: boolean; params: Record<string, string> } {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('?')[0].split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}
