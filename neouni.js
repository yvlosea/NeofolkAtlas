/* ═════════════════════════════════════════════════════════
   NEOUNI — Educational Philosophy JavaScript
   Handles interactions, animations, and educational content
═══════════════════════════════════════════════════════════ */

// NeoUni Configuration
const NEOUNI_CONFIG = {
  learningCycle: {
    items: [
      { icon: '📚', label: 'Knowledge' },
      { icon: '🏗️', label: 'Building' },
      { icon: '💡', label: 'Innovation' },
      { icon: '🌱', label: 'Growth' }
    ]
  },
  capabilities: {
    intellectual: ['Critical thinking', 'Research skills', 'Writing', 'Mathematical reasoning'],
    practical: ['Construction', 'Agriculture', 'Technology', 'Crafts'],
    social: ['Leadership', 'Community engagement', 'Conflict resolution', 'Communication'],
    cultural: ['Heritage preservation', 'Artistic expression', 'Local knowledge', 'Creativity']
  }
};

// Global state
let neouniData = {
  currentCycleIndex: 0,
  isAnimating: false,
  scrollObservers: []
};

// Initialize NeoUni page
document.addEventListener('DOMContentLoaded', () => {
  initializeNeoUni();
  initializeAnimations();
  initializeScrollEffects();
});

// Initialize NeoUni functionality
function initializeNeoUni() {
  // Start learning cycle animation
  startLearningCycle();
  
  // Add interactive elements
  addCapabilityInteractions();
  addJourneyInteractions();
  addComparisonInteractions();
}

// Initialize animations
function initializeAnimations() {
  // Animate philosophy cards on scroll
  observePhilosophyCards();
  
  // Animate ecosystem nodes
  animateEcosystemNodes();
  
  // Animate journey phases
  observeJourneyPhases();
}

// Initialize scroll effects
function initializeScrollEffects() {
  // Parallax effects for hero section
  initializeParallax();
  
  // Progress indicators for journey
  initializeJourneyProgress();
}

// Start learning cycle animation
function startLearningCycle() {
  const cycleItems = document.querySelectorAll('.cycle-item');
  
  if (cycleItems.length === 0) return;
  
  setInterval(() => {
    if (neouniData.isAnimating) return;
    
    // Remove active class from all items
    cycleItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to next item
    neouniData.currentCycleIndex = (neouniData.currentCycleIndex + 1) % cycleItems.length;
    cycleItems[neouniData.currentCycleIndex].classList.add('active');
    
    // Update tooltip if needed
    updateCycleTooltip(neouniData.currentCycleIndex);
    
  }, 3000); // Change every 3 seconds
}

