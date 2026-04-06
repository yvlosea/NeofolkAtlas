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
  try {
    const res = await fetch(`./translations/${lang}.json`);
    if (!res.ok) throw new Error();
    dictionary = await res.json();
  } catch (err) {
    console.warn(`Could not load ${lang} translations, falling back to en.`);
    const fallback = await fetch(`./translations/en.json`);
    dictionary = await fallback.json();
  }
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

/** Currently authenticated user, set by initApp after session check. */
let currentUser = null;

function renderAppNav() {
  const nav = document.getElementById('app-nav');
  if (!nav) return;

  const here = currentPageFile();
  const dashHref = currentUser ? getDashboardPath(currentUser) : 'seeker-dashboard.html';
  const isDashboardPage = here.endsWith('-dashboard.html');

  const role =
    currentUser?.user_metadata?.role ||
    currentUser?.app_metadata?.role ||
    'seeker';

  const sections = [
    {
      title: 'CORE',
      links: [
        { href: dashHref, label: 'Dashboard', isDash: true },
        { href: 'subjects.html', label: 'Domains' },
        { href: 'pathways.html', label: 'Pathways' },
        { href: 'guild.html', label: 'Guilds' },
        { href: 'portfolio.html', label: 'Portfolio' },
        { href: 'nodes.html', label: 'Nodes' }
      ]
    },
    {
      title: 'KNOWLEDGE',
      links: [
        { href: 'guide.html', label: 'Guide' },
        { href: 'vision.html', label: 'Vision' }
      ]
    },
    {
      title: 'ACCOUNT',
      links: [
        { href: 'profile.html', label: 'Profile' },
        { href: 'account-settings.html', label: 'Settings' }
      ]
    }
  ];

  // curator tools
  if (role === 'curator') {
    sections.push({
      title: 'CURATION',
      links: [
        { href: 'teaching-log.html', label: 'Teaching Log' },
        { href: 'attendance.html', label: 'Attendance' }
      ]
    });
  }

  nav.innerHTML = sections
    .map(section => `
      <div class="nav-section-group">
        <div class="nav-section-header">
          ${section.title}
        </div>
        ${section.links
          .map(link => {
            const active = link.isDash ? isDashboardPage : here === link.href;
            const cls = active ? 'sidebar-link is-active' : 'sidebar-link';
            return `<a class="${cls}" href="${link.href}">${link.label}</a>`;
          })
          .join('')}
      </div>
    `)
    .join('');

  // logout button
  if (currentUser) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'sidebar-link sidebar-logout';
    logoutBtn.type = 'button';
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = async () => {
      const supabase = getSupabaseClient();
      if (supabase) await supabase.auth.signOut();
      currentUser = null;
      location.href = 'index.html';
    };
    nav.appendChild(logoutBtn);
  }
}

/** On the home page, swap the auth card for a welcome-back card when logged in. */
function updateHomeForSession() {
  const authCard = document.querySelector('.auth-card');
  if (!authCard || currentPageFile() !== 'index.html') return;

  if (currentUser) {
    const dashHref = getDashboardPath(currentUser);
    const email = currentUser.email || '';
    authCard.innerHTML =
      '<div class="auth-panel-inner">' +
        '<p class="section-label">' + escapeHtml(t('dashboard.kicker')) + '</p>' +
        '<h2 style="margin:8px 0 4px;">' + escapeHtml(t('home.loginLabel')) + '</h2>' +
        '<p class="auth-intro">' + escapeHtml(t('dashboard.signedIn').replace('{email}', email)) + '</p>' +
        '<a class="btn btn-primary" style="width:100%;margin-top:8px;" href="' + escapeHtml(dashHref) + '">' +
          escapeHtml(t('nav.dashboard')) +
        '</a>' +
        '<a class="btn" style="width:100%;margin-top:8px;" href="subjects.html">' +
          escapeHtml(t('dashboard.browseTopics')) +
        '</a>' +
      '</div>';
  }
}

