/* ═══════════════════════════════════════════════════════════
   LIVE COUNTERS — Real-time Statistics System
   Displays live activity and momentum across the website
═══════════════════════════════════════════════════════════ */

// Live Counter Configuration
const LIVE_COUNTERS_CONFIG = {
  counters: [
    {
      id: 'studentsActive',
      label: 'Students Active',
      value: 0,
      target: 20,
      icon: '👨‍🎓',
      unit: '',
      animationDuration: 2000,
      updateInterval: 30000, // 30 seconds
      format: 'number'
    },
    {
      id: 'mealsServed',
      label: 'Meals Served',
      value: 0,
      target: 1250,
      icon: '🍛',
      unit: '',
      animationDuration: 2500,
      updateInterval: 45000, // 45 seconds
      format: 'number'
    },
    {
      id: 'solarGenerated',
      label: 'Solar Generated',
      value: 0,
      target: 850,
      icon: '☀️',
      unit: 'kWh',
      animationDuration: 3000,
      updateInterval: 60000, // 1 minute
      format: 'energy'
    },
    {
      id: 'lettersSent',
      label: 'Letters Sent',
      value: 0,
      target: 156,
      icon: '✉️',
      unit: '',
      animationDuration: 1800,
      updateInterval: 40000, // 40 seconds
      format: 'number'
    },
    {
      id: 'treesPlanted',
      label: 'Trees Planted',
      value: 0,
      target: 89,
      icon: '🌳',
      unit: '',
      animationDuration: 2200,
      updateInterval: 90000, // 1.5 minutes
      format: 'number'
    },
    {
      id: 'publicationsReleased',
      label: 'Publications Released',
      value: 0,
      target: 24,
      icon: '📚',
      unit: '',
      animationDuration: 1500,
      updateInterval: 120000, // 2 minutes
      format: 'number'
    }
  ],
  
  // Realistic growth patterns
  growthPatterns: {
    studentsActive: { min: 0, max: 3, probability: 0.3 },
    mealsServed: { min: 5, max: 15, probability: 0.8 },
    solarGenerated: { min: 1, max: 5, probability: 0.9 },
    lettersSent: { min: 0, max: 2, probability: 0.4 },
    treesPlanted: { min: 0, max: 1, probability: 0.1 },
    publicationsReleased: { min: 0, max: 1, probability: 0.05 }
  }
};

// Global state
let liveCountersData = {
  counters: {},
  intervals: {},
  isInitialized: false,
  lastUpdate: null
};

// Initialize live counters
function initializeLiveCounters() {
  if (liveCountersData.isInitialized) return;
  
  // Load metrics from Trust Dashboard (localStorage) or use defaults
  const trustMetrics = JSON.parse(localStorage.getItem('trustMetrics'));
  
  // Initialize counter values
  LIVE_COUNTERS_CONFIG.counters.forEach(counter => {
    let initialValue = Math.floor(counter.target * 0.7);
    
    // Override with real data if available
    if (trustMetrics) {
      const realMetric = trustMetrics.find(m => m.id === counter.id);
      if (realMetric) initialValue = realMetric.value;
    }

    liveCountersData.counters[counter.id] = {
      ...counter,
      currentValue: initialValue,
      displayValue: 0
    };
  });
  
  // Create counter displays
  createCounterDisplays();
  
  // Render active report if exists
  renderPublicReport();
  
  // Start animations
  animateCounters();
  
  // Start real-time updates (only if no real data is set, or for simulation)
  if (!trustMetrics) {
    startRealTimeUpdates();
  }
  
  liveCountersData.isInitialized = true;
  liveCountersData.lastUpdate = new Date();
}

// Render the public report on the homepage
function renderPublicReport() {
  const report = JSON.parse(localStorage.getItem('trustActiveReport'));
  const section = document.getElementById('publicReportSection');
  if (report && section) {
    document.getElementById('reportTitleDisplay').textContent = report.title;
    document.getElementById('reportContentDisplay').textContent = report.content;
    document.getElementById('reportDate').textContent = report.date;
    const badge = document.getElementById('reportStatusBadge');
    badge.textContent = report.status;
    badge.className = 'pulse-badge';
    
    // Style badge based on status
    badge.style.padding = '4px 8px';
    badge.style.borderRadius = '4px';
    badge.style.fontSize = '0.8rem';
    badge.style.fontWeight = '700';
    badge.style.textTransform = 'uppercase';
    
    section.style.display = 'block';
  }
}