// Update cycle tooltip
function updateCycleTooltip(index) {
  const item = NEOUNI_CONFIG.learningCycle.items[index];
  if (!item) return;
  
  // Create or update tooltip
  let tooltip = document.querySelector('.cycle-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'cycle-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 10;
    `;
    document.querySelector('.learning-cycle')?.appendChild(tooltip);
  }
  
  tooltip.textContent = item.label;
  tooltip.style.opacity = '1';
  
  // Hide after 2 seconds
  setTimeout(() => {
    tooltip.style.opacity = '0';
  }, 2000);
}

// Add capability interactions
function addCapabilityInteractions() {
  const capabilityCards = document.querySelectorAll('.capability-card');
  
  capabilityCards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle expanded state
      const isExpanded = card.classList.contains('expanded');
      
      // Close all other cards
      capabilityCards.forEach(c => c.classList.remove('expanded'));
      
      // Toggle current card
      if (!isExpanded) {
        card.classList.add('expanded');
        showCapabilityDetails(card);
      } else {
        hideCapabilityDetails();
      }
    });
  });
}

// Show capability details
function showCapabilityDetails(card) {
  const icon = card.querySelector('.capability-icon').textContent;
  const title = card.querySelector('h3').textContent;
  
  // Find matching capability data
  let capabilityType = null;
  if (icon === '🧠') capabilityType = 'intellectual';
  else if (icon === '👐') capabilityType = 'practical';
  else if (icon === '🤝') capabilityType = 'social';
  else if (icon === '🌱') capabilityType = 'cultural';
  
  if (!capabilityType || !NEOUNI_CONFIG.capabilities[capabilityType]) return;
  
  const skills = NEOUNI_CONFIG.capabilities[capabilityType];
  
  // Create detail modal or expand card
  const existingDetails = document.querySelector('.capability-details');
  if (existingDetails) existingDetails.remove();
  
  const details = document.createElement('div');
  details.className = 'capability-details';
  details.innerHTML = `
    <div class="details-header">
      <h4>${title} Development</h4>
      <button class="details-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="details-content">
      <p>Students develop these ${title.toLowerCase()} skills through hands-on projects and real-world application:</p>
      <ul>
        ${skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
      <div class="details-example">
        <strong>Example:</strong> Students practice these skills through studio projects, community work, and collaborative problem-solving.
      </div>
    </div>
  `;
  
  // Add styles for details
  details.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-surface);
    border: 2px solid var(--color-primary);
    border-radius: var(--radius-lg);
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
  `;
  
  document.body.appendChild(details);
  
  // Add backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'capability-backdrop';
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  `;
  
  backdrop.addEventListener('click', () => {
    details.remove();
    backdrop.remove();
  });
  
  document.body.appendChild(backdrop);
}

// Hide capability details
function hideCapabilityDetails() {
  const details = document.querySelector('.capability-details');
  const backdrop = document.querySelector('.capability-backdrop');
  
  if (details) details.remove();
  if (backdrop) backdrop.remove();
}

// Add journey interactions
function addJourneyInteractions() {
  const journeyPhases = document.querySelectorAll('.journey-phase');
  
  journeyPhases.forEach((phase, index) => {
    phase.addEventListener('mouseenter', () => {
      highlightJourneyPhase(index);
    });
    
    phase.addEventListener('mouseleave', () => {
      unhighlightJourneyPhase();
    });
    
    phase.addEventListener('click', () => {
      showJourneyDetails(index);
    });
  });
}

// Highlight journey phase
function highlightJourneyPhase(index) {
  const phases = document.querySelectorAll('.journey-phase');
  const markers = document.querySelectorAll('.phase-marker');
  const lines = document.querySelectorAll('.phase-line');
  
  // Highlight current and previous phases
  phases.forEach((phase, i) => {
    if (i <= index) {
      phase.style.opacity = '1';
      phase.style.transform = 'scale(1.02)';
    } else {
      phase.style.opacity = '0.6';
      phase.style.transform = 'scale(1)';
    }
  });
  
  // Highlight timeline
  markers.forEach((marker, i) => {
    if (i <= index) {
      marker.querySelector('.phase-number').style.background = 'var(--color-accent)';
    } else {
      marker.querySelector('.phase-number').style.background = 'var(--color-primary)';
    }
  });
  
  lines.forEach((line, i) => {
    if (i <= index) {
      line.style.background = 'var(--color-accent)';
    } else {
      line.style.background = 'var(--color-primary)';
    }
  });
}

// Unhighlight journey phase
function unhighlightJourneyPhase() {
  const phases = document.querySelectorAll('.journey-phase');
  const markers = document.querySelectorAll('.phase-marker');
  const lines = document.querySelectorAll('.phase-line');
  
  phases.forEach(phase => {
    phase.style.opacity = '1';
    phase.style.transform = 'scale(1)';
  });
  
  markers.forEach(marker => {
    marker.querySelector('.phase-number').style.background = 'var(--color-primary)';
  });
  
  lines.forEach(line => {
    line.style.background = 'var(--color-primary)';
  });
}

// Show journey details
function showJourneyDetails(index) {
  const phases = [
    {
      title: 'Foundation Phase',
      description: 'Students build core skills through guided projects and structured learning.',
      skills: ['Basic construction', 'Writing fundamentals', 'Digital literacy', 'Team collaboration'],
      duration: '6-12 months'
    },
    {
      title: 'Application Phase',
      description: 'Students apply skills to real community challenges and client projects.',
      skills: ['Project management', 'Client communication', 'Problem-solving', 'Quality assurance'],
      duration: '12-18 months'
    },
    {
      title: 'Innovation Phase',
      description: 'Students design and lead their own projects, creating new value.',
      skills: ['Leadership', 'Research & development', 'Entrepreneurship', 'System design'],
      duration: '18-24 months'
    },
    {
      title: 'Mastery Phase',
      description: 'Graduates become mentors and leaders, contributing to NeoUni evolution.',
      skills: ['Mentorship', 'Curriculum development', 'Strategic thinking', 'Innovation leadership'],
      duration: 'Ongoing'
    }
  ];
  
  const phase = phases[index];
  if (!phase) return;
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'journey-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${phase.title}</h3>
        <button class="modal-close" onclick="this.closest('.journey-modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <p>${phase.description}</p>
        <div class="phase-skills">
          <h4>Key Skills Developed:</h4>
          <div class="skills-grid">
            ${phase.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
        <div class="phase-duration">
          <strong>Typical Duration:</strong> ${phase.duration}
        </div>
      </div>
    </div>
  `;
  
  // Add styles
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;
  
  document.body.appendChild(modal);
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Add comparison interactions
function addComparisonInteractions() {
  const comparisonRows = document.querySelectorAll('.comparison-row');
  
  comparisonRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      // Highlight the NeoUni column
      const neouniCell = row.querySelector('.row-cell.neouni');
      if (neouniCell) {
        neouniCell.style.background = 'var(--color-primary-pale)';
        neouniCell.style.transform = 'scale(1.02)';
      }
    });
    
    row.addEventListener('mouseleave', () => {
      // Remove highlight
      const neouniCell = row.querySelector('.row-cell.neouni');
      if (neouniCell) {
        neouniCell.style.background = '';
        neouniCell.style.transform = '';
      }
    });
  });
}

