/* ═══════════════════════════════════════════════════════════
   INSIGHTS — Intellectual Journal JavaScript
   Handles article loading, filtering, and interactions
═══════════════════════════════════════════════════════════ */

// Insights Configuration
const INSIGHTS_CONFIG = {
  categories: {
    all: 'All Insights',
    development: 'Development Logs',
    architecture: 'Architecture',
    sustainability: 'Sustainability',
    education: 'Education',
    governance: 'Governance',
    culture: 'Culture'
  },
  
  sampleArticles: [
    {
      id: 1,
      title: 'Building for Learning: Architecture as Educational Tool',
      excerpt: 'How physical environment shapes educational outcomes. An exploration of campus design that fosters curiosity, collaboration, and deep learning through the very act of moving through space.',
      category: 'architecture',
      author: 'Yashveer Vats Gaurav',
      role: 'Founder & Architect',
      date: '2026-05-01',
      readTime: 12,
      featured: true,
      image: '🏛️',
      content: `
        <h2>Architecture as Silent Teacher</h2>
        <p>Every building teaches. Every space suggests possibilities. Every pathway guides movement and thought. At Panchmahala, we're not just constructing buildings—we're crafting environments that educate, inspire, and transform.</p>
        
        <h3>The Learning Environment</h3>
        <p>Traditional schools often treat buildings as containers for education—neutral boxes where learning happens. We believe architecture itself is a fundamental part of the educational process. The way light falls through a window, the height of a ceiling, the texture of a wall—these elements shape how students think, feel, and interact.</p>
        
        <h3>Design Principles</h3>
        <p>Our campus follows several key principles:</p>
        <ul>
          <li><strong>Visibility of Process:</strong> Students can see construction, agriculture, and other activities happening around them</li>
          <li><strong>Varied Spaces:</strong> No single classroom design—different spaces for different kinds of learning</li>
          <li><strong>Connection to Nature:</strong> Every learning space connects to outdoor areas</li>
          <li><strong>Flexibility:</strong> Spaces evolve with the needs of students and projects</li>
        </ul>
        
        <h3>The Library Tower</h3>
        <p>Our central library tower exemplifies this philosophy. It's not just a book repository—it's a vertical journey through knowledge. Each level represents different domains of understanding, with reading nooks, discussion spaces, and observation points that look out over the entire campus.</p>
        
        <h3>Learning Through Construction</h3>
        <p>Most importantly, students participate in building their own learning environment. Architecture students don't just study theory—they design and construct actual campus buildings. This creates a profound connection between learner and space, making the campus itself a living textbook of their educational journey.</p>
      `
    },
    {
      id: 2,
      title: 'Soil to Soul: Agricultural Philosophy in Education',
      excerpt: 'Why growing food is fundamental to understanding systems, patience, and the interconnectedness of knowledge. Agriculture as metaphor and practice for holistic education.',
      category: 'sustainability',
      author: 'Ramesh Singh',
      role: 'Agricultural Mentor',
      date: '2026-04-28',
      readTime: 8,
      featured: true,
      image: '🌱',
      content: `
        <h2>From Soil to Understanding</h2>
        <p>When students plant a seed and watch it grow, they learn more than biology. They learn patience, responsibility, the cycles of nature, and the fundamental connection between human effort and sustenance.</p>
        
        <h3>Agriculture as Systems Thinking</h3>
        <p>Farming teaches systems thinking better than any textbook. Students see how water, soil, sunlight, and human care interact to produce food. They understand feedback loops, resilience, and the importance of timing and observation.</p>
        
        <h3>The Campus Garden</h3>
        <p>Our agricultural studio manages a 2-acre garden that supplies 30% of campus food. Students don't just learn techniques—they experience the full cycle from seed to harvest to table to compost and back to seed.</p>
        
        <h3>Patience and Observation</h3>
        <p>In our instant-gratification world, agriculture teaches something rare: patience. Plants grow on their own schedule. Weather doesn't respond to deadlines. This teaches students to observe carefully, plan thoughtfully, and accept that some things are beyond our control.</p>
      `
    },
    {
      id: 3,
      title: 'Digital Deserts to Digital Gardens',
      excerpt: 'Reimagining technology education in rural contexts. How we\'re building digital infrastructure that serves local needs rather than imposing external solutions.',
      category: 'education',
      author: 'Priya Kumar',
      role: 'Technology Studio Lead',
      date: '2026-04-25',
      readTime: 10,
      featured: true,
      image: '💻',
      content: `
        <h2>Beyond Digital Literacy</h2>
        <p>Most technology education focuses on consumption—teaching students to use apps, browse websites, and navigate digital platforms. We're taking a different approach: teaching students to create technology that serves their community's needs.</p>
        
        <h3>Local Problems, Local Solutions</h3>
        <p>Our technology studio starts with community needs, not with technology trends. Students identify real challenges—water management, agricultural planning, local business operations—and design appropriate technological solutions.</p>
        
        <h3>Building Infrastructure</h3>
        <p>Students are building the campus digital infrastructure from scratch: local servers, mesh networks, custom applications for campus management. This teaches not just coding, but systems architecture, network design, and the practical challenges of technology deployment in rural areas.</p>
        
        <h3>Digital Sovereignty</h3>
        <p>We're teaching students to question whose technology they're using and why. By building their own systems, they learn about data privacy, digital rights, and the importance of community-controlled technology infrastructure.</p>
      `
    },
    {
      id: 4,
      title: 'Water Wisdom: Traditional Knowledge Meets Modern Science',
      excerpt: 'Exploring how ancient water management systems from Bihar can inform modern sustainable design. Students research and revive traditional techniques.',
      category: 'sustainability',
      author: 'Anita Sharma',
      role: 'Environmental Studies',
      date: '2026-04-20',
      readTime: 7,
      featured: false,
      image: '💧',
      content: `
        <h2>Traditional Water Systems</h2>
        <p>Bihar has sophisticated traditional water management systems that sustained communities for centuries. Our students are documenting, understanding, and adapting these systems for modern use.</p>
        
        <h3>The Ahars and Pynes</h3>
        <p>Traditional floodwater harvesting systems that captured monsoon waters for year-round use. Students are mapping these systems and understanding their engineering principles.</p>
        
        <h3>Modern Applications</h3>
        <p>How can ancient wisdom inform modern water management? Students are designing hybrid systems that combine traditional techniques with modern materials and monitoring tools.</p>
      `
    },
    {
      id: 5,
      title: 'Governance by Participation: Community Decision-Making',
      excerpt: 'How we\'re experimenting with participatory governance models where students, staff, and community members collaborate on institutional decisions.',
      category: 'governance',
      author: 'The Collective',
      role: 'Community Voice',
      date: '2026-04-15',
      readTime: 9,
      featured: false,
      image: '🤝',
      content: `
        <h2>Beyond Hierarchy</h2>
        <p>Traditional educational institutions operate on strict hierarchies. We're experimenting with more participatory models where students have real voice in institutional decisions.</p>
        
        <h3>The Council System</h3>
        <p>Students, staff, and community members form councils that make decisions about different aspects of campus life. This teaches democratic participation and shared responsibility.</p>
        
        <h3>Learning Through Governance</h3>
        <p>Participating in governance teaches valuable skills: public speaking, negotiation, policy analysis, and the art of compromise. These are essential capabilities for active citizenship.</p>
      `
    },
    {
      id: 6,
      title: 'Kaithi Script Revival: Digital Preservation of Cultural Heritage',
      excerpt: 'Students work to digitize and revive the Kaithi script, once widely used across Bihar. A project combining technology, culture, and community service.',
      category: 'culture',
      author: 'Meera Devi',
      role: 'Cultural Studies',
      date: '2026-04-10',
      readTime: 11,
      featured: false,
      image: '📜',
      content: `
        <h2>Rediscovering Kaithi</h2>
        <p>The Kaithi script was once the writing system of choice for administration, commerce, and personal correspondence across North India. Today, it's nearly extinct. Our students are working to change that.</p>
        
        <h3>Digital Documentation</h3>
        <p>Students are scanning old documents, interviewing elders who remember the script, and creating digital fonts and learning materials. This combines technical skills with cultural preservation.</p>
        
        <h3>Living Language</h3>
        <p>The goal isn't just preservation—it's revival. Students are creating modern content in Kaithi: posters for campus events, digital comics, even social media posts. Making the script relevant to contemporary life.</p>
      `
    }
  ]
};