function wireMobileNav() {
  // Skip if hamburger already exists (e.g., index.html has its own)
  if (document.getElementById('hamburgerBtn')) return;

  const sidebar = document.querySelector('.neo-sidebar.sidebar');
  if (!sidebar) return;

  const main = document.querySelector('.neo-main');
  if (!main) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';
  main.parentNode.insertBefore(overlay, main);

  // Create mobile topbar with language selector
  const topbar = document.createElement('header');
  topbar.className = 'mobile-topbar';
  topbar.innerHTML =
    '<button class="hamburger" id="hamburgerBtn" aria-label="Open menu">' +
      '<span></span><span></span><span></span>' +
    '</button>' +
    '<span class="mobile-brand">Neofolk Atlas</span>' +
    '<div class="mobile-lang-wrap">' +
      '<select class="lang-select" aria-label="Select language">' +
        '<option value="en">EN</option>' +
        '<option value="hi">\u0939\u093F</option>' +
        '<option value="ur">UR</option>' +
      '</select>' +
    '</div>';
  main.insertBefore(topbar, main.firstChild);

  // Sync the new selector with current language
  const currentLang = localStorage.getItem(LANG_STORAGE) || 'en';
  const mobileSel = topbar.querySelector('.lang-select');
  if (mobileSel) mobileSel.value = currentLang;

  const hamburger = document.getElementById('hamburgerBtn');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
  }

  hamburger.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
  );
  overlay.addEventListener('click', closeSidebar);
}

function renderSidebarLangPicker() {
  const container = document.querySelector('.sidebar-content');
  if (!container || container.querySelector('.lang-select')) return;

  const currentLang = localStorage.getItem(LANG_STORAGE) || 'en';
  container.innerHTML =
    '<div class="language-row">' +
      '<span class="sidebar-lang-label">' + escapeHtml(t('toolbar.language')) + '</span>' +
      '<select class="lang-select" aria-label="Select language">' +
        '<option value="en">English</option>' +
        '<option value="hi">\u0939\u093F\u0928\u094D\u0926\u0940</option>' +
        '<option value="ur">\u0627\u0631\u062F\u0648</option>' +
      '</select>' +
    '</div>';

  const sel = container.querySelector('.lang-select');
  if (sel) sel.value = currentLang;
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
      const role = String(document.getElementById('signup-role')?.value ?? 'seeker').trim();
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
          data: { role },
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

  // Forgot password button
  const forgotBtn = document.getElementById('forgot-password-button');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', async () => {
      const loginEmail = document.getElementById('login-email');
      const email = String(loginEmail?.value ?? '').trim();
      const msg = document.getElementById('login-message');

      if (!email) {
        if (msg) msg.textContent = t('messages.enterEmailForReset');
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        if (msg) msg.textContent = t('messages.passwordResetSent');
        return;
      }

      const redirectTo = new URL('./reset-password.html', location.href).href;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (msg) {
        msg.textContent = error
          ? (error.message || t('messages.authFailed'))
          : t('messages.passwordResetSent');
      }
    });
  }

  // Reset password form
  const resetForm = document.getElementById('reset-password-form');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPw = String(document.getElementById('new-password')?.value ?? '').trim();
      const confirmPw = String(document.getElementById('confirm-password')?.value ?? '').trim();
      const msg = document.getElementById('reset-message');

      if (!newPw || !confirmPw) {
        if (msg) msg.textContent = t('messages.missingFields');
        return;
      }
      if (newPw !== confirmPw) {
        if (msg) msg.textContent = 'Passwords do not match.';
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        if (msg) msg.textContent = t('messages.authFailed');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPw });

      if (error) {
        if (msg) msg.textContent = error.message || t('messages.authFailed');
        return;
      }
      if (msg) msg.textContent = 'Password updated successfully.';
      setTimeout(() => window.location.assign('index.html#login-form'), 1500);
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
      renderSidebarLangPicker();
      renderPageContent();
      updateHomeForSession();
    });
  });
}

