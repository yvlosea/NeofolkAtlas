/* ═══════════════════════════════════════════════════════════
   PANCHMELA — Interactive Scripts
═══════════════════════════════════════════════════════════ */

// Theme Management
const THEME_KEY = 'panchmela-theme';
const FOUNDING_PLEDGE_GOAL = 50000;
const FOUNDING_PLEDGE_POLL_MS = 30000;

function getSupabasePublicConfig() {
  const url = document.querySelector('meta[name="supabase-url"]')?.content?.trim();
  const anonKey = document.querySelector('meta[name="supabase-anon-key"]')?.content?.trim();
  return url && anonKey ? { url, anonKey } : null;
}

function formatINR(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

async function foundingPledgeFetch(path, options = {}) {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error('Supabase config missing');
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) return null;
  return response.json();
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', theme === 'dark');
  }
}

// Login Modal
function initLoginModal() {
  const loginBtn = document.getElementById('loginBtn');
  const mobileLoginBtn = document.getElementById('mobileLoginBtn');
  const accountBtn = document.getElementById('accountBtn');
  const modal = document.getElementById('loginModal');
  const closeBtn = document.getElementById('closeModal');
  const backdrop = modal?.querySelector('.login-modal-backdrop');
  const tabBtns = modal?.querySelectorAll('.tab-btn');
  
  function openModal(tab = 'login') {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Activate correct tab
    tabBtns?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    modal.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}Tab`);
    });
  }
  
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  loginBtn?.addEventListener('click', () => openModal('login'));
  mobileLoginBtn?.addEventListener('click', () => openModal('login'));
  accountBtn?.addEventListener('click', () => openModal('login'));
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  
  // Tab switching
  tabBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      modal.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tab}Tab`);
      });
    });
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });
}

// Mobile Menu
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });
  
  // Close menu when clicking a link
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuBtn?.classList.remove('active');
    });
  });
}

// Scroll Reveal Animation
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.plan-card, .sustain-card, .context-info, .context-visual');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Navbar scroll effect
function initNavbarScroll() {
  const nav = document.querySelector('.main-nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Parallax effect for hero image
function initParallax() {
  const heroImage = document.querySelector('.hero-image');
  if (!heroImage) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.15;
    heroImage.style.transform = `translateY(${rate}px) scale(1.02)`;
  });
}

// Form handling
function initForms() {
  document.querySelectorAll('.login-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Show coming soon message
      const btn = form.querySelector('.submit-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Coming Soon';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    });
  });
}

