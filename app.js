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
  reflectionIndex: "neofolk.reflectionIndex"
};

const appVersion = "v0.6.2 Alpha";
const operatorRole = "operator";

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

function setDemoOnlyMessage(elementId = "demo-message") {
  setMessage(elementId, "Demo profiles are preview-only. Use a real account to create or change data.", "success");
}

function isOperator(user) {
  return user?.role === operatorRole;
}

function displayUserName(user) {
  if (!user) return "Unknown";
  if (isOperator(user)) return "Operator";
  return user.email || user.id;
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
    highlighted: Boolean(entry.highlights?.length)
  };
}

function mapNiche(entry) {
  return {
    ...entry,
    createdBy: entry.user_id,
    topic: entry.interest
  };
}

function authErrorMessage(error) {
  const message = error?.message || "";
  if (/already registered|already exists|duplicate/i.test(message)) return "Email already exists.";
  if (/email not confirmed/i.test(message)) return "Unverified email. Please confirm your email first.";
  if (/invalid login credentials|invalid credentials/i.test(message)) return "Incorrect password.";
  return message || "Authentication failed.";
}

async function getCurrentUserProfile() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", authData.user.id).maybeSingle();
  if (profileError || !profile) return null;

  return normalizeProfile(profile, authData.user);
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

  if (!currentUser) {
    nav.innerHTML = "";
    return;
  }

  const dashboardHref = getDashboardPath(currentUser.role);
  const portfolioHref = currentUser.role === "arbiter" ? `${dashboardHref}#portfolio-review` : `${dashboardHref}#portfolio-section`;
  const nodesHref = currentUser.role === "curator" ? `${dashboardHref}#curator-modules` : "guild.html#nodes-directory";

  nav.innerHTML = `
    <a class="nav-link" href="${dashboardHref}">${isOperator(currentUser) ? "Operator" : "Dashboard"}</a>
    <a class="nav-link" href="subjects.html">Subjects</a>
    <a class="nav-link" href="guild.html">Guilds</a>
    <a class="nav-link" href="vision.html">Vision</a>
    <a class="nav-link" href="${portfolioHref}">Portfolio</a>
    <a class="nav-link" href="discovery.html">Discovery</a>
    <a class="nav-link" href="${nodesHref}">Nodes</a>
    <a class="nav-link" href="index.html#about">About</a>
    <button id="logout-button" class="nav-button" type="button">Logout</button>
  `;

  document.getElementById("logout-button").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });
}

function renderVersionBadges() {
  document.querySelectorAll(".version-badge").forEach((node) => {
    node.textContent = appVersion;
  });
}