function renderPageContent() {
  const page = currentPageFile();

  // Dictionary page
  const dictRoot = document.getElementById('dictionary-root');
  if (dictRoot && page === 'dictionary.html') {
    const termKeys = Object.keys(dictionary.terms || {});
    const cards = termKeys.map((key) => {
      const term = dictionary.terms[key];
      return (
        '<div class="card dictionary-entry" data-term="' + escapeHtml(key) + '">' +
          '<h3>' + escapeHtml(term.label || key) + '</h3>' +
          '<p><strong>' + escapeHtml(t('dictionary.simpleMeaning')) + '</strong> ' + escapeHtml(term.simple || '') + '</p>' +
          '<p><strong>' + escapeHtml(t('dictionary.expandedMeaning')) + '</strong> ' + escapeHtml(term.expanded || '') + '</p>' +
          '<p class="dictionary-example"><em>' + escapeHtml(t('dictionary.exampleUse')) + ':</em> ' + escapeHtml(term.example || '') + '</p>' +
        '</div>'
      );
    }).join('');

    dictRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('dictionary.kicker')) + '</p>' +
          '<h1>' + escapeHtml(t('dictionary.title')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('dictionary.subtitle')) + '</p>' +
        '</div></div>' +
        '<div class="filters">' +
          '<input id="dict-search" type="text" placeholder="' + escapeHtml(t('dictionary.searchPlaceholder')) + '" />' +
        '</div>' +
        '<div class="record-list" id="dict-list">' + cards + '</div>' +
      '</div>';

    const searchInput = document.getElementById('dict-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        document.querySelectorAll('.dictionary-entry').forEach((el) => {
          const text = el.textContent.toLowerCase();
          el.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }
  }

  // Dashboard pages (seeker, curator, arbiter)
  const dashRoot = document.getElementById('dashboard-root');
  if (dashRoot && dashRoot.innerHTML.trim() === '') {
    const supabase = getSupabaseClient();
    const roleName = page.replace('-dashboard.html', '');
    const roleLabel = roleName.charAt(0).toUpperCase() + roleName.slice(1);

    dashRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('dashboard.kicker')) + '</p>' +
          '<h1>' + escapeHtml(t('dashboard.title')) + '</h1>' +
          '<p id="dash-signed-in" class="dashboard-meta"></p>' +
          '<p class="lede">' + escapeHtml(t('dashboard.subtitle')) + '</p>' +
        '</div></div>' +
        '<div class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;">' +
          '<div class="stat-card"><p class="section-label">' + escapeHtml(t('dashboard.courses')) + '</p><strong id="stat-modules">0</strong><p>' + escapeHtml(t('dashboard.coursesBody')) + '</p></div>' +
          '<div class="stat-card"><p class="section-label">' + escapeHtml(t('dashboard.notes')) + '</p><strong id="stat-notes">0</strong><p>' + escapeHtml(t('dashboard.notesBody')) + '</p></div>' +
          '<div class="stat-card"><p class="section-label">' + escapeHtml(t('dashboard.progressTitle')) + '</p><strong id="stat-score">0</strong><p>' + escapeHtml(t('dashboard.progressKicker')) + '</p></div>' +
          '<div class="stat-card"><p class="section-label">' + escapeHtml(t('dashboard.groups')) + '</p><strong id="stat-groups">0</strong><p>' + escapeHtml(t('dashboard.groupsBody')) + '</p></div>' +
        '</div>' +
        '<div class="card">' +
          '<p class="section-label">' + escapeHtml(t('dashboard.nextStepKicker')) + '</p>' +
          '<h2>' + escapeHtml(t('dashboard.pickCourseTitle')) + '</h2>' +
          '<p>' + escapeHtml(t('dashboard.pickCourseBody')) + '</p>' +
          '<div class="inline-actions flow-top-32">' +
            '<a class="btn btn-primary" href="subjects.html">' + escapeHtml(t('dashboard.browseTopics')) + '</a>' +
            '<a class="btn" href="discovery.html">' + escapeHtml(t('nav.explore')) + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Show signed-in email if we have a session
    if (supabase) {
      supabase.auth.getUser().then(async ({ data }) => {
        const el = document.getElementById('dash-signed-in');
        if (!data?.user) return;
        
        if (el) el.textContent = t('dashboard.signedIn').replace('{email}', data.user.email);

        // 1. Fetch Completed Modules (50 pts each)
        const { count: modCount } = await supabase.from('enrolled_modules').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id).eq('status', 'completed');
        
        // 2. Fetch Notes Written (10 pts each)
        const { count: noteCount } = await supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id);
        
        // 3. Calculate Score
        const neoScore = (modCount || 0) * 50 + (noteCount || 0) * 10;

        // Update UI
        if (document.getElementById('stat-modules')) document.getElementById('stat-modules').textContent = modCount || 0;
        if (document.getElementById('stat-notes')) document.getElementById('stat-notes').textContent = noteCount || 0;
        if (document.getElementById('stat-score')) document.getElementById('stat-score').textContent = neoScore;

        // Persist to neo_scores table for ranking/history
        await supabase.from('neo_scores').upsert({ 
          user_id: data.user.id, 
          score: neoScore,
          updated_at: new Date().toISOString()
        });
      });
    }
  }

  // Operator dashboard
  const opRoot = document.getElementById('operator-root');
  if (opRoot && opRoot.innerHTML.trim() === '') {
    opRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">Operator</p>' +
          '<h1>Operator Console</h1>' +
          '<p class="lede">Platform administration and oversight tools.</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>Operator tools connect to the Supabase admin layer. This console will populate with data once the backend schema is active.</p>' +
        '</div>' +
      '</div>';
  }

  // Help page
  const helpRoot = document.getElementById('help-root');
  if (helpRoot && helpRoot.innerHTML.trim() === '') {
    helpRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('nav.help')) + '</p>' +
          '<h1>' + escapeHtml(t('onboarding.title')) + '</h1>' +
        '</div></div>' +
        '<div class="card"><h2>' + escapeHtml(t('onboarding.step1Title')) + '</h2><p>' + escapeHtml(t('onboarding.step1Note')) + '</p>' +
          '<ul style="margin:12px 0 0 18px;color:var(--text-secondary);display:grid;gap:8px;">' +
            '<li>' + escapeHtml(t('onboarding.step1Card1')) + '</li>' +
            '<li>' + escapeHtml(t('onboarding.step1Card2')) + '</li>' +
            '<li>' + escapeHtml(t('onboarding.step1Card3')) + '</li>' +
          '</ul></div>' +
        '<div class="card"><h2>' + escapeHtml(t('onboarding.step2Title')) + '</h2><p>' + escapeHtml(t('onboarding.step2Note')) + '</p>' +
          '<ul style="margin:12px 0 0 18px;color:var(--text-secondary);display:grid;gap:8px;">' +
            '<li><strong>' + escapeHtml(t('onboarding.learn')) + '</strong> — ' + escapeHtml(t('onboarding.step2Card1')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.notes')) + '</strong> — ' + escapeHtml(t('onboarding.step2Card2')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.projects')) + '</strong> — ' + escapeHtml(t('onboarding.step2Card3')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.progress')) + '</strong> — ' + escapeHtml(t('onboarding.step2Card4')) + '</li>' +
          '</ul></div>' +
        '<div class="card"><h2>' + escapeHtml(t('onboarding.step3Title')) + '</h2><p>' + escapeHtml(t('onboarding.step3Note')) + '</p>' +
          '<ul style="margin:12px 0 0 18px;color:var(--text-secondary);display:grid;gap:8px;">' +
            '<li><strong>' + escapeHtml(t('onboarding.subjects')) + '</strong> — ' + escapeHtml(t('onboarding.step3Card1')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.groups')) + '</strong> — ' + escapeHtml(t('onboarding.step3Card2')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.dictionary')) + '</strong> — ' + escapeHtml(t('onboarding.step3Card3')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.help')) + '</strong> — ' + escapeHtml(t('onboarding.step3Card4')) + '</li>' +
          '</ul></div>' +
        '<div class="inline-actions">' +
          '<a class="btn btn-primary" href="subjects.html">' + escapeHtml(t('nav.learn')) + '</a>' +
          '<a class="btn" href="dictionary.html">' + escapeHtml(t('nav.dictionary')) + '</a>' +
          '<a class="btn" href="vision.html">' + escapeHtml(t('nav.vision')) + '</a>' +
        '</div>' +
      '</div>';
  }

  // Subjects page
  const subjectsRoot = document.getElementById('subjects-root');
  if (subjectsRoot && subjectsRoot.innerHTML.trim() === '') {
    const guilds = ['Lingosophy','Arthmetics','Cosmology','Biosphere','Chronicles','Civitas','Tokenomics','Artifex','Praxis','Bioepisteme'];
    const guildCards = guilds.map((name) =>
      '<a href="domain.html" class="record-card" style="text-decoration:none;">' +
        '<h3>' + escapeHtml(name) + '</h3>' +
        '<p style="color:var(--text-secondary);font-size:0.9rem;">' + escapeHtml(t('home.termCoursesBody')) + '</p>' +
      '</a>'
    ).join('');

    subjectsRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('nav.learn')) + '</p>' +
          '<h1>' + escapeHtml(t('home.stepsTitle')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('home.step1Body')) + '</p>' +
        '</div></div>' +
        '<div class="record-list" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));">' + guildCards + '</div>' +
      '</div>';
  }

  // Pathways page
  const pathwaysRoot = document.getElementById('pathways-root');
  if (pathwaysRoot && pathwaysRoot.innerHTML.trim() === '') {
    pathwaysRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Pathways</p>
          <h1>Learning Pathways</h1>
        </div>
        <div class="empty-state">
          <p>No pathways yet.</p>
        </div>
      </div>
    `;
  }

  // Domain page
  const domainRoot = document.getElementById('domain-root');
  if (domainRoot && domainRoot.innerHTML.trim() === '') {
    const showCreate = currentUser?.user_metadata?.role === "curator";
    domainRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Domain</p>
          <h1>Modules</h1>
          ${showCreate ? `
            <button id="create-module" class="btn btn-primary">
              + Module
            </button>
          ` : ""}
        </div>
        <div class="empty-state">
          <p>No modules yet.</p>
        </div>
      </div>
    `;
    document.getElementById('create-module')?.addEventListener('click', () => {
      location.href = "module-editor.html";
    });
  }

  // Guild page
  const guildRoot = document.getElementById('guild-root');
  if (guildRoot && guildRoot.innerHTML.trim() === '') {
    guildRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('nav.groups')) + '</p>' +
          '<h1>' + escapeHtml(t('home.termGroups')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('home.termGroupsBody')) + '</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>' + escapeHtml(t('dashboard.groupsAdvancedEmpty')) + '</p>' +
        '</div>' +
      '</div>';
  }

  // Discovery page
  const discoveryRoot = document.getElementById('discovery-root');
  if (discoveryRoot && discoveryRoot.innerHTML.trim() === '') {
    discoveryRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('nav.explore')) + '</p>' +
          '<h1>' + escapeHtml(t('terms.discovery.label')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('terms.discovery.expanded')) + '</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>' + escapeHtml(t('dashboard.discoveryAdvancedBody')) + '</p>' +
        '</div>' +
      '</div>';
  }

  // Research page
  const researchRoot = document.getElementById('research-root');
  if (researchRoot && researchRoot.innerHTML.trim() === '') {
    researchRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('search.research')) + '</p>' +
          '<h1>' + escapeHtml(t('search.research')) + '</h1>' +
          '<p class="lede">Research projects and academic documentation from across the network.</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>Research posts will appear here as curators and seekers publish their work.</p>' +
        '</div>' +
      '</div>';
  }

  // Profile page
  const profileRoot = document.getElementById('profile-root');
  if (profileRoot && profileRoot.innerHTML.trim() === '') {
    const supabase = getSupabaseClient();
    profileRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">Profile</p>' +
          '<h1>Your Profile</h1>' +
          '<p id="profile-email" class="dashboard-meta"></p>' +
        '</div></div>' +
        '<div class="card">' +
          '<p>Your learning record, projects, and contributions are tracked here as your work grows.</p>' +
          '<input class="neo-input" placeholder="Display name">' +
          '<textarea placeholder="Bio"></textarea>' +
          '<button class="btn btn-primary">Save profile</button>' +
        '</div>' +
      '</div>';

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        const el = document.getElementById('profile-email');
        if (el && data?.user?.email) {
          el.textContent = t('dashboard.signedIn').replace('{email}', data.user.email);
        }
      });
    }
  }

  // Module page
  const moduleRoot = document.getElementById('module-root');
  if (moduleRoot && moduleRoot.innerHTML.trim() === '') {
    moduleRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('terms.module.label')) + '</p>' +
          '<h1>' + escapeHtml(t('terms.module.label')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('terms.module.expanded')) + '</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>Select a module from the Subjects page to view its content here.</p>' +
          '<a class="btn" href="subjects.html" style="margin-top:12px;">' + escapeHtml(t('dashboard.browseTopics')) + '</a>' +
        '</div>' +
      '</div>';
  }

  // Guide page
  const guideRoot = document.getElementById('guide-root');
  if (guideRoot && guideRoot.innerHTML.trim() === '') {
    guideRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Guide</p>
          <h1>NHBE Learning Guide</h1>
          <p class="lede">
          The Guide explains how Domains, Pathways, Guilds, Portfolio, and Nodes work together.
          </p>
        </div>
        <div class="card">
          <h3>Domains</h3>
          <p>Fundamental perspectives of knowledge such as Lingosophy, Arthmetics, Cosmology, Biosphere.</p>
          <h3>Pathways</h3>
          <p>Short learning experiences connecting real-world skills to Domains.</p>
          <h3>Guilds</h3>
          <p>Collaborative research groups formed by learners.</p>
          <h3>Portfolio</h3>
          <p>Documented record of learning evidence.</p>
          <h3>Nodes</h3>
          <p>Physical locations where learning occurs.</p>
        </div>
      </div>
    `;
  }

  // Portfolio page
  const portfolioRoot = document.getElementById('portfolio-root');
  if (portfolioRoot && portfolioRoot.innerHTML.trim() === '') {
    portfolioRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Portfolio</p>
          <h1>Learning Portfolio</h1>
        </div>
        <div class="empty-state">
          <p>Your documented learning evidence will appear here.</p>
        </div>
      </div>
    `;
  }

  // Teaching Log page
  const teachingRoot = document.getElementById('teaching-log-root');
  if (teachingRoot && teachingRoot.innerHTML.trim() === '') {
    teachingRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Curation</p>
          <h1>Teaching Log</h1>
        </div>
        <div class="empty-state">
          <p>Teaching records will appear here.</p>
        </div>
      </div>
    `;
  }

  // Attendance page
  const attendanceRoot = document.getElementById('attendance-root');
  if (attendanceRoot && attendanceRoot.innerHTML.trim() === '') {
    attendanceRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Curation</p>
          <h1>Attendance</h1>
        </div>
        <div class="empty-state">
          <p>Attendance tracking will appear here.</p>
        </div>
      </div>
    `;
  }

  // Module Editor page
  const editorRoot = document.getElementById('module-editor-root');
  if (editorRoot && editorRoot.innerHTML.trim() === '') {
    editorRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Curation</p>
          <h1>Create Module</h1>
        </div>
        <div class="card">
          <input
            class="neo-input"
            placeholder="Module title"
          >
          <textarea
            placeholder="Description"
          ></textarea>
          <button class="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    `;
  }

  // Studios page
  const studiosRoot = document.getElementById('studios-root');
  if (studiosRoot && studiosRoot.innerHTML.trim() === '') {
    studiosRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('search.studios')) + '</p>' +
          '<h1>' + escapeHtml(t('search.studios')) + '</h1>' +
          '<p class="lede">Capability environments unlocked through demonstrated contribution and serious intellectual production.</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>Studios become available as your learning record deepens.</p>' +
        '</div>' +
      '</div>';
  }

  // Account Settings Page
  const accountRoot = document.getElementById('account-settings-root');
  if (accountRoot && accountRoot.innerHTML.trim() === '') {
    accountRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Account</p>
          <h1>Settings</h1>
        </div>
        <div class="card">
          <p>Account settings appear here.</p>
        </div>
      </div>
    `;
  }

  
  // Role Switcher Logic (Usually in Settings or Header)
  const roleSelect = document.getElementById('role-context-switcher');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      localStorage.setItem('neofolk.activeRole', e.target.value);
      location.reload();
    });
  }
  // Nodes / Map Page
  const nodesRoot = document.getElementById('nodes-root');
  if (nodesRoot && page === 'nodes.html' && nodesRoot.innerHTML.trim() === '') {
    nodesRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">${escapeHtml(t('nodes.kicker') || 'Nodes')}</p>
          <h1>${escapeHtml(t('nodes.title') || 'Learning Nodes')}</h1>
        </div>
        <div id="map" style="height:500px;border-radius:8px;"></div>
      </div>
    `;
    // initialize Leaflet ONLY after DOM exists
    if (window.L) {
      const map = L.map('map').setView([22.9734, 78.6569], 5);
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors'
        }
      ).addTo(map);
      // Add placeholder markers
      L.marker([28.6139, 77.2090]).addTo(map).bindPopup('Delhi Node');
      L.marker([19.0760, 72.8777]).addTo(map).bindPopup('Mumbai Node');
    }
  }
}


async function initApp() {

  // Check session before rendering nav so logout/dashboard are correct
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      currentUser = data?.user || null;
    } catch (_) {
      currentUser = null;
    }
  }

  const stored = localStorage.getItem(LANG_STORAGE);
  const lang = SUPPORTED_LANGS.includes(stored) ? stored : 'en';
  await loadDictionary(lang);
  applyDocumentLanguage(lang);
  applyDataI18n();

  renderAppNav();
  wireMobileNav();
  renderSidebarLangPicker();
  syncLanguageSelects(lang);
  wireAuthForms();
  wireLanguageSelectors();
  renderPageContent();
  updateHomeForSession();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initApp().catch(console.error));
} else {
  initApp().catch(console.error);
}
