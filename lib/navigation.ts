"use client";

/**
 * Mock implementation of Next.js navigation hooks for the browser environment.
 */

export const useRouter = () => {
  return {
    push: (url: string) => {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', url);
      }
    },
    replace: (url: string) => {
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', url);
      }
    },
    back: () => {
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    },
    prefetch: () => {}, 
  };
};

export const usePathname = () => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};