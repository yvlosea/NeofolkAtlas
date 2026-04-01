import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://mopxfemfkrnthaadjxoi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcHhmZW1ma3JudGhhYWRqeG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjY1MjYsImV4cCI6MjA5MDMwMjUyNn0.iltXnWOjW3In-R0YHGNoatsKvAIm2AlBadS8Pwu-cbY"
);

const guildCatalog = [
  { slug: "lingosophy", name: "Lingosophy", description: "Language, meaning, identity, and expressive interpretation." },
  { slug: "arthmetics", name: "Arthmetics", description: "Mathematics, logic, structure, and quantitative thought." },
  { slug: "cosmology", name: "Cosmology", description: "Celestial inquiry, scale, physics, and the architecture of reality." },
  { slug: "biosphere", name: "Biosphere", description: "Life systems, ecology, health, and interdependence." },
  { slug: "chronicles", name: "Chronicles", description: "History, archives, memory, and narrative continuity." },
  { slug: "civitas", name: "Civitas", description: "Society, ethics, institutions, and civic design." },
  { slug: "tokenomics", name: "Tokenomics", description: "Value systems, exchange, financial learning, and trust." },
  { slug: "artifex", name: "Artifex", description: "Creative production, fabrication, design, and craft." },
  { slug: "praxis", name: "Praxis", description: "Embodied discipline, practice, movement, and lived method." },
  { slug: "bioepisteme", name: "Bioepisteme", description: "Knowledge systems, life philosophy, and interdisciplinary reasoning." }
];

const reflectionDeck = [
  { type: "quote", label: "Lingosophy", text: "Education is the manifestation of perfection already within.", attribution: "Swami Vivekananda" },
  { type: "quote", label: "Chronicles", text: "Where the mind is without fear and the head is held high.", attribution: "Rabindranath Tagore" },
  { type: "quote", label: "Civitas", text: "Cultivation of mind should be the ultimate aim of human existence.", attribution: "B. R. Ambedkar" },
  { type: "quote", label: "Chronicles", text: "I shall not surrender my Jhansi.", attribution: "Rani Lakshmibai" },
  { type: "quote", label: "Praxis", text: "It is our duty to pay for our liberty with our own blood.", attribution: "Subhas Chandra Bose" },
  { type: "quote", label: "Civitas", text: "The shots that hit me are the last nails to the coffin of British rule in India.", attribution: "Lala Lajpat Rai" },
  { type: "quote", label: "Cosmology", text: "Somewhere, something incredible is waiting to be known.", attribution: "Carl Sagan" },
  { type: "quote", label: "Artifex", text: "Creativity is intelligence having fun.", attribution: "Albert Einstein" },
  { type: "quote", label: "Lingosophy", text: "Words are the clothing of ideas.", attribution: "Samuel Johnson" },
  { type: "quote", label: "Biosphere", text: "Look deep into nature, then you will understand everything better.", attribution: "Albert Einstein" },
  {
    type: "wisdom-set",
    label: "Parallel Wisdom",
    title: "Knowledge as purification",
    note: "When a wisdom text appears in Neofolk, related lines from the Quran, the Bible, and the Gita are shown together.",
    entries: [
      { source: "Bhagavad Gita", text: "There is nothing as purifying as knowledge." },
      { source: "Quran", text: "Are those who know equal to those who do not know?" },
      { source: "Bible", text: "You shall know the truth, and the truth shall set you free." }
    ]
  },
  {
    type: "wisdom-set",
    label: "Parallel Wisdom",
    title: "Striving, duty, and action",
    note: "Similar meaning is presented side by side so the site emphasizes resonance across traditions.",
    entries: [
      { source: "Quran", text: "Man will have nothing but what he strives for." },
      { source: "Bhagavad Gita", text: "You have the right to perform your duty." },
      { source: "Bible", text: "Faith without works is dead." }
    ]
  }
];

const uiKeys = {
  reflectionIndex: "neofolk.reflectionIndex",
  preferredLanguage: "neofolk.preferredLanguage",
  userLocation: "neofolk.userLocation"
};

const appVersion = "Alpha 11.4";
const operatorRole = "operator";
const defaultUiLanguage = "en";

const supportedLanguages = [
  {
    code: "en",
    label: "English",
    shortLabel: "English",
    serif: '"Cormorant Garamond", Georgia, serif',
    sans: '"Manrope", Arial, sans-serif'
  },
  {
    code: "hi",
    label: "हिन्दी",
    shortLabel: "Hindi",
    serif: '"Noto Serif Devanagari", Georgia, serif',
    sans: '"Noto Sans Devanagari", system-ui, sans-serif'
  }
];
let currentLanguage = defaultUiLanguage;
let currentTranslations = {};
const searchResultTitleKeys = {
  subjects: "search.subjects",
  guilds: "search.guilds",
  research: "search.research",
  portfolio: "search.portfolio",
  studios: "search.studios",
  modules: "search.modules"
};

const missingTablePattern = /schema cache|Could not find the table|relationship between/i;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getCurrentPage() {
  return document.body.dataset.page || "";
}

function ensureSiteBranding() {
  const iconHref = "neofolk-logo.jpg";
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.href = iconHref;

  let appleTouch = document.querySelector('link[rel="apple-touch-icon"]');
  if (!appleTouch) {
    appleTouch = document.createElement("link");
    appleTouch.rel = "apple-touch-icon";
    document.head.appendChild(appleTouch);
  }
  appleTouch.href = iconHref;
}

function ensureLanguageFonts() {
  if (document.getElementById("neofolk-language-fonts")) return;
  const link = document.createElement("link");
  link.id = "neofolk-language-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Serif+Devanagari:wght@500;600&display=swap";
  document.head.appendChild(link);
}

function getPreferredLanguage() {
  return localStorage.getItem(uiKeys.preferredLanguage) || defaultUiLanguage;
}

function getLanguageMeta(code) {
  return supportedLanguages.find((item) => item.code === code) || supportedLanguages[0];
}

async function loadTranslations(code) {
  const chosen = getLanguageMeta(code);
  const fallback = await fetch("translations/en.json").then((response) => response.json());
  const selected =
    chosen.code === "en"
      ? fallback
      : await fetch(`translations/${chosen.code}.json`)
          .then((response) => (response.ok ? response.json() : fallback))
          .catch(() => fallback);

  currentLanguage = chosen.code;
  currentTranslations = { ...fallback, ...selected };
  return chosen;
}

function readTranslationValue(key) {
  return key.split(".").reduce((value, part) => (value && typeof value === "object" ? value[part] : undefined), currentTranslations);
}

function t(key, replacements = {}) {
  const value = readTranslationValue(key);
  const template = typeof value === "string" ? value : key;
  return Object.entries(replacements).reduce(
    (text, [replacementKey, replacementValue]) => text.replaceAll(`{${replacementKey}}`, String(replacementValue)),
    template
  );
}

async function applyLanguagePreference(code, options = {}) {
  const selected = getLanguageMeta(code);
  await loadTranslations(selected.code);
  localStorage.setItem(uiKeys.preferredLanguage, selected.code);
  document.documentElement.lang = selected.code;
  document.documentElement.style.setProperty("--serif", selected.serif);
  document.documentElement.style.setProperty("--sans", selected.sans);
  document.body?.setAttribute("data-ui-lang", selected.code);
  document.documentElement.setAttribute("translate", "no");

  if (!options.silent) {
    showUtilityNotice(
      t("language.readyTitle", { language: selected.shortLabel }),
      t("language.readyBody", { language: selected.label })
    );
  }
}

function getSavedUserLocation() {
  try {
    return JSON.parse(localStorage.getItem(uiKeys.userLocation) || "null");
  } catch {
    return null;
  }
}

function saveUserLocation(coords) {
  localStorage.setItem(
    uiKeys.userLocation,
    JSON.stringify({
      lat: coords.latitude,
      lng: coords.longitude,
      savedAt: new Date().toISOString()
    })
  );
}

function parseCoordinates(value) {
  const match = String(value || "").match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  const lat = Number.parseFloat(match[1]);
  const lng = Number.parseFloat(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function distanceBetweenKm(pointA, pointB) {
  if (!pointA || !pointB) return null;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(pointB.lat - pointA.lat);
  const dLng = toRad(pointB.lng - pointA.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pointA.lat)) * Math.cos(toRad(pointB.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function formatDistance(distanceKm) {
  if (distanceKm == null) return "Distance unavailable";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m away`;
  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km away`;
}

function googleMapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleMapsEmbedUrl(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function findLanguageFromInput(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return getLanguageMeta(getPreferredLanguage());
  return (
    supportedLanguages.find(
      (language) =>
        language.code.toLowerCase() === normalized ||
        language.label.toLowerCase() === normalized ||
        language.shortLabel.toLowerCase() === normalized
    ) || null
  );
}

function showUtilityNotice(title, body) {
  const stack = document.querySelector(".page-stack");
  if (!stack) return;

  let panel = document.getElementById("utility-notice-panel");
  if (!panel) {
    panel = document.createElement("section");
    panel.id = "utility-notice-panel";
    panel.className = "card utility-notice-panel";
    stack.prepend(panel);
  }

  panel.innerHTML = `
    <div class="card-header-row">
      <div>
        <p class="section-label">Quick Help</p>
        <h2>${escapeHtml(title)}</h2>
      </div>
      <button class="btn subtle-button" id="dismiss-utility-panel" type="button">Close</button>
    </div>
    <p>${escapeHtml(body)}</p>
  `;

  document.getElementById("dismiss-utility-panel")?.addEventListener("click", () => {
    panel.remove();
  });
}

function getDashboardPath(role) {
  if (role === "seeker") return "seeker-dashboard.html";
  if (role === "curator") return "curator-dashboard.html";
  if (role === "arbiter") return "arbiter-dashboard.html";
  if (role === operatorRole) return "operator-dashboard.html";
  return "index.html";
}

function setMessage(elementId, message, type) {
  const node = document.getElementById(elementId);
  if (!node) return;
  node.textContent = message;
  node.className = `status-text ${type ? `status-${type}` : ""}`.trim();
}

function textButton(label, className, attrs) {
  return `<button class="${className}" type="button" ${attrs}>${escapeHtml(label)}</button>`;
}

const dictionaryTerms = ["seeker", "curator", "arbiter", "guild", "module", "discovery", "praxis", "lingosophy"];

function termTooltip(term) {
  return `
    <span class="term-badge" tabindex="0" data-term="${escapeHtml(term)}">
      ${escapeHtml(t(`terms.${term}.label`))}
      <span class="term-tooltip" role="tooltip">
        <strong>${escapeHtml(t(`terms.${term}.label`))}</strong>
        <span>${escapeHtml(t(`terms.${term}.simple`))}</span>
      </span>
    </span>
  `;
}

function statusPill(status) {
  return `<span class="pill status-pill status-${escapeHtml(status)}">${escapeHtml(status)}</span>`;
}

function emptyCard(title, description) {
  return `
    <article class="empty-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </article>
  `;
}

function isMissingRelationError(error) {
  return missingTablePattern.test(String(error?.message || ""));
}

function optionalTableNotice(name) {
  return `Optional table unavailable: ${name}`;
}

function getGuildBySlug(slug) {
  return guildCatalog.find((guild) => guild.slug === slug) || guildCatalog[0];
}

function getNextReflectionEntry() {
  const currentIndex = Number.parseInt(sessionStorage.getItem(uiKeys.reflectionIndex) || "0", 10) || 0;
  const entry = reflectionDeck[currentIndex % reflectionDeck.length];
  sessionStorage.setItem(uiKeys.reflectionIndex, String((currentIndex + 1) % reflectionDeck.length));
  return entry;
}

function renderReflectionOverlay() {
  if (getCurrentPage() !== "home") return;
  if (sessionStorage.getItem("neofolk.overlaySeen") === "1") return;
  const entry = getNextReflectionEntry();
  const overlay = document.createElement("div");
  overlay.className = "intro-overlay";

  const content =
    entry.type === "wisdom-set"
      ? `
        <p class="section-label">${escapeHtml(entry.label)}</p>
        <h2>${escapeHtml(entry.title)}</h2>
        <div class="wisdom-grid">
          ${entry.entries
            .map(
              (item) => `
                <article class="wisdom-card">
                  <h3>${escapeHtml(item.source)}</h3>
                  <p>${escapeHtml(item.text)}</p>
                </article>
              `
            )
            .join("")}
        </div>
        <p class="intro-note">${escapeHtml(entry.note)}</p>
      `
      : `
        <p class="section-label">${escapeHtml(entry.label)}</p>
        <blockquote class="intro-quote">${escapeHtml(entry.text)}</blockquote>
        <p class="intro-attribution">${escapeHtml(entry.attribution)}</p>
      `;

  overlay.innerHTML = `
    <div class="intro-panel" role="dialog" aria-modal="true" aria-label="Neofolk opening reflection">
      <div class="intro-topline">
        <img class="intro-logo" src="neofolk-logo.jpg" alt="Neofolk humanitarian education board logo" />
        <div class="intro-wordmark">
          <p class="section-label">Neofolk Atlas</p>
          <strong>Learning as Identity</strong>
        </div>
      </div>
      <div class="intro-copy">
        ${content}
        <button class="btn btn-primary intro-dismiss" type="button">Enter the Atlas</button>
      </div>
    </div>
  `;

  const dismiss = () => {
    overlay.classList.add("is-hidden");
    sessionStorage.setItem("neofolk.overlaySeen", "1");
    window.setTimeout(() => overlay.remove(), 540);
  };

  overlay.querySelector(".intro-dismiss").addEventListener("click", dismiss);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) dismiss();
  });

  window.setTimeout(dismiss, 3400);
  document.body.appendChild(overlay);
}

function getResetRedirectUrl() {
  return new URL("reset-password.html", window.location.href).toString();
}

function normalizeProfile(profile, authUser) {
  if (!profile || !authUser) return null;
  return {
    ...profile,
    email: authUser.email || profile.email || "",
    emailConfirmed: Boolean(authUser.email_confirmed_at)
  };
}

function ensureRealUserMap(users) {
  return [...users];
}

function isOperator(user) {
  return user?.role === operatorRole;
}

function displayUserName(user) {
  if (!user) return "Unknown";
  if (isOperator(user)) return "Operator";
  return user.email || user.id;
}

function getUserInitials(user) {
  const base = displayUserName(user).replace(/@.*$/, "").trim();
  const parts = base.split(/[\s._-]+/).filter(Boolean);
  if (!parts.length) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function mapModule(module) {
  return {
    ...module,
    createdBy: module.created_by,
    denialReason: module.denial_reason || ""
  };
}

function mapPortfolio(entry) {
  return {
    ...entry,
    createdBy: entry.user_id,
    highlighted: Boolean(entry.highlighted),
    visibility: entry.visibility || "private",
    tags: Array.isArray(entry.tags) ? entry.tags : []
  };
}

function mapNiche(entry) {
  return {
    ...entry,
    createdBy: entry.user_id,
    topic: entry.interest
  };
}

function mapResearchPost(post) {
  return {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : []
  };
}

function enrichModulesWithLocations(modules, curatorCodes, userLocation) {
  const locationMap = new Map(
    curatorCodes
      .filter((row) => row.assigned_to && row.location)
      .map((row) => [row.assigned_to, row.location])
  );

  return modules.map((module) => {
    const locationText = module.location || locationMap.get(module.createdBy) || "";
    const coordinates = parseCoordinates(locationText);
    const distanceKm = userLocation && coordinates ? distanceBetweenKm(userLocation, coordinates) : null;
    return {
      ...module,
      locationText,
      distanceKm,
      mapsHref: locationText ? googleMapsSearchUrl(locationText) : ""
    };
  });
}

function authErrorMessage(error) {
  const message = error?.message || "";
  if (/already registered|already exists|duplicate/i.test(message)) return t("messages.emailExists");
  if (/email not confirmed/i.test(message)) return t("messages.unverifiedEmail");
  if (/invalid login credentials|invalid credentials/i.test(message)) return t("messages.incorrectPassword");
  return message || t("messages.authFailed");
}

async function getCurrentUserProfile() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  try {
    const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", authData.user.id).maybeSingle();
    if (profileError) {
      if (isMissingRelationError(profileError)) return normalizeProfile({ id: authData.user.id, role: authData.user.user_metadata?.role || "seeker" }, authData.user);
      return null;
    }
    return normalizeProfile(profile, authData.user);
  } catch (error) {
    if (isMissingRelationError(error)) return normalizeProfile({ id: authData.user.id, role: authData.user.user_metadata?.role || "seeker" }, authData.user);
    return null;
  }
}

async function requireRole(allowedRoles) {
  const user = await getCurrentUserProfile();
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  if (isOperator(user)) return user;
  if (!allowedRoles.includes(user.role)) {
    window.location.href = getDashboardPath(user.role);
    return null;
  }
  return user;
}

function renderNav(currentUser) {
  const nav = document.getElementById("app-nav");
  if (!nav) return;

  const dashboardHref = currentUser ? getDashboardPath(currentUser.role) : "index.html";

  nav.innerHTML = `
    <div class="site-nav-shell">
      <button id="nav-menu-toggle" class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav-panel">
        ${escapeHtml(t("nav.menu"))}
      </button>
      <div id="site-nav-panel" class="nav-panel">
        <div class="nav-cluster nav-primary-links">
          ${
            currentUser
              ? `
                <a class="nav-link" href="${dashboardHref}">${escapeHtml(t("nav.dashboard"))}</a>
                <a class="nav-link" href="subjects.html">${escapeHtml(t("nav.learn"))}</a>
                <a class="nav-link" href="${dashboardHref}#notes-area">${escapeHtml(t("nav.notes"))}</a>
                <a class="nav-link" href="${dashboardHref}#projects-area">${escapeHtml(t("nav.projects"))}</a>
                <a class="nav-link" href="guild.html">${escapeHtml(t("nav.groups"))}</a>
                <a class="nav-link" href="${dashboardHref}#progress-area">${escapeHtml(t("nav.progress"))}</a>
              `
              : `
                <a class="nav-link" href="index.html#start-learning">${escapeHtml(t("home.primaryStart"))}</a>
                <a class="nav-link" href="subjects.html">${escapeHtml(t("home.primaryBrowse"))}</a>
                <a class="nav-link" href="index.html#auth-area">${escapeHtml(t("home.primaryCreate"))}</a>
              `
          }
        </div>

        <div class="nav-cluster nav-utility-cluster">
          <label class="language-picker compact-language-picker">
            <span class="section-label">${escapeHtml(t("toolbar.language"))}</span>
            <select id="public-language-select" aria-label="${escapeHtml(t("toolbar.languageAria"))}">
              ${supportedLanguages.map((language) => `<option value="${language.code}" ${language.code === currentLanguage ? "selected" : ""}>${escapeHtml(language.label)}</option>`).join("")}
            </select>
          </label>
          ${
            currentUser
              ? `
                <a class="nav-link nav-link-secondary" href="dictionary.html">${escapeHtml(t("nav.dictionary"))}</a>
                <a class="nav-link nav-link-secondary" href="vision.html">${escapeHtml(t("nav.vision"))}</a>
                <a class="profile-chip" href="profile.html" aria-label="${escapeHtml(t("nav.settings"))}">
                  <span class="profile-chip-avatar">${escapeHtml(getUserInitials(currentUser))}</span>
                </a>
                <button id="logout-button" class="nav-button" type="button">${escapeHtml(t("nav.logout"))}</button>
              `
              : `
                <a class="nav-link nav-link-secondary" href="dictionary.html">${escapeHtml(t("nav.dictionary"))}</a>
                <a class="nav-link nav-link-secondary" href="vision.html">${escapeHtml(t("nav.vision"))}</a>
              `
          }
        </div>
      </div>
    </div>
  `;

  document.getElementById("logout-button")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });

  document.getElementById("public-language-select")?.addEventListener("change", async (event) => {
    await applyLanguagePreference(event.target.value, { silent: true });
    await init();
  });

  document.getElementById("nav-menu-toggle")?.addEventListener("click", (event) => {
    const shell = nav.querySelector(".site-nav-shell");
    const nextOpen = !shell?.classList.contains("is-open");
    shell?.classList.toggle("is-open", nextOpen);
    event.currentTarget.setAttribute("aria-expanded", String(nextOpen));
  });
}

