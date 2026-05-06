/* ═══════════════════════════════════════════════════════════
   DONATION DASHBOARD — Financial Transparency JavaScript
   Handles real-time data, donations, and transparency features
═══════════════════════════════════════════════════════════ */

// Dashboard Configuration
const DASHBOARD_CONFIG = {
  categories: {
    infrastructure: {
      name: 'Buildings & Infrastructure',
      icon: '🏛️',
      color: '#2c7a7b',
      projects: [
        { name: 'Library Tower Structure', needed: 240000, raised: 0, description: 'Main academic building foundation' },
        { name: 'Student Hostels', needed: 180000, raised: 0, description: 'Phase 1: 20 student capacity' },
        { name: 'Amphitheatre', needed: 80000, raised: 0, description: 'Open-air community space' },
        { name: 'Mailhouse', needed: 120000, raised: 0, description: 'Correspondence and publishing center' }
      ]
    },
    operations: {
      name: 'Staff & Operations',
      icon: '👩‍🏫',
      color: '#d69e2e',
      projects: [
        { name: 'Mentor Salaries', needed: 60000, raised: 0, description: '3 mentors for 6 months' },
        { name: 'Local Worker Wages', needed: 40000, raised: 0, description: 'Construction and maintenance staff' },
        { name: 'Kitchen Staff', needed: 24000, raised: 0, description: 'Meal preparation for students' },
        { name: 'Maintenance Fund', needed: 36000, raised: 0, description: 'Campus upkeep and repairs' }
      ]
    },
    technology: {
      name: 'Technology & Sustainability',
      icon: '☀️',
      color: '#3182ce',
      projects: [
        { name: 'Solar Panel System', needed: 150000, raised: 0, description: 'Campus-wide solar power' },
        { name: 'Battery Storage', needed: 80000, raised: 0, description: 'Energy storage system' },
        { name: 'Water Systems', needed: 60000, raised: 0, description: 'Rainwater harvesting and filtration' },
        { name: 'Local Servers', needed: 45000, raised: 0, description: 'Educational network infrastructure' }
      ]
    },
    students: {
      name: 'Student Support',
      icon: '🌱',
      color: '#38a169',
      projects: [
        { name: 'Student Scholarships', needed: 100000, raised: 0, description: '20 students for 1 year' },
        { name: 'Meal Program', needed: 72000, raised: 0, description: 'Daily meals for 20 students' },
        { name: 'Books & Supplies', needed: 30000, raised: 0, description: 'Educational materials' },
        { name: 'Accessibility Support', needed: 25000, raised: 0, description: 'Special needs accommodations' }
      ]
    },
    experimental: {
      name: 'Experimental Development',
      icon: '🧪',
      color: '#805ad5',
      projects: [
        { name: 'SunSlab Prototypes', needed: 50000, raised: 0, description: 'Solar road technology testing' },
        { name: 'Heliocard Development', needed: 35000, raised: 0, description: 'Educational card game system' },
        { name: 'Sustainability Testing', needed: 28000, raised: 0, description: 'Environmental impact studies' },
        { name: 'Educational Experiments', needed: 22000, raised: 0, description: 'New teaching methods research' }
      ]
    }
  }
};

// Sample transaction data
const SAMPLE_TRANSACTIONS = [
  {
    id: 1,
    type: 'donation',
    title: 'Anonymous Supporter',
    description: 'General donation for campus development',
    amount: 5000,
    date: '2026-05-06',
    icon: '💰',
    category: 'general'
  },
  {
    id: 2,
    type: 'milestone',
    title: 'Land Acquisition Complete',
    description: '18 Katha land secured for Beno Uno campus',
    amount: 0,
    date: '2026-05-01',
    icon: '🎯',
    category: 'infrastructure'
  },
  {
    id: 3,
    type: 'expense',
    title: 'Architectural Design',
    description: 'Payment for Library Tower design work',
    amount: -25000,
    date: '2026-04-28',
    icon: '📐',
    category: 'infrastructure'
  },
  {
    id: 4,
    type: 'donation',
    title: 'Rajesh Kumar',
    description: 'Support for student scholarships',
    amount: 10000,
    date: '2026-04-25',
    icon: '💰',
    category: 'students'
  },
  {
    id: 5,
    type: 'donation',
    title: 'Priya Sharma',
    description: 'Monthly Mailclub subscription',
    amount: 500,
    date: '2026-04-24',
    icon: '💰',
    category: 'general'
  }
];

