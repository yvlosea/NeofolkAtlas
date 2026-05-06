/* ═══════════════════════════════════════════════════════════
   PARTICIPATE — Public Participation System JavaScript
   Handles form submissions, modal interactions, and dynamic fields
═══════════════════════════════════════════════════════════ */

// Participation Configuration
const PARTICIPATION_CONFIG = {
  types: {
    ideas: {
      title: 'Submit Your Idea',
      subtitle: 'Share your innovative thoughts with our community',
      fields: [
        {
          name: 'idea_title',
          label: 'Idea Title',
          type: 'text',
          placeholder: 'Brief title for your idea',
          required: true
        },
        {
          name: 'idea_category',
          label: 'Idea Category',
          type: 'select',
          options: ['Educational Program', 'Campus Development', 'Community Initiative', 'Technology', 'Sustainability', 'Other'],
          required: true
        },
        {
          name: 'idea_description',
          label: 'Describe Your Idea',
          type: 'textarea',
          placeholder: 'Explain your idea in detail. What problem does it solve? How would it work?',
          required: true
        },
        {
          name: 'idea_implementation',
          label: 'Implementation Thoughts',
          type: 'textarea',
          placeholder: 'How do you envision this idea being implemented? What resources would be needed?',
          required: false
        }
      ]
    },
    sponsor: {
      title: 'Sponsor Infrastructure',
      subtitle: 'Fund specific campus projects and watch them come to life',
      fields: [
        {
          name: 'sponsor_project',
          label: 'Project to Sponsor',
          type: 'select',
          options: ['Library Books', 'Solar Panels', 'Computer Lab', 'Sports Equipment', 'Agricultural Tools', 'Water System', 'Other'],
          required: true
        },
        {
          name: 'sponsor_amount',
          label: 'Sponsorship Amount (₹)',
          type: 'number',
          placeholder: 'Enter amount in INR',
          required: true
        },
        {
          name: 'sponsor_recognition',
          label: 'Recognition Preference',
          type: 'select',
          options: ['Anonymous', 'Name Recognition', 'Company Recognition', 'Family Recognition'],
          required: true
        },
        {
          name: 'sponsor_message',
          label: 'Personal Message',
          type: 'textarea',
          placeholder: 'Share why this project matters to you (optional)',
          required: false
        }
      ]
    },
    volunteer: {
      title: 'Volunteer Your Skills',
      subtitle: 'Share your expertise and time with our community',
      fields: [
        {
          name: 'volunteer_skills',
          label: 'Skills & Expertise',
          type: 'textarea',
          placeholder: 'Describe your professional skills, expertise, and experience',
          required: true
        },
        {
          name: 'volunteer_areas',
          label: 'Areas of Interest',
          type: 'checkbox',
          options: ['Teaching', 'Construction', 'Technology', 'Agriculture', 'Administration', 'Arts & Culture', 'Research'],
          required: true
        },
        {
          name: 'volunteer_commitment',
          label: 'Time Commitment',
          type: 'select',
          options: ['One-time visit', 'Weekly', 'Monthly', '3 months', '6 months', '1 year', 'Open-ended'],
          required: true
        },
        {
          name: 'volunteer_remote',
          label: 'Remote Volunteering',
          type: 'select',
          options: ['On-site only', 'Remote only', 'Both possible'],
          required: true
        }
      ]
    },
    residency: {
      title: 'Apply for Residency',
      subtitle: 'Join our immersive learning and contribution program',
      fields: [
        {
          name: 'residency_type',
          label: 'Residency Type',
          type: 'select',
          options: ['Educational Residency', 'Artist Residency', 'Research Residency', 'Agricultural Residency', 'Technology Residency'],
          required: true
        },
        {
          name: 'residency_duration',
          label: 'Preferred Duration',
          type: 'select',
          options: ['1 month', '3 months', '6 months', '1 year', 'Flexible'],
          required: true
        },
        {
          name: 'residency_background',
          label: 'Professional Background',
          type: 'textarea',
          placeholder: 'Tell us about your educational and professional background',
          required: true
        },
        {
          name: 'residency_project',
          label: 'Proposed Project/Contribution',
          type: 'textarea',
          placeholder: 'What would you like to work on during your residency? How would you contribute?',
          required: true
        },
        {
          name: 'residency_goals',
          label: 'Learning Goals',
          type: 'textarea',
          placeholder: 'What do you hope to learn or achieve during your residency?',
          required: false
        }
      ]
    }
  }
};