function wireWorkspaceToolbar(currentUser) {
  document.getElementById("language-select")?.addEventListener("change", async (event) => {
    await applyLanguagePreference(event.target.value, { silent: true });
    await init();
  });

  document.getElementById("use-location-button")?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showUtilityNotice(t("messages.locationUnavailableTitle"), t("messages.locationUnavailableBody"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveUserLocation(position.coords);
        showUtilityNotice(
          t("messages.locationSavedTitle"),
          t("messages.locationSavedBody")
        );
      },
      (error) => {
        showUtilityNotice(t("messages.locationDeniedTitle"), error.message || t("messages.locationDeniedBody"));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  });

  document.getElementById("global-search-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("global-search-input")?.value.trim().toLowerCase();
    if (!query) return;

    const userLocation = getSavedUserLocation();

    const [subjects, guilds, researchPosts, portfolios, studios, modules, curatorCodes] = await Promise.all([
      fetchSubjects().catch(() => []),
      fetchGuildRecords().catch(() => []),
      fetchResearchPosts().catch(() => []),
      fetchPortfolioEntries().catch(() => []),
      fetchStudios().catch(() => []),
      fetchApprovedModules().catch(() => []),
      fetchCuratorCodes().catch(() => [])
    ]);

    const nearbyModules = enrichModulesWithLocations(modules, curatorCodes, userLocation)
      .filter((item) => `${item.title || ""} ${item.description || ""} ${item.guild || ""} ${item.locationText || ""}`.toLowerCase().includes(query))
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
        if (a.distanceKm != null) return -1;
        if (b.distanceKm != null) return 1;
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });

    const groups = [
      {
        title: t(searchResultTitleKeys.subjects),
        items: subjects.filter((item) => `${item.name || ""} ${item.description || ""}`.toLowerCase().includes(query)).map((item) => ({
          title: item.name,
          href: `subjects.html?id=${item.id}`,
          meta: item.category || t("search.subject")
        }))
      },
      {
        title: t(searchResultTitleKeys.guilds),
        items: guilds.filter((item) => `${item.title || item.name || ""} ${item.description || ""}`.toLowerCase().includes(query)).map((item) => ({
          title: item.title || item.name,
          href: item.id ? `guild.html?id=${item.id}` : "guild.html",
          meta: item.research_focus || t("search.guild")
        }))
      },
      {
        title: t(searchResultTitleKeys.research),
        items: researchPosts.filter((item) => `${item.title || ""} ${item.body || ""}`.toLowerCase().includes(query)).map((item) => ({
          title: item.title,
          href: "research.html",
          meta: item.tags?.join(", ") || t("search.researchPost")
        }))
      },
      {
        title: t(searchResultTitleKeys.portfolio),
        items: portfolios.filter((item) => `${item.title || ""} ${item.description || ""}`.toLowerCase().includes(query)).map((item) => ({
          title: item.title,
          href: "profile.html#portfolio",
          meta: item.visibility || t("search.portfolioEntry")
        }))
      },
      {
        title: t(searchResultTitleKeys.studios),
        items: studios.filter((item) => `${item.name || ""} ${item.description || ""}`.toLowerCase().includes(query)).map((item) => ({
          title: item.name,
          href: "studios.html",
          meta: item.category || t("search.studio")
        }))
      },
      {
        title: t(searchResultTitleKeys.modules),
        items: nearbyModules.map((item) => ({
          title: item.title,
          href: `module.html?id=${item.id}`,
          meta: `${item.guild || t("search.module")}${item.locationText ? ` · ${item.locationText}` : ""}${item.distanceKm != null ? ` · ${formatDistance(item.distanceKm)}` : ""}`,
          mapsHref: item.mapsHref
        }))
      }
    ];

    const featuredModule = nearbyModules.find((item) => item.locationText);

    let panel = document.getElementById("search-results-panel");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "search-results-panel";
      panel.className = "card search-results-panel";
      document.querySelector(".page-stack")?.prepend(panel);
    }

    panel.innerHTML = `
      <p class="section-label">${escapeHtml(t("search.kicker"))}</p>
      <h2>${escapeHtml(t("search.resultsFor", { query }))}</h2>
      ${
        featuredModule
          ? `
            <section class="nearby-map-card">
              <div>
                <p class="section-label">${escapeHtml(t("search.nearbyModule"))}</p>
                <h3>${escapeHtml(featuredModule.title)}</h3>
                <p>${escapeHtml(featuredModule.locationText)}</p>
                <p class="field-note">${escapeHtml(featuredModule.guild || t("search.module"))} · ${escapeHtml(featuredModule.distanceKm != null ? formatDistance(featuredModule.distanceKm) : t("search.routeDetails"))}</p>
                <div class="inline-actions">
                  <a class="btn btn-primary" href="module.html?id=${featuredModule.id}">${escapeHtml(t("search.openModule"))}</a>
                  <a class="btn subtle-button" href="${featuredModule.mapsHref}" target="_blank" rel="noreferrer">${escapeHtml(t("search.openMaps"))}</a>
                </div>
              </div>
              <iframe
                class="map-frame"
                title="${escapeHtml(t("search.mapTitle"))}"
                src="${googleMapsEmbedUrl(featuredModule.locationText)}"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </section>
          `
          : ""
      }
      <div class="card-grid">
        ${groups
          .map(
            (group) => `
              <article class="card">
                <p class="section-label">${escapeHtml(group.title)}</p>
                <div class="record-list">
                  ${
                    group.items.length
                      ? group.items
                          .slice(0, 6)
                          .map(
                            (item) => `
                              <article class="record-card">
                                <h3>${escapeHtml(item.title)}</h3>
                                <p class="field-note">${escapeHtml(item.meta)}</p>
                                <footer>
                                  <a class="text-link" href="${item.href}">${escapeHtml(t("search.open"))}</a>
                                  ${item.mapsHref ? `<a class="text-link" target="_blank" rel="noreferrer" href="${item.mapsHref}">${escapeHtml(t("search.maps"))}</a>` : ""}
                                </footer>
                              </article>
                            `
                          )
                          .join("")
                      : emptyCard(t("search.noResultsTitle", { type: group.title.toLowerCase() }), t("search.noResultsBody"))
                  }
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  });
}

function renderVersionBadges() {
  document.querySelectorAll(".version-badge").forEach((node) => {
    node.textContent = appVersion;
  });
}

function getOnboardingKey(user) {
  return `neofolk.onboarding.${user?.id || "guest"}`;
}

function shouldShowOnboarding(user) {
  if (!user) return false;
  return !localStorage.getItem(getOnboardingKey(user));
}

function markOnboardingSeen(user) {
  if (!user) return;
  localStorage.setItem(getOnboardingKey(user), "seen");
}