// Sample impact stories
const SAMPLE_IMPACT_STORIES = [
  {
    id: 1,
    image: '👧',
    title: 'Anita\'s First Book',
    description: '12-year-old Anita received her first set of textbooks through our scholarship program. She\'s now the top student in her class and dreams of becoming a teacher.',
    metrics: [
      { value: '1', label: 'Student Supported' },
      { value: '12', label: 'Books Provided' }
    ]
  },
  {
    id: 2,
    image: '🏗️',
    title: 'Foundation Laid',
    description: 'With community support, we completed the foundation work for the Library Tower. This structure will house thousands of books and serve hundreds of students.',
    metrics: [
      { value: '100%', label: 'Foundation Complete' },
      { value: '50', label: 'Workers Employed' }
    ]
  },
  {
    id: 3,
    image: '🌱',
    title: 'Garden Project',
    description: 'Students learned sustainable agriculture by planting their own garden. The harvest now provides fresh vegetables for the school meal program.',
    metrics: [
      { value: '200', label: 'Plants Grown' },
      { value: '20', label: 'Students Involved' }
    ]
  }
];

// Global state
let dashboardData = {
  transactions: SAMPLE_TRANSACTIONS,
  impactStories: SAMPLE_IMPACT_STORIES,
  selectedCategory: null,
  selectedAmount: 0,
  currentFilter: 'all'
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  initializeDashboard();
  initializeDonationModal();
  loadDashboardData();
  initializeTransactionFilters();
});

// Initialize dashboard components
function initializeDashboard() {
  updateOverviewStats();
  loadCategoryProjects();
  loadTransactions();
  loadImpactStories();
}

// Get Supabase configuration
function getSupabaseConfig() {
  const url = document.querySelector('meta[name="supabase-url"]')?.content?.trim();
  const anonKey = document.querySelector('meta[name="supabase-anon-key"]')?.content?.trim();
  return url && anonKey ? { url, anonKey } : null;
}

// Make API call to Supabase
async function dashboardAPI(path, options = {}) {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn('Supabase configuration missing, using sample data');
    return null;
  }

  try {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    console.error('Dashboard API error:', error);
    return null;
  }
}