// Global state
let insightsData = {
  articles: INSIGHTS_CONFIG.sampleArticles,
  currentCategory: 'all',
  displayedArticles: 6,
  isLoading: false
};

// Initialize Insights page
document.addEventListener('DOMContentLoaded', () => {
  initializeInsights();
  initializeFilters();
  initializeModal();
  loadArticles();
});

// Initialize Insights functionality
function initializeInsights() {
  // Add hover effects to articles
  addArticleInteractions();
  
  // Initialize newsletter form
  initializeNewsletterForm();
}

// Initialize category filters
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.category-filter');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Apply filter
      const category = button.dataset.category;
      insightsData.currentCategory = category;
      loadArticles(true);
    });
  });
}

// Initialize article modal
function initializeModal() {
  const modal = document.getElementById('articleModal');
  const closeBtn = document.getElementById('articleModalClose');
  const backdrop = modal?.querySelector('.article-modal-backdrop');
  
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
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

// Load articles based on current filter
function loadArticles(reset = false) {
  if (reset) {
    insightsData.displayedArticles = 6;
  }
  
  const grid = document.getElementById('insightsGrid');
  if (!grid) return;
  
  // Filter articles
  let filteredArticles = insightsData.articles;
  if (insightsData.currentCategory !== 'all') {
    filteredArticles = insightsData.articles.filter(article => 
      article.category === insightsData.currentCategory
    );
  }
  
  // Sort by date (newest first)
  filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Get articles to display
  const articlesToShow = filteredArticles.slice(0, insightsData.displayedArticles);
  
  // Clear and populate grid
  grid.innerHTML = articlesToShow.map(article => createArticleCard(article)).join('');
  
  // Add click handlers
  addArticleClickHandlers();
  
  // Update load more button
  updateLoadMoreButton(filteredArticles.length);
  
  // Animate articles
  animateArticles();
}

// Create article card HTML
function createArticleCard(article) {
  return `
    <article class="insight-article" data-id="${article.id}">
      <div class="article-image">
        <div class="image-placeholder">${article.image}</div>
      </div>
      <div class="article-content">
        <div class="article-meta">
          <span class="article-category">${INSIGHTS_CONFIG.categories[article.category]}</span>
          <span class="article-date">${formatDate(article.date)}</span>
          <span class="article-read-time">${article.readTime} min read</span>
        </div>
        <h3 class="article-title">${article.title}</h3>
        <p class="article-excerpt">${article.excerpt}</p>
        <div class="article-author">
          <div class="author-avatar">${getAuthorInitials(article.author)}</div>
          <div class="author-info">
            <span class="author-name">${article.author}</span>
            <span class="author-role">${article.role}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Add article interactions
function addArticleInteractions() {
  const articles = document.querySelectorAll('.insight-article, .featured-article');
  
  articles.forEach(article => {
    article.addEventListener('mouseenter', () => {
      article.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    article.addEventListener('mouseleave', () => {
      article.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Add click handlers to articles
function addArticleClickHandlers() {
  const articles = document.querySelectorAll('.insight-article, .featured-article');
  
  articles.forEach(article => {
    article.addEventListener('click', () => {
      const articleId = parseInt(article.dataset.id);
      openArticleModal(articleId);
    });
  });
}

// Open article modal
function openArticleModal(articleId) {
  const article = insightsData.articles.find(a => a.id === articleId);
  if (!article) return;
  
  const modal = document.getElementById('articleModal');
  const modalBody = document.getElementById('articleModalBody');
  
  if (!modal || !modalBody) return;
  
  // Populate modal content
  modalBody.innerHTML = `
    <div class="article-header">
      <div class="article-meta">
        <span class="article-category">${INSIGHTS_CONFIG.categories[article.category]}</span>
        <span class="article-date">${formatDate(article.date)}</span>
        <span class="article-read-time">${article.readTime} min read</span>
      </div>
      <h1 class="article-title">${article.title}</h1>
      <div class="article-author">
        <div class="author-avatar">${getAuthorInitials(article.author)}</div>
        <div class="author-info">
          <span class="author-name">${article.author}</span>
          <span class="author-role">${article.role}</span>
        </div>
      </div>
    </div>
    <div class="article-body">
      ${article.content}
    </div>
    <div class="article-footer">
      <div class="article-actions">
        <button class="action-btn" onclick="shareArticle(${article.id})">
          <span>Share</span>
        </button>
        <button class="action-btn" onclick="printArticle(${article.id})">
          <span>Print</span>
        </button>
      </div>
    </div>
  `;
  
  // Open modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Track article view
  if (typeof gtag !== 'undefined') {
    gtag('event', 'article_view', {
      event_category: 'insights',
      event_label: article.category,
      value: articleId
    });
  }
}

// Close article modal
function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Load more articles
function loadMoreArticles() {
  if (insightsData.isLoading) return;
  
  insightsData.isLoading = true;
  const loadBtn = document.getElementById('loadMoreInsights');
  
  if (loadBtn) {
    loadBtn.textContent = 'Loading...';
    loadBtn.disabled = true;
  }
  
  // Simulate loading delay
  setTimeout(() => {
    insightsData.displayedArticles += 3;
    loadArticles(false);
    
    insightsData.isLoading = false;
    
    if (loadBtn) {
      loadBtn.textContent = 'Load More Insights';
      loadBtn.disabled = false;
    }
  }, 1000);
}

// Update load more button
function updateLoadMoreButton(totalArticles) {
  const loadBtn = document.getElementById('loadMoreInsights');
  if (!loadBtn) return;
  
  if (insightsData.displayedArticles >= totalArticles) {
    loadBtn.textContent = 'All Articles Loaded';
    loadBtn.disabled = true;
  } else {
    loadBtn.textContent = 'Load More Insights';
    loadBtn.disabled = false;
  }
}

// Animate articles
function animateArticles() {
  const articles = document.querySelectorAll('.insight-article');
  
  articles.forEach((article, index) => {
    article.style.opacity = '0';
    article.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      article.style.transition = 'all 0.6s ease-out';
      article.style.opacity = '1';
      article.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Initialize newsletter form
function initializeNewsletterForm() {
  const form = document.getElementById('insightsNewsletterForm');
  if (!form) return;
  
  form.addEventListener('submit', handleNewsletterSubmit);
}

// Handle newsletter form submission
async function handleNewsletterSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const emailInput = document.getElementById('insightsEmail');
  const statusElement = document.getElementById('insightsFormStatus');
  
  if (!emailInput.value) {
    statusElement.textContent = 'Please enter your email address';
    statusElement.className = 'form-status error';
    return;
  }
  
  try {
    // Save to Supabase or simulate
    const subscriptionData = {
      email: emailInput.value,
      type: 'insights',
      created_at: new Date().toISOString()
    };
    
    const result = await saveNewsletterSubscription(subscriptionData);
    
    // Show success
    statusElement.textContent = 'Thank you for subscribing! Check your email for confirmation.';
    statusElement.className = 'form-status success';
    
    // Reset form
    form.reset();
    
    // Track subscription
    if (typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_subscribe', {
        event_category: 'insights',
        event_label: 'insights_newsletter'
      });
    }
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    statusElement.textContent = 'Subscription failed. Please try again.';
    statusElement.className = 'form-status error';
  }
}

// Save newsletter subscription to Supabase
async function saveNewsletterSubscription(subscriptionData) {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn('Supabase configuration missing, simulating subscription');
    return { id: Date.now(), ...subscriptionData };
  }

  const response = await fetch(`${config.url}/rest/v1/newsletter_subscriptions`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscriptionData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to subscribe');
  }

  return response.json();
}

// Get Supabase configuration
function getSupabaseConfig() {
  const url = document.querySelector('meta[name="supabase-url"]')?.content?.trim();
  const anonKey = document.querySelector('meta[name="supabase-anon-key"]')?.content?.trim();
  return url && anonKey ? { url, anonKey } : null;
}

// Explore topic
function exploreTopic(topicSlug) {
  // In a full implementation, this would navigate to a topic-specific page
  alert(`Exploring topic: ${topicSlug}\n\nIn a full implementation, this would open a dedicated page with all articles related to this topic, along with related discussions and resources.`);
}

// Share article
function shareArticle(articleId) {
  const article = insightsData.articles.find(a => a.id === articleId);
  if (!article) return;
  
  const shareData = {
    title: article.title,
    text: article.excerpt,
    url: `${window.location.href}#article-${articleId}`
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    alert('Article link copied to clipboard!');
  }
}

// Print article
function printArticle(articleId) {
  const article = insightsData.articles.find(a => a.id === articleId);
  if (!article) return;
  
  // Create print-friendly version
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${article.title}</title>
      <style>
        body { font-family: Georgia, serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
        h1 { color: #333; margin-bottom: 1rem; }
        h2 { color: #555; margin-top: 2rem; margin-bottom: 1rem; }
        p { margin-bottom: 1rem; }
        ul { margin-bottom: 1rem; }
        li { margin-bottom: 0.5rem; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
      </style>
    </head>
    <body>
      <div class="meta">
        <strong>${article.title}</strong><br>
        By ${article.author} | ${formatDate(article.date)} | ${article.readTime} min read
      </div>
      ${article.content}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function getAuthorInitials(author) {
  return author
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Export functions for global access
window.openArticleModal = openArticleModal;
window.closeArticleModal = closeArticleModal;
window.loadMoreArticles = loadMoreArticles;
window.exploreTopic = exploreTopic;
window.shareArticle = shareArticle;
window.printArticle = printArticle;