// Global state
let participationData = {
  currentType: null,
  isSubmitting: false
};

// Initialize participation page
document.addEventListener('DOMContentLoaded', () => {
  initializeParticipation();
  initializeModal();
  addOptionInteractions();
});

// Initialize participation functionality
function initializeParticipation() {
  // Add hover effects to option cards
  addOptionHoverEffects();
  
  // Initialize form
  initializeParticipationForm();
}

// Initialize modal
function initializeModal() {
  const modal = document.getElementById('participationModal');
  const closeBtn = document.getElementById('participationModalClose');
  const backdrop = modal?.querySelector('.participation-modal-backdrop');
  
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetParticipationForm();
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

// Add option interactions
function addOptionInteractions() {
  const optionCards = document.querySelectorAll('.option-card');
  
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const option = card.dataset.option;
      openParticipationModal(option);
    });
  });
}

// Add hover effects to option cards
function addOptionHoverEffects() {
  const optionCards = document.querySelectorAll('.option-card');
  
  optionCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.option-icon');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(10deg)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.option-icon');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
}

// Open participation modal
function openParticipationModal(type) {
  const modal = document.getElementById('participationModal');
  const typeConfig = PARTICIPATION_CONFIG.types[type];
  
  if (!typeConfig || !modal) return;
  
  // Update modal content
  document.getElementById('modalTag').textContent = 'Get Involved';
  document.getElementById('modalTitle').textContent = typeConfig.title;
  document.getElementById('modalSubtitle').textContent = typeConfig.subtitle;
  document.getElementById('participationType').value = type;
  
  // Generate type-specific fields
  generateTypeSpecificFields(type);
  
  // Open modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  participationData.currentType = type;
}

// Generate type-specific fields
function generateTypeSpecificFields(type) {
  const typeConfig = PARTICIPATION_CONFIG.types[type];
  const fieldsContainer = document.getElementById('typeSpecificFields');
  
  if (!typeConfig || !fieldsContainer) return;
  
  // Clear existing fields
  fieldsContainer.innerHTML = '';
  
  // Generate new fields
  typeConfig.fields.forEach(field => {
    const fieldElement = createFieldElement(field);
    fieldsContainer.appendChild(fieldElement);
  });
}

