import { useEffect, useState } from 'react';

// Helper to get current theme from document or localStorage
function getCurrentTheme() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    // fallback to document attribute
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
  return false;
}

export default function useThemeContext() {
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());

  useEffect(() => {
    // On mount, set theme from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        setIsDarkTheme(true);
      } else if (stored === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        setIsDarkTheme(false);
      }
    }
    const handler = () => {
      setIsDarkTheme(getCurrentTheme());
    };
    window.addEventListener('storage', handler);
    // Listen for theme changes
    const observer = new MutationObserver(handler);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('storage', handler);
      observer.disconnect();
    };
  }, []);

  const setLightTheme = () => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    setIsDarkTheme(false);
  };
  const setDarkTheme = () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    setIsDarkTheme(true);
  };

  return {
    isDarkTheme,
    setLightTheme,
    setDarkTheme,
  };
}