function renderOnboarding(user) {
  if (!shouldShowOnboarding(user)) return;
  if (document.getElementById("onboarding-overlay")) return;

  const steps = [
    {
      kicker: t("onboarding.stepLabel", { step: 1 }),
      title: t("onboarding.step1Title"),
      note: t("onboarding.step1Note"),
      cards: [
        { title: t("onboarding.language"), body: t("onboarding.step1Card1") },
        { title: t("onboarding.interests"), body: t("onboarding.step1Card2") },
        { title: t("onboarding.firstCourse"), body: t("onboarding.step1Card3") }
      ]
    },
    {
      kicker: t("onboarding.stepLabel", { step: 2 }),
      title: t("onboarding.step2Title"),
      note: t("onboarding.step2Note"),
      cards: [
        { title: t("onboarding.learn"), body: t("onboarding.step2Card1") },
        { title: t("onboarding.notes"), body: t("onboarding.step2Card2") },
        { title: t("onboarding.projects"), body: t("onboarding.step2Card3") },
        { title: t("onboarding.progress"), body: t("onboarding.step2Card4") }
      ]
    },
    {
      kicker: t("onboarding.stepLabel", { step: 3 }),
      title: t("onboarding.step3Title"),
      note: t("onboarding.step3Note"),
      cards: [
        { title: t("onboarding.subjects"), body: t("onboarding.step3Card1") },
        { title: t("onboarding.groups"), body: t("onboarding.step3Card2") },
        { title: t("onboarding.dictionary"), body: t("onboarding.step3Card3") },
        { title: t("onboarding.help"), body: t("onboarding.step3Card4") }
      ]
    },
    {
      kicker: t("onboarding.stepLabel", { step: 4 }),
      title: t("onboarding.step4Title"),
      note: t("onboarding.step4Note"),
      cards: [
        { title: t("onboarding.language"), body: t("onboarding.step4Card1") },
        { title: t("onboarding.nearMe"), body: t("onboarding.step4Card2") },
        { title: t("onboarding.phaseTwo"), body: t("onboarding.step4Card3") }
      ]
    }
  ];

  const overlay = document.createElement("div");
  overlay.id = "onboarding-overlay";
  overlay.className = "intro-overlay onboarding-overlay";
  overlay.innerHTML = `
    <div class="intro-panel onboarding-panel" role="dialog" aria-modal="true" aria-label="How to use Neofolk Atlas">
      <div class="intro-topline">
        <img class="intro-logo" src="neofolk-logo.jpg" alt="Neofolk humanitarian education board logo" />
        <div class="intro-wordmark">
          <p class="section-label">${escapeHtml(t("onboarding.kicker"))}</p>
          <strong>${escapeHtml(t("onboarding.title"))}</strong>
        </div>
        <button class="btn subtle-button onboarding-close" id="dismiss-onboarding-top" type="button">${escapeHtml(t("onboarding.close"))}</button>
      </div>
      <div class="intro-copy">
        <div class="onboarding-progress">
          <p class="section-label" id="onboarding-step-label"></p>
          <div class="onboarding-dots" id="onboarding-dots"></div>
        </div>
        <div id="onboarding-step-body"></div>
        <div class="inline-actions onboarding-actions">
          <button class="btn subtle-button" id="onboarding-prev" type="button">${escapeHtml(t("onboarding.previous"))}</button>
          <a class="btn" href="help.html">${escapeHtml(t("onboarding.openHelp"))}</a>
          <button class="btn btn-primary" id="onboarding-next" type="button">${escapeHtml(t("onboarding.next"))}</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  let stepIndex = 0;
  const body = overlay.querySelector("#onboarding-step-body");
  const label = overlay.querySelector("#onboarding-step-label");
  const dots = overlay.querySelector("#onboarding-dots");
  const prevButton = overlay.querySelector("#onboarding-prev");
  const nextButton = overlay.querySelector("#onboarding-next");

  const renderStep = () => {
    const step = steps[stepIndex];
    label.textContent = t("onboarding.stepOf", { current: stepIndex + 1, total: steps.length });
    dots.innerHTML = steps
      .map((_, index) => `<span class="onboarding-dot ${index === stepIndex ? "is-active" : ""}"></span>`)
      .join("");
    body.innerHTML = `
      <p class="page-note">${escapeHtml(step.note)}</p>
      <h2>${escapeHtml(step.title)}</h2>
      <div class="onboarding-step-grid">
        ${step.cards
          .map(
            (card) => `
              <article class="record-card">
                <h3>${escapeHtml(card.title)}</h3>
                <p>${escapeHtml(card.body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
    prevButton.disabled = stepIndex === 0;
    nextButton.textContent = stepIndex === steps.length - 1 ? t("onboarding.finish") : t("onboarding.next");
  };

  const dismiss = () => {
    markOnboardingSeen(user);
    overlay.classList.add("is-hidden");
    window.setTimeout(() => overlay.remove(), 420);
  };

  prevButton?.addEventListener("click", () => {
    stepIndex = Math.max(0, stepIndex - 1);
    renderStep();
  });
  nextButton?.addEventListener("click", () => {
    if (stepIndex === steps.length - 1) {
      dismiss();
      return;
    }
    stepIndex += 1;
    renderStep();
  });
  document.getElementById("dismiss-onboarding-top")?.addEventListener("click", dismiss);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) dismiss();
  });

  renderStep();
}

function renderWorkspaceToolbar(currentUser) {
  if (!currentUser) return;
  const stack = document.querySelector(".page-stack");
  if (!stack) return;

  const currentLanguageMeta = getLanguageMeta(getPreferredLanguage());
  let toolbar = document.getElementById("workspace-toolbar");
  if (!toolbar) {
    toolbar = document.createElement("section");
    toolbar.id = "workspace-toolbar";
    toolbar.className = "card workspace-toolbar";
    stack.prepend(toolbar);
  }

  toolbar.innerHTML = `
    <div class="workspace-toolbar-grid">
      <form id="global-search-form" class="toolbar-search" role="search">
        <label class="toolbar-field">
          <span class="section-label">${escapeHtml(t("toolbar.search"))}</span>
          <input id="global-search-input" type="search" placeholder="${escapeHtml(t("toolbar.searchPlaceholder"))}" />
        </label>
        <button id="global-search-button" class="btn btn-primary" type="submit">${escapeHtml(t("toolbar.searchButton"))}</button>
      </form>

      <div class="toolbar-translate">
        <label class="toolbar-field">
          <span class="section-label">${escapeHtml(t("toolbar.language"))}</span>
          <select id="language-select" aria-label="${escapeHtml(t("toolbar.languageAria"))}">
            ${supportedLanguages.map((language) => `<option value="${language.code}" ${language.code === currentLanguageMeta.code ? "selected" : ""}>${escapeHtml(language.label)}</option>`).join("")}
          </select>
        </label>
        <button id="use-location-button" class="btn subtle-button" type="button">${escapeHtml(t("toolbar.nearMe"))}</button>
      </div>
    </div>
  `;

  wireWorkspaceToolbar(currentUser);
}

async function fetchUsers() {
  try {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("users"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchApprovedModules() {
  try {
    const { data, error } = await supabase
      .from("modules")
      .select("*, users!modules_created_by_fkey(id, role, verified, email)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).filter((row) => row.users?.verified).map(mapModule);
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("modules"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchAllModules() {
  try {
    const { data, error } = await supabase
      .from("modules")
      .select("*, users!modules_created_by_fkey(id, role, verified, email)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapModule);
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("modules"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchPortfolioEntries() {
  try {
    const [{ data: entries, error: entriesError }, { data: highlights, error: highlightsError }] = await Promise.all([
      supabase.from("portfolio_entries").select("*").order("created_at", { ascending: false }),
      supabase.from("highlights").select("*")
    ]);

    if (entriesError) throw entriesError;
    if (highlightsError && !isMissingRelationError(highlightsError)) throw highlightsError;

    const highlightedIds = new Set((highlights || []).filter((item) => item.entry_type ? item.entry_type === "portfolio" : true).map((item) => item.entry_id));
    return (entries || []).map((entry) => mapPortfolio({ ...entry, highlighted: highlightedIds.has(entry.id) }));
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("portfolio_entries/highlights"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchHighlightedEntries() {
  try {
    const [{ data: highlights, error: highlightsError }, { data: entries, error: entriesError }] = await Promise.all([
      supabase.from("highlights").select("*").order("created_at", { ascending: false }),
      supabase.from("portfolio_entries").select("*").order("created_at", { ascending: false })
    ]);
    if (highlightsError) throw highlightsError;
    if (entriesError) throw entriesError;

    const entryMap = new Map((entries || []).map((entry) => [entry.id, entry]));
    return (highlights || [])
      .filter((item) => !item.entry_type || item.entry_type === "portfolio")
      .map((item) => {
        const entry = entryMap.get(item.entry_id);
        return entry ? mapPortfolio({ ...entry, highlighted: true, highlighted_at: item.created_at }) : null;
      })
      .filter(Boolean);
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("highlights"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchNicheEntries() {
  try {
    const { data, error } = await supabase.from("niche_entries").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapNiche);
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("niche_entries"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchEnrollmentsForUser(userId) {
  try {
    const { data, error } = await supabase.from("enrollments").select("*").eq("student_id", userId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("enrollments"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchCuratorCodes() {
  try {
    const { data, error } = await supabase.from("curator_codes").select("*");
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("curator_codes"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchSubjects() {
  try {
    const { data, error } = await supabase.from("subjects").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("subjects"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchGuildRecords() {
  try {
    const { data, error } = await supabase.from("guilds").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("guilds"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchGuildMembers() {
  try {
    const { data, error } = await supabase.from("guild_members").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("guild_members"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchGuildOutputs() {
  try {
    const { data, error } = await supabase.from("guild_outputs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("guild_outputs"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchResearchPosts() {
  try {
    const { data, error } = await supabase.from("research_posts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapResearchPost);
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("research_posts"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchStudios() {
  try {
    const { data, error } = await supabase.from("studios").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("studios"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchStudioRequests() {
  try {
    const { data, error } = await supabase.from("studio_requests").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("studio_requests"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchNeoscores() {
  try {
    const { data, error } = await supabase.from("neoscore").select("*");
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("neoscore"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchTokens() {
  try {
    const { data, error } = await supabase.from("tokens").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("tokens"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchTags() {
  try {
    const { data, error } = await supabase.from("tags").select("*").order("name", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("tags"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchTagLinks() {
  try {
    const { data, error } = await supabase.from("tag_links").select("*");
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("tag_links"), error.message);
      return [];
    }
    throw error;
  }
}

async function fetchQuotes() {
  try {
    const { data, error } = await supabase.from("quotes").select("*");
    if (error) throw error;
    return data || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(optionalTableNotice("quotes"), error.message);
      return [];
    }
    throw error;
  }
}

function getEntityTags(entityType, entityId, tags, tagLinks) {
  const ids = tagLinks.filter((link) => link.entity_type === entityType && link.entity_id === entityId).map((link) => link.tag_id);
  const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));
  return ids.map((id) => tagMap.get(id)).filter(Boolean);
}

function renderTagPills(tagNames = []) {
  if (!tagNames.length) return "";
  return `<div class="inline-actions">${tagNames.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function getRandomItem(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function getNeoscoreForUser(neoscores, userId) {
  return neoscores.find((entry) => entry.user_id === userId) || null;
}

function totalNeoscore(score) {
  if (!score) return 0;
  return Number(score.total_score || 0) ||
    Number(score.knowledge_score || 0) +
    Number(score.portfolio_score || 0) +
    Number(score.guild_score || 0) +
    Number(score.creative_score || 0) +
    Number(score.praxis_score || 0);
}

function getUserTokenBalance(tokens, userId) {
  return tokens.filter((entry) => entry.user_id === userId).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function neoscoreSummary(score) {
  const total = totalNeoscore(score);
  return `
    <div class="record-list">
      <article class="record-card"><h3>Knowledge</h3><p>${Number(score?.knowledge_score || 0)} / 20</p></article>
      <article class="record-card"><h3>Portfolio</h3><p>${Number(score?.portfolio_score || 0)} / 20</p></article>
      <article class="record-card"><h3>Guild</h3><p>${Number(score?.guild_score || 0)} / 20</p></article>
      <article class="record-card"><h3>Creative</h3><p>${Number(score?.creative_score || 0)} / 20</p></article>
      <article class="record-card"><h3>Praxis</h3><p>${Number(score?.praxis_score || 0)} / 20</p></article>
      <article class="record-card"><h3>Total</h3><p>${total} / 100</p></article>
    </div>
  `;
}

function computeTagFilterOptions(tags, tagLinks, entityType) {
  const relevantIds = new Set(tagLinks.filter((link) => link.entity_type === entityType).map((link) => link.tag_id));
  return tags.filter((tag) => relevantIds.has(tag.id));
}

function filterByTag(entityType, entityId, activeTag, tags, tagLinks) {
  if (!activeTag) return true;
  return getEntityTags(entityType, entityId, tags, tagLinks).includes(activeTag);
}

function portfolioCard(entry, viewer, usersById, options = {}) {
  const author = usersById.get(entry.createdBy);
  const actions = [];

  if (options.allowEdit && viewer.id === entry.createdBy) {
    actions.push(textButton("Edit entry", "btn subtle-button edit-portfolio-button", `data-portfolio-id="${entry.id}"`));
  }
  if (options.allowDelete && viewer.id === entry.createdBy) {
    actions.push(textButton("Delete entry", "btn subtle-button delete-portfolio-button", `data-portfolio-id="${entry.id}"`));
  }
  if (options.allowHighlight && viewer.role === "arbiter") {
    actions.push(
      textButton(
        entry.highlighted ? "Remove from discovery" : "Highlight for discovery",
        "btn subtle-button toggle-highlight-button",
        `data-portfolio-id="${entry.id}"`
      )
    );
  }

  return `
    <article class="record-card">
      <div class="card-header-row">
        <p class="section-label">${escapeHtml(entry.title)} · ${formatDate(entry.created_at)}</p>
        ${entry.highlighted ? `<span class="pill">Highlighted</span>` : ""}
      </div>
      <h3>${escapeHtml(entry.description || "Portfolio Entry")}</h3>
      ${entry.link ? `<p><a class="text-link" href="${escapeHtml(entry.link)}" target="_blank" rel="noreferrer">Open work link</a></p>` : ""}
      ${entry.visibility ? `<p class="field-note">Visibility: ${escapeHtml(entry.visibility)}</p>` : ""}
      ${renderTagPills(options.tags || entry.tags || [])}
      <p class="field-note">By ${escapeHtml(displayUserName(author))}</p>
      <footer>${actions.join("")}</footer>
    </article>
  `;
}

function nicheCard(entry, viewer, allowDelete) {
  const actions = [];
  if (allowDelete && viewer.id === entry.createdBy) {
    actions.push(textButton("Delete entry", "btn subtle-button delete-niche-button", `data-niche-id="${entry.id}"`));
  }

  return `
    <article class="record-card">
      <p class="section-label">${formatDate(entry.created_at)}</p>
      <h3>${escapeHtml(entry.topic)}</h3>
      <p>${escapeHtml(entry.notes)}</p>
      <footer>${actions.join("")}</footer>
    </article>
  `;
}

function moduleCard(module, usersById, options = {}) {
  const owner = usersById.get(module.createdBy);
  const actions = [`<a class="text-link" href="module.html?id=${module.id}">Open module</a>`];

  if (options.showDelete) {
    actions.push(textButton("Delete module", "btn subtle-button delete-module-button", `data-module-id="${module.id}"`));
  }
  if (options.allowEnroll) {
    if (options.alreadyEnrolledIds?.has(module.id)) {
      actions.push(`<span class="pill">Enrolled</span>`);
    } else {
      actions.push(textButton("Enroll", "btn enroll-button", `data-module-id="${module.id}"`));
    }
  }

  return `
    <article class="record-card">
      <div class="card-header-row">
        <p class="section-label">${escapeHtml(module.guild)}</p>
        ${statusPill(module.status)}
      </div>
      <h3>${escapeHtml(module.title)}</h3>
      <p>${escapeHtml(module.description)}</p>
      <p class="field-note">Created by ${escapeHtml(owner?.email || "Unknown Curator")}</p>
      ${module.denialReason ? `<p class="denial-note">Denial reason: ${escapeHtml(module.denialReason)}</p>` : ""}
      <footer>${actions.join("")}</footer>
    </article>
  `;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function countRecentItems(items, dateField = "created_at", days = 30) {
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return items.filter((item) => {
    const value = item?.[dateField];
    return value && new Date(value).getTime() >= threshold;
  }).length;
}

function getTopDistribution(entries, limit = 5) {
  const filtered = entries
    .filter((entry) => entry.label && entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  if (!filtered.length) {
    return [{ label: "Learning", value: 1, color: "#8a6a4f" }];
  }

  return filtered;
}

function renderDonutCard({ kicker, title, subtitle, segments }) {
  const palette = ["#c8a86b", "#a85d34", "#5f7d7a", "#7b8d63", "#a48a63"];
  const normalized = getTopDistribution(
    segments.map((segment, index) => ({
      ...segment,
      color: segment.color || palette[index % palette.length]
    }))
  );
  const total = normalized.reduce((sum, item) => sum + item.value, 0) || 1;
  let cursor = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const rings = normalized
    .map((segment) => {
      const dash = (segment.value / total) * circumference;
      const node = `
        <circle
          cx="60"
          cy="60"
          r="${radius}"
          fill="none"
          stroke="${segment.color}"
          stroke-width="16"
          stroke-linecap="butt"
          stroke-dasharray="${dash} ${circumference - dash}"
          stroke-dashoffset="${-cursor}"
          transform="rotate(-90 60 60)"
        ></circle>
      `;
      cursor += dash;
      return node;
    })
    .join("");

  const primaryPercent = Math.round((normalized[0].value / total) * 100);

  return `
    <article class="card dashboard-metric-card">
      <p class="section-label">${escapeHtml(kicker)}</p>
      <h2>${escapeHtml(title)}</h2>
      <div class="dashboard-donut-layout">
        <div class="dashboard-donut-wrap">
          <svg viewBox="0 0 120 120" class="dashboard-donut" aria-hidden="true">
            <circle cx="60" cy="60" r="${radius}" fill="none" stroke="rgba(245, 239, 230, 0.08)" stroke-width="16"></circle>
            ${rings}
          </svg>
          <div class="dashboard-donut-center">
            <strong>${primaryPercent}%</strong>
          </div>
        </div>
        <div class="dashboard-donut-legend">
          ${normalized
            .map((segment) => {
              const percent = Math.round((segment.value / total) * 100);
              return `
                <div class="dashboard-legend-item">
                  <span class="dashboard-legend-swatch" style="background:${segment.color}"></span>
                  <span>${escapeHtml(segment.label)}</span>
                  <strong>${percent}%</strong>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
      <p class="field-note">${escapeHtml(subtitle)}</p>
    </article>
  `;
}

function renderProgressBar(percent) {
  const safePercent = clamp(Math.round(percent || 0), 0, 100);
  return `
    <div class="dashboard-progress-block">
      <div class="dashboard-progress-track">
        <span class="dashboard-progress-fill" style="width:${safePercent}%"></span>
      </div>
      <strong class="dashboard-progress-value">${safePercent}%</strong>
    </div>
  `;
}

async function renderHomePage() {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData?.session) {
    const currentUser = await getCurrentUserProfile();
    if (currentUser) {
      window.location.href = getDashboardPath(currentUser.role);
      return;
    }
  }

  const stack = document.querySelector(".page-stack");
  if (!stack) return;
  const currentLanguageMeta = getLanguageMeta(getPreferredLanguage());
  stack.innerHTML = `
    <section id="start-learning" class="hero-panel hero-panel-simple">
      <article class="hero-copy card">
        <p class="section-label">${escapeHtml(t("home.kicker"))}</p>
        <h1>${escapeHtml(t("home.title"))}</h1>
        <p class="lede">${escapeHtml(t("home.subtitle"))}</p>
        <div class="inline-actions">
          <a class="btn btn-primary" href="#auth-area">${escapeHtml(t("home.primaryStart"))}</a>
          <a class="btn" href="subjects.html">${escapeHtml(t("home.primaryBrowse"))}</a>
          <a class="btn subtle-button" href="#login-form">${escapeHtml(t("home.primaryContinue"))}</a>
        </div>
        <section id="hero-quote" class="page-note"></section>
      </article>

      <article id="auth-area" class="auth-panel card">
        <p class="section-label">${escapeHtml(t("home.languageKicker"))}</p>
        <h2>${escapeHtml(t("home.languageTitle"))}</h2>
        <div class="auth-language-row">
          <label class="toolbar-field">
            <span class="section-label">${escapeHtml(t("toolbar.language"))}</span>
            <select id="home-language-select" aria-label="${escapeHtml(t("toolbar.languageAria"))}">
              ${supportedLanguages.map((language) => `<option value="${language.code}" ${language.code === currentLanguageMeta.code ? "selected" : ""}>${escapeHtml(language.label)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="auth-layout auth-layout-simple">
          <section>
            <p class="section-label">${escapeHtml(t("home.signupLabel"))}</p>
            <h2>${escapeHtml(t("home.signupTitle"))}</h2>
            <p class="field-note">${escapeHtml(t("home.signupNote"))}</p>
            <form id="signup-form" class="form-stack">
              <label>
                ${escapeHtml(t("auth.email"))}
                <input id="signup-email" name="email" type="email" autocomplete="email" required />
              </label>
              <label>
                ${escapeHtml(t("auth.password"))}
                <input id="signup-password" name="password" type="password" autocomplete="new-password" required />
              </label>
              <button class="btn btn-primary" type="submit">${escapeHtml(t("auth.createAccount"))}</button>
            </form>
            <p id="signup-message" class="status-text" aria-live="polite"></p>
          </section>

          <section>
            <p class="section-label">${escapeHtml(t("home.loginLabel"))}</p>
            <h2>${escapeHtml(t("home.loginTitle"))}</h2>
            <p class="field-note">${escapeHtml(t("home.loginNote"))}</p>
            <form id="login-form" class="form-stack">
              <label>
                ${escapeHtml(t("auth.email"))}
                <input id="login-email" name="email" type="email" autocomplete="email" required />
              </label>
              <label>
                ${escapeHtml(t("auth.password"))}
                <input id="login-password" name="password" type="password" autocomplete="current-password" required />
              </label>
              <button class="btn" type="submit">${escapeHtml(t("auth.login"))}</button>
              <button id="forgot-password-button" class="btn subtle-button" type="button">${escapeHtml(t("auth.forgotPassword"))}</button>
            </form>
            <p id="login-message" class="status-text" aria-live="polite"></p>
          </section>
        </div>
      </article>
    </section>

    <section class="card">
      <p class="section-label">${escapeHtml(t("home.stepsKicker"))}</p>
      <h2>${escapeHtml(t("home.stepsTitle"))}</h2>
      <div class="card-grid">
        <article class="soft-card"><h3>${escapeHtml(t("home.step1Title"))}</h3><p>${escapeHtml(t("home.step1Body"))}</p></article>
        <article class="soft-card"><h3>${escapeHtml(t("home.step2Title"))}</h3><p>${escapeHtml(t("home.step2Body"))}</p></article>
        <article class="soft-card"><h3>${escapeHtml(t("home.step3Title"))}</h3><p>${escapeHtml(t("home.step3Body"))}</p></article>
      </div>
    </section>

    <section id="about" class="card prose-panel">
      <p class="section-label">${escapeHtml(t("home.philosophyKicker"))}</p>
      <h2>${escapeHtml(t("home.philosophyTitle"))}</h2>
      <p>${escapeHtml(t("home.philosophyBody"))}</p>
      <div class="three-column">
        <article class="soft-card">
          <h3>${escapeHtml(t("home.termCourses"))}</h3>
          <div class="inline-actions">${termTooltip("module")}</div>
          <p>${escapeHtml(t("home.termCoursesBody"))}</p>
        </article>
        <article class="soft-card">
          <h3>${escapeHtml(t("home.termGroups"))}</h3>
          <div class="inline-actions">${termTooltip("guild")}</div>
          <p>${escapeHtml(t("home.termGroupsBody"))}</p>
        </article>
        <article class="soft-card">
          <h3>${escapeHtml(t("home.termProjects"))}</h3>
          <div class="inline-actions">${termTooltip("seeker")}</div>
          <p>${escapeHtml(t("home.termProjectsBody"))}</p>
        </article>
      </div>
    </section>
  `;

  const forgotButton = document.getElementById("forgot-password-button");
  const heroQuote = document.getElementById("hero-quote");

  const quotes = await fetchQuotes().catch(() => []);
  const randomQuote = getRandomItem(quotes);
  if (heroQuote && randomQuote) {
    heroQuote.innerHTML = `
      <p class="section-label">${escapeHtml(randomQuote.theme || randomQuote.tradition || "Reflection")}</p>
      <blockquote class="intro-quote">${escapeHtml(randomQuote.text)}</blockquote>
      <p class="field-note">${escapeHtml(randomQuote.author || "Unknown")} · ${escapeHtml(randomQuote.tradition || "Tradition")}</p>
    `;
  }

  document.getElementById("home-language-select")?.addEventListener("change", async (event) => {
    await applyLanguagePreference(event.target.value, { silent: true });
    await init();
  });

  document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("signup-message", "", "");
    const formElement = event.currentTarget;

    const form = new FormData(formElement);
    const email = form.get("email")?.toString().trim().toLowerCase();
    const password = form.get("password")?.toString().trim();

    if (!email || !password) {
      setMessage("signup-message", t("messages.missingFields"), "error");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "seeker" } }
      });
      if (error) {
        setMessage("signup-message", authErrorMessage(error), "error");
        return;
      }

      if (!data.user) {
        setMessage("signup-message", t("messages.signupFailed"), "error");
        return;
      }

      const profilePayload = {
        id: data.user.id,
        role: "seeker",
        verified: false,
        email
      };

      const { error: profileError } = await supabase.from("users").insert(profilePayload);
      if (profileError) {
        setMessage("signup-message", profileError.message, "error");
        return;
      }

      formElement.reset();
      setMessage(
        "signup-message",
        t("messages.checkEmail"),
        "success"
      );
    } catch (error) {
      setMessage("signup-message", error.message || t("messages.signupFailed"), "error");
    }
  });

  document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("login-message", "", "");

    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.toString().trim().toLowerCase();
    const password = form.get("password")?.toString().trim();

    if (!email || !password) {
      setMessage("login-message", t("messages.missingFields"), "error");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("login-message", authErrorMessage(error), "error");
      return;
    }

    if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      setMessage("login-message", t("messages.unverifiedEmail"), "error");
      return;
    }

    const role = data.user?.user_metadata?.role;
    
    if (role) {
      window.location.href = getDashboardPath(role);
    } else {
      const profile = await getCurrentUserProfile();
      if (!profile) {
        setMessage("login-message", t("messages.noProfile"), "error");
        return;
      }
      window.location.href = getDashboardPath(profile.role);
    }
  });

  if (forgotButton) {
    forgotButton.addEventListener("click", async () => {
      const emailField = document.getElementById("login-email");
      const email = emailField?.value.trim().toLowerCase();

      if (!email) {
        setMessage("login-message", t("messages.enterEmailForReset"), "error");
        return;
      }

      const redirectTo = getResetRedirectUrl();
      const resetResult = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setMessage(
        "login-message",
        resetResult.error ? resetResult.error.message : t("messages.passwordResetSent"),
        resetResult.error ? "error" : "success"
      );
    });
  }

}

async function initResetPasswordPage() {
  const form = document.getElementById("reset-password-form");
  const messageId = "reset-message";
  if (!form) return;

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);
  const accessToken = hashParams.get("access_token") || queryParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token") || queryParams.get("refresh_token");
  const urlError = hashParams.get("error_description") || queryParams.get("error_description");

  if (urlError) {
    setMessage(messageId, decodeURIComponent(urlError.replace(/\+/g, " ")), "error");
  }

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    if (error) {
      setMessage(messageId, error.message, "error");
    } else {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session && !urlError) {
    setMessage(messageId, "This recovery link is invalid or has expired. Request a fresh password reset email.", "error");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(messageId, "", "");

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("newPassword")?.toString().trim();
    const confirmPassword = formData.get("confirmPassword")?.toString().trim();

    if (!newPassword || !confirmPassword) {
      setMessage(messageId, "Missing fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(messageId, "Passwords do not match.", "error");
      return;
    }

    const { data: currentSession } = await supabase.auth.getSession();
    if (!currentSession.session) {
      setMessage(messageId, "This recovery session is no longer valid. Request a fresh reset email.", "error");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(messageId, error.message, "error");
      return;
    }

    setMessage(messageId, "Password updated successfully. You can now return to login.", "success");
    form.reset();
  });
}