// Create counter displays in the DOM
function createCounterDisplays() {
  // Check if counters container already exists
  let container = document.getElementById('liveCountersContainer');
  
  if (!container) {
    // Create container
    container = document.createElement('div');
    container.id = 'liveCountersContainer';
    container.className = 'live-counters-container';
    
    // Add styles if not already added
    addCounterStyles();
    
    // Insert into page (after hero section)
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && heroSection.nextSibling) {
      heroSection.parentNode.insertBefore(container, heroSection.nextSibling);
    }
  }
  
  // Clear existing content
  container.innerHTML = '';
  
  // Create counter elements
  LIVE_COUNTERS_CONFIG.counters.forEach(counter => {
    const counterElement = createCounterElement(counter);
    container.appendChild(counterElement);
  });
}

// Create individual counter element
function createCounterElement(counter) {
  const counterDiv = document.createElement('div');
  counterDiv.className = 'live-counter';
  counterDiv.id = `counter-${counter.id}`;
  
  counterDiv.innerHTML = `
    <div class="counter-glass"></div>
    <div class="counter-icon">${counter.icon}</div>
    <div class="counter-content">
      <div class="counter-label">${counter.label}</div>
      <div class="counter-value-row">
        <div class="counter-value" id="value-${counter.id}">0</div>
        <div class="counter-unit" id="unit-${counter.id}">${counter.unit}</div>
      </div>
    </div>
    <div class="counter-indicator" id="indicator-${counter.id}">
      <div class="indicator-dot"></div>
    </div>
    <div class="counter-trend">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    </div>
  `;
  
  return counterDiv;
}

// Add counter styles to the page
function addCounterStyles() {
  if (document.getElementById('liveCountersStyles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'liveCountersStyles';
  styles.textContent = `
    /* Live Counters Container */
    .live-counters-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      padding: 3rem 2rem;
      background: var(--color-bg-alt);
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      max-width: 1200px;
      margin: 0 auto;
    }
    
    /* Individual Counter */
    .live-counter {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      position: relative;
      border: 1px solid var(--border-color);
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    
    .counter-glass {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(29, 90, 67, 0.03), transparent);
      transform: rotate(45deg);
      pointer-events: none;
      transition: 0.6s;
    }

    .live-counter:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      border-color: var(--color-primary);
    }
    
    .live-counter:hover .counter-glass {
      left: 100%;
    }
    
    .counter-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    }
    
    .counter-content {
      width: 100%;
    }
    
    .counter-value-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .counter-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-primary);
      line-height: 1;
      font-family: var(--font-serif);
      font-variant-numeric: tabular-nums;
    }
    
    .counter-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }
    
    .counter-unit {
      font-size: 1rem;
      color: var(--color-accent);
      font-weight: 700;
    }
    
    .counter-trend {
      position: absolute;
      bottom: 1.5rem;
      right: 1.5rem;
      color: var(--color-primary);
      opacity: 0.15;
      transform: scale(1.5);
    }

    .counter-indicator {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 10px;
      height: 10px;
    }
    
    .indicator-dot {
      width: 100%;
      height: 100%;
      background: var(--color-primary);
      border-radius: 50%;
      opacity: 0.3;
      animation: pulse 2s ease-in-out infinite;
    }
    
    .indicator-dot.active {
      opacity: 1;
      background: var(--color-accent);
      animation: pulse 0.5s ease-out;
    }
    
    /* Update Animation */
    .live-counter.updating .counter-value {
      animation: countUpdate 0.6s ease-out;
    }
    
    @keyframes countUpdate {
      0% { transform: scale(1); color: var(--color-primary); }
      50% { transform: scale(1.1); color: var(--color-accent); }
      100% { transform: scale(1); color: var(--color-primary); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.2); opacity: 0.6; }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .live-counters-container {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        padding: 2rem 1rem;
      }
      
      .live-counter {
        padding: 1.5rem 1rem;
      }
      
      .counter-icon {
        font-size: 2rem;
      }
      
      .counter-value {
        font-size: 1.5rem;
      }
      
      .counter-label {
        font-size: 0.8rem;
      }
    }
    
    @media (max-width: 480px) {
      .live-counters-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
        padding: 1.5rem 1rem;
      }
      
      .live-counter {
        padding: 1rem 0.75rem;
        flex-direction: column;
        text-align: center;
      }
      
      .counter-icon {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }
      
      .counter-value {
        font-size: 1.3rem;
      }
      
      .counter-label {
        font-size: 0.75rem;
      }
      
      .counter-indicator {
        top: 0.5rem;
        right: 0.5rem;
      }
    }
  `;
  
  document.head.appendChild(styles);
}

// Animate counters on initial load
function animateCounters() {
  LIVE_COUNTERS_CONFIG.counters.forEach(counter => {
    const counterData = liveCountersData.counters[counter.id];
    const element = document.getElementById(`value-${counter.id}`);
    
    if (element && counterData) {
      animateValue(element, 0, counterData.currentValue, counter.animationDuration, counter.format);
    }
  });
}

// Animate a single value
function animateValue(element, start, end, duration, format = 'number') {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);
    
    // Format based on type
    let displayValue = current;
    if (format === 'energy') {
      displayValue = current.toLocaleString('en-IN');
    } else {
      displayValue = current.toLocaleString('en-IN');
    }
    
    element.textContent = displayValue;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      liveCountersData.counters[element.id.replace('value-', '')].displayValue = current;
    }
  }
  
  requestAnimationFrame(update);
}