async function fetchUsers() {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchApprovedModules() {
  const { data, error } = await supabase
    .from("modules")
    .select("*, users!modules_created_by_fkey(id, role, verified, email)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).filter((row) => row.users?.verified).map(mapModule);
}

async function fetchAllModules() {
  const { data, error } = await supabase
    .from("modules")
    .select("*, users!modules_created_by_fkey(id, role, verified, email)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapModule);
}

async function fetchPortfolioEntries() {
  const { data, error } = await supabase
    .from("portfolio_entries")
    .select("*, highlights(id, approved_by, created_at)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapPortfolio);
}

async function fetchHighlightedEntries() {
  const { data, error } = await supabase
    .from("portfolio_entries")
    .select("*, highlights!inner(id, approved_by, created_at)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapPortfolio);
}

async function fetchNicheEntries() {
  const { data, error } = await supabase.from("niche_entries").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapNiche);
}

async function fetchEnrollmentsForUser(userId) {
  const { data, error } = await supabase.from("enrollments").select("*").eq("student_id", userId);
  if (error) throw error;
  return data || [];
}

async function fetchCuratorCodes() {
  const { data, error } = await supabase.from("curator_codes").select("*");
  if (error) throw error;
  return data || [];
}

async function fetchSubjects() {
  const { data, error } = await supabase.from("subjects").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
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
      <p class="field-note">By ${escapeHtml(author?.email || "Unknown Seeker")}</p>
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

async function renderHomePage() {
  const currentUser = await getCurrentUserProfile();
  if (currentUser) {
    window.location.href = getDashboardPath(currentUser.role);
    return;
  }

  const roleSelect = document.getElementById("signup-role");
  const curatorCodeField = document.getElementById("curator-code-field");
  const forgotButton = document.getElementById("forgot-password-button");
  const demoButtons = document.querySelectorAll(".demo-login-button");

  const toggleCuratorCode = () => curatorCodeField.classList.toggle("hidden", roleSelect.value !== "curator");
  roleSelect.addEventListener("change", toggleCuratorCode);
  toggleCuratorCode();

  document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("signup-message", "", "");
    const formElement = event.currentTarget;

    const form = new FormData(formElement);
    const email = form.get("email")?.toString().trim().toLowerCase();
    const password = form.get("password")?.toString().trim();
    const selectedRole = form.get("role")?.toString();
    const enteredCode = form.get("curatorCode")?.toString().trim().toUpperCase();

    if (!email || !password || !selectedRole) {
      setMessage("signup-message", "Missing fields.", "error");
      return;
    }

    let codeRow = null;

    try {
      if (selectedRole === "curator") {
        if (!enteredCode) {
          setMessage("signup-message", "Invalid curator code", "error");
          return;
        }

        const { data, error } = await supabase
          .from("curator_codes")
          .select("*")
          .eq("code", enteredCode)
          .eq("used", false)
          .single();

        if (error || !data) {
          setMessage("signup-message", "Invalid curator code", "error");
          return;
        }

        codeRow = data;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage("signup-message", authErrorMessage(error), "error");
        return;
      }

      if (!data.user) {
        setMessage("signup-message", "Signup failed.", "error");
        return;
      }

      const profilePayload = {
        id: data.user.id,
        role: selectedRole,
        verified: false,
        email
      };

      const { error: profileError } = await supabase.from("users").insert(profilePayload);
      if (profileError) {
        setMessage("signup-message", profileError.message, "error");
        return;
      }

      if (selectedRole === "curator" && codeRow) {
        const { error: codeError } = await supabase
          .from("curator_codes")
          .update({ used: true, assigned_to: data.user.id })
          .eq("code", enteredCode);

        if (codeError) {
          setMessage("signup-message", codeError.message, "error");
          return;
        }
      }

      formElement.reset();
      toggleCuratorCode();
      setMessage(
        "signup-message",
        "Signup successful. Check your email to confirm your account before logging in.",
        "success"
      );
    } catch (error) {
      setMessage("signup-message", error.message || "Signup failed.", "error");
    }
  });

  document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("login-message", "", "");

    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.toString().trim().toLowerCase();
    const password = form.get("password")?.toString().trim();

    if (!email || !password) {
      setMessage("login-message", "Missing fields.", "error");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("login-message", authErrorMessage(error), "error");
      return;
    }

    if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      setMessage("login-message", "Unverified email. Please confirm your email first.", "error");
      return;
    }

    const profile = await getCurrentUserProfile();
    if (!profile) {
      setMessage("login-message", "No profile found for this account.", "error");
      return;
    }

    window.location.href = getDashboardPath(profile.role);
  });

  if (forgotButton) {
    forgotButton.addEventListener("click", async () => {
      const emailField = document.getElementById("login-email");
      const email = emailField?.value.trim().toLowerCase();

      if (!email) {
        setMessage("login-message", "Enter your email first to reset your password.", "error");
        return;
      }

      const redirectTo = getResetRedirectUrl();
      const resetResult = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setMessage(
        "login-message",
        resetResult.error ? resetResult.error.message : "Password reset email sent if the account exists.",
        resetResult.error ? "error" : "success"
      );
    });
  }

  demoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const profile = setDemoUser(button.dataset.demoRole);
      if (!profile) {
        setMessage("demo-message", "Could not start demo profile.", "error");
        return;
      }
      window.location.href = getDashboardPath(profile.role);
    });
  });
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

