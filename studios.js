/* ═══════════════════════════════════════════════════════════
   STUDIOS — Learning Workshops JavaScript
   Handles studio applications, filtering, and interactions
═══════════════════════════════════════════════════════════ */

// Studios Configuration
const STUDIOS_CONFIG = {
  architecture: {
    name: 'Architecture Studio',
    description: 'Designing and building physical infrastructure of Panchmahala',
    status: 'active',
    progress: 75,
    mentors: ['Arjun Kumar', 'Sunita Patel'],
    projects: ['Library Tower Structure', 'Passive Cooling Systems'],
    outputs: ['Campus Layout v2.1', '3D Tower Visualization'],
    fundingGoal: 240000,
    fundingRaised: 180000
  },
  agriculture: {
    name: 'Agriculture Studio',
    description: 'Cultivating sustainable food systems and agricultural practices',
    status: 'active',
    progress: 60,
    mentors: ['Ramesh Singh'],
    projects: ['Campus Garden Expansion', 'Composting System'],
    outputs: ['200kg Vegetables', 'Seasonal Planting Calendar'],
    fundingGoal: 120000,
    fundingRaised: 72000
  },
  technology: {
    name: 'Technology Studio',
    description: 'Building digital infrastructure and educational technology solutions',
    status: 'collaboration',
    progress: 30,
    mentors: ['Priya Kumar'],
    collaborationNeeds: ['Software Development Mentor', 'Network Infrastructure Expert', 'Educational App Developer'],
    projects: ['Student Learning Portal', 'Campus Management System'],
    outputs: [],
    fundingGoal: 150000,
    fundingRaised: 45000
  },
  arts: {
    name: 'Arts & Culture Studio',
    description: 'Preserving and evolving local cultural heritage through artistic expression',
    status: 'planned',
    progress: 15,
    mentors: [],
    projects: ['Kaithi Script Documentation', 'Local Art Workshop Series'],
    outputs: ['Cultural Heritage Database', 'Annual Cultural Festival'],
    fundingGoal: 80000,
    fundingRaised: 12000
  },
  publishing: {
    name: 'Publishing Studio',
    description: 'Creating and disseminating knowledge through publications',
    status: 'active',
    progress: 85,
    mentors: ['Anita Gupta'],
    projects: ['Student Journal Volume 2', 'Local History Book'],
    outputs: ['Campus Garden Guide', 'Monthly Mailclub'],
    fundingGoal: 100000,
    fundingRaised: 85000
  }
};

// Global state
let studiosData = {
  studios: STUDIOS_CONFIG,
  currentFilter: 'all',
  selectedStudio: null
};

// Initialize studios page
document.addEventListener('DOMContentLoaded', () => {
  initializeStudios();
  initializeStudioModal();
  initializeFilters();
});

// Initialize studios functionality
function initializeStudios() {
  // Add hover effects to studio cards
  addStudioInteractions();
  
  // Animate progress bars on scroll
  observeProgressBars();
}

// Add interactive effects to studio cards
function addStudioInteractions() {
  const studioCards = document.querySelectorAll('.studio-card');
  
  studioCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Observe progress bars for animation
function observeProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });
  
  progressBars.forEach(bar => observer.observe(bar));
}

// Initialize studio modal
function initializeStudioModal() {
  const modal = document.getElementById('studioModal');
  const closeBtn = document.getElementById('studioModalClose');
  const backdrop = modal?.querySelector('.login-modal-backdrop');
  
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetStudioForm();
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

// Initialize filters
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Apply filter
      const filter = button.dataset.filter;
      studiosData.currentFilter = filter;
      filterStudios(filter);
    });
  });
}