function initHiddenFounderSection() {
  const popup = document.getElementById('hiddenFounderPopup');
  const popupClose = document.getElementById('hiddenFounderPopupClose');
  const popupBackdrop = document.getElementById('hiddenFounderPopupBackdrop');
  const hopeButton = document.getElementById('secretHopeTrigger');

  function openPopup() {
    if (!popup) return;
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    hopeButton?.setAttribute('aria-expanded', 'true');
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hopeButton?.setAttribute('aria-expanded', 'false');
  }

  hopeButton?.addEventListener('click', openPopup);
  hopeButton?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPopup();
    }
  });
  popupClose?.addEventListener('click', closePopup);
  popupBackdrop?.addEventListener('click', closePopup);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup?.classList.contains('active')) {
      closePopup();
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.submit-btn');
    const originalText = btn?.textContent || 'Send Message';
    const formData = new FormData(form);

    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      form.reset();
      status.textContent = 'Message sent. It will be delivered to inhetedu@zohomail.in.';
      status.classList.add('is-success');
    } catch (error) {
      status.textContent = 'We could not send the form right now. Please email inhetedu@zohomail.in directly.';
      status.classList.add('is-error');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

function initFoundingPledges() {
  const section = document.getElementById('foundingPledgeSection');
  if (!section) return;

  const amountButtons = Array.from(document.querySelectorAll('.pledge-amount-card'));
  const modal = document.getElementById('pledgeModal');
  const modalBackdrop = document.getElementById('pledgeModalBackdrop');
  const modalClose = document.getElementById('pledgeModalClose');
  const form = document.getElementById('pledgeForm');
  const formStatus = document.getElementById('pledgeFormStatus');
  const successState = document.getElementById('pledgeSuccessState');
  const selectedAmountText = document.getElementById('pledgeModalSelectedAmount');
  const amountInput = document.getElementById('pledgeAmountInput');
  const customAmountGroup = document.getElementById('pledgeCustomAmountGroup');
  const customAmountInput = document.getElementById('pledgeCustomAmount');
  const totalNode = document.getElementById('pledgeTotal');
  const supportersNode = document.getElementById('pledgeSupporters');
  const goalStatusNode = document.getElementById('pledgeGoalStatus');
  const progressFill = document.getElementById('pledgeProgressFill');
  const progressNote = document.getElementById('pledgeProgressNote');
  const wall = document.getElementById('pledgeWall');
  const emptyState = document.getElementById('pledgeEmptyState');
  const submitBtn = document.getElementById('pledgeSubmitBtn');

  let selectedAmount = null;

  function openModal(amountValue) {
    selectedAmount = amountValue;
    form.reset();
    document.getElementById('pledgePublicName').checked = true;
    amountInput.value = amountValue === 'custom' ? '' : String(amountValue);
    customAmountGroup.hidden = amountValue !== 'custom';
    if (amountValue === 'custom') {
      customAmountInput.value = '';
    }
    selectedAmountText.textContent = `Selected amount: ${amountValue === 'custom' ? 'Custom amount' : formatINR(amountValue)}`;
    successState.hidden = true;
    form.hidden = false;
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderWall(rows) {
    wall.querySelectorAll('.pledge-wall-item').forEach(node => node.remove());
    if (!rows.length) {
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    const fragment = document.createDocumentFragment();
    rows.forEach(row => {
      const item = document.createElement('div');
      item.className = 'pledge-wall-item';
      const publicName = row.display_publicly ? row.full_name : 'Anonymous';
      item.innerHTML = `
        <span class="pledge-wall-name">${publicName}</span>
        <span class="pledge-wall-amount">${formatINR(row.amount)}</span>
      `;
      fragment.appendChild(item);
    });
    wall.appendChild(fragment);
  }

  function renderSummary(rows) {
    const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const count = rows.length;
    totalNode.textContent = `${formatINR(total)} Pledged`;
    supportersNode.textContent = `${count} Founding Supporter${count === 1 ? '' : 's'}`;
    const progress = Math.min((total / FOUNDING_PLEDGE_GOAL) * 100, 100);
    progressFill.style.width = `${progress}%`;

    if (total > FOUNDING_PLEDGE_GOAL) {
      goalStatusNode.textContent = 'Registration milestone surpassed';
      progressNote.textContent = `The public pledge total is now ${formatINR(total)} while the legal registration goal remains ${formatINR(FOUNDING_PLEDGE_GOAL)}.`;
    } else if (total > 0) {
      goalStatusNode.textContent = `${formatINR(FOUNDING_PLEDGE_GOAL)} Goal`;
      progressNote.textContent = `${formatINR(total)} pledged toward the legal establishment target.`;
    } else {
      goalStatusNode.textContent = `${formatINR(FOUNDING_PLEDGE_GOAL)} Goal`;
      progressNote.textContent = 'Pledges will begin populating this milestone once founding supporters register.';
    }
  }

  async function loadPledges() {
    try {
      const rows = await foundingPledgeFetch('rpc/get_public_founding_pledges', {
        method: 'POST',
        body: JSON.stringify({})
      });
      renderSummary(rows || []);
      renderWall(rows || []);
    } catch (error) {
      console.error('Founding pledges failed to load', error);
      progressNote.textContent = 'We could not load live pledges right now. Please try again shortly.';
    }
  }

  async function sendPledgeNotification(record) {
    const formData = new FormData();
    formData.append('_subject', `Founding Pledge: ${record.full_name} pledged ${formatINR(record.amount)}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('_replyto', record.email);
    formData.append('_cc', record.email);
    formData.append('name', record.full_name);
    formData.append('email', record.email);
    formData.append('phone', record.phone || '');
    formData.append('pledge_amount', formatINR(record.amount));
    formData.append('display_publicly', record.display_publicly ? 'Yes' : 'No');
    formData.append('message', record.message || '');
    formData.append('pledge_type', 'Future pledge only — no funds collected');

    await fetch('https://formsubmit.co/ajax/inhetedu@zohomail.in', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    });
  }

  amountButtons.forEach(button => {
    button.addEventListener('click', () => {
      amountButtons.forEach(node => node.classList.remove('is-active'));
      button.classList.add('is-active');
      openModal(button.dataset.amount);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const resolvedAmount = selectedAmount === 'custom' ? Number(customAmountInput.value) : Number(amountInput.value);
    if (!resolvedAmount || resolvedAmount <= 0) {
      formStatus.textContent = 'Please enter a valid pledge amount.';
      formStatus.className = 'form-status is-error';
      return;
    }

    const payload = {
      full_name: document.getElementById('pledgeName').value.trim(),
      email: document.getElementById('pledgeEmail').value.trim(),
      phone: document.getElementById('pledgePhone').value.trim() || null,
      message: document.getElementById('pledgeMessage').value.trim() || null,
      amount: resolvedAmount,
      display_publicly: document.getElementById('pledgePublicName').checked
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Recording Pledge...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      await foundingPledgeFetch('founding_pledges', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Prefer: 'return=minimal'
        }
      });

      try {
        await sendPledgeNotification(payload);
      } catch (mailError) {
        console.warn('Pledge email notification failed', mailError);
      }

      await loadPledges();
      form.hidden = true;
      successState.hidden = false;
    } catch (error) {
      console.error('Founding pledge submit failed', error);
      formStatus.textContent = 'We could not record your pledge right now. Please try again in a moment.';
      formStatus.className = 'form-status is-error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Make My Pledge';
    }
  });

  loadPledges();
  window.setInterval(loadPledges, FOUNDING_PLEDGE_POLL_MS);
}

// Image gallery lightbox (for Current Work page)
function initLightbox() {
  const galleryImages = document.querySelectorAll('.gallery-image');
  if (galleryImages.length === 0) return;
  
  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-content">
      <button class="lightbox-close">&times;</button>
      <img src="" alt="" class="lightbox-img">
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);
  
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');
  
  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  galleryImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
  });
  
  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// Initialize everything
function init() {
  initTheme();
  initLoginModal();
  initMobileMenu();
  initScrollReveal();
  initNavbarScroll();
  initSmoothScroll();
  initParallax();
  initForms();
  initContactForm();
  initLightbox();
  initHiddenFounderSection();
  initFoundingPledges();
  
  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
