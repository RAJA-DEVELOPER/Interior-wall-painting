/**
 * theme.js — Dark/Light mode + RTL/LTR toggle with localStorage
 */

(function () {
  'use strict';

  /* ── THEME ── */
  const THEME_KEY = 'evora-theme';
  const RTL_KEY   = 'evora-dir';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    const sunSvg  = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    const moonSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
      el.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ── RTL ── */
  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(RTL_KEY, dir);
    updateDirIcons(dir);
  }

  function updateDirIcons(dir) {
    document.querySelectorAll('[data-dir-icon]').forEach(el => {
      el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      el.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  }

  function toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'rtl' ? 'ltr' : 'rtl');
  }

  /* ── INIT ── */
  function init() {
    // Restore saved preferences
    const savedTheme = localStorage.getItem(THEME_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const savedDir = localStorage.getItem(RTL_KEY) || 'ltr';

    applyTheme(savedTheme);
    applyDir(savedDir);

    // Bind toggle buttons
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-toggle-theme]')) toggleTheme();
      if (e.target.closest('[data-toggle-dir]'))   toggleDir();
    });

    // Watch system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