// Load dashboard data from Supabase
async function loadDashboardData() {
  try {
    // Load real data from Supabase
    const donations = await dashboardAPI('donations');
    const expenses = await dashboardAPI('expenses');
    const projects = await dashboardAPI('projects');
    
    if (donations || expenses || projects) {
      // Process real data
      processRealData(donations, expenses, projects);
    } else {
      // Use sample data
      console.log('Using sample data for demonstration');
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

// Process real data from Supabase
function processRealData(donations, expenses, projects) {
  // Update dashboard state with real data
  if (donations) {
    dashboardData.donations = donations;
  }
  if (expenses) {
    dashboardData.expenses = expenses;
  }
  if (projects) {
    dashboardData.projects = projects;
  }
  
  // Refresh UI with real data
  updateOverviewStats();
  loadCategoryProjects();
  loadTransactions();
}

// Update overview statistics
function updateOverviewStats() {
  let totalRaised = 0;
  let totalNeeded = 0;
  let projectsCompleted = 0;
  let activeProjects = 0;

  // Calculate totals from categories
  Object.values(DASHBOARD_CONFIG.categories).forEach(category => {
    category.projects.forEach(project => {
      totalRaised += project.raised;
      totalNeeded += project.needed;
      if (project.raised >= project.needed) {
        projectsCompleted++;
      } else if (project.raised > 0) {
        activeProjects++;
      } else {
        activeProjects++;
      }
    });
  });

  // Update UI
  updateStatElement('totalRaised', totalRaised);
  updateStatElement('totalNeeded', totalNeeded);
  updateStatElement('projectsCompleted', projectsCompleted);
  updateStatElement('activeProjects', activeProjects);
}

// Update stat element with animation
function updateStatElement(elementId, value) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (typeof value === 'number') {
    if (elementId.includes('Raised') || elementId.includes('Needed')) {
      element.textContent = formatINR(value);
    } else {
      animateNumber(element, 0, value, 1000);
    }
  } else {
    element.textContent = value;
  }
}

// Animate number counting
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = Math.floor(start + (end - start) * progress);
    element.textContent = current.toLocaleString('en-IN');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Load category projects
function loadCategoryProjects() {
  Object.entries(DASHBOARD_CONFIG.categories).forEach(([key, category]) => {
    updateCategoryCard(key, category);
  });
}

// Update individual category card
function updateCategoryCard(categoryKey, category) {
  const totalRaised = category.projects.reduce((sum, project) => sum + project.raised, 0);
  const totalNeeded = category.projects.reduce((sum, project) => sum + project.needed, 0);
  const progressPercentage = totalNeeded > 0 ? (totalRaised / totalNeeded) * 100 : 0;

  // Update progress bar
  const progressBar = document.getElementById(`${categoryKey}Bar`);
  if (progressBar) {
    progressBar.style.width = `${progressPercentage}%`;
  }

  // Update progress text
  const progressText = document.getElementById(`${categoryKey}Progress`);
  if (progressText) {
    progressText.textContent = `${Math.round(progressPercentage)}% funded`;
  }

  // Update stats
  const categoryCard = document.querySelector(`.category-card.${categoryKey}`);
  if (categoryCard) {
    const raisedElement = categoryCard.querySelector('.stat-value');
    const neededElement = categoryCard.querySelectorAll('.stat-value')[1];
    
    if (raisedElement) raisedElement.textContent = formatINR(totalRaised);
    if (neededElement) neededElement.textContent = formatINR(totalNeeded);
  }

  // Load projects list
  const projectsList = document.getElementById(`${categoryKey}Projects`);
  if (projectsList) {
    projectsList.innerHTML = category.projects.map(project => `
      <div class="project-item">
        <div class="project-name">${project.name}</div>
        <div class="project-progress">${formatINR(project.raised)} / ${formatINR(project.needed)}</div>
        <div class="project-amount">${Math.round((project.raised / project.needed) * 100)}% complete</div>
      </div>
    `).join('');
  }
}

// Load transactions
function loadTransactions(filter = 'all') {
  const transactionsList = document.getElementById('transactionsList');
  if (!transactionsList) return;

  let filteredTransactions = dashboardData.transactions;
  
  if (filter !== 'all') {
    filteredTransactions = dashboardData.transactions.filter(t => t.type === filter);
  }

  transactionsList.innerHTML = filteredTransactions.map(transaction => `
    <div class="transaction-item">
      <div class="transaction-icon ${transaction.type}">
        ${transaction.icon}
      </div>
      <div class="transaction-details">
        <div class="transaction-title">${transaction.title}</div>
        <div class="transaction-description">${transaction.description}</div>
      </div>
      <div class="transaction-meta">
        <div class="transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}">
          ${transaction.amount >= 0 ? '+' : ''}${formatINR(transaction.amount)}
        </div>
        <div class="transaction-date">${formatDate(transaction.date)}</div>
      </div>
    </div>
  `).join('');
}

// Load impact stories
function loadImpactStories() {
  const impactGrid = document.getElementById('impactStories');
  if (!impactGrid) return;

  impactGrid.innerHTML = dashboardData.impactStories.map(story => `
    <div class="impact-story">
      <div class="impact-image">${story.image}</div>
      <div class="impact-content">
        <h3 class="impact-title">${story.title}</h3>
        <p class="impact-description">${story.description}</p>
        <div class="impact-metrics">
          ${story.metrics.map(metric => `
            <div class="impact-metric">
              <span class="impact-metric-value">${metric.value}</span>
              <span class="impact-metric-label">${metric.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// Initialize transaction filters
function initializeTransactionFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Load filtered transactions
      const filter = button.dataset.filter;
      dashboardData.currentFilter = filter;
      loadTransactions(filter);
    });
  });

  // Load more button
  const loadMoreBtn = document.getElementById('loadMoreTransactions');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      // In a real implementation, this would load more transactions from the API
      loadMoreBtn.textContent = 'No more transactions';
      loadMoreBtn.disabled = true;
    });
  }
}

// Initialize donation modal
function initializeDonationModal() {
  const modal = document.getElementById('donationModal');
  const closeBtn = document.getElementById('donationModalClose');
  const backdrop = modal?.querySelector('.login-modal-backdrop');
  
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetDonationForm();
  }
  
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Initialize amount selection
  initializeAmountSelection();
}

// Initialize amount selection
function initializeAmountSelection() {
  const amountCards = document.querySelectorAll('.amount-card');
  const customAmountGroup = document.getElementById('customAmountGroup');
  const customAmountInput = document.getElementById('customAmount');
  
  amountCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove previous selection
      amountCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const amount = card.dataset.amount;
      
      if (amount === 'custom') {
        customAmountGroup.hidden = false;
        customAmountInput.focus();
        dashboardData.selectedAmount = 0;
      } else {
        customAmountGroup.hidden = true;
        dashboardData.selectedAmount = parseInt(amount);
      }
      
      updateDonationSummary();
    });
  });

  // Handle custom amount input
  customAmountInput?.addEventListener('input', (e) => {
    dashboardData.selectedAmount = parseInt(e.target.value) || 0;
    updateDonationSummary();
  });
}