// Filter studios based on selected filter
function filterStudios(filter) {
  const studioCards = document.querySelectorAll('.studio-card');
  
  studioCards.forEach(card => {
    const status = card.dataset.status;
    let shouldShow = false;
    
    switch (filter) {
      case 'all':
        shouldShow = true;
        break;
      case 'active':
        shouldShow = status === 'active';
        break;
      case 'planned':
        shouldShow = status === 'planned';
        break;
      case 'collaboration':
        shouldShow = status === 'collaboration';
        break;
    }
    
    if (shouldShow) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

// Open studio modal for application
function openStudioModal(studioId) {
  const modal = document.getElementById('studioModal');
  const studioConfig = studiosData.studios[studioId];
  
  if (!studioConfig || !modal) return;
  
  // Update modal content
  document.getElementById('studioModalTitle').textContent = `Join ${studioConfig.name}`;
  document.getElementById('studioId').value = studioId;
  
  // Update subtitle based on studio status
  let subtitle = 'Apply to join this learning workshop';
  if (studioConfig.status === 'collaboration') {
    subtitle = 'Collaborate with this studio';
  } else if (studioConfig.status === 'planned') {
    subtitle = 'Support the development of this studio';
  }
  document.getElementById('studioModalSubtitle').textContent = subtitle;
  
  // Open modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  studiosData.selectedStudio = studioId;
}

// View studio details
function viewStudioDetails(studioId) {
  const studioConfig = studiosData.studios[studioId];
  
  if (!studioConfig) return;
  
  // Create detailed view (could be a separate page or modal)
  alert(`Detailed view for ${studioConfig.name}:\n\n${studioConfig.description}\n\nStatus: ${studioConfig.status}\nProgress: ${studioConfig.progress}%\n\nIn a full implementation, this would open a detailed studio page with complete information, galleries, and application forms.`);
}

// Handle studio application form submission
async function handleStudioApplication(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = document.getElementById('studioSubmitBtn');
  const statusElement = document.getElementById('studioFormStatus');
  const successState = document.getElementById('studioSuccessState');
  const successMessage = document.getElementById('studioSuccessMessage');
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  try {
    const formData = new FormData(form);
    const applicationData = {
      studio_id: formData.get('studio_id'),
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      role: formData.get('role'),
      skills: formData.get('skills') || null,
      motivation: formData.get('motivation') || null,
      availability: formData.get('availability'),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    // Validate required fields
    if (!applicationData.full_name || !applicationData.email || !applicationData.role) {
      throw new Error('Please fill in all required fields');
    }
    
    // Save to Supabase
    const result = await saveStudioApplication(applicationData);
    
    // Show success state
    form.style.display = 'none';
    successState.hidden = false;
    
    const studioConfig = studiosData.studios[applicationData.studio_id];
    successMessage.textContent = `Thank you for your interest in ${studioConfig.name}! We'll review your application and contact you within 3-5 business days.`;
    
    // Track application
    if (typeof gtag !== 'undefined') {
      gtag('event', 'studio_application_submitted', {
        event_category: 'studios',
        event_label: applicationData.studio_id,
        value: 1
      });
    }
    
  } catch (error) {
    console.error('Studio application error:', error);
    statusElement.textContent = error.message || 'Application failed. Please try again.';
    statusElement.className = 'form-status error';
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
  }
}

// Save studio application to Supabase
async function saveStudioApplication(applicationData) {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn('Supabase configuration missing, simulating application submission');
    return { id: Date.now(), ...applicationData };
  }

  const response = await fetch(`${config.url}/rest/v1/studio_applications`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(applicationData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to submit application');
  }

  return response.json();
}

// Get Supabase configuration
function getSupabaseConfig() {
  const url = document.querySelector('meta[name="supabase-url"]')?.content?.trim();
  const anonKey = document.querySelector('meta[name="supabase-anon-key"]')?.content?.trim();
  return url && anonKey ? { url, anonKey } : null;
}

// Reset studio application form
function resetStudioForm() {
  const form = document.getElementById('studioForm');
  const successState = document.getElementById('studioSuccessState');
  
  if (form) {
    form.reset();
    form.style.display = 'block';
  }
  
  if (successState) {
    successState.hidden = true;
  }
  
  // Reset form status
  const statusElement = document.getElementById('studioFormStatus');
  if (statusElement) {
    statusElement.textContent = '';
    statusElement.className = 'form-status';
  }
  
  // Reset submit button
  const submitBtn = document.getElementById('studioSubmitBtn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
  }
}

// Format currency for display
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

// Handle phone number formatting
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 10) {
    value = value.slice(0, 10);
  }
  if (value.length > 0 && !value.startsWith('+91')) {
    value = '+91 ' + value;
  }
  input.value = value;
}

// Add form validation and formatting
document.addEventListener('DOMContentLoaded', () => {
  const studioForm = document.getElementById('studioForm');
  if (studioForm) {
    studioForm.addEventListener('submit', handleStudioApplication);
  }
  
  // Email validation
  const emailInput = document.getElementById('applicantEmail');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !validateEmail(emailInput.value)) {
        emailInput.setCustomValidity('Please enter a valid email address');
      } else {
        emailInput.setCustomValidity('');
      }
    });
  }
  
  // Phone formatting
  const phoneInput = document.getElementById('applicantPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));
  }
  
  // Role-based form updates
  const roleSelect = document.getElementById('applicantRole');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const submitBtn = document.getElementById('studioSubmitBtn');
      const role = e.target.value;
      
      switch (role) {
        case 'student':
          submitBtn.textContent = 'Apply as Student';
          break;
        case 'mentor':
          submitBtn.textContent = 'Apply as Mentor';
          break;
        case 'collaborator':
          submitBtn.textContent = 'Propose Collaboration';
          break;
        case 'volunteer':
          submitBtn.textContent = 'Volunteer';
          break;
        default:
          submitBtn.textContent = 'Submit Application';
      }
    });
  }
});

// Export functions for global access
window.openStudioModal = openStudioModal;
window.viewStudioDetails = viewStudioDetails;
window.formatINR = formatINR;