// Create field element
function createFieldElement(field) {
  const fieldGroup = document.createElement('div');
  fieldGroup.className = 'form-group';
  
  // Create label
  const label = document.createElement('label');
  label.setAttribute('for', field.name);
  label.textContent = field.label + (field.required ? ' *' : '');
  fieldGroup.appendChild(label);
  
  // Create input based on type
  let input;
  
  switch (field.type) {
    case 'textarea':
      input = document.createElement('textarea');
      input.setAttribute('rows', '4');
      input.setAttribute('placeholder', field.placeholder || '');
      break;
      
    case 'select':
      input = document.createElement('select');
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = `Select ${field.label}`;
      input.appendChild(defaultOption);
      
      field.options?.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.toLowerCase().replace(/\s+/g, '-');
        optionElement.textContent = option;
        input.appendChild(optionElement);
      });
      break;
      
    case 'checkbox':
      input = document.createElement('div');
      input.className = 'checkbox-group';
      
      field.options?.forEach(option => {
        const checkboxWrapper = document.createElement('label');
        checkboxWrapper.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `${field.name}_${option.toLowerCase().replace(/\s+/g, '-')}`;
        checkbox.value = option.toLowerCase().replace(/\s+/g, '-');
        
        const checkboxLabel = document.createElement('span');
        checkboxLabel.textContent = option;
        
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(checkboxLabel);
        input.appendChild(checkboxWrapper);
      });
      break;
      
    default:
      input = document.createElement('input');
      input.type = field.type;
      if (field.placeholder) {
        input.setAttribute('placeholder', field.placeholder);
      }
      if (field.type === 'number') {
        input.min = '0';
        input.step = '1';
      }
      break;
  }
  
  if (field.type !== 'checkbox') {
    input.name = field.name;
    input.id = field.name;
    if (field.required) {
      input.required = true;
    }
  }
  
  fieldGroup.appendChild(input);
  
  // Add field-specific styling
  if (field.type === 'checkbox') {
    const style = document.createElement('style');
    style.textContent = `
      .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
      
      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-weight: 400;
        color: var(--color-text);
      }
      
      .checkbox-item input[type="checkbox"] {
        width: auto;
        margin: 0;
      }
    `;
    fieldGroup.appendChild(style);
  }
  
  return fieldGroup;
}

// Initialize participation form
function initializeParticipationForm() {
  const form = document.getElementById('participationForm');
  if (!form) return;
  
  form.addEventListener('submit', handleParticipationSubmit);
}

// Handle participation form submission
async function handleParticipationSubmit(event) {
  event.preventDefault();
  
  if (participationData.isSubmitting) return;
  
  const form = event.target;
  const submitBtn = document.getElementById('participationSubmitBtn');
  const statusElement = document.getElementById('participationFormStatus');
  const successState = document.getElementById('participationSuccessState');
  const successMessage = document.getElementById('participationSuccessMessage');
  
  // Validate form
  if (!validateParticipationForm(form)) {
    return;
  }
  
  // Disable submit button
  participationData.isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  try {
    // Collect form data
    const formData = new FormData(form);
    const submissionData = {
      participation_type: formData.get('participation_type'),
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      location: formData.get('location') || null,
      motivation: formData.get('motivation') || null,
      availability: formData.get('availability') || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    // Add type-specific data
    const typeConfig = PARTICIPATION_CONFIG.types[submissionData.participation_type];
    if (typeConfig) {
      typeConfig.fields.forEach(field => {
        if (field.type === 'checkbox') {
          // Handle checkbox fields
          const checkboxValues = [];
          field.options?.forEach(option => {
            const checkboxName = `${field.name}_${option.toLowerCase().replace(/\s+/g, '-')}`;
            const checkbox = form.querySelector(`input[name="${checkboxName}"]:checked`);
            if (checkbox) {
              checkboxValues.push(option);
            }
          });
          submissionData[field.name] = checkboxValues;
        } else {
          // Handle other field types
          const fieldInput = form.querySelector(`[name="${field.name}"]`);
          if (fieldInput) {
            submissionData[field.name] = fieldInput.value;
          }
        }
      });
    }
    
    // Save to Supabase
    const result = await saveParticipationSubmission(submissionData);
    
    // Show success state
    form.style.display = 'none';
    successState.hidden = false;
    
    const typeLabels = {
      ideas: 'idea',
      sponsor: 'sponsorship',
      volunteer: 'volunteer application',
      residency: 'residency application'
    };
    
    successMessage.textContent = `Thank you for your ${typeLabels[submissionData.participation_type]}! We'll review your submission and contact you within 3-5 business days.`;
    
    // Track submission
    if (typeof gtag !== 'undefined') {
      gtag('event', 'participation_submitted', {
        event_category: 'participation',
        event_label: submissionData.participation_type,
        value: 1
      });
    }
    
  } catch (error) {
    console.error('Participation submission error:', error);
    statusElement.textContent = error.message || 'Submission failed. Please try again.';
    statusElement.className = 'form-status error';
    
    // Re-enable submit button
    participationData.isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
  }
}

// Validate participation form
function validateParticipationForm(form) {
  const statusElement = document.getElementById('participationFormStatus');
  
  // Check required fields
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  let firstInvalidField = null;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('invalid');
      if (!firstInvalidField) {
        firstInvalidField = field;
      }
    } else {
      field.classList.remove('invalid');
    }
  });
  
  // Check email format
  const emailField = form.querySelector('#participantEmail');
  if (emailField && emailField.value && !validateEmail(emailField.value)) {
    isValid = false;
    emailField.classList.add('invalid');
    if (!firstInvalidField) {
      firstInvalidField = emailField;
    }
  }
  
  if (!isValid) {
    statusElement.textContent = 'Please fill in all required fields correctly.';
    statusElement.className = 'form-status error';
    
    // Focus first invalid field
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    
    return false;
  }
  
  return true;
}

