/* ═══════════════════════════════════════════════════════════
   MAILCLUB — Subscription System JavaScript
   Handles subscription forms, modals, and Supabase integration
═══════════════════════════════════════════════════════════ */

// Mailclub Configuration
const MAILCLUB_CONFIG = {
  standard: {
    name: 'Mailclub Member',
    price: 500,
    description: 'The intellectual newspaper of the ecosystem'
  },
  patron: {
    name: 'Patron Mailclub',
    price: 1000,
    description: 'Personal connection with the community'
  }
};

// Modal Management
function initSubscriptionModal() {
  const modal = document.getElementById('subscriptionModal');
  const closeBtn = document.getElementById('subscriptionModalClose');
  const backdrop = modal?.querySelector('.login-modal-backdrop');
  
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetSubscriptionForm();
  }
  
  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Open subscription modal with specific tier
function openSubscriptionModal(tier) {
  const modal = document.getElementById('subscriptionModal');
  const config = MAILCLUB_CONFIG[tier];
  
  if (!config || !modal) return;
  
  // Update modal content
  document.getElementById('subscriptionModalTitle').textContent = `Join ${config.name}`;
  document.getElementById('subscriptionModalSubtitle').textContent = config.description;
  document.getElementById('subscriptionTier').value = tier;
  document.getElementById('subscriptionAmount').value = config.price;
  
  // Update summary
  document.getElementById('summaryTier').textContent = config.name;
  document.getElementById('summaryAmount').textContent = `₹${config.price}`;
  
  // Show/hide address field for patrons
  const addressField = document.getElementById('subscriptionAddress').parentElement;
  if (tier === 'patron') {
    addressField.style.display = 'block';
    document.getElementById('subscriptionAddress').required = true;
  } else {
    addressField.style.display = 'none';
    document.getElementById('subscriptionAddress').required = false;
  }
  
  // Open modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Reset subscription form
function resetSubscriptionForm() {
  const form = document.getElementById('subscriptionForm');
  const successState = document.getElementById('subscriptionSuccessState');
  
  if (form) {
    form.reset();
    form.style.display = 'block';
  }
  
  if (successState) {
    successState.hidden = true;
  }
  
  // Reset form status
  const statusElement = document.getElementById('subscriptionFormStatus');
  if (statusElement) {
    statusElement.textContent = '';
    statusElement.className = 'form-status';
  }
}

// Get Supabase configuration
function getSupabaseConfig() {
  const url = document.querySelector('meta[name="supabase-url"]')?.content?.trim();
  const anonKey = document.querySelector('meta[name="supabase-anon-key"]')?.content?.trim();
  return url && anonKey ? { url, anonKey } : null;
}

// Make API call to Supabase
async function mailclubAPI(path, options = {}) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Supabase configuration missing');
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
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  if (response.status === 204) return null;
  return response.json();
}

// Handle subscription form submission
async function handleSubscriptionSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = document.getElementById('subscriptionSubmitBtn');
  const statusElement = document.getElementById('subscriptionFormStatus');
  const successState = document.getElementById('subscriptionSuccessState');
  const successMessage = document.getElementById('subscriptionSuccessMessage');
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  
  // Clear previous status
  statusElement.textContent = '';
  statusElement.className = 'form-status';
  
  try {
    const formData = new FormData(form);
    const subscriptionData = {
      tier: formData.get('tier'),
      amount: parseInt(formData.get('amount')),
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      address: formData.get('address') || null,
      message: formData.get('message') || null,
      payment_method: formData.get('payment_method'),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    // Validate required fields
    if (!subscriptionData.full_name || !subscriptionData.email) {
      throw new Error('Please fill in all required fields');
    }
    
    // Save to Supabase
    const result = await mailclubAPI('mailclub_subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData)
    });
    
    // Show success state
    form.style.display = 'none';
    successState.hidden = false;
    
    // Update success message based on tier
    const tierConfig = MAILCLUB_CONFIG[subscriptionData.tier];
    successMessage.textContent = `You're now a ${tierConfig.name}! Check your email for next steps.`;
    
    // Track conversion (if analytics is available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'subscription_started', {
        event_category: 'mailclub',
        event_label: subscriptionData.tier,
        value: subscriptionData.amount
      });
    }
    
  } catch (error) {
    console.error('Subscription error:', error);
    statusElement.textContent = error.message || 'Subscription failed. Please try again.';
    statusElement.className = 'form-status error';
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Complete Subscription';
  }
}

// Initialize payment method handlers
function initPaymentMethods() {
  const paymentOptions = document.querySelectorAll('input[name="payment_method"]');
  
  paymentOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      // Update UI based on selected payment method
      const selectedOption = e.target.closest('.payment-option');
      document.querySelectorAll('.payment-option').forEach(opt => {
        opt.style.borderColor = 'var(--border-color)';
      });
      selectedOption.style.borderColor = 'var(--color-primary)';
    });
  });
}

// Format currency display
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initSubscriptionModal();
  initPaymentMethods();
  
  // Handle subscription form submission
  const subscriptionForm = document.getElementById('subscriptionForm');
  if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', handleSubscriptionSubmit);
  }
  
  // Handle email validation
  const emailInput = document.getElementById('subscriptionEmail');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !validateEmail(emailInput.value)) {
        emailInput.setCustomValidity('Please enter a valid email address');
      } else {
        emailInput.setCustomValidity('');
      }
    });
  }
  
  // Handle phone number formatting
  const phoneInput = document.getElementById('subscriptionPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      if (value.length > 0 && !value.startsWith('+91')) {
        value = '+91 ' + value;
      }
      e.target.value = value;
    });
  }
});

// Export functions for global access
window.openSubscriptionModal = openSubscriptionModal;
window.formatINR = formatINR;
