/**
 * Neofolk Atlas — DOM contracts: #app-nav, #login-form, translation JSON, page roots.
 * Replace wireAuthForms() stubs with your Supabase (or other) client when wiring production auth.
 */

const LANG_STORAGE = 'neofolk.preferredLanguage';
const SUPPORTED_LANGS = ['en', 'hi', 'ur'];

let dictionary = {};

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
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '');
      const msg = document.getElementById('login-message');
      if (!email || !password) {
        if (msg) msg.textContent = t('messages.missingFields');
        return;
      }
      if (msg) msg.textContent = '';
      // TODO: replace with Supabase signInWithPassword; keep preventDefault above.
      window.location.assign('seeker-dashboard.html');
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(signupForm);
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '');
      const msg = document.getElementById('signup-message');
      if (!email || !password) {
        if (msg) msg.textContent = t('messages.missingFields');
        return;
      }
      if (msg) msg.textContent = t('messages.checkEmail');
      // TODO: replace with Supabase signUp.
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