// Start real-time updates
function startRealTimeUpdates() {
  LIVE_COUNTERS_CONFIG.counters.forEach(counter => {
    // Set up interval for each counter
    const interval = setInterval(() => {
      updateCounter(counter.id);
    }, counter.updateInterval);
    
    liveCountersData.intervals[counter.id] = interval;
  });
}

// Update individual counter
function updateCounter(counterId) {
  const counterData = liveCountersData.counters[counterId];
  const growthPattern = LIVE_COUNTERS_CONFIG.growthPatterns[counterId];
  
  if (!counterData || !growthPattern) return;
  
  // Determine if this counter should update
  if (Math.random() > growthPattern.probability) return;
  
  // Calculate new value
  const increment = Math.floor(Math.random() * (growthPattern.max - growthPattern.min + 1)) + growthPattern.min;
  const newValue = Math.min(counterData.currentValue + increment, counterData.target * 2); // Allow up to 2x target
  
  // Update display
  const element = document.getElementById(`value-${counterId}`);
  const indicator = document.getElementById(`indicator-${counterId}`);
  
  if (element && newValue > counterData.currentValue) {
    // Add updating class
    const counterElement = document.getElementById(`counter-${counterId}`);
    counterElement.classList.add('updating');
    
    // Animate the change
    animateValue(element, counterData.currentValue, newValue, 600, counterData.format);
    
    // Show indicator
    if (indicator) {
      const dot = indicator.querySelector('.indicator-dot');
      dot.classList.add('active');
      setTimeout(() => dot.classList.remove('active'), 500);
    }
    
    // Remove updating class
    setTimeout(() => counterElement.classList.remove('updating'), 600);
    
    // Update data
    counterData.currentValue = newValue;
    counterData.displayValue = newValue;
  }
}

// Update counter programmatically (for external events)
function updateCounterValue(counterId, value, animate = true) {
  const counterData = liveCountersData.counters[counterId];
  const element = document.getElementById(`value-${counterId}`);
  
  if (!counterData || !element) return;
  
  const oldValue = counterData.currentValue;
  const newValue = Math.max(0, value);
  
  if (animate && newValue !== oldValue) {
    const counterElement = document.getElementById(`counter-${counterId}`);
    counterElement.classList.add('updating');
    
    animateValue(element, oldValue, newValue, 600, counterData.format);
    
    setTimeout(() => counterElement.classList.remove('updating'), 600);
  } else {
    element.textContent = newValue.toLocaleString('en-IN');
  }
  
  counterData.currentValue = newValue;
  counterData.displayValue = newValue;
}

// Get current counter values
function getCounterValues() {
  const values = {};
  Object.keys(liveCountersData.counters).forEach(counterId => {
    values[counterId] = liveCountersData.counters[counterId].currentValue;
  });
  return values;
}

// Reset counters to initial values
function resetCounters() {
  LIVE_COUNTERS_CONFIG.counters.forEach(counter => {
    const counterData = liveCountersData.counters[counter.id];
    if (counterData) {
      counterData.currentValue = Math.floor(counter.target * 0.7);
      counterData.displayValue = counterData.currentValue;
      updateCounterValue(counter.id, counterData.currentValue, true);
    }
  });
}

// Stop real-time updates
function stopRealTimeUpdates() {
  Object.values(liveCountersData.intervals).forEach(interval => {
    clearInterval(interval);
  });
  liveCountersData.intervals = {};
}

// Export functions for global access
window.initializeLiveCounters = initializeLiveCounters;
window.updateCounterValue = updateCounterValue;
window.getCounterValues = getCounterValues;
window.resetCounters = resetCounters;
window.stopRealTimeUpdates = stopRealTimeUpdates;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLiveCounters);
} else {
  initializeLiveCounters();
}