function renderNeoscorePieChart() {
  const domains = [
    { name: "Lingosophy", color: "#8c4b2f" },
    { name: "Arthmetics", color: "#c6a96b" },
    { name: "Cosmology", color: "#6f7b5c" },
    { name: "Biosphere", color: "#4a3c31" },
    { name: "Chronicles", color: "#5b4e41" },
    { name: "Civitas", color: "#7a5c4d" },
    { name: "Tokenomics", color: "#8b7e66" },
    { name: "Artifex", color: "#9c8166" },
    { name: "Praxis", color: "#a88e72" },
    { name: "Bioepisteme", color: "#5c6b5d" }
  ];

  const radius = 100;
  const cx = 150;
  const cy = 150;
  const strokeWidth = 40;
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / domains.length;
  const gap = 2;
  const dashArray = `${segmentLength - gap} ${circumference - (segmentLength - gap)}`;
  
  const segmentsSvg = domains.map((domain, index) => {
    const angle = (index * 360) / domains.length;
    return `
      <circle 
        cx="${cx}" cy="${cy}" r="${radius}" 
        fill="none" 
        stroke="${domain.color}" 
        stroke-width="${strokeWidth}" 
        stroke-dasharray="${dashArray}" 
        stroke-dashoffset="${circumference / 4}" 
        transform="rotate(${angle} ${cx} ${cy})"
      >
        <title>${domain.name}</title>
      </circle>
    `;
  }).join("");

  const legendHtml = domains.map(domain => `
    <div class="legend-item">
      <div class="legend-color" style="background: ${domain.color}"></div>
      <span>${domain.name}</span>
    </div>
  `).join("");

  return `
    <div class="card dashboard-chart-card">
      <p class="section-label">Learning Balance Map</p>
      <h2>Neofolk Knowledge Model</h2>
      <div class="chart-container">
        <div class="chart-svg-wrapper">
          <svg viewBox="0 0 300 300" width="100%" height="100%">
            ${segmentsSvg}
          </svg>
        </div>
        <div class="chart-legend">
          ${legendHtml}
        </div>
      </div>
    </div>
  `;
}