async function initSeekerDashboard() {
  const currentUser = await requireRole(["seeker"]);
  if (!currentUser) return;

  const root = document.getElementById("dashboard-root");
  const [modules, entries, nicheEntries, enrollments, users] = await Promise.all([
    fetchApprovedModules(),
    fetchPortfolioEntries(),
    fetchNicheEntries(),
    fetchEnrollmentsForUser(currentUser.id),
    fetchUsers()
  ]);
  const allUsers = ensureRealUserMap(users);

  const ownEntries = entries.filter((entry) => entry.createdBy === currentUser.id);
  const ownNicheEntries = nicheEntries.filter((entry) => entry.createdBy === currentUser.id);
  const enrolledIds = new Set(enrollments.map((entry) => entry.module_id));
  const enrolledModules = modules.filter((module) => enrolledIds.has(module.id));
  const usersById = new Map(allUsers.map((user) => [user.id, user]));

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Seeker Dashboard</p>
          <h1>${escapeHtml(displayUserName(currentUser))}</h1>
        </div>
        <p class="dashboard-meta">Seekers can build portfolios, record intellectual interests, enroll in approved modules, and study highlighted work.</p>
      </header>

      <section class="stats-grid">
        <article class="stat-card">
          <span class="section-label">Email</span>
          <strong>${currentUser.emailConfirmed ? "Confirmed" : "Pending"}</strong>
        </article>
        <article class="stat-card">
          <span class="section-label">Portfolio</span>
          <strong>${ownEntries.length}</strong>
        </article>
        <article class="stat-card">
          <span class="section-label">Enrollments</span>
          <strong>${enrolledModules.length}</strong>
        </article>
      </section>

      <section class="card-grid">
        <article class="card" id="portfolio-section">
          <p class="section-label">Portfolio</p>
          <h2>Create a portfolio entry</h2>
          <form id="portfolio-form" class="form-stack">
            <label>
              Title
              <input name="title" type="text" required />
            </label>
            <label>
              Description
              <textarea name="description" required></textarea>
            </label>
            <label>
              Link
              <input name="link" type="url" placeholder="https://example.com/work" />
            </label>
            <button class="btn btn-primary" type="submit">Add portfolio entry</button>
          </form>
          <p id="portfolio-message" class="status-text" aria-live="polite"></p>
        </article>

        <article class="card" id="niche-section">
          <p class="section-label">Niche Folder</p>
          <h2>Intellectual interests</h2>
          <form id="niche-form" class="form-stack">
            <label>
              Interest
              <input name="interest" type="text" required />
            </label>
            <label>
              Notes
              <textarea name="notes" required></textarea>
            </label>
            <button class="btn" type="submit">Add niche entry</button>
          </form>
          <p id="niche-message" class="status-text" aria-live="polite"></p>
        </article>

        <article class="card">
          <p class="section-label">Guild Exploration</p>
          <h2>Approved modules</h2>
          <div class="record-list">
            ${
              modules.length
                ? modules.map((module) => moduleCard(module, usersById, { allowEnroll: true, alreadyEnrolledIds: enrolledIds })).join("")
                : emptyCard("No approved modules", "Seekers only see modules after Arbiter approval.")
            }
          </div>
        </article>
      </section>

      <section class="card-grid">
        <article class="card">
          <p class="section-label">Your portfolio</p>
          <h2>Chronological record</h2>
          <div class="record-list">
            ${
              ownEntries.length
                ? ownEntries.map((entry) => portfolioCard(entry, currentUser, usersById, { allowEdit: true, allowDelete: true })).join("")
                : emptyCard("No portfolio entries", "Your portfolio begins once you submit your first article, project, or reflection.")
            }
          </div>
        </article>

        <article class="card">
          <p class="section-label">Your niche folder</p>
          <h2>Academic cards</h2>
          <div class="record-list">
            ${
              ownNicheEntries.length
                ? ownNicheEntries.map((entry) => nicheCard(entry, currentUser, true)).join("")
                : emptyCard("No niche entries", "Record questions, themes, and curiosities here.")
            }
          </div>
        </article>
      </section>

      <section class="card">
        <p class="section-label">Enrolled modules</p>
        <h2>Approved learning path</h2>
        <div class="record-list">
          ${
            enrolledModules.length
              ? enrolledModules.map((module) => moduleCard(module, usersById, { alreadyEnrolledIds: enrolledIds })).join("")
              : emptyCard("No enrollments", "Once you enroll in an approved module, it appears here.")
          }
        </div>
      </section>
    </section>
  `;

  document.getElementById("portfolio-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title")?.toString().trim();
    const description = form.get("description")?.toString().trim();
    const link = form.get("link")?.toString().trim();

    if (!title || !description) {
      setMessage("portfolio-message", "Missing fields.", "error");
      return;
    }

    const { error } = await supabase.from("portfolio_entries").insert({ user_id: currentUser.id, title, description, link: link || null });
    setMessage("portfolio-message", error ? error.message : "Portfolio entry saved.", error ? "error" : "success");
    if (!error) await initSeekerDashboard();
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
  const currentUser = await requireRole(["seeker", "curator", "arbiter", "operator"]);
  if (!currentUser) return;

  const root = document.getElementById("guild-root");
  const params = new URLSearchParams(window.location.search);
  const selectedGuild = getGuildBySlug(params.get("guild") || guildCatalog[0].slug);
  const [modules, users, enrollments] = await Promise.all([
    fetchApprovedModules(),
    fetchUsers(),
    currentUser.role === "seeker" ? fetchEnrollmentsForUser(currentUser.id) : Promise.resolve([])
  ]);
  const allUsers = ensureRealUserMap(users);

  const usersById = new Map(allUsers.map((user) => [user.id, user]));
  const guildModules = modules.filter((module) => module.guild === selectedGuild.name);
  const enrolledIds = new Set(enrollments.map((entry) => entry.module_id));
  const curatorIds = new Set(guildModules.map((module) => module.createdBy));
  const curators = users.filter((user) => user.role === "curator" && user.verified && curatorIds.has(user.id));

  root.innerHTML = `
    <section class="guild-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Guild Directory</p>
          <h1>${escapeHtml(selectedGuild.name)}</h1>
        </div>
        <p class="dashboard-meta">${escapeHtml(selectedGuild.description)}</p>
      </header>

      <section class="guild-list">
        ${guildCatalog
          .map(
            (guild) => `
              <article class="record-card guild-card">
                <p class="section-label">${escapeHtml(guild.name)}</p>
                <p>${escapeHtml(guild.description)}</p>
                <footer>
                  <a class="text-link" href="guild.html?guild=${guild.slug}">Open guild</a>
                </footer>
              </article>
            `
          )
          .join("")}
      </section>

      <section class="card">
        <p class="section-label">Approved Modules</p>
        <h2>Visible to Seekers</h2>
        <div class="record-list">
          ${
            guildModules.length
              ? guildModules.map((module) => moduleCard(module, usersById, { allowEnroll: currentUser.role === "seeker", alreadyEnrolledIds: enrolledIds })).join("")
              : emptyCard("No approved modules", "Guild pages display modules only after Arbiter approval.")
          }
        </div>
      </section>

      <section id="nodes-directory" class="card">
        <p class="section-label">Approved Nodes</p>
        <h2>Curator directory</h2>
        <div class="record-list">
          ${
            curators.length
              ? curators
                  .map(
                    (user) => `
                      <article class="record-card">
                        <div class="card-header-row">
                          <h3>${escapeHtml(user.email || user.id)}</h3>
                          ${statusPill("approved")}
                        </div>
                        <p class="field-note">Approved curator aligned with ${escapeHtml(selectedGuild.name)}</p>
                      </article>
                    `
                  )
                  .join("")
              : emptyCard("No approved Curators", "Approved Curators aligned to this guild will appear here.")
          }
        </div>
      </section>
    </section>
  `;

  root.querySelectorAll(".enroll-button").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!["seeker", "operator"].includes(currentUser.role)) return;
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
  const currentUser = await requireRole(["seeker", "curator", "arbiter"]);
  if (!currentUser) return;

  const root = document.getElementById("discovery-root");
  const [entries, users] = await Promise.all([fetchHighlightedEntries(), fetchUsers()]);
  const usersById = new Map(ensureRealUserMap(users).map((user) => [user.id, user]));

  root.innerHTML = `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="section-label">Discovery</p>
          <h1>Highlighted scholarly work</h1>
        </div>
        <p class="dashboard-meta">A calm showcase of portfolio entries selected by Arbiters for academic quality and clarity.</p>
      </header>

      <section class="card">
        <p class="section-label">Highlighted Portfolio</p>
        <h2>Curated feed</h2>
        <div class="record-list">
          ${
            entries.length
              ? entries.map((entry) => portfolioCard(entry, currentUser, usersById)).join("")
              : emptyCard("No highlighted work", "The discovery feed populates only after Arbiters mark portfolio entries as highlighted.")
          }
        </div>
      </section>
    </section>
  `;
}

async function init() {
  try {
    const currentUser = await getCurrentUserProfile();
    renderNav(currentUser);
    renderReflectionOverlay();

    const page = getCurrentPage();
    if (page === "home") await renderHomePage();
    if (page === "seeker-dashboard") await initSeekerDashboard();
    if (page === "curator-dashboard") await initCuratorDashboard();
    if (page === "arbiter-dashboard") await initArbiterDashboard();
    if (page === "guild") await initGuildPage();
    if (page === "module") await initModulePage();
    if (page === "discovery") await initDiscoveryPage();
    if (page === "reset-password") await initResetPasswordPage();
  } catch (error) {
    console.error(error);
    const root =
      document.getElementById("dashboard-root") ||
      document.getElementById("guild-root") ||
      document.getElementById("module-root") ||
      document.getElementById("discovery-root");

    if (root) {
      root.innerHTML = emptyCard("Connection error", error.message || "Supabase could not load the application data.");
    }

    setMessage("signup-message", error.message || "Connection error.", "error");
    setMessage("login-message", error.message || "Connection error.", "error");
  }
}

document.addEventListener("DOMContentLoaded", init);
