/* ═══════════════════════════════════════════════════════════
   PANCHMELA — Interactive Scripts
═══════════════════════════════════════════════════════════ */

// Theme Management
const THEME_KEY = 'panchmela-theme';

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
  const hiddenSection = document.getElementById('hiddenFounderSection');
  const planTrigger = document.getElementById('longTermPlanTrigger');
  const planButton = document.getElementById('secretPlanBtn');
  const hopeButton = document.getElementById('secretHopeTrigger');

  function revealHiddenSection() {
    if (!hiddenSection) return;
    hiddenSection.hidden = false;
    hiddenSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    planTrigger?.setAttribute('aria-expanded', 'true');
    hopeButton?.setAttribute('aria-expanded', 'true');
  }

  planTrigger?.addEventListener('click', revealHiddenSection);
  planTrigger?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      revealHiddenSection();
    }
  });
  planButton?.addEventListener('click', revealHiddenSection);
  hopeButton?.addEventListener('click', revealHiddenSection);
  hopeButton?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      revealHiddenSection();
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
  
  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