async function initSeekerDashboard() {
  const currentUser = await requireRole(["seeker"]);
  if (!currentUser) return;

  const root = document.getElementById("dashboard-root");
  const [modules, entries, nicheEntries, enrollments, users, subjects, guilds, guildMembers, neoscores, tokens, researchPosts, tags, tagLinks] = await Promise.all([
    fetchApprovedModules(),
    fetchPortfolioEntries(),
    fetchNicheEntries(),
    fetchEnrollmentsForUser(currentUser.id),
    fetchUsers(),
    fetchSubjects(),
    fetchGuildRecords(),
    fetchGuildMembers(),
    fetchNeoscores(),
    fetchTokens(),
    fetchResearchPosts(),
    fetchTags(),
    fetchTagLinks()
  ]);
  const allUsers = ensureRealUserMap(users);

  const ownEntries = entries.filter((entry) => entry.createdBy === currentUser.id);
  const ownNicheEntries = nicheEntries.filter((entry) => entry.createdBy === currentUser.id);
  const enrolledIds = new Set(enrollments.map((entry) => entry.module_id));
  const enrolledModules = modules.filter((module) => enrolledIds.has(module.id));
  const usersById = new Map(allUsers.map((user) => [user.id, user]));
  const joinedGuildIds = new Set(guildMembers.filter((member) => member.user_id === currentUser.id).map((member) => member.guild_id));
  const joinedGuilds = guilds.filter((guild) => joinedGuildIds.has(guild.id));
  const score = getNeoscoreForUser(neoscores, currentUser.id);
  const tokenBalance = getUserTokenBalance(tokens, currentUser.id);
  const recentActivity = [
    ...ownEntries.map((entry) => ({ title: entry.title, type: "Portfolio", created_at: entry.created_at })),
    ...ownNicheEntries.map((entry) => ({ title: entry.topic, type: "Note", created_at: entry.created_at })),
    ...researchPosts.filter((post) => post.user_id === currentUser.id).map((post) => ({ title: post.title, type: "Research", created_at: post.created_at }))
  ]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);
  const recommendedSubjects = subjects.filter((subject) => !enrolledModules.some((module) => module.guild === subject.name)).slice(0, 4);
  const recommendedGuilds = guilds.filter((guild) => !joinedGuildIds.has(guild.id)).slice(0, 3);
  const currentCourse = enrolledModules[0] || recommendedSubjects[0] || null;
  const suggestedTags = [...new Set([...ownNicheEntries.map((entry) => entry.topic), ...getEntityTags("portfolio", ownEntries[0]?.id, tags, tagLinks)])]
    .filter(Boolean)
    .slice(0, 6);
  const latestWork = ownEntries[0] || null;
  const recentEnrollments = countRecentItems(enrollments);
  const recentNotesCount = countRecentItems(ownNicheEntries);
  const recentProjectsCount = countRecentItems(ownEntries);
  const recentGroupCount = countRecentItems(guildMembers.filter((member) => member.user_id === currentUser.id));
  const activitySegments = [
    { label: "Modules", value: recentEnrollments, color: "#c8a86b" },
    { label: "Notes", value: recentNotesCount, color: "#a85d34" },
    { label: "Projects", value: recentProjectsCount, color: "#5f7d7a" },
    { label: "Groups", value: recentGroupCount, color: "#7b8d63" }
  ];
  const activityCount = activitySegments.reduce((sum, item) => sum + item.value, 0);
  const activityPercent = clamp(Math.round((activityCount / 12) * 100), 0, 100);
  const tagFrequency = new Map();
  enrolledModules.forEach((module) => {
    const key = module.guild || "General";
    tagFrequency.set(key, (tagFrequency.get(key) || 0) + 1);
  });
  ownNicheEntries.forEach((entry) => {
    const key = entry.topic || "General";
    tagFrequency.set(key, (tagFrequency.get(key) || 0) + 1);
  });
  ownEntries.forEach((entry) => {
    getEntityTags("portfolio", entry.id, tags, tagLinks).forEach((tag) => {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    });
  });
  const subjectDistribution = [...tagFrequency.entries()].map(([label, value]) => ({ label, value }));
  const currentCourseProgress = currentCourse
    ? clamp(
        18 +
          recentNotesCount * 10 +
          recentProjectsCount * 14 +
          (currentCourse.id && enrolledIds.has(currentCourse.id) ? 18 : 0),
        8,
        92
      )
    : 0;
  const latestWorkStatus = latestWork?.visibility === "public" ? "Published" : "Draft";
  let nextStepLabel = "Add your first note";
  let nextStepBody = "Write one short note so the platform starts working for you immediately.";
  let nextStepHref = "#notes-area";
  let nextStepAction = "Create note";

  if (!currentCourse) {
    nextStepLabel = "Choose your first course";
    nextStepBody = "Open Learn and begin with one topic instead of exploring everything at once.";
    nextStepHref = "subjects.html";
    nextStepAction = "Browse topics";
  } else if (!ownEntries.length) {
    nextStepLabel = "Add your first project";
    nextStepBody = "Turn one reflection, essay, or exercise into a visible project.";
    nextStepHref = "#projects-area";
    nextStepAction = "Create project";
  } else if (!joinedGuilds.length) {
    nextStepLabel = "Explore groups";
    nextStepBody = "Join a learning group when you are ready for shared inquiry.";
    nextStepHref = "guild.html";
    nextStepAction = "Explore groups";
  } else if (currentCourse?.id) {
    nextStepLabel = "Continue your current course";
    nextStepBody = "Return to your active course and keep your rhythm steady.";
    nextStepHref = `module.html?id=${currentCourse.id}`;
    nextStepAction = "Continue learning";
  }

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">${escapeHtml(t("dashboard.kicker"))}</p>
          <h1>${escapeHtml(t("dashboard.title"))}</h1>
          <p class="field-note">${escapeHtml(t("dashboard.signedIn", { email: currentUser.email || displayUserName(currentUser) }))}</p>
        </div>
        <p class="dashboard-meta">${escapeHtml(t("dashboard.subtitle"))}</p>
      </header>

      <section class="dashboard-card-grid dashboard-six-cards">
        ${renderDonutCard({
          kicker: "Learning Activity",
          title: "Learning Activity",
          subtitle: `You are ${activityPercent}% active this month`,
          segments: activitySegments
        })}

        ${renderDonutCard({
          kicker: "Subject Distribution",
          title: "Subject Distribution",
          subtitle: subjectDistribution.length ? "Built from courses, notes, projects, and tags" : "Subject patterns appear as you keep learning",
          segments: subjectDistribution
        })}

        <article class="card dashboard-summary-card">
          <p class="section-label">Current Course</p>
          <h2>${escapeHtml(currentCourse?.title || currentCourse?.name || "No current course")}</h2>
          <p>${escapeHtml(currentCourse?.description || "Choose one topic and begin there.")}</p>
          ${renderProgressBar(currentCourseProgress)}
          <div class="inline-actions">
            <a class="btn btn-primary" href="${currentCourse?.id ? `module.html?id=${currentCourse.id}` : "subjects.html"}">${escapeHtml(t("dashboard.continueLearning"))}</a>
          </div>
        </article>

        <article class="card dashboard-summary-card">
          <p class="section-label">Recent Work</p>
          <h2>${escapeHtml(latestWork?.title || "No recent project yet")}</h2>
          <p class="field-note">${escapeHtml(latestWorkStatus)}</p>
          <p>${escapeHtml(latestWork?.description || "Your latest essay, design, reflection, or documentation will appear here.")}</p>
          <div class="inline-actions">
            <a class="btn btn-primary" href="${latestWork ? "profile.html#portfolio" : "#projects-area"}">${latestWork ? "Continue editing" : "Create project"}</a>
          </div>
        </article>

        <article class="card dashboard-summary-card">
          <p class="section-label">Groups (Guilds)</p>
          <h2>${joinedGuilds.length} active group${joinedGuilds.length === 1 ? "" : "s"}</h2>
          <p>${escapeHtml(joinedGuilds[0]?.title || "Learning groups help you move from study into collaborative inquiry.")}</p>
          <div class="inline-actions">
            <a class="btn subtle-button" href="guild.html">Explore groups</a>
          </div>
        </article>

        <article class="card dashboard-summary-card dashboard-next-step-card">
          <p class="section-label">Next Step</p>
          <h2>${escapeHtml(nextStepLabel)}</h2>
          <p>${escapeHtml(nextStepBody)}</p>
          <div class="inline-actions">
            <a class="btn btn-primary" href="${nextStepHref}">${escapeHtml(nextStepAction)}</a>
          </div>
        </article>
      </section>

      <section class="dashboard-support-grid">
        <article class="card" id="notes-area">
          <div class="dashboard-card-topline">
            <div>
              <p class="section-label">Notes</p>
              <h2>Recent notes</h2>
            </div>
            <span class="pill">${ownNicheEntries.length}</span>
          </div>
          <div class="record-list">
            ${
              ownNicheEntries.length
                ? ownNicheEntries
                    .slice(0, 3)
                    .map(
                      (item) => `
                        <article class="record-card compact-record-card">
                          <p class="section-label">${formatDate(item.created_at)}</p>
                          <h3>${escapeHtml(item.topic)}</h3>
                          <p>${escapeHtml(item.notes)}</p>
                        </article>
                      `
                    )
                    .join("")
                : emptyCard("No notes yet", "Write one short note so the Atlas starts becoming useful immediately.")
            }
          </div>
          <details class="simple-details">
            <summary class="btn subtle-button">Create note</summary>
            <form id="niche-form" class="form-stack">
              <label>
                ${escapeHtml(t("forms.interest"))}
                <input name="interest" type="text" required />
              </label>
              <label>
                ${escapeHtml(t("forms.notes"))}
                <textarea name="notes" required></textarea>
              </label>
              <button class="btn" type="submit">${escapeHtml(t("dashboard.saveNote"))}</button>
            </form>
          </details>
          <p id="niche-message" class="status-text" aria-live="polite"></p>
        </article>

        <article class="card" id="projects-area">
          <div class="dashboard-card-topline">
            <div>
              <p class="section-label">Projects (Portfolio)</p>
              <h2>Recent project</h2>
            </div>
            <span class="pill">${ownEntries.length}</span>
          </div>
          <div class="record-list">
            ${
              latestWork
                ? `
                  <article class="record-card compact-record-card">
                    <p class="section-label">${formatDate(latestWork.created_at)}</p>
                    <h3>${escapeHtml(latestWork.title)}</h3>
                    <p>${escapeHtml(latestWork.description)}</p>
                  </article>
                `
                : emptyCard("No projects yet", "Save one strong piece of work here when you are ready.")
            }
          </div>
          <details class="simple-details">
            <summary class="btn subtle-button">Create project</summary>
            <form id="portfolio-form" class="form-stack">
              <label>
                ${escapeHtml(t("forms.title"))}
                <input name="title" type="text" required />
              </label>
              <label>
                ${escapeHtml(t("forms.description"))}
                <textarea name="description" required></textarea>
              </label>
              <label>
                ${escapeHtml(t("forms.projectType"))}
                <select name="entryType">
                  <option value="project">${escapeHtml(t("forms.project"))}</option>
                  <option value="essay">${escapeHtml(t("forms.essay"))}</option>
                  <option value="article">${escapeHtml(t("forms.article"))}</option>
                  <option value="design">${escapeHtml(t("forms.design"))}</option>
                  <option value="research">${escapeHtml(t("forms.research"))}</option>
                  <option value="documentation">${escapeHtml(t("forms.documentation"))}</option>
                  <option value="reflection">${escapeHtml(t("forms.reflection"))}</option>
                </select>
              </label>
              <label>
                ${escapeHtml(t("forms.link"))}
                <input name="link" type="url" placeholder="${escapeHtml(t("forms.linkPlaceholder"))}" />
              </label>
              <label>
                ${escapeHtml(t("forms.visibility"))}
                <select name="visibility">
                  <option value="private">${escapeHtml(t("forms.private"))}</option>
                  <option value="arbiter-only">${escapeHtml(t("forms.arbiterOnly"))}</option>
                  <option value="public">${escapeHtml(t("forms.public"))}</option>
                </select>
              </label>
              <label>
                ${escapeHtml(t("forms.tags"))}
                <input name="tags" type="text" placeholder="${escapeHtml(t("forms.tagsPlaceholder"))}" />
              </label>
              <button class="btn btn-primary" type="submit">${escapeHtml(t("dashboard.saveProject"))}</button>
            </form>
          </details>
          <p id="portfolio-message" class="status-text" aria-live="polite"></p>
        </article>

        <article class="card" id="progress-area">
          <div class="dashboard-card-topline">
            <div>
              <p class="section-label">${escapeHtml(t("dashboard.progressKicker"))}</p>
              <h2>${escapeHtml(t("dashboard.progressTitle"))}</h2>
            </div>
            <span class="pill">${tokenBalance}</span>
          </div>
          ${neoscoreSummary(score)}
          ${suggestedTags.length ? `<div class="divider"></div>${renderTagPills(suggestedTags)}` : ""}
        </article>
      </section>
    </section>
  `;

  document.getElementById("portfolio-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title")?.toString().trim();
    const description = form.get("description")?.toString().trim();
    const link = form.get("link")?.toString().trim();
    const entryType = form.get("entryType")?.toString().trim();
    const visibility = form.get("visibility")?.toString().trim() || "private";
    const rawTags = form
      .get("tags")
      ?.toString()
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];

    if (!title || !description) {
      setMessage("portfolio-message", "Missing fields.", "error");
      return;
    }

    const { data: newEntry, error } = await supabase.from("portfolio_entries").insert({
      user_id: currentUser.id,
      title,
      description: entryType ? `[${entryType}] ${description}` : description,
      link: link || null,
      visibility
    }).select().single();
    
    if (error) {
      setMessage("portfolio-message", error.message, "error");
      return;
    }

    if (rawTags.length > 0 && newEntry) {
      for (const tagName of rawTags) {
        let tagId;
        const { data: tag } = await supabase.from("tags").select("id").eq("name", tagName).maybeSingle();
        if (tag) {
          tagId = tag.id;
        } else {
          const { data: newTag } = await supabase.from("tags").insert({ name: tagName }).select().single();
          if (newTag) tagId = newTag.id;
        }
        if (tagId) {
          await supabase.from("tag_links").insert({
            tag_id: tagId,
            entity_type: "portfolio",
            entity_id: newEntry.id
          });
        }
      }
    }
    
    setMessage("portfolio-message", "Portfolio entry saved.", "success");
    await initSeekerDashboard();
  });

  document.getElementById("niche-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const interest = form.get("interest")?.toString().trim();
    const notes = form.get("notes")?.toString().trim();

    if (!interest || !notes) {
      setMessage("niche-message", "Missing fields.", "error");
      return;
    }

    const { error } = await supabase.from("niche_entries").insert({ user_id: currentUser.id, interest, notes });
    setMessage("niche-message", error ? error.message : "Niche entry saved.", error ? "error" : "success");
    if (!error) await initSeekerDashboard();
  });

  root.querySelectorAll(".enroll-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const moduleId = button.dataset.moduleId;
      const { data: existing } = await supabase
        .from("enrollments")
        .select("id")
        .eq("student_id", currentUser.id)
        .eq("module_id", moduleId)
        .maybeSingle();

      if (!existing) {
        await supabase.from("enrollments").insert({ student_id: currentUser.id, module_id: moduleId });
      }
      await initSeekerDashboard();
    });
  });

  root.querySelectorAll(".delete-niche-button").forEach((button) => {
    button.addEventListener("click", async () => {
      await supabase.from("niche_entries").delete().eq("id", button.dataset.nicheId).eq("user_id", currentUser.id);
      await initSeekerDashboard();
    });
  });

  root.querySelectorAll(".delete-portfolio-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const entryId = button.dataset.portfolioId;
      await supabase.from("highlights").delete().eq("entry_id", entryId);
      await supabase.from("portfolio_entries").delete().eq("id", entryId).eq("user_id", currentUser.id);
      await initSeekerDashboard();
    });
  });

  root.querySelectorAll(".edit-portfolio-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const entry = ownEntries.find((item) => item.id === button.dataset.portfolioId);
      if (!entry) return;

      const nextTitle = window.prompt("Edit title", entry.title || "");
      const nextDescription = window.prompt("Edit description", entry.description || "");
      const nextLink = window.prompt("Edit link", entry.link || "");

      if (!nextTitle || !nextDescription) {
        setMessage("portfolio-message", "Missing fields.", "error");
        return;
      }

      const { error } = await supabase
        .from("portfolio_entries")
        .update({ title: nextTitle.trim(), description: nextDescription.trim(), link: nextLink ? nextLink.trim() : null })
        .eq("id", entry.id)
        .eq("user_id", currentUser.id);

      setMessage("portfolio-message", error ? error.message : "Portfolio entry updated.", error ? "error" : "success");
      if (!error) await initSeekerDashboard();
    });
  });
}

async function initCuratorDashboard() {
  const currentUser = await requireRole(["curator"]);
  if (!currentUser) return;

  const root = document.getElementById("dashboard-root");
  const [modules, codeRows] = await Promise.all([fetchAllModules(), fetchCuratorCodes()]);
  const allUsers = ensureRealUserMap([]);
  const ownModules = modules.filter((module) => module.createdBy === currentUser.id);
  const curatorCode = codeRows.find((entry) => entry.assigned_to === currentUser.id);

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Curator Dashboard</p>
          <h1>${escapeHtml(displayUserName(currentUser))}</h1>
        </div>
        <p class="dashboard-meta">Curators define node identity and create modules. Modules remain pending until Arbiter approval.</p>
      </header>
      ${renderNeoscorePieChart()}

      <section class="stats-grid">
        <article class="stat-card">
          <span class="section-label">Email</span>
          <strong>${currentUser.emailConfirmed ? "Confirmed" : "Pending"}</strong>
        </article>
        <article class="stat-card">
          <span class="section-label">Assigned Code</span>
          <strong>${escapeHtml(curatorCode?.code || "None")}</strong>
        </article>
        <article class="stat-card">
          <span class="section-label">Reviewed</span>
          <strong>${currentUser.verified ? "Approved" : "Pending"}</strong>
        </article>
      </section>

      <section class="card">
        <p class="section-label">Verification</p>
        <h2>Account review</h2>
        <p>${currentUser.verified ? "Your Curator account is approved." : "Your Curator account is awaiting Arbiter approval."}</p>
        <p class="field-note">Assigned Curator Code: ${escapeHtml(curatorCode?.code || "None")}</p>
      </section>

      <section class="card" id="curator-modules">
        <p class="section-label">Module Creation</p>
        <h2>Create a module</h2>
        ${
          currentUser.verified
            ? `
              <form id="module-form" class="form-stack">
                <label>
                  Title
                  <input name="title" type="text" required />
                </label>
                <label>
                  Guild
                  <select name="guild" required>
                    ${guildCatalog.map((guild) => `<option value="${guild.name}">${guild.name}</option>`).join("")}
                  </select>
                </label>
                <label>
                  Description
                  <textarea name="description" required></textarea>
                </label>
                <button class="btn" type="submit">Submit module for review</button>
              </form>
            `
            : `<div class="page-note">Only approved Curators can submit modules.</div>`
        }
        <p id="module-message" class="status-text" aria-live="polite"></p>
      </section>

      <section class="card">
        <p class="section-label">Your modules</p>
        <h2>Status and feedback</h2>
        <div class="record-list">
          ${
            ownModules.length
              ? ownModules.map((module) => moduleCard(module, new Map(allUsers.map((user) => [user.id, user])), { showDelete: module.status !== "approved" })).join("")
              : emptyCard("No modules yet", "Once you create a module, its approval status appears here.")
          }
        </div>
      </section>
    </section>
  `;

  const moduleForm = document.getElementById("module-form");
  if (moduleForm) {
    moduleForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const title = form.get("title")?.toString().trim();
      const guild = form.get("guild")?.toString().trim();
      const description = form.get("description")?.toString().trim();

      if (!title || !guild || !description) {
        setMessage("module-message", "Missing fields.", "error");
        return;
      }

      const { error } = await supabase.from("modules").insert({
        title,
        description,
        guild,
        created_by: currentUser.id,
        status: "pending"
      });

      setMessage("module-message", error ? error.message : "Module submitted for Arbiter approval.", error ? "error" : "success");
      if (!error) await initCuratorDashboard();
    });
  }

  root.querySelectorAll(".delete-module-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const moduleId = button.dataset.moduleId;
      const module = ownModules.find((item) => item.id === moduleId);
      if (!module || module.status === "approved") return;
      await supabase.from("enrollments").delete().eq("module_id", moduleId);
      await supabase.from("modules").delete().eq("id", moduleId).eq("created_by", currentUser.id);
      await initCuratorDashboard();
    });
  });
}