// Open donation modal
function openDonationModal(category = 'general') {
  const modal = document.getElementById('donationModal');
  const categoryConfig = DASHBOARD_CONFIG.categories[category];
  
  if (!modal) return;
  
  // Update modal content
  document.getElementById('donationCategory').value = category;
  
  if (categoryConfig) {
    document.getElementById('donationModalTitle').textContent = `Support ${categoryConfig.name}`;
    document.getElementById('summaryCategory').textContent = categoryConfig.name;
  } else {
    document.getElementById('donationModalTitle').textContent = 'Support Our Mission';
    document.getElementById('summaryCategory').textContent = 'General Support';
  }
  
  // Open modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Update donation summary
function updateDonationSummary() {
  const summaryAmount = document.getElementById('summaryAmount');
  if (summaryAmount) {
    summaryAmount.textContent = formatINR(dashboardData.selectedAmount);
  }
}

// Reset donation form
function resetDonationForm() {
  const form = document.getElementById('donationForm');
  const successState = document.getElementById('donationSuccessState');
  
  if (form) {
    form.reset();
    form.style.display = 'block';
  }
  
  if (successState) {
    successState.hidden = true;
  }
  
  // Reset amount selection
  document.querySelectorAll('.amount-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  document.getElementById('customAmountGroup').hidden = true;
  dashboardData.selectedAmount = 0;
  
  // Reset form status
  const statusElement = document.getElementById('donationFormStatus');
  if (statusElement) {
    statusElement.textContent = '';
    statusElement.className = 'form-status';
  }
}

// Handle donation form submission
async function handleDonationSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = document.getElementById('donationSubmitBtn');
  const statusElement = document.getElementById('donationFormStatus');
  const successState = document.getElementById('donationSuccessState');
  const successMessage = document.getElementById('donationSuccessMessage');
  
  // Validate amount
  if (dashboardData.selectedAmount <= 0) {
    statusElement.textContent = 'Please select or enter a valid donation amount';
    statusElement.className = 'form-status error';
    return;
  }
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  
  try {
    const formData = new FormData(form);
    const donationData = {
      category: formData.get('category'),
      amount: dashboardData.selectedAmount,
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      message: formData.get('message') || null,
      payment_method: formData.get('payment_method'),
      anonymous: formData.get('anonymous') === 'on',
      display_publicly: formData.get('display_publicly') === 'on',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    // Save to Supabase
    const result = await dashboardAPI('donations', {
      method: 'POST',
      body: JSON.stringify(donationData)
    });
    
    // Show success state
    form.style.display = 'none';
    successState.hidden = false;
    
    const displayName = donationData.anonymous ? 'Anonymous Supporter' : donationData.full_name;
    successMessage.textContent = `Thank you, ${displayName}! Your ${formatINR(donationData.amount)} donation will make a real difference.`;
    
    // Update dashboard data
    const newTransaction = {
      id: dashboardData.transactions.length + 1,
      type: 'donation',
      title: donationData.anonymous ? 'Anonymous Supporter' : donationData.full_name,
      description: donationData.message || `Donation for ${donationData.category}`,
      amount: donationData.amount,
      date: new Date().toISOString().split('T')[0],
      icon: '💰',
      category: donationData.category
    };
    
    dashboardData.transactions.unshift(newTransaction);
    loadTransactions(dashboardData.currentFilter);
    updateOverviewStats();
    
    // Track conversion
    if (typeof gtag !== 'undefined') {
      gtag('event', 'donation_completed', {
        event_category: 'donation',
        event_label: donationData.category,
        value: donationData.amount
      });
    }
    
  } catch (error) {
    console.error('Donation error:', error);
    statusElement.textContent = error.message || 'Donation failed. Please try again.';
    statusElement.className = 'form-status error';
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Complete Donation';
  }
}

// Format currency
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Download report function
function downloadReport(type) {
  // In a real implementation, this would generate and download actual PDF reports
  const reportUrls = {
    monthly: '/reports/monthly-financial-summary.pdf',
    annual: '/reports/annual-impact-report.pdf',
    audit: '/reports/independent-audit.pdf'
  };
  
  const url = reportUrls[type];
  if (url) {
    // For demo purposes, show an alert
    alert(`In a real implementation, this would download: ${url}`);
    
    // Track download
    if (typeof gtag !== 'undefined') {
      gtag('event', 'report_downloaded', {
        event_category: 'reports',
        event_label: type
      });
    }
  }
}

// Set up form submission handler
document.addEventListener('DOMContentLoaded', () => {
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    donationForm.addEventListener('submit', handleDonationSubmit);
  }
});

// Export functions for global access
window.openDonationModal = openDonationModal;
window.downloadReport = downloadReport;
window.formatINR = formatINR;
