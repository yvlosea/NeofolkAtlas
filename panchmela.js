/* ═══════════════════════════════════════════════════════════
   PANCHMELA — Interactive Scripts
═══════════════════════════════════════════════════════════ */

// Theme Management - Removed

function formatINR(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

const SITE_LOGO = 'inhet Logo.png?v=20260525';
const DONATION_MODAL_ID = 'donationModal';
const DONATION_WALL_KEY = 'inhet-donation-wall';

function getHeartIconMarkup() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  `;
}

function buildFooterColumn(title, links) {
  return `
    <div class="footer-col">
      <h4>${title}</h4>
      ${links.map((link) => `<a href="${link.href}">${link.label}</a>`).join('')}
    </div>
  `;
}

function normalizeSiteChrome() {
  document.querySelectorAll('.nav-logo, .footer-logo, .modal-logo').forEach((img) => {
    img.src = SITE_LOGO;
  });

  document.querySelectorAll('link[rel="icon"]').forEach((icon) => {
    icon.setAttribute('href', SITE_LOGO);
  });

  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    Array.from(navLinks.querySelectorAll('.nav-dropdown')).forEach((dropdown) => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const menu = dropdown.querySelector('.dropdown-menu');
      const label = trigger?.textContent.replace(/\s+/g, ' ').trim() || '';

      if (label.startsWith('About') && menu) {
        menu.innerHTML = `
          <a href="team.html" class="dropdown-item">Team</a>
          <a href="transparency.html" class="dropdown-item">Transparency</a>
          <a href="faq.html" class="dropdown-item">FAQ</a>
        `;
      }

      if (label.startsWith('The Campus')) {
        dropdown.remove();
      }

      if (label.startsWith('Education')) {
        const manifestoLink = document.createElement('a');
        manifestoLink.href = 'manifesto.html';
        manifestoLink.className = 'nav-link';
        if (window.location.pathname.endsWith('/manifesto.html') || window.location.pathname.endsWith('manifesto.html')) {
          manifestoLink.classList.add('active');
        }
        manifestoLink.textContent = 'Manifesto';
        dropdown.replaceWith(manifestoLink);
      }
    });
  }

  Array.from(document.querySelectorAll('.mobile-menu-section')).forEach((section) => {
    const titleNode = section.querySelector('h4');
    const title = titleNode?.textContent.trim() || '';

    if (title === 'About') {
      section.innerHTML = `
        <h4 class="mobile-section-title">About</h4>
        <a href="team.html" class="mobile-link">Team</a>
        <a href="transparency.html" class="mobile-link">Transparency</a>
        <a href="faq.html" class="mobile-link">FAQ</a>
      `;
    }

    if (title === 'The Campus') {
      section.remove();
    }

    if (title === 'Education') {
      section.innerHTML = `
        <h4 class="mobile-section-title">Manifesto</h4>
        <a href="manifesto.html" class="mobile-link">Read the Manifesto</a>
      `;
    }
  });

  const footerLinksContainer = document.querySelector('.footer-links-container');
  if (footerLinksContainer) {
    footerLinksContainer.innerHTML = [
      buildFooterColumn('About', [
        { href: 'team.html', label: 'Team' },
        { href: 'transparency.html', label: 'Transparency' },
        { href: 'faq.html', label: 'FAQ' }
      ]),
      buildFooterColumn('Read', [
        { href: 'manifesto.html', label: 'Manifesto' }
      ]),
      buildFooterColumn('Connect', [
        { href: 'partnerships.html', label: 'Partnerships' },
        { href: 'contact.html', label: 'Contact' }
      ])
    ].join('');
  } else {
    Array.from(document.querySelectorAll('.footer-col')).forEach((column) => {
      const heading = column.querySelector('h4')?.textContent.trim();
      if (heading === 'About') {
        column.innerHTML = `
          <h4>About</h4>
          <a href="team.html">Team</a>
          <a href="transparency.html">Transparency</a>
          <a href="faq.html">FAQ</a>
        `;
      }

      if (heading === 'The Campus') {
        column.remove();
      }

      if (heading === 'Education') {
        column.innerHTML = `
          <h4>Read</h4>
          <a href="manifesto.html">Manifesto</a>
        `;
      }
    });
  }
}

function injectDonationModal() {
  if (document.getElementById(DONATION_MODAL_ID)) return;

  const modal = document.createElement('div');
  modal.className = 'donation-modal';
  modal.id = DONATION_MODAL_ID;
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="donation-modal-backdrop" data-donation-close></div>
    <div class="donation-modal-panel" role="dialog" aria-modal="true" aria-labelledby="donationModalTitle">
      <button type="button" class="donation-modal-close" data-donation-close aria-label="Close donation popup">&times;</button>
      <div class="donation-modal-grid">
        <div class="donation-modal-media">
          <span class="section-tag">Support iNHET</span>
          <h2 id="donationModalTitle">Donate to help build the first campus steps</h2>
          <p>Scan the QR code to make your contribution, then share your details so we can confirm and acknowledge your support.</p>
          <img src="Images/donate-qr.png" alt="iNHET donation QR code" class="donation-modal-qr" />
          <p class="donation-modal-note">Green button, one form, no clutter. We only ask for the details needed to confirm your donation.</p>
        </div>
        <div class="donation-modal-form-wrap">
          <form class="donation-form donation-form-modal" id="donationPopupForm" action="https://formsubmit.co/inhetedu@zohomail.in" method="POST" target="_blank">
            <input type="hidden" name="_subject" value="New Donation Received" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <div class="form-group">
              <label for="popupDonorName">Your Name</label>
              <input type="text" id="popupDonorName" name="name" placeholder="Enter your full name" required />
            </div>
            <div class="form-group">
              <label for="popupDonorEmail">Email Address</label>
              <input type="email" id="popupDonorEmail" name="email" placeholder="you@example.com" required />
            </div>
            <div class="form-group">
              <label for="popupDonorPhone">Phone Number</label>
              <input type="tel" id="popupDonorPhone" name="phone" placeholder="Optional but helpful" />
            </div>
            <div class="form-group">
              <label for="popupDonationAmount">Donation Amount (INR)</label>
              <input type="number" id="popupDonationAmount" name="amount" placeholder="Enter amount donated" min="1" required />
            </div>
            <div class="form-group">
              <label for="popupDonationScreenshot">Payment Screenshot</label>
              <input type="file" id="popupDonationScreenshot" name="screenshot" accept="image/*" required />
            </div>
            <div class="form-group">
              <label for="popupDonationMessage">Message</label>
              <textarea id="popupDonationMessage" name="message" rows="4" placeholder="Optional note for the team"></textarea>
            </div>
            <button type="submit" class="submit-btn donation-submit-btn">Send Donation Details</button>
            <p class="form-status" id="donationPopupStatus" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function initDonationModal() {
  injectDonationModal();

  const modal = document.getElementById(DONATION_MODAL_ID);
  const form = document.getElementById('donationPopupForm');
  const formStatus = document.getElementById('donationPopupStatus');
  const submitBtn = form?.querySelector('.donation-submit-btn');

  if (!modal || !form) return;

  function openDonationModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDonationModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.donate-btn, .donate-btn-nav').forEach((button) => {
    button.setAttribute('data-open-donate', 'true');

    if (!button.querySelector('svg')) {
      button.insertAdjacentHTML('afterbegin', getHeartIconMarkup());
    }

    if (!button.textContent.includes('Donate')) {
      button.append(document.createTextNode('Donate Now'));
    }
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-donate], .donate-btn, .donate-btn-nav');
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    openDonationModal();
  });

  modal.querySelectorAll('[data-donation-close]').forEach((node) => {
    node.addEventListener('click', closeDonationModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeDonationModal();
    }
  });

  form.addEventListener('submit', (event) => {
    const formData = new FormData(form);
    const amount = parseInt(formData.get('amount'), 10);

    if (!amount || amount <= 0) {
      event.preventDefault();
      formStatus.textContent = 'Please enter a valid donation amount.';
      formStatus.className = 'form-status error';
      return;
    }

    // Let the form submit normally to FormSubmit.co
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    formStatus.textContent = 'Submitting your donation details...';
    formStatus.className = 'form-status';
  });
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

// Donation System
const INITIAL_DONATION_AMOUNT = 2266;
const DONATION_STORAGE_KEY = 'inhet-donation-total';

function getDonationTotal() {
  const stored = localStorage.getItem(DONATION_STORAGE_KEY);
  return stored ? parseInt(stored, 10) : INITIAL_DONATION_AMOUNT;
}

function updateDonationTotal(amount) {
  const currentTotal = getDonationTotal();
  const newTotal = currentTotal + amount;
  localStorage.setItem(DONATION_STORAGE_KEY, newTotal.toString());
  return newTotal;
}

function displayDonationTotal() {
  const total = getDonationTotal();
  const counterElement = document.getElementById('donationTotal');
  if (counterElement) {
    counterElement.textContent = `₹${total.toLocaleString('en-IN')} donated`;
  }
}

function getDonationWallEntries() {
  const stored = localStorage.getItem(DONATION_WALL_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveDonationWallEntry(name, amount) {
  const entries = getDonationWallEntries();
  entries.unshift({
    name: name || 'Anonymous',
    amount: Number(amount) || 0
  });
  localStorage.setItem(DONATION_WALL_KEY, JSON.stringify(entries.slice(0, 18)));
}

function renderDonationWall() {
  const wall = document.getElementById('donationWall');
  const empty = document.getElementById('donationWallEmpty');
  if (!wall) return;

  const entries = getDonationWallEntries();
  wall.innerHTML = '';

  if (!entries.length) {
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';

  entries.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'donation-wall-item';
    item.innerHTML = `
      <span class="donation-wall-name">${entry.name} donated</span>
      <span class="donation-wall-amount">${formatINR(entry.amount)}</span>
    `;
    wall.appendChild(item);
  });
}

function initDonationForm() {
  const form = document.getElementById('donationForm');
  const formStatus = document.getElementById('donationFormStatus');
  const submitBtn = form?.querySelector('.donation-submit-btn');

  displayDonationTotal();
  renderDonationWall();

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const amount = parseInt(formData.get('amount'), 10);
    
    if (!amount || amount <= 0) {
      formStatus.textContent = 'Please enter a valid donation amount.';
      formStatus.className = 'form-status error';
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // Update the donation counter
        const newTotal = updateDonationTotal(amount);
        displayDonationTotal();
        
        formStatus.textContent = `Thank you! Your donation of ₹${amount.toLocaleString('en-IN')} has been submitted successfully.`;
        formStatus.className = 'form-status success';
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Donation submission failed', error);
      formStatus.textContent = 'There was an error submitting your donation. Please try again.';
      formStatus.className = 'form-status error';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Donation';
      }
    }
  });

}

// Initialize everything
function init() {
  normalizeSiteChrome();
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
  initDonationModal();
  initDonationForm();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