async function initArbiterDashboard() {
  const currentUser = await requireRole(["arbiter", "operator"]);
  if (!currentUser) return;

  const root = document.getElementById("dashboard-root");
  const [users, modules, portfolioEntries] = await Promise.all([fetchUsers(), fetchAllModules(), fetchPortfolioEntries()]);
  const allUsers = ensureRealUserMap(users);
  const pendingCurators = users.filter((user) => user.role === "curator" && !user.verified);
  const seekers = users.filter((user) => user.role === "seeker");
  const curators = users.filter((user) => user.role === "curator");
  const pendingModules = modules.filter((module) => module.status === "pending");
  const usersById = new Map(allUsers.map((user) => [user.id, user]));

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Arbiter Dashboard</p>
          <h1>${escapeHtml(displayUserName(currentUser))}</h1>
        </div>
        <p class="dashboard-meta">Arbiters review Curator status, approve or deny modules, and highlight exemplary portfolio work for discovery.</p>
      </header>
      ${renderNeoscorePieChart()}

      <section class="stats-grid">
        <article class="stat-card">
          <span class="section-label">Pending Curators</span>
          <strong>${pendingCurators.length}</strong>
        </article>
        <article class="stat-card">
          <span class="section-label">Pending Modules</span>
          <strong>${pendingModules.length}</strong>
        </article>
        <article class="stat-card">
          <span class="section-label">Portfolio Entries</span>
          <strong>${portfolioEntries.length}</strong>
        </article>
      </section>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Pending Curators</p>
          <h2>Verification controls</h2>
          <div class="record-list">
            ${
              pendingCurators.length
                ? pendingCurators
                    .map(
                      (user) => `
                        <article class="record-card">
                          <div class="card-header-row">
                            <h3>${escapeHtml(user.email || user.id)}</h3>
                            ${statusPill(user.verified ? "approved" : "pending")}
                          </div>
                          <form class="form-stack arbiter-curator-review" data-user-id="${user.id}">
                            <label>
                              Denial reason
                              <textarea name="reason"></textarea>
                            </label>
                            <div class="inline-actions">
                              <button class="btn btn-primary" type="submit" data-decision="approved">Approve Curator</button>
                              <button class="btn subtle-button" type="submit" data-decision="denied">Deny Curator</button>
                            </div>
                          </form>
                        </article>
                      `
                    )
                    .join("")
                : emptyCard("No pending Curators", "Curator verification requests appear here.")
            }
          </div>
        </article>

        <article class="card">
          <p class="section-label">Pending Modules</p>
          <h2>Academic quality review</h2>
          <div class="record-list">
            ${
              pendingModules.length
                ? pendingModules
                    .map(
                      (module) => `
                        <article class="record-card">
                          <div class="card-header-row">
                            <h3>${escapeHtml(module.title)}</h3>
                            ${statusPill(module.status)}
                          </div>
                          <p>${escapeHtml(module.description)}</p>
                          <p class="field-note">Guild: ${escapeHtml(module.guild)}</p>
                          <form class="form-stack arbiter-module-review" data-module-id="${module.id}">
                            <label>
                              Denial reason
                              <textarea name="reason"></textarea>
                            </label>
                            <div class="inline-actions">
                              <button class="btn btn-primary" type="submit" data-decision="approved">Approve module</button>
                              <button class="btn subtle-button" type="submit" data-decision="denied">Deny module</button>
                            </div>
                          </form>
                        </article>
                      `
                    )
                    .join("")
                : emptyCard("No pending modules", "Modules appear here until an Arbiter makes a decision.")
            }
          </div>
        </article>
      </section>

      <section class="card-grid">
        <article class="card" id="portfolio-review">
          <p class="section-label">Portfolio Review</p>
          <h2>Highlight scholarly work</h2>
          <div class="record-list">
            ${
              portfolioEntries.length
                ? portfolioEntries.map((entry) => portfolioCard(entry, currentUser, usersById, { allowHighlight: true })).join("")
                : emptyCard("No portfolio entries", "Seekers must create work before discovery can be curated.")
            }
          </div>
        </article>

        <article class="card">
          <p class="section-label">Platform Review</p>
          <h2>Users and modules</h2>
          <div class="record-list">
            ${
              seekers.length || curators.length || modules.length
                ? [
                    ...seekers.map(
                      (user) => `
                        <article class="record-card">
                          <div class="card-header-row">
                            <h3>${escapeHtml(user.email || user.id)}</h3>
                            ${statusPill("seeker")}
                          </div>
                          <p class="field-note">Role: Seeker</p>
                        </article>
                      `
                    ),
                    ...curators.map(
                      (user) => `
                        <article class="record-card">
                          <div class="card-header-row">
                            <h3>${escapeHtml(user.email || user.id)}</h3>
                            ${statusPill(user.verified ? "approved" : "pending")}
                          </div>
                          <p class="field-note">Role: Curator</p>
                        </article>
                      `
                    ),
                    ...modules.map((module) => moduleCard(module, usersById))
                  ].join("")
                : emptyCard("No records", "The Arbiter review surface remains empty until real accounts and work exist.")
            }
          </div>
        </article>
      </section>
    </section>
  `;

  root.querySelectorAll(".arbiter-curator-review").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const decision = event.submitter.dataset.decision;
      const targetUserId = form.dataset.userId;
      const reason = form.querySelector('textarea[name="reason"]')?.value.trim() || "";

      if (decision === "denied" && !reason) {
        alert("A denial reason is required.");
        return;
      }

      await supabase.from("users").update({ verified: decision === "approved" }).eq("id", targetUserId);
      await supabase.from("verification_reviews").insert({
        target_id: targetUserId,
        target_type: "user",
        status: decision,
        reason,
        reviewed_by: currentUser.id
      });
      await initArbiterDashboard();
    });
  });

  root.querySelectorAll(".arbiter-module-review").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const decision = event.submitter.dataset.decision;
      const moduleId = form.dataset.moduleId;
      const reason = form.querySelector('textarea[name="reason"]')?.value.trim() || "";

      if (decision === "denied" && !reason) {
        alert("A denial reason is required.");
        return;
      }

      await supabase
        .from("modules")
        .update({ status: decision, denial_reason: decision === "denied" ? reason : null })
        .eq("id", moduleId);

      await supabase.from("verification_reviews").insert({
        target_id: moduleId,
        target_type: "module",
        status: decision,
        reason,
        reviewed_by: currentUser.id
      });

      await initArbiterDashboard();
    });
  });

  root.querySelectorAll(".toggle-highlight-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const entryId = button.dataset.portfolioId;
      const entry = portfolioEntries.find((item) => item.id === entryId);
      if (!entry) return;

      if (entry.highlighted) {
        await supabase.from("highlights").delete().eq("entry_id", entryId);
      } else {
        await supabase.from("highlights").insert({ entry_id: entryId, approved_by: currentUser.id });
      }

      await initArbiterDashboard();
    });
  });
}

async function initGuildPage() {
  const currentUser = await requireRole(["seeker", "curator", "arbiter"]);
  if (!currentUser) return;

  const root = document.getElementById("guild-root");
  const params = new URLSearchParams(window.location.search);
  const selectedGuildId = params.get("id");
  const [modules, users, enrollments, guildRecords, guildMembers, guildOutputs, subjects, tags, tagLinks] = await Promise.all([
    fetchApprovedModules(),
    fetchUsers(),
    currentUser.role === "seeker" ? fetchEnrollmentsForUser(currentUser.id) : Promise.resolve([]),
    fetchGuildRecords(),
    fetchGuildMembers(),
    fetchGuildOutputs(),
    fetchSubjects(),
    fetchTags(),
    fetchTagLinks()
  ]);
  const allUsers = ensureRealUserMap(users);
  const usersById = new Map(allUsers.map((user) => [user.id, user]));
  const enrolledIds = new Set(enrollments.map((entry) => entry.module_id));

  const guildList = guildRecords.length
    ? guildRecords
    : guildCatalog.map((guild) => ({
        id: guild.slug,
        title: guild.name,
        description: guild.description,
        research_focus: guild.description,
        status: "open"
      }));
  const selectedGuild = guildList.find((guild) => String(guild.id) === String(selectedGuildId)) || null;

  if (!selectedGuild) {
      root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Guilds</p>
          <h1>Research Groups</h1>
        </div>
        ${currentUser.role !== "arbiter" ? `<button id="create-guild-button" class="btn btn-primary" type="button">Create Guild</button>` : ""}
      </header>

      <section class="record-list">
        ${guildList.length ? guildList.map(guild => {
          const membersList = guildMembers.filter(m => m.guild_id === guild.id);
          const tagsList = getEntityTags("guild", guild.id, tags, tagLinks);
          return `
            <article class="card record-card">
              <h3>${escapeHtml(guild.title || guild.name)}</h3>
              <p>${escapeHtml(guild.description || guild.research_focus || "No description")}</p>
              ${tagsList.length ? `<div class="tag-stack">${tagsList.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
              <div class="record-footer-spread">
                <p class="field-note">${membersList.length} Member${membersList.length === 1 ? "" : "s"}</p>
              </div>
              <footer><a class="btn subtle-button full-width-button" href="guild.html?id=${guild.id}">Open Guild</a></footer>
            </article>
          `;
        }).join("") : `<div class="empty-state"><p>No guilds yet.</p></div>`}
      </section>
    </section>
  `;


    document.getElementById("guild-create-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const title = form.get("title")?.toString().trim();
      const researchFocus = form.get("research_focus")?.toString().trim();
      const description = form.get("description")?.toString().trim();
      if (!title || !researchFocus || !description) {
        setMessage("guild-message", "Missing fields.", "error");
        return;
      }
      const { error } = await supabase.from("guilds").insert({
        title,
        description,
        research_focus: researchFocus,
        created_by: currentUser.id,
        status: "pending"
      });
      setMessage("guild-message", error ? error.message : "Guild submitted for review.", error ? "error" : "success");
      if (!error) await initGuildPage();
    });
    return;
  }

  const guildModules = modules.filter((module) => module.guild === (selectedGuild.title || selectedGuild.name));
  const selectedMembers = guildMembers.filter((member) => member.guild_id === selectedGuild.id);
  const selectedOutputs = guildOutputs.filter((output) => output.guild_id === selectedGuild.id);
  const isMember = selectedMembers.some((member) => member.user_id === currentUser.id);
  const relatedSubjects = subjects.filter((subject) =>
    `${selectedGuild.title || ""} ${selectedGuild.description || ""} ${selectedGuild.research_focus || ""}`
      .toLowerCase()
      .includes(String(subject.name || "").toLowerCase())
  );
  const guildTagNames = getEntityTags("guild", selectedGuild.id, tags, tagLinks);

  root.innerHTML = `
    <section class="guild-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Guild</p>
          <h1>${escapeHtml(selectedGuild.title || selectedGuild.name)}</h1>
        </div>
        <p class="dashboard-meta">${escapeHtml(selectedGuild.research_focus || selectedGuild.description || "No research focus yet.")}</p>
      </header>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Research Focus</p>
          <h2>Purpose and approach</h2>
          <p>${escapeHtml(selectedGuild.description || "No description yet.")}</p>
          ${renderTagPills(guildTagNames)}
          <div class="inline-actions">
            ${currentUser.role !== "arbiter" && !isMember && selectedGuild.id ? `<button class="btn btn-primary" id="join-guild-button" type="button">Join Guild</button>` : ""}
            ${currentUser.role !== "arbiter" && isMember && selectedGuild.id ? `<button class="btn subtle-button" id="leave-guild-button" type="button">Leave Guild</button>` : ""}
            <a class="btn subtle-button" href="guild.html">All guilds</a>
          </div>
          <p id="guild-membership-message" class="status-text" aria-live="polite"></p>
        </article>

        <article class="card">
          <p class="section-label">Related Subjects</p>
          <h2>Connected study domains</h2>
          <div class="record-list">
            ${
              relatedSubjects.length
                ? relatedSubjects
                    .map(
                      (subject) => `
                        <article class="record-card">
                          <h3>${escapeHtml(subject.name)}</h3>
                          <p>${escapeHtml(subject.description || "No description yet.")}</p>
                          <footer><a class="text-link" href="subjects.html?id=${subject.id}">Open subject</a></footer>
                        </article>
                      `
                    )
                    .join("")
                : emptyCard("No linked subjects yet", "Subject connections will appear here as the academic map deepens.")
            }
          </div>
        </article>
      </section>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Members</p>
          <h2>Research community</h2>
          <div class="record-list">
            ${
              selectedMembers.length
                ? selectedMembers
                    .map(
                      (member) => `
                        <article class="record-card">
                          <h3>${escapeHtml(displayUserName(usersById.get(member.user_id)))}</h3>
                          <p class="field-note">${escapeHtml(member.role || "member")}</p>
                        </article>
                      `
                    )
                    .join("")
                : emptyCard("No members yet", "The first collaborators will appear here.")
            }
          </div>
        </article>

        <article class="card">
          <p class="section-label">Guild Outputs</p>
          <h2>Research record</h2>
          <div class="record-list">
            ${
              selectedOutputs.length
                ? selectedOutputs
                    .map(
                      (output) => `
                        <article class="record-card">
                          <div class="card-header-row">
                            <h3>${escapeHtml(output.title)}</h3>
                            ${statusPill(output.status || output.review_status || "pending")}
                          </div>
                          <p>${escapeHtml(output.description || "No description yet.")}</p>
                          ${(output.submission_link || output.link) ? `<p><a class="text-link" href="${escapeHtml(output.submission_link || output.link)}" target="_blank" rel="noreferrer">Open submission</a></p>` : ""}
                        </article>
                      `
                    )
                    .join("")
                : emptyCard("No outputs yet", "Research outputs and documentation will appear here once submitted.")
            }
          </div>
        </article>
      </section>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Module Links</p>
          <h2>Structured learning inside this guild</h2>
          <div class="record-list">
            ${
              guildModules.length
                ? guildModules.map((module) => moduleCard(module, usersById, { allowEnroll: currentUser.role === "seeker", alreadyEnrolledIds: enrolledIds })).join("")
                : emptyCard("No approved modules", "Guild pages display modules only after Arbiter approval.")
            }
          </div>
        </article>

        <article id="nodes-directory" class="card">
          <p class="section-label">Curator Insight</p>
          <h2>Approved guides</h2>
          <div class="record-list">
            ${
              users.filter((user) => user.role === "curator" && user.verified).length
                ? users
                    .filter((user) => user.role === "curator" && user.verified)
                    .map(
                      (user) => `
                        <article class="record-card">
                          <h3>${escapeHtml(displayUserName(user))}</h3>
                          <p class="field-note">Approved curator within the learning network.</p>
                        </article>
                      `
                    )
                    .join("")
                : emptyCard("No approved Curators", "Approved Curators aligned to this guild will appear here.")
            }
          </div>
        </article>
      </section>
    </section>
  `;

  document.getElementById("join-guild-button")?.addEventListener("click", async () => {
    const { error } = await supabase.from("guild_members").insert({
      guild_id: selectedGuild.id,
      user_id: currentUser.id,
      role: currentUser.role === "curator" ? "mentor" : "member"
    });
    setMessage("guild-membership-message", error ? error.message : "Guild joined.", error ? "error" : "success");
    if (!error) await initGuildPage();
  });

  document.getElementById("leave-guild-button")?.addEventListener("click", async () => {
    const { error } = await supabase.from("guild_members").delete().eq("guild_id", selectedGuild.id).eq("user_id", currentUser.id);
    setMessage("guild-membership-message", error ? error.message : "Guild left.", error ? "error" : "success");
    if (!error) await initGuildPage();
  });

  root.querySelectorAll(".enroll-button").forEach((button) => {
    button.addEventListener("click", async () => {
      if (currentUser.role !== "seeker") return;
      const moduleId = button.dataset.moduleId;
      const { data: existing } = await supabase
        .from("enrollments")
        .select("id")
        .eq("student_id", currentUser.id)
        .eq("module_id", moduleId)
        .maybeSingle();

      if (!existing) {
        await supabase.from("enrollments").insert({ student_id: currentUser.id, module_id: moduleId });
      }
      await initGuildPage();
    });
  });
}

async function initModulePage() {
  const currentUser = await requireRole(["seeker", "curator", "arbiter", "operator"]);
  if (!currentUser) return;

  const root = document.getElementById("module-root");
  const params = new URLSearchParams(window.location.search);
  const moduleId = params.get("id");

  const { data, error } = await supabase.from("modules").select("*").eq("id", moduleId).maybeSingle();
  if (error || !data) {
    root.innerHTML = `<section class="module-shell">${emptyCard("Module not found", "Select a module from the guild directory after it has been created.")}</section>`;
    return;
  }

  const module = mapModule(data);
  const users = await fetchUsers();
  const allUsers = ensureRealUserMap(users);
  const owner = allUsers.find((user) => user.id === module.createdBy);
  const canView =
    currentUser.role === "arbiter" ||
    isOperator(currentUser) ||
    (currentUser.role === "curator" && currentUser.id === module.createdBy) ||
    (currentUser.role === "seeker" && module.status === "approved" && owner?.verified);

  if (!canView) {
    root.innerHTML = `<section class="module-shell">${emptyCard("Module unavailable", "Seekers can only view approved modules from approved Curators.")}</section>`;
    return;
  }

  const { count } = await supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("module_id", module.id);

  root.innerHTML = `
    <section class="module-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">${escapeHtml(module.guild)}</p>
          <h1>${escapeHtml(module.title)}</h1>
        </div>
        <div class="dashboard-meta">
          <p>Created by ${escapeHtml(displayUserName(owner))}</p>
          ${statusPill(module.status)}
        </div>
      </header>

      <section class="two-column">
        <article class="card">
          <p class="section-label">Description</p>
          <h2>Learning pathway</h2>
          <p>${escapeHtml(module.description)}</p>
        </article>
        <article class="card">
          <p class="section-label">Review State</p>
          <h2>Module status</h2>
          <p>Status: ${escapeHtml(module.status)}</p>
          ${
            module.denialReason
              ? `<p class="denial-note">Module denied: ${escapeHtml(module.denialReason)}</p>`
              : `<p class="field-note">${count || 0} enrollment${count === 1 ? "" : "s"}</p>`
          }
        </article>
      </section>
    </section>
  `;
}

async function initDiscoveryPage() {
  const currentUser = await requireRole(["seeker", "curator", "arbiter", "operator"]);
  if (!currentUser) return;

  const root = document.getElementById("discovery-root");
  const [entries, users] = await Promise.all([fetchHighlightedEntries(), fetchUsers()]);
  const usersById = new Map(ensureRealUserMap(users).map((user) => [user.id, user]));

    root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Discovery</p>
          <h1>Academic Feed</h1>
        </div>
        <a class="btn btn-primary" href="profile.html#portfolio">Create entry</a>
      </header>

      <section class="feed-list">
        ${
          entries.length
            ? entries.map(entry => {
                const author = usersById.get(entry.createdBy);
                const role = author ? author.role : "Unknown";
                return `
                  <article class="card record-card feed-card">
                    <div class="card-header-row">
                      <h3>${escapeHtml(entry.title)}</h3>
                      <span class="pill">${escapeHtml(role)}</span>
                    </div>
                    ${entry.tags && entry.tags.length ? `<div class="tag-stack">${entry.tags.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
                    <p>${escapeHtml(entry.description || "No preview available.")}</p>
                    <div class="feed-meta">
                      <span>By ${escapeHtml(displayUserName(author))}</span>
                      <span>•</span>
                      <span>${formatDate(entry.created_at)}</span>
                    </div>
                  </article>
                `;
              }).join("")
            : `<div class="empty-state"><p>No highlighted scholarly work yet.</p></div>`
        }
      </section>
    </section>
  `;
}

async function initResearchPage() {
  const currentUser = await requireRole(["seeker", "curator", "arbiter"]);
  if (!currentUser) return;

  const root = document.getElementById("research-root");
  if (!root) return;

  const [posts, subjects, guilds, tags, tagLinks] = await Promise.all([
    fetchResearchPosts(),
    fetchSubjects(),
    fetchGuildRecords(),
    fetchTags(),
    fetchTagLinks()
  ]);

  const tagOptions = computeTagFilterOptions(tags, tagLinks, "research_post");

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Research Feed</p>
          <h1>Academic discussion and documentation</h1>
        </div>
        <p class="dashboard-meta">This is the shared intellectual exchange space for questions, documentation, research notes, and curated links. The tone remains scholarly rather than casual.</p>
      </header>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Create Post</p>
          <h2>Publish research notes</h2>
          <form id="research-form" class="form-stack">
            <label>Title<input name="title" type="text" required /></label>
            <label>Body<textarea name="body" required></textarea></label>
            <label>Tags<input name="tags" type="text" placeholder="philosophy, design, ecology" /></label>
            <label>Related subject
              <select name="subject_id">
                <option value="">None</option>
                ${subjects.map((subject) => `<option value="${subject.id}">${escapeHtml(subject.name)}</option>`).join("")}
              </select>
            </label>
            <label>Related guild
              <select name="guild_id">
                <option value="">None</option>
                ${guilds.map((guild) => `<option value="${guild.id}">${escapeHtml(guild.title || guild.name)}</option>`).join("")}
              </select>
            </label>
            <button class="btn btn-primary" type="submit">Publish post</button>
          </form>
          <p id="research-message" class="status-text" aria-live="polite"></p>
        </article>

        <article class="card">
          <p class="section-label">Filter</p>
          <h2>Find by tag</h2>
          <div class="inline-actions">
            <button class="btn subtle-button research-filter-button" type="button" data-tag="">All</button>
            ${tagOptions.map((tag) => `<button class="btn subtle-button research-filter-button" type="button" data-tag="${escapeHtml(tag.name)}">${escapeHtml(tag.name)}</button>`).join("")}
          </div>
        </article>
      </section>

      <section class="card">
        <p class="section-label">Current Feed</p>
        <h2>Posts and learning notes</h2>
        <div id="research-feed-list" class="record-list">
          ${
            posts.length
              ? posts
                  .map(
                    (post) => `
                      <article class="record-card research-post-card" data-tags="${escapeHtml((getEntityTags("research_post", post.id, tags, tagLinks) || post.tags || []).join(","))}">
                        <p class="section-label">${formatDate(post.created_at)}</p>
                        <h3>${escapeHtml(post.title)}</h3>
                        <p>${escapeHtml(post.body || "")}</p>
                        ${renderTagPills(getEntityTags("research_post", post.id, tags, tagLinks) || post.tags || [])}
                        <footer class="inline-actions">
                          <span class="pill">Upvotes: ${Number(post.upvotes || 0)}</span>
                          <span class="pill">Saved: ${Number(post.saves || 0)}</span>
                        </footer>
                      </article>
                    `
                  )
                  .join("")
              : emptyCard("No research posts yet", "Create the first research post once the research_posts table is available in Supabase.")
          }
        </div>
      </section>
    </section>
  `;

  document.getElementById("research-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title")?.toString().trim();
    const body = form.get("body")?.toString().trim();
    const subjectId = form.get("subject_id")?.toString().trim();
    const guildId = form.get("guild_id")?.toString().trim();
    const rawTags = form.get("tags")?.toString().trim();

    if (!title || !body) {
      setMessage("research-message", "Missing fields.", "error");
      return;
    }

    const { error } = await supabase.from("research_posts").insert({
      user_id: currentUser.id,
      title,
      body,
      subject_id: subjectId || null,
      guild_id: guildId || null
    });
    setMessage("research-message", error ? error.message : "Research post published.", error ? "error" : "success");
    if (!error && rawTags) {
      await initResearchPage();
    }
  });

  root.querySelectorAll(".research-filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.dataset.tag;
      root.querySelectorAll(".research-post-card").forEach((card) => {
        const tagsValue = card.dataset.tags || "";
        card.classList.toggle("hidden", tag && !tagsValue.split(",").includes(tag));
      });
    });
  });
}