// Observe philosophy cards for animation
function observePhilosophyCards() {
  const cards = document.querySelectorAll('.philosophy-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 200); // Stagger animation
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
  });
}

// Animate ecosystem nodes
function animateEcosystemNodes() {
  const nodes = document.querySelectorAll('.ecosystem-node');
  
  nodes.forEach((node, index) => {
    setTimeout(() => {
      node.style.opacity = '1';
      node.style.transform = 'scale(1)';
    }, index * 300);
  });
}

// Observe journey phases for animation
function observeJourneyPhases() {
  const phases = document.querySelectorAll('.journey-phase');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  phases.forEach(phase => {
    phase.style.opacity = '0';
    phase.style.transform = 'translateX(-50px)';
    phase.style.transition = 'all 0.6s ease-out';
    observer.observe(phase);
  });
}

// Initialize parallax effects
function initializeParallax() {
  const heroVisual = document.querySelector('.neouni-hero-visual');
  if (!heroVisual) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const yPos = rate;
    
    heroVisual.style.transform = `translateY(${yPos}px)`;
  });
}

// Initialize journey progress
function initializeJourneyProgress() {
  window.addEventListener('scroll', () => {
    const journeySection = document.querySelector('.journey-section');
    if (!journeySection) return;
    
    const rect = journeySection.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Calculate progress through journey section
    const sectionTop = rect.top + scrollTop;
    const sectionHeight = rect.height;
    const progress = Math.max(0, Math.min(1, (scrollTop - sectionTop + windowHeight) / sectionHeight));
    
    // Update timeline
    updateTimelineProgress(progress);
  });
}

// Update timeline progress
function updateTimelineProgress(progress) {
  const timeline = document.querySelector('.journey-timeline::before');
  if (!timeline) return;
  
  // Update the visual timeline height
  const timelineHeight = progress * 100;
  
  // This would require CSS custom properties or direct style manipulation
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .journey-timeline::before {
      height: ${timelineHeight}%;
      transition: height 0.3s ease;
    }
  `;
  
  // Remove old style and add new one
  const oldStyle = document.querySelector('#timeline-progress');
  if (oldStyle) oldStyle.remove();
  
  styleSheet.id = 'timeline-progress';
  document.head.appendChild(styleSheet);
}

// Export functions for global access
window.showCapabilityDetails = showCapabilityDetails;
window.hideCapabilityDetails = hideCapabilityDetails;
window.showJourneyDetails = showJourneyDetails;