// Save participation submission to Supabase
async function saveParticipationSubmission(submissionData) {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn('Supabase configuration missing, simulating submission');
    return { id: Date.now(), ...submissionData };
  }

  const response = await fetch(`${config.url}/rest/v1/participations`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submissionData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to submit participation');
  }

  return response.json();
}

// Get Supabase configuration
function getSupabaseConfig() {
  const url = document.querySelector('meta[name="supabase-url"]')?.content?.trim();
  const anonKey = document.querySelector('meta[name="supabase-anon-key"]')?.content?.trim();
  return url && anonKey ? { url, anonKey } : null;
}

// Reset participation form
function resetParticipationForm() {
  const form = document.getElementById('participationForm');
  const successState = document.getElementById('participationSuccessState');
  
  if (form) {
    form.reset();
    form.style.display = 'block';
  }
  
  if (successState) {
    successState.hidden = true;
  }
  
  // Reset form status
  const statusElement = document.getElementById('participationFormStatus');
  if (statusElement) {
    statusElement.textContent = '';
    statusElement.className = 'form-status';
  }
  
  // Reset submit button
  const submitBtn = document.getElementById('participationSubmitBtn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
  }
  
  // Clear type-specific fields
  const fieldsContainer = document.getElementById('typeSpecificFields');
  if (fieldsContainer) {
    fieldsContainer.innerHTML = '';
  }
  
  participationData.isSubmitting = false;
  participationData.currentType = null;
}

// Apply for specific opportunity
function applyForOpportunity(opportunityId) {
  // Map opportunity to participation type
  const opportunityMap = {
    'library-books': 'sponsor',
    'mentor': 'volunteer',
    'digital-workshop': 'volunteer',
    'farming': 'volunteer'
  };
  
  const type = opportunityMap[opportunityId] || 'volunteer';
  openParticipationModal(type);
  
  // Pre-fill some fields based on opportunity
  setTimeout(() => {
    const form = document.getElementById('participationForm');
    if (!form) return;
    
    switch (opportunityId) {
      case 'library-books':
        const sponsorProject = form.querySelector('[name="sponsor_project"]');
        if (sponsorProject) {
          sponsorProject.value = 'library-books';
        }
        break;
        
      case 'mentor':
        const skillsField = form.querySelector('[name="volunteer_skills"]');
        if (skillsField) {
          skillsField.value = 'Professional mentoring and teaching expertise';
        }
        break;
        
      case 'digital-workshop':
        const skillsField2 = form.querySelector('[name="volunteer_skills"]');
        if (skillsField2) {
          skillsField2.value = 'Digital literacy and computer skills teaching';
        }
        break;
        
      case 'farming':
        const skillsField3 = form.querySelector('[name="volunteer_skills"]');
        if (skillsField3) {
          skillsField3.value = 'Agricultural experience and farming skills';
        }
        break;
    }
  }, 100);
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Format phone number
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

// Export functions for global access
window.openParticipationModal = openParticipationModal;
window.applyForOpportunity = applyForOpportunity;