async function initStudiosPage() {
  const currentUser = await requireRole(["seeker", "curator", "arbiter"]);
  if (!currentUser) return;

  const root = document.getElementById("studios-root");
  if (!root) return;

  const [studios, requests] = await Promise.all([fetchStudios(), fetchStudioRequests()]);
  const ownRequests = requests.filter((request) => request.user_id === currentUser.id);

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Studios</p>
          <h1>Capability environments</h1>
        </div>
        <p class="dashboard-meta">Studios are capability spaces for advanced practice. They can represent engineering, craft, language, performance, science, architecture, and more.</p>
      </header>

      <section class="card">
        <p class="section-label">Studios Near You</p>
        <h2>Interactive learning map coming soon</h2>
        <p>This future map will connect studios, lodges, atheneums, and coliseums across a larger learning geography.</p>
      </section>

      <section class="guild-list">
        ${
          studios.length
            ? studios
                .map((studio) => {
                  const request = ownRequests.find((item) => item.studio_id === studio.id);
                  return `
                    <article class="card guild-card">
                      <p class="section-label">${escapeHtml(studio.category || "Studio")}</p>
                      <h2>${escapeHtml(studio.name)}</h2>
                      <p>${escapeHtml(studio.description || "No description yet.")}</p>
                      <p class="field-note">Token requirement: ${escapeHtml(studio.token_requirement || 0)}</p>
                      <p class="field-note">Required level: ${escapeHtml(studio.required_level || "Developing")}</p>
                      ${
                        currentUser.role === "seeker"
                          ? request
                            ? `<p class="field-note">Request status: ${escapeHtml(request.status)}${request.arbiter_notes ? ` · ${escapeHtml(request.arbiter_notes)}` : ""}</p>`
                            : `<button class="btn btn-primary studio-request-button" type="button" data-studio-id="${studio.id}">Request Access</button>`
                          : ""
                      }
                    </article>
                  `;
                })
                .join("")
            : emptyCard("No studios yet", "Studios appear here once the studios table is available and populated.")
        }
      </section>
      <p id="studio-message" class="status-text" aria-live="polite"></p>
    </section>
  `;

  root.querySelectorAll(".studio-request-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const { error } = await supabase.from("studio_requests").insert({
        user_id: currentUser.id,
        studio_id: button.dataset.studioId,
        status: "pending"
      });
      setMessage("studio-message", error ? error.message : "Studio access request submitted.", error ? "error" : "success");
      if (!error) await initStudiosPage();
    });
  });
}

async function initProfilePage() {
  const currentUser = await requireRole(["seeker", "curator", "arbiter"]);
  if (!currentUser) return;

  const root = document.getElementById("profile-root");
  if (!root) return;

  const [entries, nicheEntries, guilds, guildMembers, neoscores, tags, tagLinks, modules, enrollments] = await Promise.all([
    fetchPortfolioEntries(),
    fetchNicheEntries(),
    fetchGuildRecords(),
    fetchGuildMembers(),
    fetchNeoscores(),
    fetchTags(),
    fetchTagLinks(),
    fetchApprovedModules(),
    fetchEnrollmentsForUser(currentUser.id).catch(() => [])
  ]);
  const ownEntries = entries.filter((entry) => entry.createdBy === currentUser.id);
  const ownNotes = nicheEntries.filter((entry) => entry.createdBy === currentUser.id);
  const ownGuilds = guilds.filter((guild) => guildMembers.some((member) => member.guild_id === guild.id && member.user_id === currentUser.id));
  const enrolledModules = modules.filter((module) => enrollments.some((entry) => entry.module_id === module.id));
  const score = getNeoscoreForUser(neoscores, currentUser.id);
  const interestTags = [...new Set(ownNotes.map((entry) => entry.topic.toLowerCase()))];

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Profile</p>
          <h1>${escapeHtml(displayUserName(currentUser))}</h1>
        </div>
        <p class="dashboard-meta">Your profile gathers your learning record, interests, guild participation, and broader academic direction into one place.</p>
      </header>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Identity</p>
          <h2>Bio and goals</h2>
          <p>${escapeHtml(currentUser.bio || "No biography yet. This profile will grow as identity and work become clearer.")}</p>
          <p class="field-note">Research goals: ${escapeHtml(currentUser.research_goals || "Not yet set")}</p>
          <p class="field-note">Learning philosophy: ${escapeHtml(currentUser.learning_philosophy || "Still forming")}</p>
        </article>

        <article class="card">
          <p class="section-label">Interests</p>
          <h2>Tags of interest</h2>
          ${renderTagPills(interestTags)}
          <div class="record-list">
            ${
              ownNotes.length
                ? ownNotes.slice(0, 4).map((entry) => `<article class="record-card"><h3>${escapeHtml(entry.topic)}</h3><p>${escapeHtml(entry.notes)}</p></article>`).join("")
                : emptyCard("No interests yet", "Subject notes and interests will appear here.")
            }
          </div>
        </article>
      </section>

      <section class="card-grid">
        <article class="card" id="portfolio">
          <p class="section-label">Portfolio</p>
          <h2>Published and private work</h2>
          <div class="record-list">
            ${
              ownEntries.length
                ? ownEntries.map((entry) => `<article class="record-card"><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.description || "")}</p><p class="field-note">${escapeHtml(entry.visibility || "private")}</p></article>`).join("")
                : emptyCard("No portfolio entries", "Portfolio work appears here once created.")
            }
          </div>
        </article>

        <article class="card">
          <p class="section-label">Guild Participation</p>
          <h2>Current collaborations</h2>
          <div class="record-list">
            ${
              ownGuilds.length
                ? ownGuilds.map((guild) => `<article class="record-card"><h3>${escapeHtml(guild.title || guild.name)}</h3><p>${escapeHtml(guild.description || guild.research_focus || "")}</p></article>`).join("")
                : emptyCard("No guilds joined yet", "Guild participation will appear here once you enter research communities.")
            }
          </div>
        </article>
      </section>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Neoscore</p>
          <h2>Holistic evaluation</h2>
          ${neoscoreSummary(score)}
        </article>

        <article class="card">
          <p class="section-label">Subject Enrollment</p>
          <h2>Current study</h2>
          <div class="record-list">
            ${
              enrolledModules.length
                ? enrolledModules.map((module) => `<article class="record-card"><h3>${escapeHtml(module.title)}</h3><p>${escapeHtml(module.guild)}</p></article>`).join("")
                : emptyCard("No active enrollments", "Approved modules you join will appear here.")
            }
          </div>
        </article>
      </section>
    </section>
  `;
}

