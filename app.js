/**
 * Neofolk Atlas — DOM contracts, i18n, nav, Supabase Auth (when configured).
 *
 * Configure Supabase (pick one):
 * - Set <meta name="supabase-url" content="https://YOUR_PROJECT.supabase.co"> and
 *   <meta name="supabase-anon-key" content="YOUR_ANON_KEY"> on each HTML page, or
 * - Before loading app.js: window.NEOFOLK_SUPABASE_URL / window.NEOFOLK_SUPABASE_ANON_KEY
 *
 * If URL/key are missing, login/signup fall back to the previous demo behavior (redirect / message only).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const LANG_STORAGE = 'neofolk.preferredLanguage';
const SUPPORTED_LANGS = ['en', 'hi', 'ur'];

let dictionary = {};

/** @type {ReturnType<typeof createClient> | null | undefined} */
let supabaseClient;

function readSupabaseConfig() {
  const url = (
    (typeof window !== 'undefined' && window.NEOFOLK_SUPABASE_URL) ||
    document.querySelector('meta[name="supabase-url"]')?.getAttribute('content')?.trim() ||
    ''
  ).trim();
  const anonKey = (
    (typeof window !== 'undefined' && window.NEOFOLK_SUPABASE_ANON_KEY) ||
    document.querySelector('meta[name="supabase-anon-key"]')?.getAttribute('content')?.trim() ||
    ''
  ).trim();
  return url && anonKey ? { url, anonKey } : null;
}

function getSupabaseClient() {
  if (supabaseClient !== undefined) return supabaseClient;
  const cfg = readSupabaseConfig();
  if (!cfg) {
    supabaseClient = null;
    return null;
  }
  supabaseClient = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return supabaseClient;
}

function t(path) {
  const value = path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), dictionary);
  return typeof value === 'string' ? value : path;
}

async function loadDictionary(code) {
  const lang = SUPPORTED_LANGS.includes(code) ? code : 'en';
  const res = await fetch(`./translations/${lang}.json`);
  if (!res.ok) throw new Error(`Missing translations/${lang}.json`);
  dictionary = await res.json();
  return lang;
}

function applyDocumentLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
}

function syncLanguageSelects(lang) {
  document.querySelectorAll('select.lang-select, #home-language-select').forEach((sel) => {
    if (sel.querySelector(`option[value="${lang}"]`)) sel.value = lang;
  });
}

function applyDataI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const val = t(key);
    if (val && val !== key) el.textContent = val;
  });
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function currentPageFile() {
  if (typeof location === 'undefined') return 'index.html';
  let tail = location.pathname.split('/').pop() || '';
  if (tail.includes('?')) tail = tail.split('?')[0];
  return tail === '' ? 'index.html' : tail;
}

/** Role → dashboard URL (user_metadata.role or app_metadata.role, default seeker). */
function getDashboardPath(user) {
  const role = String(
    user?.user_metadata?.role || user?.app_metadata?.role || 'seeker'
  ).toLowerCase();
  const map = {
    seeker: 'seeker-dashboard.html',
    curator: 'curator-dashboard.html',
    arbiter: 'arbiter-dashboard.html',
    operator: 'operator-dashboard.html',
  };
  return map[role] || map.seeker;
}

function renderAppNav() {
  const nav = document.getElementById('app-nav');
  if (!nav) return;

  const here = currentPageFile();
  const links = [
    { href: 'index.html', key: 'nav.home' },
    { href: 'seeker-dashboard.html', key: 'nav.dashboard' },
    { href: 'subjects.html', key: 'nav.learn' },
    { href: 'guild.html', key: 'nav.groups' },
    { href: 'discovery.html', key: 'nav.explore' },
    { href: 'dictionary.html', key: 'nav.dictionary' },
    { href: 'vision.html', key: 'nav.vision' },
    { href: 'help.html', key: 'nav.help' },
  ];

  nav.innerHTML = links
    .map(({ href, key }) => {
      const active = here === href || (href === 'index.html' && (here === 'index.html' || here === ''));
      const cls = active ? 'sidebar-link is-active' : 'sidebar-link';
      return `<a class="${cls}" href="${href}">${escapeHtml(t(key))}</a>`;
    })
    .join('');
}

function wireAuthForms() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = String(loginForm.elements?.email?.value ?? loginForm.querySelector('[name="email"]')?.value ?? '').trim();
      const password = String(loginForm.elements?.password?.value ?? loginForm.querySelector('[name="password"]')?.value ?? '').trim();
      const msg = document.getElementById('login-message');

      if (!email || !password) {
        if (msg) msg.textContent = t('messages.missingFields');
        return;
      }
      if (msg) msg.textContent = '';

      const supabase = getSupabaseClient();
      if (!supabase) {
        window.location.assign('seeker-dashboard.html');
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (msg) msg.textContent = error.message || t('messages.authFailed');
        return;
      }
      if (data?.user) {
        window.location.assign(getDashboardPath(data.user));
      }
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = String(signupForm.elements?.email?.value ?? signupForm.querySelector('[name="email"]')?.value ?? '').trim();
      const password = String(signupForm.elements?.password?.value ?? signupForm.querySelector('[name="password"]')?.value ?? '').trim();
      const msg = document.getElementById('signup-message');

      if (!email || !password) {
        if (msg) msg.textContent = t('messages.missingFields');
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        if (msg) msg.textContent = t('messages.checkEmail');
        return;
      }

      const emailRedirectTo = new URL('./index.html', location.href).href;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        if (msg) msg.textContent = error.message || t('messages.signupFailed');
        return;
      }

      if (data.session && data.user) {
        window.location.assign(getDashboardPath(data.user));
      } else if (msg) {
        msg.textContent = t('messages.checkEmail');
      }
    });
  }
}

function wireLanguageSelectors() {
  document.querySelectorAll('select.lang-select, #home-language-select').forEach((sel) => {
    sel.addEventListener('change', async (e) => {
      const code = e.target.value;
      if (!SUPPORTED_LANGS.includes(code)) return;
      localStorage.setItem(LANG_STORAGE, code);
      syncLanguageSelects(code);
      await loadDictionary(code);
      applyDocumentLanguage(code);
      applyDataI18n();
      renderAppNav();
    });
  });
}

async function initApp() {
  const stored = localStorage.getItem(LANG_STORAGE);
  const lang = SUPPORTED_LANGS.includes(stored) ? stored : 'en';
  await loadDictionary(lang);
  applyDocumentLanguage(lang);
  syncLanguageSelects(lang);
  applyDataI18n();
  renderAppNav();
  wireAuthForms();
  wireLanguageSelectors();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initApp().catch(console.error));
} else {
  initApp().catch(console.error);
}
