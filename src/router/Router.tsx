import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
  openDisplayWindow: (gameId: string) => void;
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

  const openDisplayWindow = (gameId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/display/${gameId}`;
    window.open(url, `feud_display_${gameId}`, 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no');
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, openDisplayWindow }}>
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