async function initHelpPage() {
  const currentUser = await getCurrentUserProfile();

  const root = document.getElementById("help-root");
  if (!root) return;

  const helpCards = [
    { title: "First Day", body: "If you are new, open Dashboard first, then Subjects. Choose one subject, enroll in one module, and add one portfolio entry before trying to use every page." },
    { title: "Dashboard", body: "Your dashboard is your live overview. It shows progress, recent activity, current study, and what to do next so you do not have to guess." },
    { title: "Subjects", body: "Subjects are structured learning domains. Use them to understand what is studied, how it is approached, and what kind of work is expected." },
    { title: "Guilds", body: "Guilds are collaborative research collectives. Join them when you want to investigate with others and produce deeper research outputs." },
    { title: "Portfolio", body: "The portfolio is your main academic record. Put your essays, designs, projects, reflections, and documented work here." },
    { title: "Research", body: "Research is the academic posting area. Use it for notes, questions, documentation, references, and careful intellectual discussion rather than casual chatting." },
    { title: "Studios", body: "Studios are capability environments. Some may require tokens or review. Request access only when you are ready for deeper practice." },
    { title: "Discovery", body: "Discovery is a journal-like showcase of highlighted work. It is meant for serious reading, not social-media scrolling." },
    { title: "Language", body: "Use the language selector in the header or on the homepage to switch the interface directly. The platform now uses manual UI translations so key terminology stays clear." },
    { title: "Nearby Modules", body: "Use the Near Me button in the header to save your location. Then search for modules and the closest available locations will appear first when location data exists." },
    { title: "Vision", body: "Vision explains the wider philosophy, infrastructure, and long-term educational direction behind the platform." },
    { title: "Profile", body: "Your profile gathers your identity, interests, guild participation, portfolio record, and broader learning direction in one calm place." }
  ];

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Help</p>
          <h1>Guidance inside the platform</h1>
        </div>
        <p class="dashboard-meta">Use this page whenever you need to understand where to go next or what each area of the platform is meant to do.</p>
      </header>

      <section class="card">
        <p class="section-label">Query</p>
        <h2>What do you need help with?</h2>
        <label class="filters">
          Search guidance
          <input id="help-search-input" type="search" placeholder="subjects, guilds, portfolio, research..." />
        </label>
      </section>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Simple Path</p>
          <h2>Use Neofolk in this order</h2>
          <div class="record-list">
            <article class="record-card"><h3>1. Dashboard</h3><p>See your current status and what should be done next.</p></article>
            <article class="record-card"><h3>2. Subjects</h3><p>Find one area of study and enroll in a module.</p></article>
            <article class="record-card"><h3>3. Portfolio</h3><p>Record the work you produce so your learning is visible.</p></article>
            <article class="record-card"><h3>4. Guilds and Research</h3><p>Move into deeper inquiry once you have direction.</p></article>
          </div>
        </article>

        <article class="card">
          <p class="section-label">Language & Access</p>
          <h2>India-first support</h2>
          <p>The header includes a direct language selector, and the homepage shows the same control before login or signup. The interface now uses manual translation files so core academic terms remain clear and consistent.</p>
        </article>
      </section>

      <section id="help-card-list" class="card-grid">
        ${helpCards
          .map(
            (card) => `
              <article class="card help-card" data-help-text="${escapeHtml(`${card.title} ${card.body}`.toLowerCase())}">
                <p class="section-label">${escapeHtml(card.title)}</p>
                <h2>${escapeHtml(card.title)}</h2>
                <p>${escapeHtml(card.body)}</p>
              </article>
            `
          )
          .join("")}
      </section>
    </section>
  `;

  document.getElementById("help-search-input")?.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    root.querySelectorAll(".help-card").forEach((card) => {
      card.classList.toggle("hidden", query && !card.dataset.helpText.includes(query));
    });
  });
}

async function initDictionaryPage() {
  const root = document.getElementById("dictionary-root");
  if (!root) return;

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">${escapeHtml(t("dictionary.kicker"))}</p>
          <h1>${escapeHtml(t("dictionary.title"))}</h1>
        </div>
        <p class="dashboard-meta">${escapeHtml(t("dictionary.subtitle"))}</p>
      </header>

      <section class="card">
        <p class="section-label">${escapeHtml(t("dictionary.searchLabel"))}</p>
        <h2>${escapeHtml(t("dictionary.searchTitle"))}</h2>
        <label class="filters">
          ${escapeHtml(t("dictionary.searchPrompt"))}
          <input id="dictionary-search-input" type="search" placeholder="${escapeHtml(t("dictionary.searchPlaceholder"))}" />
        </label>
      </section>

      <section id="dictionary-card-list" class="card-grid">
        ${dictionaryTerms
          .map(
            (term) => `
              <article class="card dictionary-card" data-dictionary-text="${escapeHtml(`${t(`terms.${term}.label`)} ${t(`terms.${term}.simple`)} ${t(`terms.${term}.expanded`)} ${t(`terms.${term}.example`)}`.toLowerCase())}">
                <p class="section-label">${escapeHtml(t(`terms.${term}.label`))}</p>
                <h2>${escapeHtml(t(`terms.${term}.label`))}</h2>
                <p><strong>${escapeHtml(t("dictionary.simpleMeaning"))}</strong> ${escapeHtml(t(`terms.${term}.simple`))}</p>
                <p><strong>${escapeHtml(t("dictionary.expandedMeaning"))}</strong> ${escapeHtml(t(`terms.${term}.expanded`))}</p>
                <p class="field-note">${escapeHtml(t("dictionary.exampleUse"))}: ${escapeHtml(t(`terms.${term}.example`))}</p>
              </article>
            `
          )
          .join("")}
      </section>
    </section>
  `;

  document.getElementById("dictionary-search-input")?.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    root.querySelectorAll(".dictionary-card").forEach((card) => {
      card.classList.toggle("hidden", query && !card.dataset.dictionaryText.includes(query));
    });
  });
}

async function initSubjectsPage() {
  const currentUser = await getCurrentUserProfile();

  const root = document.getElementById("subjects-root");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const subjectId = params.get("id");

  const [subjects, modules, users, guilds, tags, tagLinks] = await Promise.all([
    fetchSubjects().catch(() => []),
    fetchApprovedModules(),
    fetchUsers(),
    fetchGuildRecords(),
    fetchTags(),
    fetchTagLinks()
  ]);

  const subjectList = subjects.length
    ? subjects
    : guildCatalog.map((guild) => ({
        id: guild.slug,
        name: guild.name,
        description: guild.description,
        category: "Subject"
      }));
  const subject = subjectList.find((item) => String(item.id) === String(subjectId)) || null;
  const usersById = new Map(users.map((user) => [user.id, user]));

  if (subject) {
    const relatedModules = modules.filter((module) => module.guild === subject.name);
    const relatedGuilds = guilds.filter((guild) => `${guild.title || ""} ${guild.description || ""}`.toLowerCase().includes(String(subject.name || "").toLowerCase()));
    const subjectTags = getEntityTags("subject", subject.id, tags, tagLinks);
    const curatorIds = [...new Set(relatedModules.map((module) => module.createdBy))];
    const curators = curatorIds.map((id) => usersById.get(id)).filter(Boolean);

    root.innerHTML = `
      <section class="dashboard-shell">
        <header class="dashboard-header">
          <div>
            <p class="section-label">${escapeHtml(subject.category || "Subject")}</p>
            <h1>${escapeHtml(subject.name)}</h1>
          </div>
          <p class="dashboard-meta">${escapeHtml(subject.description || "No description yet.")}</p>
        </header>

        <section class="card-grid">
          <article class="card">
            <p class="section-label">Learning Approach</p>
            <h2>How this subject is approached</h2>
            <p>${escapeHtml(subject.learning_approach || "Through guided reading, portfolio evidence, and disciplined subject familiarity.")}</p>
            ${renderTagPills(subjectTags)}
            <div class="inline-actions">
              ${currentUser?.role === "seeker" ? `<button class="btn btn-primary" id="subject-interest-button" type="button">Tag Interest</button>` : ""}
              <a class="btn subtle-button" href="subjects.html">Back to subjects</a>
            </div>
            <p id="subject-message" class="status-text" aria-live="polite"></p>
          </article>

          <article class="card">
            <p class="section-label">Expected Outcomes</p>
            <h2>What learners produce</h2>
            <p>${escapeHtml(subject.expected_outcomes || "Essays, documentation, reflective work, and clear evidence of understanding rather than only exam performance.")}</p>
          </article>
        </section>

        <section class="card-grid">
          <article class="card">
            <p class="section-label">Related Guilds</p>
            <h2>Research directions</h2>
            <div class="record-list">
              ${
                relatedGuilds.length
                  ? relatedGuilds
                      .map(
                        (guild) => `
                          <article class="record-card">
                            <h3>${escapeHtml(guild.title || guild.name)}</h3>
                            <p>${escapeHtml(guild.description || guild.research_focus || "No research focus yet.")}</p>
                            <footer><a class="text-link" href="${guild.id ? `guild.html?id=${guild.id}` : "guild.html"}">Open guild</a></footer>
                          </article>
                        `
                      )
                      .join("")
                  : emptyCard("No related guilds yet", "Guild suggestions become clearer as research records are added.")
              }
            </div>
          </article>

          <article class="card">
            <p class="section-label">Curator Profiles</p>
            <h2>Who is guiding this area</h2>
            <div class="record-list">
              ${
                curators.length
                  ? curators
                      .map(
                        (user) => `
                          <article class="record-card">
                            <h3>${escapeHtml(displayUserName(user))}</h3>
                            <p class="field-note">Curator aligned with ${escapeHtml(subject.name)}</p>
                          </article>
                        `
                      )
                      .join("")
                  : emptyCard("No curators yet", "Curator profiles appear once approved modules exist in this subject.")
              }
            </div>
          </article>
        </section>

        <section class="card">
          <p class="section-label">Available Modules</p>
          <h2>Structured study path</h2>
          <div class="record-list">
            ${
              relatedModules.length
                ? relatedModules.map((module) => moduleCard(module, usersById, { allowEnroll: currentUser?.role === "seeker" })).join("")
                : emptyCard("No approved modules", "This subject has not yet received approved modules.")
            }
          </div>
        </section>
      </section>
    `;

    document.getElementById("subject-interest-button")?.addEventListener("click", async () => {
      if (!currentUser) {
        window.location.href = "index.html#auth-area";
        return;
      }
      const { error } = await supabase.from("niche_entries").insert({
        user_id: currentUser.id,
        interest: subject.name,
        notes: `Interested in ${subject.name}`
      });
      setMessage("subject-message", error ? error.message : "Subject interest saved to your notes.", error ? "error" : "success");
    });

    root.querySelectorAll(".enroll-button").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!currentUser) {
          window.location.href = "index.html#auth-area";
          return;
        }
        const moduleId = button.dataset.moduleId;
        const { data: existing } = await supabase.from("enrollments").select("id").eq("student_id", currentUser.id).eq("module_id", moduleId).maybeSingle();
        if (!existing) {
          await supabase.from("enrollments").insert({ student_id: currentUser.id, module_id: moduleId });
        }
        await initSubjectsPage();
      });
    });
    return;
  }

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Subjects</p>
          <h1>Experiential domains</h1>
        </div>
        <p class="dashboard-meta">Subjects organize structured study. Guilds remain the collaborative inquiry layer of the Atlas.</p>
      </header>

      <section class="guild-list">
        ${subjectList
          .map((subject) => {
            const subjectModules = modules.filter((module) => module.guild === subject.name);
            return `
              <article class="card guild-card">
                <p class="section-label">${escapeHtml(subject.category || "Subject")}</p>
                <h2>${escapeHtml(subject.name)}</h2>
                <p>${escapeHtml(subject.description || "No description yet.")}</p>
                <p class="field-note">${subjectModules.length} approved module${subjectModules.length === 1 ? "" : "s"} available</p>
                ${renderTagPills(getEntityTags("subject", subject.id, tags, tagLinks))}
                <footer><a class="text-link" href="subjects.html?id=${subject.id}">Open subject</a></footer>
              </article>
            `;
          })
          .join("")}
      </section>
    </section>
  `;
}

async function initOperatorDashboard() {
  const currentUser = await requireRole([operatorRole]);
  if (!currentUser || !isOperator(currentUser)) return;

  const root = document.getElementById("operator-root");
  if (!root) return;

  const [users, modules, portfolioEntries] = await Promise.all([
    fetchUsers(),
    fetchAllModules(),
    fetchPortfolioEntries()
  ]);

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Operator Console</p>
          <h1>Universal access</h1>
        </div>
        <p class="dashboard-meta">The operator surface sits above standard review roles and provides a clean system overview across people, modules, portfolios, and navigation paths.</p>
      </header>
      ${renderNeoscorePieChart()}

      <section class="stats-grid">
        <article class="stat-card">
          <span class="section-label">Users</span>
          <strong>${users.length}</strong>
        </article>
        <article class="stat-card">
          <span class="section-label">Modules</span>
          <strong>${modules.length}</strong>
        </article>
        <article class="stat-card">
          <span class="section-label">Portfolio Entries</span>
          <strong>${portfolioEntries.length}</strong>
        </article>
      </section>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Role Surfaces</p>
          <h2>Enter any operational view</h2>
          <div class="inline-actions">
            <a class="btn btn-primary" href="seeker-dashboard.html">Seeker</a>
            <a class="btn" href="curator-dashboard.html">Curator</a>
            <a class="btn" href="arbiter-dashboard.html">Arbiter</a>
          </div>
        </article>

        <article class="card">
          <p class="section-label">Structure</p>
          <h2>Navigate the system</h2>
          <div class="inline-actions">
            <a class="btn btn-primary" href="subjects.html">Subjects</a>
            <a class="btn" href="guild.html">Guilds</a>
            <a class="btn" href="vision.html">Vision</a>
            <a class="btn" href="discovery.html">Discovery</a>
          </div>
        </article>
      </section>

      <section class="card">
        <p class="section-label">Recent Accounts</p>
        <h2>Current users in the system</h2>
        <div class="record-list">
          ${
            users.length
              ? users
                  .slice(0, 10)
                  .map(
                    (user) => `
                      <article class="record-card">
                        <div class="card-header-row">
                          <h3>${escapeHtml(displayUserName(user))}</h3>
                          ${statusPill(user.role)}
                        </div>
                        <p class="field-note">${user.verified ? "Verified" : "Pending review"}</p>
                      </article>
                    `
                  )
                  .join("")
              : emptyCard("No users yet", "Accounts created through Supabase Auth will appear here once the profile row is inserted.")
          }
        </div>
      </section>
    </section>
  `;
}

async function init() {
  try {
    ensureSiteBranding();
    ensureLanguageFonts();
    await applyLanguagePreference(getPreferredLanguage(), { silent: true });

    const currentUser = await getCurrentUserProfile();
    const page = getCurrentPage();
    const isDashboardPage = ["seeker-dashboard", "curator-dashboard", "arbiter-dashboard", "operator-dashboard"].includes(page);
    document.body.classList.toggle("dashboard-page", isDashboardPage);
    renderVersionBadges();
    renderNav(currentUser);
    if (currentUser && page !== "home" && page !== "reset-password") {
      renderWorkspaceToolbar(currentUser);
    }
    renderReflectionOverlay();
    if (page === "home") await renderHomePage();
    if (page === "research") await initResearchPage();
    if (page === "studios") await initStudiosPage();
    if (page === "profile") await initProfilePage();
    if (page === "help") await initHelpPage();
    if (page === "dictionary") await initDictionaryPage();
    if (page === "subjects") await initSubjectsPage();
    if (page === "seeker-dashboard") await initSeekerDashboard();
    if (page === "curator-dashboard") await initCuratorDashboard();
    if (page === "arbiter-dashboard") await initArbiterDashboard();
    if (page === "operator-dashboard") await initOperatorDashboard();
    if (page === "guild") await initGuildPage();
    if (page === "module") await initModulePage();
    if (page === "discovery") await initDiscoveryPage();
    if (page === "reset-password") await initResetPasswordPage();

    if (currentUser && page !== "home" && page !== "reset-password") {
      window.setTimeout(() => renderOnboarding(currentUser), 120);
    }
  } catch (error) {
    console.error(error);
    const root =
      document.getElementById("dashboard-root") ||
      document.getElementById("research-root") ||
      document.getElementById("studios-root") ||
      document.getElementById("profile-root") ||
      document.getElementById("help-root") ||
      document.getElementById("dictionary-root") ||
      document.getElementById("subjects-root") ||
      document.getElementById("operator-root") ||
      document.getElementById("guild-root") ||
      document.getElementById("module-root") ||
      document.getElementById("discovery-root") ||
      document.getElementById("reset-root");

    if (root) {
      root.innerHTML = emptyCard("Connection error", error.message || "Supabase could not load the application data.");
    }

    setMessage("signup-message", error.message || "Connection error.", "error");
    setMessage("login-message", error.message || "Connection error.", "error");
  }
}

document.addEventListener("DOMContentLoaded", init);
