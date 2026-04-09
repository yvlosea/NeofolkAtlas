/**
 * Neofolk Atlas — DOM contracts, i18n, nav, Supabase Auth (when configured).
 *
 * Configure Supabase (pick one):
 * - Set <meta name="supabase-url" content="https://YOUR_PROJECT.supabase.co"> and
 *   <meta name="supabase-anon-key" content="YOUR_ANON_KEY"> on each HTML page, or
 * - Before loading app.js: window.NEOFOLK_SUPABASE_URL / window.NEOFOLK_SUPABASE_ANON_KEY
 *
 * If URL/key are missing, login/signup fall back to the previous demo behavior (redirect / message only).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const LANG_STORAGE = 'neofolk.preferredLanguage';
const SUPPORTED_LANGS = ['en', 'hi', 'ur'];
const ROLE_HINT_STORAGE = 'neofolk.roleHint';

/**
 * Hash-based Router for SPA feel
 */
window.Router = {
  getRoute() {
    const hash = window.location.hash.substring(1) || 'home';
    const [path, query] = hash.split('?');
    const parts = path.split('/');
    return {
      path: path,
      parts: parts,
      page: parts[0],
      id: parts[1],
      query: new URLSearchParams(query || '')
    };
  },
  navigate(hash) {
    window.location.hash = hash;
  }
};

/**
 * Debounce helper for search
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Domain-based scoring system - Base 10 structure
const domainKeys = [
  'lingosophy', 'arithmetics', 'cosmology', 'biosphere', 'chronicles', 
  'civitas', 'tokenomics', 'artifex', 'praxis', 'bioepisteme'
];

const defaultNeoDomains = domainKeys.reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
const defaultNeoSpecialization = { "General": 0 };

// LINEAGE_TOKENS mapping for Knowledge Topology - Indian Lineage Tokens
const LINEAGE_TOKENS = {
    lingosophy: "Spivaks", 
    arithmetics: "Shakuntis", 
    cosmology: "Bhattas",
    biosphere: "Janakis", 
    chronicles: "Thapars", 
    civitas: "Savi",
    tokenomics: "Bhanus", 
    artifex: "Sarabhs", 
    praxis: "Arunas", 
    bioepisteme: "Gagas"
};

// DOMAIN_NAMES mapping for radar chart and UI display
const DOMAIN_NAMES = {
    lingosophy: "LINGOSOPHY",
    arithmetics: "ARITHMETICS", 
    cosmology: "COSMOLOGY",
    biosphere: "BIOSPHERE", 
    chronicles: "CHRONICLES", 
    civitas: "CIVITAS",
    tokenomics: "TOKENOMICS", 
    artifex: "ARTIFEX", 
    praxis: "PRAXIS", 
    bioepisteme: "BIOEPISTEME"
};

const LINEAGE_DETAILS = [
  {
    "domain": "Lingosophy",
    "subdomain": "Linguistics & Philosophy",
    "tokenName": "Spivaks",
    "fullName": "Gayatri Chakravorty Spivak",
    "colorClass": "purple",
    "resonancePillar": "Language as power",
    "description": "She translated Derrida and then dismantled him — building postcolonial theory from the margins of the Western canon while insisting that the subaltern's silence was itself a political fact. A high Spivak resonance means you operate at the edge where language meets power: you do not merely speak, you interrogate who has been forbidden to."
  },
  {
    "domain": "Arithmetics",
    "subdomain": "Mathematics",
    "tokenName": "Shakuntis",
    "fullName": "Shakuntala Devi",
    "colorClass": "amber",
    "resonancePillar": "Pattern as embodied sense",
    "description": "She multiplied two 13-digit numbers in her head in 28 seconds and was entered into the Guinness Book of World Records — proof that the human mind, uncolonized by institutional gatekeeping, is its own supercomputer. A high Shakunti resonance means you carry numbers in your body: pattern recognition is not a tool you use but a sense you possess."
  },
  {
    "domain": "Cosmology",
    "subdomain": "Astronomy & Physics",
    "tokenName": "Bhattas",
    "fullName": "Rohini Godbole",
    "colorClass": "blue",
    "resonancePillar": "Scale beyond self",
    "description": "A theoretical particle physicist who worked on Higgs boson phenomenology and championed women in science across four decades — she mapped the deep structure of matter while refusing to let Indian women remain invisible in the rooms where that mapping happened. A high Bhatta resonance means you think at scales that dissolve the self: from quarks to cosmological constants, the universe is your unit of analysis."
  },
  {
    "domain": "Biosphere",
    "subdomain": "Biology & Botany",
    "tokenName": "Janakis",
    "fullName": "Janaki Ammal",
    "colorClass": "green",
    "resonancePillar": "Life as political archive",
    "description": "She hybridized sugarcane varieties that freed India from British botanical monopoly and campaigned to save the Silent Valley from a dam — a scientist who understood that the archive of life is also a political battlefield. A high Janaki resonance means you read landscapes as libraries: every species is a sentence, every ecosystem an argument about what survives."
  },
  {
    "domain": "Chronicles",
    "subdomain": "History",
    "tokenName": "Thapars",
    "fullName": "Romila Thapar",
    "colorClass": "red",
    "resonancePillar": "Narrative as legitimacy",
    "description": "She rewrote the history of ancient India by insisting on evidence over myth and remained unbowed when governments tried to weaponize the past against the present — at 91, she refused an honorary degree rather than accept the conditions attached to it. A high Thapar resonance means you understand that history is always a struggle over legitimacy: who gets to narrate the past controls the terms of the future."
  },
  {
    "domain": "Civitas",
    "subdomain": "Political Theory & Social Justice",
    "tokenName": "Savi",
    "fullName": "Savitribai Phule",
    "colorClass": "pink",
    "resonancePillar": "Polity beyond exclusion",
    "description": "She walked through pelted dung to teach Dalit women to read in 1848 — a century before independence, she had already drawn the blueprint for a republic that could not exist unless its most excluded people were educated into it. A high Ambedi resonance means you build toward a polity that does not yet exist: your political imagination is larger than any constitution currently in force."
  },
  {
    "domain": "Tokenomics",
    "subdomain": "Economics & Commons",
    "tokenName": "Bhanus",
    "fullName": "Bina Agarwal",
    "colorClass": "coral",
    "resonancePillar": "Economy from the ground up",
    "description": "Her landmark work A Field of One's Own proved that women's land rights were the single most powerful lever against rural poverty — she built an economics that begins with the body that farms, not the market that prices the harvest. A high Bhanu resonance means you design economies from the ground up: your models account for unpaid labor, collective tenure, and the commons as infrastructure."
  },
  {
    "domain": "Artifex",
    "subdomain": "Design & Craft",
    "tokenName": "Sarabhs",
    "fullName": "Mrinalini Sarabhai",
    "colorClass": "teal",
    "resonancePillar": "Form as argument",
    "description": "She founded Darpana Academy in 1949 and spent fifty years proving that Bharatanatyam was not a relic to be preserved but a living grammar capable of addressing modernity — she made the body a site of decolonial aesthetic argument. A high Sarabh resonance means you treat form as argument: every design decision is a position, every craft choice a claim about what deserves to exist."
  },
  {
    "domain": "Praxis",
    "subdomain": "Action & Reform",
    "tokenName": "Arunas",
    "fullName": "Aruna Roy",
    "colorClass": "purple",
    "resonancePillar": "Theory as lived accountability",
    "description": "She left the IAS to live in a Rajasthan village and invented the jan sunwai — the public hearing — as a tool to pry government records open, eventually forcing the Right to Information Act into law through sheer organized persistence. A high Aruna resonance means your knowledge does not stay inside institutions: you understand that theory becomes real only when the most excluded person in the room can use it against power."
  },
  {
    "domain": "Bioepisteme",
    "subdomain": "Life Sciences & Public Health",
    "tokenName": "Gagas",
    "fullName": "Gagandeep Kang",
    "colorClass": "teal",
    "resonancePillar": "Data as protection",
    "description": "The first Indian woman elected Fellow of the Royal Society, she built vaccine infrastructure in Indian slums, ran rotavirus trials on tens of thousands of children, and became the country's clearest public voice on scientific integrity during the pandemic. A high Gaga resonance means you operate where data meets bodies: you do not separate the epistemology of science from the politics of who gets protected by it."
  }
];

const DOMAIN_STRUCTURE = {
  lingosophy: {
    title: "Lingosophy",
    definition: "Study of language as a structure of thought and culture.",
    includes: ["etymology", "rhetoric", "semiotics", "symbolic systems", "linguistic anthropology", "script evolution", "discourse analysis"],
    coreFunction: "Understanding how language shapes perception, identity, and civilizational continuity.",
    examples: ["Etymological Mapping", "Script Evolution", "Dialect Analysis", "Hermeneutics"]
  },
  arithmetics: {
    title: "Arthmetics",
    definition: "Mathematics as aesthetic and structural intelligence.",
    includes: ["geometry", "algorithmic thinking", "ratios & harmony", "formal logic", "pattern systems", "quantitative reasoning"],
    coreFunction: "Understanding order, proportion, and computation in natural and human systems.",
    examples: ["Golden Ratio composition", "geometric drafting", "harmonic analysis", "symbolic logic"]
  },
  cosmology: {
    title: "Cosmology",
    definition: "Understanding universal structure across physical and metaphysical scales.",
    includes: ["astronomy", "spacetime systems", "metaphysics", "calendar systems", "cosmography", "philosophical physics"],
    coreFunction: "Orienting human activity within larger universal cycles and frameworks.",
    examples: ["celestial navigation", "archaeoastronomy", "orbital mechanics", "big history"]
  },
  biosphere: {
    title: "Biosphere",
    definition: "Study of living systems and ecological interdependence.",
    includes: ["ecology", "soil science", "permaculture", "hydrology", "biodiversity", "regenerative systems"],
    coreFunction: "Understanding how life sustains itself and how humans can participate in ecological continuity.",
    examples: ["soil microbiology", "ecosystem mapping", "permaculture design", "plant taxonomy"]
  },
  chronicles: {
    title: "Chronicles",
    definition: "Preservation and interpretation of human memory across time.",
    includes: ["historiography", "archival science", "oral traditions", "genealogy", "cultural continuity", "manuscript studies"],
    coreFunction: "Maintaining civilizational memory and continuity of knowledge transmission.",
    examples: ["oral history recording", "lineage mapping", "paleography basics", "archival structuring"]
  },
  civitas: {
    title: "Civitas",
    definition: "Study of social organization and ethical cooperation.",
    includes: ["governance models", "law", "social coordination", "conflict mediation", "political philosophy", "commons theory"],
    coreFunction: "Designing stable, ethical, and cooperative societies.",
    examples: ["restorative justice frameworks", "consensus facilitation", "civic architecture", "mutual aid structures"]
  },
  tokenomics: {
    title: "Tokenomics",
    definition: "Design of value systems and resource coordination mechanisms.",
    includes: ["incentive design", "cooperative economics", "decentralized finance logic", "accounting structures", "exchange systems", "credit networks"],
    coreFunction: "Structuring sustainable economic relationships and resource distribution.",
    examples: ["circular economy models", "local credit systems", "ledger design", "incentive modeling"]
  },
  artifex: {
    title: "Artifex",
    definition: "Applied craftsmanship and material intelligence.",
    includes: ["fabrication", "tool-making", "engineering fundamentals", "traditional crafts", "material science", "applied design"],
    coreFunction: "Transforming ideas into tangible structures and tools.",
    examples: ["woodworking", "forging", "solar circuitry", "loom mechanics"]
  },
  praxis: {
    title: "Praxis",
    definition: "Embodied practice and disciplined action.",
    includes: ["skill acquisition", "reflective practice", "field work", "training systems", "habit formation", "performance methods"],
    coreFunction: "Integrating theory through repeated application and disciplined iteration.",
    examples: ["observational journaling", "field experimentation", "conflict rehearsal", "reflective writing"]
  },
  bioepisteme: {
    title: "Bioepisteme",
    definition: "Study of knowledge as an emergent property of living systems.",
    includes: ["cognitive science", "biosemiotics", "ethology", "systems thinking", "embodied intelligence", "perception ecology"],
    coreFunction: "Understanding intelligence beyond human abstraction.",
    examples: ["plant signaling studies", "sensory ecology", "animal cognition mapping", "systems modelling"]
  }
};

// ============================================================
// NODE DEMAND SYSTEM - Structured Node Needs with Domain/Subject/Tags
// ============================================================

// Global NodeNeeds collection - stored in localStorage for cross-user visibility
const nodeNeeds = [];

// Valid Domains (the 10 lineage domains)
const VALID_DOMAINS = [
  'lingosophy', 'arithmetics', 'cosmology', 'biosphere', 'chronicles',
  'civitas', 'tokenomics', 'artifex', 'praxis', 'bioepisteme'
];

// Domain to Token mapping
const DOMAIN_TO_TOKEN = {
  'lingosophy': 'Spivaks',
  'arithmetics': 'Shakuntis',
  'cosmology': 'Bhattas',
  'biosphere': 'Janakis',
  'chronicles': 'Thapars',
  'civitas': 'Savi',
  'tokenomics': 'Bhanus',
  'artifex': 'Sarabhs',
  'praxis': 'Arunas',
  'bioepisteme': 'Gagas'
};

// Valid statuses for NodeNeeds
const VALID_STATUSES = ['pending', 'provisioning', 'fulfilled'];

// Current map view filter
let nodeNeedFilter = 'all'; // 'all', 'active', 'needs'
let demandModeActive = false;

function getGuestStorageId() {
  let guestId = localStorage.getItem('neofolk.guestId');
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('neofolk.guestId', guestId);
  }
  return guestId;
}

/**
 * Toggle Demand Mode - allowing users to drop new signals
 */
window.toggleDemandMode = function() {
  demandModeActive = !demandModeActive;
  const mapOverlay = document.getElementById('map');
  if (mapOverlay) {
    if (demandModeActive) mapOverlay.classList.add('demand-mode-active');
    else mapOverlay.classList.remove('demand-mode-active');
  }
  
  if (demandModeActive) {
    let indicator = document.querySelector('.demand-mode-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'demand-mode-indicator';
      indicator.textContent = 'DEMAND MODE: CLICK MAP TO SIGNAL NEED';
      document.body.appendChild(indicator);
    }
    indicator.style.display = 'block';
  } else {
    const indicator = document.querySelector('.demand-mode-indicator');
    if (indicator) indicator.style.display = 'none';
  }
};

/**
 * Create a new NodeNeed entry with structured data hierarchy
 * @param {number} lat - Latitude coordinate
 * @param {number} lng - Longitude coordinate  
 * @param {string} domain - Domain from VALID_DOMAINS
 * @param {string} subject - Specific subject within domain
 * @param {string[]} tags - Array of custom tags
 * @returns {object} The created NodeNeed object
 */
function createNodeNeed(lat, lng, domain, subject, tags = []) {
  if (!VALID_DOMAINS.includes(domain)) {
    console.error(`Invalid domain: ${domain}. Must be one of: ${VALID_DOMAINS.join(', ')}`);
    return null;
  }
  
  const tokenType = DOMAIN_TO_TOKEN[domain];
  
  const need = {
    id: `need_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    coordinates: [lat, lng],
    domain: domain,
    subject: subject || 'General',
    tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
    tokenType: tokenType,
    clickCount: 1, // 1-5 urgency loop
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    boostedBy: [] // Track users who boosted
  };
  
  nodeNeeds.push(need);
  saveGlobalNodeNeeds();
  return need;
}

/**
 * Drop a new need signal on the map
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} domain - Domain
 * @param {string} subject - Subject
 * @param {string[]} tags - Custom tags
 */
function dropNeedSignal(lat, lng, domain, subject, tags) {
  const need = createNodeNeed(lat, lng, domain, subject, tags);
  if (need) {
    renderNodeNeedMarker(need);
    console.log(`NodeNeed dropped: ${domain} - ${subject} at [${lat}, ${lng}]`);
  }
  return need;
}

/**
 * Boost an existing NodeNeed - increments clickCount (1-5, resets to 1 at 5)
 * @param {string} needId - ID of the NodeNeed to boost
 */
function supportNodeNeed(needId) {
  const need = nodeNeeds.find(n => n.id === needId);
  if (!need) {
    console.error(`NodeNeed not found: ${needId}`);
    return null;
  }
  
  // Urgency loop: 1-5, reset to 1 when at 5
  if (need.clickCount >= 5) {
    need.clickCount = 1;
  } else {
    need.clickCount += 1;
  }
  
  need.updatedAt = new Date().toISOString();
  
  // Track who boosted (for analytics)
  const userId = currentUser?.id || getGuestStorageId();
  if (!need.boostedBy.includes(userId)) {
    need.boostedBy.push(userId);
  }
  
  saveGlobalNodeNeeds();
  
  // Update marker display
  updateNodeNeedMarker(need);
  console.log(`NodeNeed ${needId} boosted. Level: ${need.clickCount}/5`);
  return need;
}

/**
 * Update NodeNeed status
 * @param {string} needId - ID of the NodeNeed
 * @param {string} newStatus - New status ('pending', 'provisioning', 'fulfilled')
 */
function updateNodeNeedStatus(needId, newStatus) {
  if (!VALID_STATUSES.includes(newStatus)) {
    console.error(`Invalid status: ${newStatus}. Must be one of: ${VALID_STATUSES.join(', ')}`);
    return null;
  }
  
  const need = nodeNeeds.find(n => n.id === needId);
  if (!need) {
    console.error(`NodeNeed not found: ${needId}`);
    return null;
  }
  
  need.status = newStatus;
  need.updatedAt = new Date().toISOString();
  saveGlobalNodeNeeds();
  updateNodeNeedMarker(need);
  return need;
}

/**
 * Toggle map view filter between 'active' (Studios) and 'needs' (NodeNeeds)
 * @param {string} filter - 'all', 'active', or 'needs'
 */
function setNodeNeedFilter(filter) {
  if (!['all', 'active', 'needs'].includes(filter)) {
    console.error(`Invalid filter: ${filter}. Must be 'all', 'active', or 'needs'`);
    return;
  }
  nodeNeedFilter = filter;
  renderNodeNeedsOnMap();
}

/**
 * Save NodeNeeds to global localStorage (cross-user visibility)
 */
function saveGlobalNodeNeeds() {
  localStorage.setItem('neofolk.globalNodeNeeds', JSON.stringify(nodeNeeds));
}

/**
 * Load NodeNeeds from global localStorage
 */
function loadGlobalNodeNeeds() {
  const stored = localStorage.getItem('neofolk.globalNodeNeeds');
  if (stored) {
    const loaded = JSON.parse(stored);
    nodeNeeds.length = 0;
    nodeNeeds.push(...loaded);
  }
  
  // Ensure guest ID exists for tracking
  if (!localStorage.getItem('neofolk.guestId')) {
    getGuestStorageId();
  }
}

/**
 * Get color for token type
 * @param {string} tokenType 
 * @returns {string} Hex color
 */
function getTokenColor(tokenType) {
  const colors = {
    'Spivaks': '#9c59b6',
    'Shakuntis': '#f39c12',
    'Bhattas': '#3498db',
    'Janakis': '#27ae60',
    'Thapars': '#e74c3c',
    'Ambedis': '#ff69b4',
    'Bhanus': '#ff7f50',
    'Sarabhs': '#1abc9c',
    'Arunas': '#9b59b6',
    'Gagas': '#16a085'
  };
  return colors[tokenType] || '#d4a373';
}

/**
 * Render a single NodeNeed marker on map
 * @param {object} need - NodeNeed object
 */
function renderNodeNeedMarker(need) {
  if (!window.nodeNeedMarkers) window.nodeNeedMarkers = {};
  
  // Remove existing marker if any
  if (window.nodeNeedMarkers[need.id]) {
    window.mapInstance.removeLayer(window.nodeNeedMarkers[need.id]);
  }
  
  // Check if should show based on filter
  if (nodeNeedFilter === 'active') return; // Only show active nodes
  
  const color = getTokenColor(need.tokenType);
  
  // Custom Icon with Pulsing Effect (5-Stage CSS Classes)
  const markerIcon = L.divIcon({
    className: 'node-need-marker',
    html: `
      <div class="node-pulse level-${need.clickCount}" style="--node-color: ${color};">
        <span class="click-count">${need.clickCount}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const marker = L.marker(need.coordinates, {
    icon: markerIcon,
    riseOnHover: true
  }).addTo(window.mapInstance);
  
  // Click handler to boost - always interactive
  marker.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    supportNodeNeed(need.id);
  });
  
  // Tooltip with specific formatting: [Domain] > [Subject] | Tags: #tag1, #tag2 | Urgency: X/5
  const tagsStr = need.tags.length > 0 ? ` | Tags: ${need.tags.map(t => '#' + t).join(', ')}` : '';
  const tooltipContent = `
    <div style="font-family:monospace; padding:6px; background:#000; border:1px solid ${color}; color:#fff; font-size:11px; white-space:nowrap;">
      <strong>${need.domain} &gt; ${need.subject}</strong>${tagsStr} | Urgency: ${need.clickCount}/5
      <br><span style="font-size:9px; opacity:0.5; margin-top:4px; display:block;">
        CLICK TO BOOST
      </span>
    </div>
  `;
  
  marker.bindTooltip(tooltipContent, { sticky: true, opacity: 0.95 });
  
  window.nodeNeedMarkers[need.id] = marker;
}

/**
 * Show a radial menu to select domain and enter subject/tags at coordinates
 * @param {number} lat 
 * @param {number} lng 
 */
function showRadialMenu(lat, lng) {
  // Remove any existing menu
  const existing = document.getElementById('radial-menu-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'radial-menu-overlay';
  overlay.innerHTML = `
    <div class="radial-container">
      <div class="radial-center">
        <span>SIGNAL</span>
        <strong>NEED</strong>
      </div>
      ${VALID_DOMAINS.map((domain, i) => {
        const angle = (i / VALID_DOMAINS.length) * (2 * Math.PI) - (Math.PI / 2);
        const radius = 110;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const color = getTokenColor(DOMAIN_TO_TOKEN[domain]);
        return `
          <div class="radial-item" 
               style="transform: translate(${x}px, ${y}px); --token-color: ${color};"
               onclick="window.showNeedForm(${lat}, ${lng}, '${domain}', '${color}');">
            <span>${domain}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
  
  document.body.appendChild(overlay);
}

/**
 * Show form to enter subject and tags for a new need
 * @param {number} lat 
 * @param {number} lng 
 * @param {string} domain 
 * @param {string} color 
 */
window.showNeedForm = function(lat, lng, domain, color) {
  // Remove radial menu
  const radial = document.getElementById('radial-menu-overlay');
  if (radial) radial.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'need-form-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10003;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  `;
  
  overlay.innerHTML = `
    <div style="background: var(--ink, #1a1614); border: 1px solid ${color}; padding: 30px; width: 350px; max-width: 90%; border-radius: 4px;">
      <h3 style="color: ${color}; margin: 0 0 20px 0; font-family: var(--serif, 'Cormorant Garamond'); font-size: 1.5rem;">
        ${domain}
      </h3>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; color: var(--muted-text); font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
          Subject *
        </label>
        <input type="text" id="need-subject" placeholder="e.g., Sanskrit, Permaculture..." 
               style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); color: var(--parchment); font-family: monospace; box-sizing: border-box;">
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; color: var(--muted-text); font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
          Tags (comma separated)
        </label>
        <input type="text" id="need-tags" placeholder="e.g., library, community-garden..." 
               style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); color: var(--parchment); font-family: monospace; box-sizing: border-box;">
      </div>
      
      <div style="display: flex; gap: 10px;">
        <button onclick="window.submitNeed(${lat}, ${lng}, '${domain}')" 
                style="flex: 1; background: ${color}; border: none; color: #000; padding: 12px; cursor: pointer; font-weight: bold; font-family: monospace;">
          DROP SIGNAL
        </button>
        <button onclick="document.getElementById('need-form-overlay').remove()" 
                style="flex: 1; background: none; border: 1px solid var(--border-color); color: var(--muted-text); padding: 12px; cursor: pointer; font-family: monospace;">
          CANCEL
        </button>
      </div>
    </div>
  `;
  
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
  
  document.body.appendChild(overlay);
  
  // Focus subject input
  setTimeout(() => document.getElementById('need-subject')?.focus(), 100);
};

/**
 * Submit a new need from the form
 */
window.submitNeed = function(lat, lng, domain) {
  const subjectInput = document.getElementById('need-subject');
  const tagsInput = document.getElementById('need-tags');
  
  const subject = subjectInput?.value.trim();
  if (!subject) {
    subjectInput.style.borderColor = '#e74c3c';
    return;
  }
  
  const tagsStr = tagsInput?.value.trim() || '';
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
  
  dropNeedSignal(lat, lng, domain, subject, tags);
  
  // Close form
  document.getElementById('need-form-overlay')?.remove();
};

/**
 * Update existing marker display
 */
function updateNodeNeedMarker(need) {
  renderNodeNeedMarker(need);
}

/**
 * Render all NodeNeeds on map based on current filter
 */
function renderNodeNeedsOnMap() {
  if (!window.mapInstance) return;
  
  // Clear existing markers
  if (window.nodeNeedMarkers) {
    Object.values(window.nodeNeedMarkers).forEach(marker => {
      window.mapInstance.removeLayer(marker);
    });
  }
  window.nodeNeedMarkers = {};
  
  // Render based on filter
  if (nodeNeedFilter === 'all' || nodeNeedFilter === 'needs') {
    nodeNeeds.forEach(need => renderNodeNeedMarker(need));
  }
  
  // TODO: Render active nodes (Studios) when filter is 'all' or 'active'
}

// ============================================================
// CURATOR CARD SYSTEM - License and credentials management
// ============================================================

// Curator cards collection
const curatorCards = [];

// Valid license levels
const LICENSE_LEVELS = ['Level 1', 'Level 2', 'Level 3'];

/**
 * Create a new Curator Card (License)
 * @param {string} fullName - Curator's full name
 * @param {number} age - Curator's age
 * @param {string[]} activeLicenses - Array of licenses (e.g., ['Level 3 Lingosophy'])
 * @returns {object} The created CuratorCard object
 */
function createCuratorCard(fullName, age, activeLicenses = []) {
  const userId = currentUser?.id || getGuestStorageId();
  
  const card = {
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: userId,
    fullName: fullName,
    age: age,
    activeLicenses: activeLicenses,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active' // 'active', 'suspended', 'expired'
  };
  
  curatorCards.push(card);
  saveCuratorCards();
  return card;
}

/**
 * Get curator card for current user
 * @returns {object|null} CuratorCard or null if not found
 */
function getMyCuratorCard() {
  const userId = currentUser?.id || getGuestStorageId();
  return curatorCards.find(c => c.userId === userId) || null;
}

/**
 * Add a license to an existing curator card
 * @param {string} cardId 
 * @param {string} license 
 */
function addLicenseToCard(cardId, license) {
  const card = curatorCards.find(c => c.id === cardId);
  if (!card) {
    console.error(`CuratorCard not found: ${cardId}`);
    return null;
  }
  
  if (!card.activeLicenses.includes(license)) {
    card.activeLicenses.push(license);
    card.updatedAt = new Date().toISOString();
    saveCuratorCards();
  }
  return card;
}

/**
 * Save curator cards to localStorage
 */
function saveCuratorCards() {
  localStorage.setItem('neofolk.curatorCards', JSON.stringify(curatorCards));
}

/**
 * Load curator cards from localStorage
 */
function loadCuratorCards() {
  const stored = localStorage.getItem('neofolk.curatorCards');
  if (stored) {
    const loaded = JSON.parse(stored);
    curatorCards.length = 0;
    curatorCards.push(...loaded);
  }
}

// Expose curator card functions globally
window.createCuratorCard = createCuratorCard;
window.getMyCuratorCard = getMyCuratorCard;
window.addLicenseToCard = addLicenseToCard;

// ============================================================
// MODULE SYSTEM - Module creation with curatorCardID requirement
// ============================================================

// Modules collection
const modules = [];

/**
 * Create a new Module (requires curatorCardID)
 * @param {string} title - Module title
 * @param {string} description - Module description
 * @param {string} domain - Domain from VALID_DOMAINS
 * @param {string} curatorCardID - ID of curator's license card
 * @returns {object} The created Module object
 */
function createModule(title, description, domain, curatorCardID) {
  // Validate curator card exists
  const card = curatorCards.find(c => c.id === curatorCardID);
  if (!card) {
    console.error(`Cannot create module: Invalid curatorCardID ${curatorCardID}`);
    return null;
  }
  
  // Validate domain
  if (!VALID_DOMAINS.includes(domain)) {
    console.error(`Invalid domain: ${domain}`);
    return null;
  }
  
  const module = {
    id: `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: title,
    description: description,
    domain: domain,
    curatorCardID: curatorCardID,
    curatorName: card.fullName,
    batches: [], // Array of batch IDs
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active' // 'active', 'archived', 'draft'
  };
  
  modules.push(module);
  saveModules();
  return module;
}

/**
 * Get module by ID
 * @param {string} moduleId 
 */
function getModule(moduleId) {
  return modules.find(m => m.id === moduleId) || null;
}

/**
 * Get all modules for a curator
 * @param {string} curatorCardID 
 */
function getModulesByCurator(curatorCardID) {
  return modules.filter(m => m.curatorCardID === curatorCardID);
}

/**
 * Save modules to localStorage
 */
function saveModules() {
  localStorage.setItem('neofolk.modules', JSON.stringify(modules));
}

/**
 * Load modules from localStorage
 */
function loadModules() {
  const stored = localStorage.getItem('neofolk.modules');
  if (stored) {
    const loaded = JSON.parse(stored);
    modules.length = 0;
    modules.push(...loaded);
  }
}

// Expose module functions globally
window.createModule = createModule;
window.getModule = getModule;
window.getModulesByCurator = getModulesByCurator;

// ============================================================
// ATTENDANCE SYSTEM - Module > Batch > Attendance Log
// ============================================================

/**
 * Create a new Batch for a Module
 * @param {string} moduleId - Parent module ID
 * @param {string} batchName - Name of the batch
 * @param {string[]} studentIds - Array of enrolled student IDs
 */
function createBatch(moduleId, batchName, studentIds = []) {
  const module = getModule(moduleId);
  if (!module) {
    console.error(`Cannot create batch: Module not found ${moduleId}`);
    return null;
  }
  
  const batch = {
    id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    moduleId: moduleId,
    moduleTitle: module.title,
    name: batchName,
    studentIds: studentIds,
    attendanceLogs: [], // Array of daily logs
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  
  // Add batch to module
  module.batches.push(batch.id);
  saveModules();
  
  // Store batch separately
  const batches = JSON.parse(localStorage.getItem('neofolk.batches') || '[]');
  batches.push(batch);
  localStorage.setItem('neofolk.batches', JSON.stringify(batches));
  
  return batch;
}

/**
 * Toggle attendance status for a student (Present/Absent)
 * @param {string} batchId 
 * @param {string} date 
 * @param {string} studentId 
 * @returns {string} New status ('present' or 'absent')
 */
function toggleAttendance(batchId, date, studentId) {
  const batches = JSON.parse(localStorage.getItem('neofolk.batches') || '[]');
  const batch = batches.find(b => b.id === batchId);
  
  if (!batch) {
    console.error(`Batch not found: ${batchId}`);
    return null;
  }
  
  // Find or create log for this date
  let log = batch.attendanceLogs.find(l => l.date === date);
  if (!log) {
    log = {
      id: `log_${Date.now()}`,
      batchId: batchId,
      date: date,
      records: {},
      recordedAt: new Date().toISOString(),
      recordedBy: currentUser?.id || 'guest'
    };
    batch.attendanceLogs.push(log);
  }
  
  // Toggle status
  const currentStatus = log.records[studentId];
  const newStatus = currentStatus === 'present' ? 'absent' : 'present';
  log.records[studentId] = newStatus;
  
  localStorage.setItem('neofolk.batches', JSON.stringify(batches));
  
  // Sync to student dashboard
  syncAttendanceToStudents(batch, log);
  
  return newStatus;
}

/**
 * Sync attendance data to student dashboards
 * @param {object} batch 
 * @param {object} logEntry 
 */
function syncAttendanceToStudents(batch, logEntry) {
  Object.keys(logEntry.records).forEach(studentId => {
    const key = `neofolk.attendance.${studentId}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    
    const record = {
      batchId: batch.id,
      batchName: batch.name,
      moduleId: batch.moduleId,
      moduleTitle: batch.moduleTitle,
      date: logEntry.date,
      status: logEntry.records[studentId],
      recordedAt: logEntry.recordedAt
    };
    
    const existingIndex = history.findIndex(h => h.batchId === batch.id && h.date === logEntry.date);
    if (existingIndex >= 0) {
      history[existingIndex] = record;
    } else {
      history.push(record);
    }
    
    localStorage.setItem(key, JSON.stringify(history));
  });
}

/**
 * Get attendance history for a student
 * @param {string} studentId 
 */
function getStudentAttendance(studentId) {
  return JSON.parse(localStorage.getItem(`neofolk.attendance.${studentId}`) || '[]');
}

// Expose attendance functions globally
window.createBatch = createBatch;
window.toggleAttendance = toggleAttendance;
window.getStudentAttendance = getStudentAttendance;

// ============================================================
// GUILD SYSTEM - Instant Guilds with invites
// ============================================================

// Guilds collection
const guilds = [];

/**
 * Create a new Guild
 * @param {string} name - Guild name
 * @param {string} description - Guild description
 * @param {string} ownerId - Creator's user ID
 */
function createGuild(name, description, ownerId) {
  const guild = {
    id: `guild_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name,
    description: description,
    ownerId: ownerId,
    members: [ownerId],
    invited: [], // Array of pending invites { targetId, invitedAt, invitedBy }
    sharedModules: [], // Guild-shared module IDs
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  guilds.push(guild);
  saveGuilds();
  return guild;
}

window.showInstantCraft = function() {
  const ownerId = currentUser?.id || getGuestStorageId();
  const name = window.prompt('Name this guild or craft circle.');
  if (!name || !name.trim()) return;

  const description = window.prompt('Add a short description for the group.', '') || '';
  const guild = createGuild(name.trim(), description.trim(), ownerId);
  if (!guild) {
    alert('Unable to create guild right now.');
    return;
  }

  window.location.reload();
};

/**
 * Invite a profile to a guild
 * @param {string} guildId 
 * @param {string} targetId - User ID to invite
 */
function inviteProfile(guildId, targetId) {
  const guild = guilds.find(g => g.id === guildId);
  if (!guild) {
    console.error(`Guild not found: ${guildId}`);
    return null;
  }
  
  if (guild.members.includes(targetId)) {
    console.log(`User ${targetId} is already a member`);
    return null;
  }
  
  const existingInvite = guild.invited.find(i => i.targetId === targetId);
  if (existingInvite) {
    console.log(`User ${targetId} already has a pending invite`);
    return existingInvite;
  }
  
  const invite = {
    targetId: targetId,
    invitedAt: new Date().toISOString(),
    invitedBy: currentUser?.id || 'guest'
  };
  
  guild.invited.push(invite);
  saveGuilds();
  
  // Add to target's pending invites
  const pendingKey = `neofolk.pendingInvites.${targetId}`;
  const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
  pending.push({
    guildId: guild.id,
    guildName: guild.name,
    invitedAt: invite.invitedAt,
    invitedBy: invite.invitedBy
  });
  localStorage.setItem(pendingKey, JSON.stringify(pending));
  
  return invite;
}

/**
 * Accept a guild invite
 * @param {string} userId 
 * @param {string} guildId 
 */
function acceptGuildInvite(userId, guildId) {
  const guild = guilds.find(g => g.id === guildId);
  if (!guild) return null;
  
  // Remove from pending invites
  const pendingKey = `neofolk.pendingInvites.${userId}`;
  const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
  const filtered = pending.filter(p => p.guildId !== guildId);
  localStorage.setItem(pendingKey, JSON.stringify(filtered));
  
  // Remove from guild's invited list
  guild.invited = guild.invited.filter(i => i.targetId !== userId);
  
  // Add to members
  if (!guild.members.includes(userId)) {
    guild.members.push(userId);
  }
  
  saveGuilds();
  return guild;
}

/**
 * Decline a guild invite
 * @param {string} userId 
 * @param {string} guildId 
 */
function declineGuildInvite(userId, guildId) {
  const guild = guilds.find(g => g.id === guildId);
  if (guild) {
    guild.invited = guild.invited.filter(i => i.targetId !== userId);
    saveGuilds();
  }
  
  const pendingKey = `neofolk.pendingInvites.${userId}`;
  const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
  const filtered = pending.filter(p => p.guildId !== guildId);
  localStorage.setItem(pendingKey, JSON.stringify(filtered));
  
  return true;
}

/**
 * Handle Syllabus Item Addition
 */
window.addSyllabusItem = function(title = '', details = '') {
  const container = document.getElementById('syllabus-items');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'syllabus-item-card';
  div.innerHTML = `
    <div class="syllabus-item-header">
      <input class="neo-input syllabus-input" data-syllabus-field="title" placeholder="Syllabus item title" value="${escapeHtml(title)}">
      <button onclick="this.closest('.syllabus-item-card').remove()" class="btn-ghost syllabus-remove-button" type="button">&times;</button>
    </div>
    <textarea class="neo-input syllabus-input-detail" data-syllabus-field="details" rows="3" placeholder="What is inside this item? Add concepts, activities, texts, or outputs.">${escapeHtml(details)}</textarea>
  `;
  container.appendChild(div);
};

/**
 * Save Module with Advanced Schema
 */
window.saveModuleAdvanced = async function() {
  const editId = document.getElementById('mod-edit-id')?.value;
  const title = document.getElementById('mod-title')?.value;
  const desc = document.getElementById('mod-desc')?.value;
  const weeks = parseInt(document.getElementById('mod-weeks')?.value || '1');
  const capacity = parseInt(document.getElementById('mod-capacity')?.value || '20');
  const locName = document.getElementById('mod-loc-name')?.value;
  const domain = document.getElementById('mod-domain')?.value || 'lingosophy';
  const syllabus = Array.from(document.querySelectorAll('.syllabus-item-card'))
    .map((item) => ({
      title: item.querySelector('[data-syllabus-field="title"]')?.value.trim() || '',
      details: item.querySelector('[data-syllabus-field="details"]')?.value.trim() || '',
    }))
    .filter((item) => item.title || item.details);

  if (!title) return alert('Title is required');
  if (!syllabus.length) return alert('Add at least one syllabus item');

  // Check for curator card
  const myCard = getMyCuratorCard();
  if (!myCard) {
    alert('You need a curator license to create or edit modules. Please apply for curator status first.');
    return;
  }

  let module;
  if (editId) {
    module = getModule(editId);
    if (!module) return alert('Module to edit not found');
    
    // Check ownership
    if (module.curatorCardID !== myCard.id) return alert('You do not have permission to edit this module');
    
    module.title = title;
    module.description = desc;
    module.domain = domain;
    module.updatedAt = new Date().toISOString();
  } else {
    // Create module using curator card system
    module = createModule(title, desc, domain, myCard.id);
  }

  if (!module) {
    alert('Operation failed. Please check your curator license.');
    return;
  }

  // Add/Update additional fields
  module.durationWeeks = weeks;
  module.maxCapacity = capacity;
  module.locationName = locName;
  module.syllabus = syllabus;

  // Save to localStorage
  saveModules();

  // Also try to save to Supabase if available
  const supabase = getSupabaseClient();
  if (supabase && currentUser) {
    try {
      if (editId) {
        await supabase.from('modules').update({
          title: title,
          description: desc,
          domain: domain,
          duration_weeks: weeks,
          max_capacity: capacity,
          location_name: locName,
          syllabus: syllabus,
          updated_at: new Date()
        }).eq('local_id', editId);
      } else {
        await supabase.from('modules').insert({
          curator_id: currentUser.id,
          title: title,
          description: desc,
          domain: domain,
          duration_weeks: weeks,
          max_capacity: capacity,
          location_name: locName,
          syllabus: syllabus,
          is_published: true,
          local_id: module.id
        });
      }
    } catch (e) {
      console.warn('Supabase save failed, using local storage only:', e);
    }
  }

  alert(editId ? 'Module updated successfully!' : 'Module created successfully!');
  window.location.assign('teaching-log.html');
};

/**
 * Render Public Profile View
 */
async function renderPublicProfile(container, username) {
  const supabase = getSupabaseClient();
  let profileData = null;
  let scoreData = null;

  if (supabase) {
    const { data: profile } = await supabase.from('curator_profiles').select('*').eq('name', username).single();
    profileData = profile;
    const { data: score } = await supabase.from('neo_scores').select('*').eq('user_id', profile?.user_id).single();
    scoreData = score;
  }

  container.innerHTML = `
    <div class="dashboard-shell">
      <div class="dashboard-header">
        <p class="section-label">${escapeHtml(t('profile.curatorStatus'))}</p>
        <h1>${escapeHtml(username)}</h1>
      </div>
      <div class="card" style="display:grid; grid-template-columns: 1fr 2fr; gap:30px;">
        <div style="text-align:center;">
          <div style="width:120px; height:120px; border-radius:50%; background:var(--gold); margin:0 auto 16px; display:flex; align-items:center; justify-content:center; font-size:2rem; color:#000;">
            ${username[0]}
          </div>
          <h3>Neo Score: ${scoreData?.score || 0}</h3>
        </div>
        <div>
          <h3>${escapeHtml(t('profile.academicRecord'))}</h3>
          <p>${escapeHtml(profileData?.teaching_style || 'This researcher has not updated their bio yet.')}</p>
          <div style="margin-top:20px;">
            <p><strong>Domains:</strong> ${profileData?.domains?.join(', ') || 'General'}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Near Me - Surfacing local learning
 */
window.renderNearbyModules = function() {
  const container = document.getElementById('near-me-root') || document.body; // Fallback
  
  if (!navigator.geolocation) {
    alert(t('messages.locationUnavailableBody'));
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    const supabase = getSupabaseClient();
    
    if (supabase) {
      // In a real app with PostGIS:
      // const { data } = await supabase.rpc('get_nearby_modules', { lat: latitude, lng: longitude, radius_m: 10000 });
      // For now, let's just query modules with locations
      const { data } = await supabase.from('modules').select('*').not('location_name', 'is', null);
      
      const resultsHTML = data?.map(m => `
        <div class="record-card">
          <h3>${escapeHtml(m.title)}</h3>
          <p>${escapeHtml(m.location_name)}</p>
          <button class="btn" ${m.current_enrollment >= m.max_capacity ? 'disabled' : ''}>
            ${m.current_enrollment >= m.max_capacity ? t('modules.moduleFull') : t('modules.enroll')}
          </button>
        </div>
      `).join('') || '<p>No nearby modules found.</p>';

      container.innerHTML = `
        <div class="dashboard-shell">
          <div class="dashboard-header">
            <p class="section-label">${escapeHtml(t('modules.nearMe'))}</p>
            <h1>${escapeHtml(t('modules.nearbyModules'))}</h1>
          </div>
          <div class="record-list">${resultsHTML}</div>
        </div>
      `;
    }
  });
};

/**
 * Handle Search Centering on Map
 * @param {string} query 
 */
window.handleMapSearch = function(query) {
  if (!query) return;
  // Mock geocoding: In a real app, this would use a Geocoding API
  const cities = {
    'bangalore': [12.9716, 77.5946],
    'delhi': [28.6139, 77.2090],
    'mumbai': [19.0760, 72.8777],
    'chennai': [13.0827, 80.2707],
    'kolkata': [22.5726, 88.3639],
    'pune': [18.5204, 73.8567]
  };
  
  const target = cities[query.toLowerCase()] || [20.5937 + (Math.random()-0.5)*5, 78.9629 + (Math.random()-0.5)*5];
  
  if (window.mapInstance) {
    window.mapInstance.setView(target, 13);
    
    // If in demand mode, drop radial menu automatically
    if (demandModeActive) {
      showRadialMenu(target[0], target[1]);
    }
  }
};

/**
 * Get pending invites for a user
 * @param {string} userId 
 */
function getPendingInvites(userId) {
  return JSON.parse(localStorage.getItem(`neofolk.pendingInvites.${userId}`) || '[]');
}

/**
 * Share a module with guild
 * @param {string} guildId 
 * @param {string} moduleId 
 */
function shareModuleWithGuild(guildId, moduleId) {
  const guild = guilds.find(g => g.id === guildId);
  if (!guild) {
    console.error(`Guild not found: ${guildId}`);
    return null;
  }
  
  if (!guild.sharedModules.includes(moduleId)) {
    guild.sharedModules.push(moduleId);
    saveGuilds();
  }
  
  return guild;
}

/**
 * Get user's guilds
 * @param {string} userId 
 */
function getUserGuilds(userId) {
  return guilds.filter(g => g.members.includes(userId));
}

/**
 * Save guilds to localStorage
 */
function saveGuilds() {
  localStorage.setItem('neofolk.guilds', JSON.stringify(guilds));
}

/**
 * Load guilds from localStorage
 */
function loadGuilds() {
  const stored = localStorage.getItem('neofolk.guilds');
  if (stored) {
    const loaded = JSON.parse(stored);
    guilds.length = 0;
    guilds.push(...loaded);
  }
}

// Expose guild functions globally
window.createGuild = createGuild;
window.inviteProfile = inviteProfile;
window.acceptGuildInvite = acceptGuildInvite;
window.declineGuildInvite = declineGuildInvite;
window.getPendingInvites = getPendingInvites;
window.shareModuleWithGuild = shareModuleWithGuild;
window.getUserGuilds = getUserGuilds;

function calculateNeoscore(domains) {
  const values = Object.values(domains);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(avg * 10);
}

function calculateSpecscore(spec) {
  const values = Object.values(spec || {}).filter((value) => Number.isFinite(value));
  return values.length ? Math.max(...values) : 0;
}

function getLiveTopology(userData) {
    const domains = userData.domains || { ...defaultNeoDomains };
    const specs = userData.specializations || { ...defaultNeoSpecialization };
    
    const domainValues = Object.values(domains);
    const neoscore = domainValues.length > 0 ? (domainValues.reduce((a, b) => a + b, 0) / 10) * 10 : 0;
    
    const specscore = Object.values(specs).length > 0 ? Math.max(...Object.values(specs)) : 0;
    
    return { neoscore, specscore, domains, specs };
}

function toggleNeoscore() {
  const el = document.getElementById("neoscore-analysis");
  if (el) el.classList.toggle("hidden");
}

window.forceNavigateToTopology = async function(userData) {
    if (userData) {
        renderTopologyPage(userData);
        return;
    }

    const userId = currentUser?.id || 'guest';
    const supabase = getSupabaseClient();
    
    const liveDomains = { ...defaultNeoDomains };
    const liveSpecs = {};

    if (supabase && currentUser) {
        try {
            // 1. Fetch completed modules and map to domains
            const { data: enrolled } = await supabase
                .from('enrolled_modules')
                .select('module_id')
                .eq('user_id', currentUser.id)
                .eq('status', 'completed');

            if (enrolled?.length) {
                const modIds = enrolled.map(e => e.module_id);
                const { data: mods } = await supabase
                    .from('modules')
                    .select('domain')
                    .in('id', modIds);

                mods?.forEach(m => {
                    const d = m.domain?.toLowerCase();
                    if (liveDomains.hasOwnProperty(d)) liveDomains[d] += 1;
                    else if (d === 'arthmetics') liveDomains.arithmetics += 1; // Fix legacy spelling
                });
            }

            // 2. Fetch specializations from breakdown
            const { data: scoreRec } = await supabase
                .from('neo_scores')
                .select('breakdown')
                .eq('user_id', currentUser.id)
                .eq('role', 'seeker')
                .single();

            if (scoreRec?.breakdown?.specializations) {
                Object.assign(liveSpecs, scoreRec.breakdown.specializations);
            }
        } catch (e) {
            console.error("Topology fetch failed:", e);
        }
    } else {
        // Fallback to local storage if no user
        const storedDomains = JSON.parse(localStorage.getItem(`neofolk.domains.${userId}`) || 'null');
        const storedSpec = JSON.parse(localStorage.getItem(`neofolk.spec.${userId}`) || 'null');
        if (storedDomains) Object.assign(liveDomains, storedDomains);
        if (storedSpec) Object.assign(liveSpecs, storedSpec);
    }

    renderTopologyPage({ domains: liveDomains, specializations: liveSpecs });
};

// Knowledge Topology Immersive Page with High-Fidelity Dashboard
function renderTopologyPage(userData) {
    const { neoscore, specscore, domains, specs } = getLiveTopology(userData);
    const mainArea = document.querySelector('.neo-main') || document.getElementById('content');
    if (!mainArea) return;

    mainArea.innerHTML = `
    <div class="topology-immersion" style="background:#0f0d0c; min-height:100vh; padding:40px; font-family:monospace; color:#d4a373; animation: fadeIn 0.4s ease; position: relative; z-index: 1000;">
        <div style="max-width:1200px; margin:0 auto;">
            <header class="topology-header" style="margin-bottom:40px; display:flex; justify-content:space-between; align-items:flex-end;">
                <div>
                    <h1 style="font-family:'Cormorant Garamond', serif; font-size:2.5rem; color:#fff; margin:0;">Knowledge Topology</h1>
                    <p style="color:#555; margin:5px 0 0 0; letter-spacing:1px; font-size: 0.75rem;">INTELLECTUAL SHAPE & DIRECTION VECTOR</p>
                </div>
                <button onclick="location.reload()" style="background:none; border:1px solid #2a2420; color:#8b8276; padding:10px 20px; cursor:pointer; font-size:10px; text-transform:uppercase; letter-spacing:1px;">[ ESC / RETURN ]</button>
            </header>

            <!-- HERO METRICS -->
            <div class="topology-hero-metrics" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                <div style="background:#1a1614; padding:30px; border:1px solid #2a2420; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:10px; color:#555; letter-spacing:2px;">NEOSCORE (BREADTH)</span>
                        <div style="font-size:4.5rem; color:#fff; font-weight:bold;">${neoscore.toFixed(1)}<span style="font-size:1rem; color:#333;">/100</span></div>
                    </div>
                    <svg width="100" height="100" style="transform:rotate(-90deg)">
                        <circle cx="50" cy="50" r="45" stroke="#222" stroke-width="4" fill="none"/>
                        <circle cx="50" cy="50" r="45" stroke="#d4a373" stroke-width="4" fill="none" stroke-dasharray="283" stroke-dashoffset="${283 - (283 * neoscore / 100)}" />
                    </svg>
                </div>
                <div style="background:#1a1614; padding:30px; border:1px solid #2a2420;">
                    <span style="font-size:10px; color:#555; letter-spacing:2px;">SPECSCORE (DEPTH)</span>
                    <div style="font-size:4.5rem; color:#fff; font-weight:bold;">${specscore}</div>
                    <div style="height:4px; width:100%; background:#222; margin-top:10px;"><div style="height:100%; width:${Math.min(specscore, 100)}%; background:#d4a373;"></div></div>
                </div>
            </div>

            <!-- CHART GRID -->
            <div class="topology-grid-2" style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:20px; margin-bottom:20px;">
                <div style="background:#1a1614; padding:30px; border:1px solid #2a2420;">
                    <h3 style="font-size:10px; margin-bottom:20px; color:#8b8276; text-transform: uppercase; letter-spacing: 2px;">DOMAIN SHAPE (RADAR)</h3>
                    <div class="topology-chart-container" style="height:400px;"><canvas id="radarChart"></canvas></div>
                </div>
                <div style="background:#1a1614; padding:30px; border:1px solid #2a2420;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h3 style="font-size:10px; color:#8b8276; text-transform: uppercase; letter-spacing: 2px; margin:0;">SPECIALIZATION FOCUS (DONUT)</h3>
                        <button onclick="window.manageSpecializations()" style="background:none; border:1px solid #2a2420; color:#c6a96b; padding:4px 8px; cursor:pointer; font-size:9px; text-transform:uppercase;">MANAGE</button>
                    </div>
                    <div class="topology-chart-container" style="height:350px; display:flex; justify-content:center; align-items:center; position:relative;">
                        <canvas id="donutChart"></canvas>
                        <div class="donut-center-label" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; pointer-events:none;">
                            <p style="font-size:10px; color:#555; text-transform:uppercase; margin:0;">Specscore</p>
                            <p style="font-size:32px; color:#fff; font-weight:bold; margin:0;">${specscore}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SPECIALIZATION SELECTION MODAL -->
            <div id="spec-modal" class="hidden" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:10001; display:flex; align-items:center; justify-content:center; padding:20px;">
                <div style="background:linear-gradient(135deg, #1a1614 0%, #2c1f1a 100%); border:1px solid var(--gold); border-radius:12px; padding:40px; width:520px; max-width:100%; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(198,169,107,0.05);">
                    <div style="position:absolute; top:0; left:0; right:0; height:4px; background:var(--gold); border-radius:12px 12px 0 0; box-shadow:0 0 15px var(--gold);"></div>
                    
                    <div style="text-align:center; margin-bottom:30px;">
                        <h2 style="font-family:'Cormorant Garamond', serif; color:var(--gold); font-size:1.8rem; margin:0 0 10px 0; font-weight:600;">Subjects of Specialization</h2>
                        <p style="color:#8b8276; font-size:12px; margin:0; line-height:1.5;">Select domains to deepen your expertise. Each specialization increases your depth score and shapes your intellectual profile.</p>
                    </div>
                    
                    <div id="spec-list" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:35px; max-height:400px; overflow-y:auto; padding-right:10px;">
                        ${domainKeys.map(k => {
                            const color = getTokenColor(DOMAIN_TO_TOKEN[k] || k);
                            return `
                                <label style="display:flex; align-items:center; gap:12px; cursor:pointer; color:#c6a96b; font-size:13px; padding:16px; background:rgba(0,0,0,0.3); border:1px solid rgba(198,169,107,0.1); border-radius:8px; transition:all 0.3s ease; position:relative; overflow:hidden;">
                                    <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:${color}; opacity:0;"></div>
                                    <input type="checkbox" name="spec-item" value="${k}" style="accent-color:${color}; width:18px; height:18px; position:relative; z-index:2;">
                                    <div style="flex:1;">
                                        <div style="font-weight:600; margin-bottom:4px; color:var(--gold);">${DOMAIN_NAMES[k]}</div>
                                        <div style="font-size:10px; color:#8b8276; text-transform:uppercase; letter-spacing:1px;">${DOMAIN_TO_TOKEN[k] || k}</div>
                                    </div>
                                </label>
                            `;
                        }).join('')}
                    </div>
                    
                    <div style="display:flex; gap:12px;">
                        <button onclick="window.saveSpecializations()" style="flex:1; background:var(--gold); border:none; color:#000; padding:14px; cursor:pointer; font-weight:600; font-family:var(--serif); font-size:14px; border-radius:6px; transition:all 0.3s ease; box-shadow:0 4px 15px rgba(198,169,107,0.3);">
                            SAVE SPECIALIZATIONS
                        </button>
                        <button onclick="document.getElementById('spec-modal').classList.add('hidden')" style="flex:1; background:none; border:1px solid var(--gold); color:var(--gold); padding:14px; cursor:pointer; font-family:var(--serif); font-size:14px; border-radius:6px; transition:all 0.3s ease;">
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>


            <!-- DOMAIN INTENSITY (Canvas Bar Chart Style) -->
            <div style="background:#1a1614; padding:30px; border:1px solid #2a2420; margin-bottom:20px;">
                <h3 style="font-size:10px; margin-bottom:20px; color:#8b8276; text-transform: uppercase; letter-spacing: 2px;">DOMAIN INTENSITY (TOKEN HARVEST)</h3>
                <canvas id="intensityBarChart" height="150" style="width:100%;"></canvas>
            </div>

            <!-- RESONANCE FRAMEWORK (TOKENS) -->
            <div style="background:#1a1614; padding:30px; border:1px solid #2a2420;">
                <h3 style="font-size:10px; margin-bottom:24px; color:#8b8276; text-transform: uppercase; letter-spacing: 2px;">RESONANCE FRAMEWORK</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                    ${LINEAGE_DETAILS.map((t, idx) => `
                        <div style="padding:20px; background:#f5f5dc !important; border-radius:2px; box-shadow:2px 2px 8px rgba(0,0,0,0.2); transform:rotate(${idx % 2 === 0 ? '-1' : '1'}deg); display:flex; flex-direction:column; gap:10px; transition: transform 0.2s ease;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <span style="font-size:10px; color:#8b4513; background:#e8e0c5; padding:2px 6px; font-weight:600; text-transform:uppercase; border-radius:3px; letter-spacing:1px;">${t.tokenName}</span>
                                <span style="font-size:9px; color:#8b7355;">${t.subdomain}</span>
                            </div>
                            <h4 style="margin:5px 0; color:#3d2914; font-family:'Cormorant Garamond', serif; font-size:1.3rem; font-weight:600;">${t.fullName}</h4>
                            <p style="font-size:11px; color:#5c4033; line-height:1.5; font-family:serif; margin:0;">${t.description}</p>
                            <div style="margin-top:auto; padding-top:10px; border-top:1px dashed #d4c4a8; font-size:9px; color:#8b7355; font-style:italic;">
                                Pillar: ${t.resonancePillar}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    `;
    
    setTimeout(() => initLiveCharts(domains, specs), 50);
}

function initLiveCharts(domains, specs) {
    // 1. Radar Chart (Intellectual Shape)
    const radarCanvas = document.getElementById('radarChart');
    if (radarCanvas && window.Chart) {
        new Chart(radarCanvas, {
            type: 'radar',
            data: {
                labels: Object.keys(domains).map(k => DOMAIN_NAMES[k]),
                datasets: [{
                    data: Object.values(domains),
                    backgroundColor: 'rgba(212, 163, 115, 0.1)',
                    borderColor: '#d4a373',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    r: { 
                        grid: { color: '#2a2420' }, 
                        angleLines: { color: '#2a2420' }, 
                        pointLabels: { color: '#8b8276', font: { size: 10, family: 'monospace' } },
                        ticks: { display: false, max: 10 } 
                    } 
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // 2. Donut Chart (Specialization Focus)
    const donutCanvas = document.getElementById('donutChart');
    if (donutCanvas && window.Chart) {
        new Chart(donutCanvas, {
            type: 'doughnut',
            data: {
                labels: Object.keys(specs),
                datasets: [{
                    data: Object.values(specs),
                    backgroundColor: ['#4e463f', '#7c6f64', '#a89984', '#928374', '#504945'],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#8b8276', font: { size: 10 }, padding: 20 } }
                }
            }
        });
    }

    // 3. Custom Bar Chart (Domain Intensity - mimicking renderDashboardCharts canvas logic)
    const barCanvas = document.getElementById('intensityBarChart');
    if (barCanvas && barCanvas.getContext) {
        const ctx = barCanvas.getContext('2d');
        const values = Object.values(domains);
        const names = Object.keys(domains).map(k => DOMAIN_NAMES[k]);
        
        // Set canvas size
        barCanvas.width = barCanvas.offsetWidth;
        barCanvas.height = 150;
        
        const width = barCanvas.width;
        const height = barCanvas.height;
        const barWidth = (width / values.length) * 0.6;
        const gap = (width / values.length) * 0.4;
        const max = 10; // Domain max is 10
        
        ctx.clearRect(0, 0, width, height);
        
        values.forEach((val, i) => {
            const x = (i * (barWidth + gap)) + (gap / 2);
            const barHeight = (val / max) * (height - 40);
            const y = height - barHeight - 25;
            
            // Background track
            ctx.fillStyle = '#2a2420';
            ctx.fillRect(x, 25, barWidth, height - 40);
            
            // Actual value bar
            ctx.fillStyle = '#d4a373';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Label
            ctx.fillStyle = '#8b8276';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(names[i].substring(0, 6), x + barWidth/2, height - 8);
            
            // Value
            ctx.fillStyle = '#fff';
            ctx.font = '11px monospace';
            ctx.fillText(val, x + barWidth/2, y - 5);
        });
    }
}

function renderDashboardCharts(modules, notes, guilds, neoscore) {
  // Activity Chart - Bar chart
  const actCanvas = document.getElementById('activityChart');
  if (actCanvas && actCanvas.getContext) {
    const ctx = actCanvas.getContext('2d');
    const width = actCanvas.width;
    const height = actCanvas.height;
    const data = [modules, notes, guilds];
    const labels = ['Modules', 'Notes', 'Guilds'];
    const max = Math.max(...data, 10);
    const barWidth = 60;
    const gap = (width - (barWidth * 3)) / 4;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw bars
    data.forEach((val, i) => {
      const barHeight = (val / max) * (height - 40);
      const x = gap + i * (barWidth + gap);
      const y = height - barHeight - 25;
      
      // Bar
      ctx.fillStyle = 'rgba(139, 115, 85, 0.7)';
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Label
      ctx.fillStyle = 'var(--text-secondary, #6b6b6b)';
      ctx.font = '12px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barWidth/2, height - 10);
      
      // Value
      ctx.fillStyle = 'var(--text-primary, #2a2a2a)';
      ctx.font = '14px Manrope, sans-serif';
      ctx.fillText(val.toString(), x + barWidth/2, y - 5);
    });
  }
  
  // Neoscore Chart - Line chart showing growth
  const scoreCanvas = document.getElementById('scoreChart');
  if (scoreCanvas && scoreCanvas.getContext) {
    const ctx = scoreCanvas.getContext('2d');
    const width = scoreCanvas.width;
    const height = scoreCanvas.height;
    
    // Mock historical data points
    const points = [0, Math.floor(neoscore * 0.3), Math.floor(neoscore * 0.6), neoscore];
    const max = Math.max(...points, 100);
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(139, 115, 85, 0.9)';
    ctx.lineWidth = 2;
    
    points.forEach((val, i) => {
      const x = 30 + (i * (width - 60) / (points.length - 1));
      const y = height - 30 - ((val / max) * (height - 50));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw points
    points.forEach((val, i) => {
      const x = 30 + (i * (width - 60) / (points.length - 1));
      const y = height - 30 - ((val / max) * (height - 50));
      
      ctx.beginPath();
      ctx.fillStyle = 'rgba(139, 115, 85, 1)';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Value label
      ctx.fillStyle = 'var(--text-primary, #2a2a2a)';
      ctx.font = '11px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), x, y - 8);
    });
  }
}

let dictionary = {};

/** @type {ReturnType<typeof createClient> | null | undefined} */
let supabaseClient;

function readSupabaseConfig() {
  const url = (
    (typeof window !== 'undefined' && window.NEOFOLK_SUPABASE_URL) ||
    document.querySelector('meta[name="supabase-url"]')?.getAttribute('content')?.trim() ||
    ''
  ).trim();
  const anonKey = (
    (typeof window !== 'undefined' && window.NEOFOLK_SUPABASE_ANON_KEY) ||
    document.querySelector('meta[name="supabase-anon-key"]')?.getAttribute('content')?.trim() ||
    ''
  ).trim();
  return url && anonKey ? { url, anonKey } : null;
}

function getSupabaseClient() {
  if (supabaseClient !== undefined) return supabaseClient;
  const cfg = readSupabaseConfig();
  if (!cfg) {
    supabaseClient = null;
    return null;
  }
  supabaseClient = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return supabaseClient;
}

function t(path) {
  const value = path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), dictionary);
  return typeof value === 'string' ? value : path;
}

async function loadDictionary(code) {
  const lang = SUPPORTED_LANGS.includes(code) ? code : 'en';
  try {
    const res = await fetch(`./translations/${lang}.json`);
    if (!res.ok) throw new Error();
    dictionary = await res.json();
  } catch (err) {
    console.warn(`Could not load ${lang} translations, falling back to en.`);
    const fallback = await fetch(`./translations/en.json`);
    dictionary = await fallback.json();
  }
  return lang;
}

function applyDocumentLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
}

function syncLanguageSelects(lang) {
  document.querySelectorAll('select.lang-select, #home-language-select').forEach((sel) => {
    if (sel.querySelector(`option[value="${lang}"]`)) sel.value = lang;
  });
}

function applyDataI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const val = t(key);
    if (val && val !== key) el.textContent = val;
  });
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function currentPageFile() {
  if (typeof location === 'undefined') return 'index.html';
  let tail = location.pathname.split('/').pop() || '';
  if (tail.includes('?')) tail = tail.split('?')[0];
  return tail === '' ? 'index.html' : tail;
}

/** Role → dashboard URL (user_metadata.role or app_metadata.role, default seeker). */
function getDashboardPath(user) {
  const role = String(
    user?.user_metadata?.role || user?.app_metadata?.role || 'seeker'
  ).toLowerCase();
  const map = {
    seeker: 'seeker-dashboard.html',
    curator: 'curator-dashboard.html',
    arbiter: 'arbiter-dashboard.html',
    operator: 'operator-dashboard.html',
  };
  return map[role] || map.seeker;
}

/** Currently authenticated user, set by initApp after session check. */
let currentUser = null;

function getRoleFromPage(page = currentPageFile()) {
  const pageRoleMap = {
    'seeker-dashboard.html': 'seeker',
    'curator-dashboard.html': 'curator',
    'arbiter-dashboard.html': 'arbiter',
    'operator-dashboard.html': 'operator',
  };
  return pageRoleMap[page] || null;
}

function getStoredRoleHint(user) {
  if (!user) return localStorage.getItem(`${ROLE_HINT_STORAGE}.last`) || null;
  return (
    localStorage.getItem(`${ROLE_HINT_STORAGE}.id.${user.id}`) ||
    (user.email ? localStorage.getItem(`${ROLE_HINT_STORAGE}.email.${user.email.toLowerCase()}`) : null) ||
    localStorage.getItem(`${ROLE_HINT_STORAGE}.last`) ||
    null
  );
}

function persistRoleHint(role, user) {
  if (!role) return;
  localStorage.setItem(`${ROLE_HINT_STORAGE}.last`, role);
  if (user?.id) localStorage.setItem(`${ROLE_HINT_STORAGE}.id.${user.id}`, role);
  if (user?.email) localStorage.setItem(`${ROLE_HINT_STORAGE}.email.${user.email.toLowerCase()}`, role);
}

function resolveUserRole(user, fallbackRole = null) {
  const explicitRole = String(
    user?.user_metadata?.role ||
    user?.app_metadata?.role ||
    ''
  ).toLowerCase();
  
  // 1. TRUST EXPLICIT ROLE FIRST
  if (explicitRole) return explicitRole;

  // 2. TRUST VERIFIED CURATOR STATUS OVER CACHED HINTS
  if (user?.id && curatorCards.some((card) => card.userId === user.id)) return 'curator';

  // 3. FALLBACK TO HINTS
  const hintedRole = String(getStoredRoleHint(user) || '').toLowerCase();
  if (hintedRole) return hintedRole;

  return String(fallbackRole || 'seeker').toLowerCase();
}

function getCurrentRole() {
  return resolveUserRole(currentUser, getRoleFromPage() || 'seeker');
}

function applyRoleTheme(role = getCurrentRole()) {
  if (document?.body) {
    document.body.dataset.roleTheme = role;
  }
}

function getAllBatches() {
  return JSON.parse(localStorage.getItem('neofolk.batches') || '[]');
}

function getStoredProfile(userId) {
  return JSON.parse(localStorage.getItem(`neofolk.profile.${userId}`) || 'null');
}

function getAllStoredProfiles() {
  const profiles = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !key.startsWith('neofolk.profile.')) continue;
    const userId = key.replace('neofolk.profile.', '');
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      profiles.push({ userId, ...value });
    } catch (_) {
      // Ignore malformed profile entries and keep the UI usable.
    }
  }
  return profiles;
}

function getDisplayNameForUser(userId, fallback = 'Unnamed') {
  const profile = getStoredProfile(userId);
  if (profile?.name) return profile.name;

  const curatorCard = curatorCards.find((card) => card.userId === userId);
  if (curatorCard?.fullName) return curatorCard.fullName;

  return fallback;
}

function getCuratorDashboardData() {
  const myCard = getMyCuratorCard();
  const myModules = myCard ? getModulesByCurator(myCard.id) : [];
  const allBatches = getAllBatches();
  const myBatches = allBatches.filter((batch) => myModules.some((module) => module.id === batch.moduleId));
  const uniqueStudentIds = [...new Set(myBatches.flatMap((batch) => batch.studentIds || []))];

  return {
    myCard,
    myModules,
    myBatches,
    totalStudents: uniqueStudentIds.length,
    activeLicenses: myCard?.activeLicenses?.length || 0,
  };
}

function getDomainFilterFromUrl() {
  const param = new URLSearchParams(window.location.search).get('domain');
  if (!param) return '';
  return String(param).toLowerCase();
}

function getArbiterInterviewList(studentProfiles) {
  const stored = JSON.parse(localStorage.getItem('neofolk.studentInterviews') || 'null');
  if (Array.isArray(stored) && stored.length) return stored;

  const fallbackProfiles = studentProfiles.length
    ? studentProfiles
    : [
        { userId: 'sample-student-1', name: 'Aarav Sharma', domain: 'Chronicles' },
        { userId: 'sample-student-2', name: 'Isha Patel', domain: 'Biosphere' },
        { userId: 'sample-student-3', name: 'Kabir Das', domain: 'Praxis' },
      ];

  const states = ['Queued', 'Scheduled', 'Needs follow-up'];
  return fallbackProfiles.slice(0, 5).map((profile, index) => ({
    id: `interview_${index + 1}`,
    studentId: profile.userId,
    studentName: profile.name || `Student ${index + 1}`,
    domain: profile.domain || 'General',
    status: states[index % states.length],
    slot: ['Today, 17:30', 'Tomorrow, 11:00', 'April 12, 15:00'][index % 3],
    notes: ['Portfolio review pending', 'Guild contribution check', 'Needs writing sample'][index % 3],
  }));
}

function getArbiterDashboardData() {
  const storedProfiles = getAllStoredProfiles();
  const curatorMap = new Map(curatorCards.map((card) => [card.userId, card]));

  const teacherProfiles = storedProfiles
    .filter((profile) => curatorMap.has(profile.userId))
    .map((profile) => ({
      ...profile,
      licenses: curatorMap.get(profile.userId)?.activeLicenses || [],
    }));

  curatorCards.forEach((card) => {
    if (!teacherProfiles.find((profile) => profile.userId === card.userId)) {
      teacherProfiles.push({
        userId: card.userId,
        name: card.fullName,
        domain: 'Curation',
        bio: 'Curator profile pending completion.',
        skills: card.activeLicenses.join(', '),
        licenses: card.activeLicenses,
      });
    }
  });

  const studentProfiles = storedProfiles.filter((profile) => !curatorMap.has(profile.userId));
  const fallbackStudents = studentProfiles.length
    ? studentProfiles
    : [
        { userId: 'student-a', name: 'Aarav Sharma', domain: 'Chronicles', skills: 'Essay Drafting, Inquiry' },
        { userId: 'student-b', name: 'Isha Patel', domain: 'Biosphere', skills: 'Field Notes, Mapping' },
        { userId: 'student-c', name: 'Kabir Das', domain: 'Praxis', skills: 'Workshop Practice, Reflection' },
      ];

  const reviewGuilds = guilds.length
    ? guilds
    : [
        { id: 'guild_seed_1', name: 'Solar Architecture Guild', members: ['student-a', 'student-b'], invited: [], description: 'Built environment and climate adaptation.' },
        { id: 'guild_seed_2', name: 'Food Culture Guild', members: ['student-c'], invited: ['student-d'], description: 'Regional food systems and memory.' },
      ];

  const reviewModules = modules.length
    ? modules.slice(0, 6)
    : [
        { id: 'mod_seed_1', title: 'History of Water Commons', domain: 'chronicles', curatorName: 'Aditi Rao', status: 'submitted' },
        { id: 'mod_seed_2', title: 'Ecology of Monsoon Cities', domain: 'biosphere', curatorName: 'Dev Mehta', status: 'needs review' },
      ];

  return {
    studentProfiles: fallbackStudents,
    teacherProfiles,
    interviews: getArbiterInterviewList(fallbackStudents),
    reviewGuilds,
    reviewModules,
  };
}

function focusDashboardPanelFromQuery() {
  const panel = new URLSearchParams(window.location.search).get('panel');
  if (!panel) return;
  const target = document.getElementById(panel);
  if (!target) return;
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

function renderSeekerDashboard(root) {
  root.innerHTML =
    '<div class="dashboard-shell role-dashboard role-dashboard--seeker">' +
      '<section class="dashboard-welcome">' +
        '<div>' +
          '<p class="section-label">Welcome Seeker</p>' +
          '<h1>Chart your next step with clarity.</h1>' +
          '<p id="dash-signed-in" class="dashboard-meta">Your learner dashboard keeps study, notes, and visible progress in one place.</p>' +
        '</div>' +
        '<div class="role-badge">Learner Track</div>' +
      '</section>' +
      '<div class="stats-grid">' +
        '<div class="stat-card"><p class="section-label">' + escapeHtml(t('dashboard.courses')) + '</p><strong id="stat-modules">0</strong><p>' + escapeHtml(t('dashboard.coursesBody')) + '</p></div>' +
        '<div class="stat-card"><p class="section-label">' + escapeHtml(t('dashboard.notes')) + '</p><strong id="stat-notes">0</strong><p>' + escapeHtml(t('dashboard.notesBody')) + '</p></div>' +
        '<div class="stat-card"><p class="section-label">' + escapeHtml(t('dashboard.progressTitle')) + '</p><strong id="stat-score">0</strong><p>' + escapeHtml(t('dashboard.progressKicker')) + '</p></div>' +
        '<div class="stat-card"><p class="section-label">' + escapeHtml(t('dashboard.groups')) + '</p><strong id="stat-groups">0</strong><p>' + escapeHtml(t('dashboard.groupsBody')) + '</p></div>' +
      '</div>' +
      '<div class="dashboard-charts">' +
        '<div class="chart-card">' +
          '<h3>Learning Activity</h3>' +
          '<canvas id="activityChart" width="400" height="200"></canvas>' +
        '</div>' +
        '<div class="chart-card">' +
          '<h3>Neoscore Growth</h3>' +
          '<canvas id="scoreChart" width="400" height="200"></canvas>' +
        '</div>' +
      '</div>' +
      '<div class="dashboard-sections">' +
        '<div class="card">' +
          '<p class="section-label">' + escapeHtml(t('dashboard.nextStepKicker')) + '</p>' +
          '<h2>' + escapeHtml(t('dashboard.pickCourseTitle')) + '</h2>' +
          '<p>' + escapeHtml(t('dashboard.pickCourseBody')) + '</p>' +
          '<div class="inline-actions flow-top-32">' +
            '<a class="btn btn-primary" href="subjects.html">' + escapeHtml(t('dashboard.browseTopics')) + '</a>' +
            '<a class="btn" href="discovery.html">' + escapeHtml(t('nav.explore')) + '</a>' +
          '</div>' +
        '</div>' +
        '<div class="card">' +
          '<p class="section-label">Profile</p>' +
          '<h2>Keep your learning identity current.</h2>' +
          '<p>Update your profile, track your notes, and document the work you want peers and arbiters to see.</p>' +
          '<div class="inline-actions flow-top-32">' +
            '<a class="btn btn-primary" href="profile.html">Open Profile</a>' +
            '<a class="btn" href="portfolio.html">Open Portfolio</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function renderCuratorDashboard(root) {
  const { myCard, myModules, myBatches, totalStudents, activeLicenses } = getCuratorDashboardData();

  root.innerHTML =
    '<div class="dashboard-shell role-dashboard role-dashboard--curator">' +
      '<section class="dashboard-welcome">' +
        '<div>' +
          '<p class="section-label">Welcome Curator</p>' +
          '<h1>Run the curation floor.</h1>' +
          '<p id="dash-signed-in" class="dashboard-meta">Build modules, track your cohorts, and maintain a serious teaching dossier.</p>' +
        '</div>' +
        '<div class="role-badge">Curation Studio</div>' +
      '</section>' +
      '<div class="stats-grid">' +
        '<div class="stat-card"><p class="section-label">Modules Authored</p><strong>' + myModules.length + '</strong><p>Structured learning sequences under your name.</p></div>' +
        '<div class="stat-card"><p class="section-label">Live Batches</p><strong>' + myBatches.length + '</strong><p>Cohorts currently attached to your modules.</p></div>' +
        '<div class="stat-card"><p class="section-label">Learners Reached</p><strong>' + totalStudents + '</strong><p>Total distinct students across your batches.</p></div>' +
        '<div class="stat-card"><p class="section-label">Active Licenses</p><strong>' + activeLicenses + '</strong><p>Domain permissions currently attached to your curator card.</p></div>' +
      '</div>' +
      '<div class="dashboard-sections two-column">' +
        '<div class="card" id="curator-license">' +
          '<p class="section-label">Curation License</p>' +
          '<h2>Teaching authority and domain scope.</h2>' +
          (myCard ? `
            <div class="curator-card-id">
              <div class="chip"></div>
              <div class="card-header">
                <div>
                  <div class="card-meta">Curator ID</div>
                  <div class="card-name">${escapeHtml(myCard.fullName)}</div>
                </div>
                <div style="text-align:right;">
                  <div class="card-meta">Status</div>
                  <div style="color:#9fd1af; font-size:11px; font-weight:bold;">ACTIVE</div>
                </div>
              </div>
              <div style="margin-top:10px;">
                <div class="card-meta">Registered Age</div>
                <div style="font-size:1.1rem; font-weight:600;">${escapeHtml(String(myCard.age))}</div>
              </div>
              <div class="token-badges">
                ${myCard.activeLicenses.map((license) => `<span class="badge">${escapeHtml(license)}</span>`).join('')}
              </div>
            </div>
          ` : `
            <div class="empty-state">
              <p>No curator license found yet. Create one to unlock module publishing.</p>
              <button onclick="window.applyForCurator()" class="btn btn-primary" style="margin-top:12px;">Apply Now</button>
            </div>
          `) +
        '</div>' +
        '<div class="card" id="curator-dossier">' +
          '<p class="section-label">Dossier</p>' +
          '<h2>Your curation record.</h2>' +
          '<p>Keep a serious record of what you have authored, who you have taught, and which domains you are licensed to curate.</p>' +
          '<div class="mini-stat-grid">' +
            '<div class="mini-stat"><strong>' + myModules.length + '</strong><span>Modules</span></div>' +
            '<div class="mini-stat"><strong>' + myBatches.length + '</strong><span>Batches</span></div>' +
            '<div class="mini-stat"><strong>' + totalStudents + '</strong><span>Learners</span></div>' +
            '<div class="mini-stat"><strong>' + activeLicenses + '</strong><span>Licenses</span></div>' +
          '</div>' +
          '<div class="inline-actions flow-top-32">' +
            '<a class="btn btn-primary" href="portfolio.html">Open Dossier</a>' +
            '<a class="btn" href="teaching-log.html">Open Teaching Log</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="card module-builder-card" id="curator-add-module">' +
        '<div class="dashboard-card-topline">' +
          '<div>' +
            '<p class="section-label">Add Module</p>' +
            '<h2>Launch a new module from the curation area.</h2>' +
          '</div>' +
          '<a class="btn" href="module-editor.html">Open Advanced Editor</a>' +
        '</div>' +
        '<p>Keep creation close to the dashboard. Draft the core structure and publish the first version right here.</p>' +
        '<div class="module-creation-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">' +
          '<input id="quick-mod-title" class="neo-input" placeholder="Module title" style="grid-column: span 2;">' +
          '<select id="quick-mod-domain" class="neo-input">' +
            Object.keys(DOMAIN_NAMES).map((key) => `<option value="${key}">${DOMAIN_NAMES[key]}</option>`).join('') +
          '</select>' +
          '<div style="display:flex; gap:8px;">' +
            '<input id="quick-mod-weeks" type="number" class="neo-input" value="4" placeholder="Weeks" style="width:70px;">' +
            '<input id="quick-mod-capacity" type="number" class="neo-input" value="20" placeholder="Cap" style="width:70px;">' +
          '</div>' +
          '<input id="quick-mod-loc" class="neo-input" placeholder="Location" style="grid-column: span 2;">' +
          '<textarea id="quick-mod-desc" class="neo-input module-creation-textarea" rows="3" placeholder="Description/Outcomes" style="grid-column: span 2;"></textarea>' +
        '</div>' +
        '<div class="inline-actions flow-top-32">' +
          '<button onclick="window.quickCreateModule()" class="btn btn-primary">Create Module</button>' +
          '<a class="btn" href="teaching-log.html">Open Teaching Log</a>' +
        '</div>' +
      '</div>' +
      '<div class="card" id="curator-modules">' +
        '<div class="dashboard-card-topline">' +
          '<div>' +
            '<p class="section-label">Module Floor</p>' +
            '<h2>Everything you are currently curating.</h2>' +
          '</div>' +
          '<a class="btn" href="modules.html">Open Library</a>' +
        '</div>' +
        '<div class="record-list">' +
          (myModules.length ? myModules.map((module) => `
            <div class="record-card">
              <div class="dashboard-card-topline">
                <span class="pill">${escapeHtml(DOMAIN_NAMES[module.domain] || module.domain)}</span>
                <span class="muted">${module.batches.length} batches</span>
              </div>
              <h3>${escapeHtml(module.title)}</h3>
              <p>${escapeHtml(module.description || 'No description yet.')}</p>
              <div class="inline-actions">
                <a class="btn" href="teaching-log.html">Teaching Log</a>
                <a class="btn subtle-button" href="attendance.html">Attendance</a>
              </div>
            </div>
          `).join('') : '<div class="empty-state"><p>No modules yet. Use the add module section above to create your first one.</p></div>') +
        '</div>' +
      '</div>' +
    '</div>';
}

function renderArbiterDashboard(root) {
  const { studentProfiles, teacherProfiles, interviews, reviewGuilds, reviewModules } = getArbiterDashboardData();

  root.innerHTML = `
    <div class="dashboard-shell role-dashboard role-dashboard--arbiter">
      <section class="dashboard-welcome arbiter-welcome">
        <div>
          <p class="section-label">Welcome Arbiter</p>
          <h1>Oversight, review, and platform trust.</h1>
          <p id="dash-signed-in" class="dashboard-meta">You have visibility into learner records, curator activity, guild formation, and interview queues.</p>
        </div>
        <div class="role-badge">Review Command</div>
      </section>
      <div class="stats-grid">
        <div class="stat-card"><p class="section-label">Student Profiles</p><strong>${studentProfiles.length}</strong><p>Learner records currently visible to review.</p></div>
        <div class="stat-card"><p class="section-label">Curator Profiles</p><strong>${teacherProfiles.length}</strong><p>Teaching identities and licenses on file.</p></div>
        <div class="stat-card"><p class="section-label">Interview Queue</p><strong>${interviews.length}</strong><p>Student interviews awaiting arbiter attention.</p></div>
        <div class="stat-card"><p class="section-label">Guild Registry</p><strong>${reviewGuilds.length}</strong><p>Active guilds and craft circles under observation.</p></div>
      </div>
      <div class="oversight-grid">
        <div class="card" id="arbiter-students">
          <p class="section-label">Student Profiles</p>
          <h2>All learner profiles</h2>
          <div class="plain-list">
            ${studentProfiles.map((profile) => `
              <div class="oversight-row">
                <div>
                  <strong>${escapeHtml(profile.name || 'Unnamed Student')}</strong>
                  <p>${escapeHtml(profile.domain || 'General')}</p>
                </div>
                <span class="pill">${escapeHtml(profile.skills || 'Profile pending')}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card" id="arbiter-curators">
          <p class="section-label">Teacher Profiles</p>
          <h2>All curator records</h2>
          <div class="plain-list">
            ${teacherProfiles.map((profile) => `
              <div class="oversight-row">
                <div>
                  <strong>${escapeHtml(profile.name || 'Unnamed Curator')}</strong>
                  <p>${escapeHtml(profile.domain || 'Curation')}</p>
                </div>
                <span class="pill">${escapeHtml((profile.licenses || []).join(', ') || profile.skills || 'License pending')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="oversight-grid">
        <div class="card" id="arbiter-interviews">
          <p class="section-label">Student Interviews</p>
          <h2>Interview list</h2>
          <div class="plain-list">
            ${interviews.map((entry) => `
              <div class="oversight-row oversight-row--stacked">
                <div class="dashboard-card-topline">
                  <strong>${escapeHtml(entry.studentName)}</strong>
                  <span class="pill">${escapeHtml(entry.status)}</span>
                </div>
                <p>${escapeHtml(entry.domain)} · ${escapeHtml(entry.slot)}</p>
                <p>${escapeHtml(entry.notes)}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card" id="arbiter-guilds">
          <p class="section-label">Guilds</p>
          <h2>Guild and craft registry</h2>
          <div class="plain-list">
            ${reviewGuilds.map((guild) => `
              <div class="oversight-row oversight-row--stacked">
                <div class="dashboard-card-topline">
                  <strong>${escapeHtml(guild.name)}</strong>
                  <span class="pill">${(guild.members || []).length} members</span>
                </div>
                <p>${escapeHtml(guild.description || 'No guild summary available.')}</p>
                <p>${(guild.invited || []).length} pending invites</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="card" id="arbiter-modules">
        <p class="section-label">Review Queue</p>
        <h2>Module and teaching surfaces requiring review</h2>
        <div class="plain-list">
          ${reviewModules.map((module) => `
            <div class="oversight-row">
              <div>
                <strong>${escapeHtml(module.title)}</strong>
                <p>${escapeHtml(DOMAIN_NAMES[module.domain] || module.domain || 'General')}</p>
              </div>
              <span class="pill">${escapeHtml(module.status || 'active')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
}

function hydrateSignedInMeta(supabase) {
  if (!supabase) return;
  supabase.auth.getUser().then(({ data }) => {
    const el = document.getElementById('dash-signed-in');
    if (!el || !data?.user?.email) return;
    el.textContent = t('dashboard.signedIn').replace('{email}', data.user.email);
  }).catch(() => {});
}

function hydrateSeekerDashboard(supabase) {
  if (!supabase) return;

  supabase.auth.getUser().then(async ({ data }) => {
    const el = document.getElementById('dash-signed-in');
    if (!data?.user) return;

    if (el) el.textContent = t('dashboard.signedIn').replace('{email}', data.user.email);

    const { count: modCount } = await supabase.from('enrolled_modules').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id).eq('status', 'completed');
    const { count: noteCount } = await supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id);
    const neoScore = (modCount || 0) * 50 + (noteCount || 0) * 10;

    if (document.getElementById('stat-modules')) document.getElementById('stat-modules').textContent = modCount || 0;
    if (document.getElementById('stat-notes')) document.getElementById('stat-notes').textContent = noteCount || 0;
    if (document.getElementById('stat-score')) document.getElementById('stat-score').textContent = neoScore;

    await supabase.from('neo_scores').upsert({
      user_id: data.user.id,
      score: neoScore,
      updated_at: new Date().toISOString()
    });

    renderDashboardCharts(modCount || 0, noteCount || 0, 2, neoScore);
  }).catch(() => {});
}

function renderAppNav() {
  const nav = document.getElementById('app-nav');
  if (!nav) return;

  const here = currentPageFile();
  const fallbackRole = getRoleFromPage(here) || 'seeker';
  const dashHref = currentUser
    ? getDashboardPath({ ...currentUser, user_metadata: { ...(currentUser.user_metadata || {}), role: resolveUserRole(currentUser, fallbackRole) } })
    : getDashboardPath({ user_metadata: { role: fallbackRole } });
  const isDashboardPage = here.endsWith('-dashboard.html');
  const role = getCurrentRole();
  applyRoleTheme(role);

  const sectionsByRole = {
    seeker: [
      {
        title: 'SEEKER',
        links: [
          { href: dashHref, label: 'Dashboard', isDash: true },
          { href: 'subjects.html', label: 'Domains' },
          { href: 'pathways.html', label: 'Pathways' },
          { href: 'guild.html', label: 'Guilds' },
          { href: 'portfolio.html', label: 'Portfolio' },
          { href: 'nodes.html', label: 'Nodes' },
        ]
      },
      {
        title: 'KNOWLEDGE',
        links: [
          { href: 'guide.html', label: 'Guide' },
          { href: 'vision.html', label: 'Vision' },
        ]
      },
      {
        title: 'ACCOUNT',
        links: [
          { href: 'profile.html', label: 'Profile' },
          { href: 'account-settings.html', label: 'Settings' },
        ]
      }
    ],
    curator: [
      {
        title: 'CURATION',
        links: [
          { href: 'curator-dashboard.html', label: 'Dashboard', isDash: true },
          { href: 'curator-dashboard.html?panel=curator-add-module', label: 'Add Module' },
          { href: 'modules.html', label: 'Module Library' },
          { href: 'teaching-log.html', label: 'Teaching Log' },
          { href: 'attendance.html', label: 'Attendance' },
          { href: 'portfolio.html', label: 'Dossier' },
        ]
      },
      {
        title: 'REFERENCE',
        links: [
          { href: 'subjects.html', label: 'Domains' },
          { href: 'guide.html', label: 'Guide' },
        ]
      },
      {
        title: 'ACCOUNT',
        links: [
          { href: 'profile.html', label: 'Profile' },
          { href: 'account-settings.html', label: 'Settings' },
        ]
      }
    ],
    arbiter: [
      {
        title: 'OVERSIGHT',
        links: [
          { href: 'arbiter-dashboard.html', label: 'Dashboard', isDash: true },
          { href: 'arbiter-dashboard.html?panel=arbiter-students', label: 'Students' },
          { href: 'arbiter-dashboard.html?panel=arbiter-curators', label: 'Curators' },
          { href: 'arbiter-dashboard.html?panel=arbiter-interviews', label: 'Interviews' },
          { href: 'arbiter-dashboard.html?panel=arbiter-guilds', label: 'Guilds' },
        ]
      },
      {
        title: 'PLATFORM',
        links: [
          { href: 'subjects.html', label: 'Domains' },
          { href: 'vision.html', label: 'Charter' },
          { href: 'help.html', label: 'Protocol' },
        ]
      },
      {
        title: 'ACCOUNT',
        links: [
          { href: 'profile.html', label: 'Profile' },
          { href: 'account-settings.html', label: 'Settings' },
        ]
      }
    ],
    operator: [
      {
        title: 'OPERATOR',
        links: [
          { href: 'operator-dashboard.html', label: 'Console', isDash: true },
          { href: 'subjects.html', label: 'Domains' },
          { href: 'help.html', label: 'Help' },
        ]
      }
    ]
  };

  const sections = sectionsByRole[role] || sectionsByRole.seeker;

  nav.innerHTML = sections
    .map(section => `
      <div class="nav-section-group">
        <div class="nav-section-header">
          ${section.title}
        </div>
        ${section.links
          .map(link => {
            const active = link.isDash ? isDashboardPage : here === link.href;
            const cls = active ? 'sidebar-link is-active' : 'sidebar-link';
            if (link.onClick) {
              return `<a class="${cls}" href="${link.href}" onclick="${link.onClick}; return false;">${link.label}</a>`;
            }
            return `<a class="${cls}" href="${link.href}">${link.label}</a>`;
          })
          .join('')}
      </div>
    `)
    .join('');

  let chip = document.getElementById("neoscore-chip");
  if (role !== 'seeker') {
    if (chip) chip.remove();
    chip = null;
  } else if (!chip) {
    const brandArea = document.querySelector(".brand-area");
    if (brandArea) {
      chip = document.createElement("div");
      chip.id = "neoscore-chip";
      chip.className = "neoscore-chip";
      chip.title = "View Knowledge Topology";
      
      chip.innerHTML = `
        <img src="neoscore.png" class="neoscore-logo" />
        <span id="neoscore-value">--</span>
      `;
      brandArea.appendChild(chip);

      // Navigation Hook
      chip.onclick = (e) => {
        e.preventDefault();
        if (typeof window.forceNavigateToTopology === 'function') {
          window.forceNavigateToTopology();
        }
      };

      // Fetch and update score
      if (currentUser) {
        getSupabaseClient()?.from('enrolled_modules').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id).eq('status', 'completed')
          .then(({ count: mCount }) => {
            getSupabaseClient()?.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id)
              .then(({ count: nCount }) => {
                const score = (mCount || 0) * 50 + (nCount || 0) * 10;
                const el = document.getElementById("neoscore-value");
                if (el) el.textContent = score;
              });
          });
      }
    }
  }

  // Active state visual
  if (chip) {
    if (document.querySelector('.topology-immersion')) {
      chip.classList.add('is-active');
    } else {
      chip.classList.remove('is-active');
    }
  }

  // logout button
  if (currentUser) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'sidebar-link sidebar-logout';
    logoutBtn.type = 'button';
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = async () => {
      const supabase = getSupabaseClient();
      if (supabase) await supabase.auth.signOut();
      currentUser = null;
      location.href = 'index.html';
    };
    nav.appendChild(logoutBtn);
  }
}

/** On the home page, swap the auth card for a welcome-back card when logged in. */
function updateHomeForSession() {
  const authCard = document.querySelector('.auth-card');
  if (!authCard || currentPageFile() !== 'index.html') return;

  if (currentUser) {
    const dashHref = getDashboardPath(currentUser);
    const email = currentUser.email || '';
    authCard.innerHTML =
      '<div class="auth-panel-inner">' +
        '<p class="section-label">' + escapeHtml(t('dashboard.kicker')) + '</p>' +
        '<h2 style="margin:8px 0 4px;">' + escapeHtml(t('home.loginLabel')) + '</h2>' +
        '<p class="auth-intro">' + escapeHtml(t('dashboard.signedIn').replace('{email}', email)) + '</p>' +
        '<a class="btn btn-primary" style="width:100%;margin-top:8px;" href="' + escapeHtml(dashHref) + '">' +
          escapeHtml(t('nav.dashboard')) +
        '</a>' +
        '<a class="btn" style="width:100%;margin-top:8px;" href="subjects.html">' +
          escapeHtml(t('dashboard.browseTopics')) +
        '</a>' +
      '</div>';
  }
}

function wireMobileNav() {
  // Skip if hamburger already exists (e.g., index.html has its own)
  if (document.getElementById('hamburgerBtn')) return;

  const sidebar = document.querySelector('.neo-sidebar.sidebar');
  if (!sidebar) return;

  const main = document.querySelector('.neo-main');
  if (!main) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';
  main.parentNode.insertBefore(overlay, main);

  // Create mobile topbar with language selector
  const topbar = document.createElement('header');
  topbar.className = 'mobile-topbar';
  topbar.innerHTML =
    '<button class="hamburger" id="hamburgerBtn" aria-label="Open menu">' +
      '<span></span><span></span><span></span>' +
    '</button>' +
    '<span class="mobile-brand">Neofolk Atlas</span>' +
    '<div class="mobile-lang-wrap">' +
      '<select class="lang-select" aria-label="Select language">' +
        '<option value="en">EN</option>' +
        '<option value="hi">\u0939\u093F</option>' +
        '<option value="ur">UR</option>' +
      '</select>' +
    '</div>';
  main.insertBefore(topbar, main.firstChild);

  // Sync the new selector with current language
  const currentLang = localStorage.getItem(LANG_STORAGE) || 'en';
  const mobileSel = topbar.querySelector('.lang-select');
  if (mobileSel) mobileSel.value = currentLang;

  const hamburger = document.getElementById('hamburgerBtn');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
  }

  hamburger.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
  );
  overlay.addEventListener('click', closeSidebar);
}

function renderSidebarLangPicker() {
  const container = document.querySelector('.sidebar-content');
  if (!container || container.querySelector('.lang-select')) return;

  const currentLang = localStorage.getItem(LANG_STORAGE) || 'en';
  container.innerHTML =
    '<div class="language-row">' +
      '<span class="sidebar-lang-label">' + escapeHtml(t('toolbar.language')) + '</span>' +
      '<select class="lang-select" aria-label="Select language">' +
        '<option value="en">English</option>' +
        '<option value="hi">\u0939\u093F\u0928\u094D\u0926\u0940</option>' +
        '<option value="ur">\u0627\u0631\u062F\u0648</option>' +
      '</select>' +
    '</div>';

  const sel = container.querySelector('.lang-select');
  if (sel) sel.value = currentLang;
}

function wireAuthForms() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = String(loginForm.elements?.email?.value ?? loginForm.querySelector('[name="email"]')?.value ?? '').trim();
      const password = String(loginForm.elements?.password?.value ?? loginForm.querySelector('[name="password"]')?.value ?? '').trim();
      const msg = document.getElementById('login-message');

      if (!email || !password) {
        if (msg) msg.textContent = t('messages.missingFields');
        return;
      }
      if (msg) msg.textContent = '';

      const supabase = getSupabaseClient();
      if (!supabase) {
        window.location.assign('seeker-dashboard.html');
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (msg) msg.textContent = error.message || t('messages.authFailed');
        return;
      }
      if (data?.user) {
        const resolvedRole = resolveUserRole(data.user, getRoleFromPage() || 'seeker');
        persistRoleHint(resolvedRole, data.user);
        window.location.assign(getDashboardPath({
          ...data.user,
          user_metadata: { ...(data.user.user_metadata || {}), role: resolvedRole }
        }));
      }
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = String(signupForm.elements?.email?.value ?? signupForm.querySelector('[name="email"]')?.value ?? '').trim();
      const password = String(signupForm.elements?.password?.value ?? signupForm.querySelector('[name="password"]')?.value ?? '').trim();
      const role = String(document.getElementById('signup-role')?.value ?? 'seeker').trim();
      const msg = document.getElementById('signup-message');

      if (!email || !password) {
        if (msg) msg.textContent = t('messages.missingFields');
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        if (msg) msg.textContent = t('messages.checkEmail');
        return;
      }

      const emailRedirectTo = new URL('./index.html', location.href).href;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: { role },
        },
      });

      if (error) {
        if (msg) msg.textContent = error.message || t('messages.signupFailed');
        return;
      }

      if (data?.user) persistRoleHint(role, data.user);

      if (data.session && data.user) {
        window.location.assign(getDashboardPath({
          ...data.user,
          user_metadata: { ...(data.user.user_metadata || {}), role }
        }));
      } else if (msg) {
        msg.textContent = t('messages.checkEmail');
      }
    });
  }

  // Forgot password button
  const forgotBtn = document.getElementById('forgot-password-button');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', async () => {
      const loginEmail = document.getElementById('login-email');
      const email = String(loginEmail?.value ?? '').trim();
      const msg = document.getElementById('login-message');

      if (!email) {
        if (msg) msg.textContent = t('messages.enterEmailForReset');
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        if (msg) msg.textContent = t('messages.passwordResetSent');
        return;
      }

      const redirectTo = new URL('./reset-password.html', location.href).href;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (msg) {
        msg.textContent = error
          ? (error.message || t('messages.authFailed'))
          : t('messages.passwordResetSent');
      }
    });
  }

  // Reset password form
  const resetForm = document.getElementById('reset-password-form');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPw = String(document.getElementById('new-password')?.value ?? '').trim();
      const confirmPw = String(document.getElementById('confirm-password')?.value ?? '').trim();
      const msg = document.getElementById('reset-message');

      if (!newPw || !confirmPw) {
        if (msg) msg.textContent = t('messages.missingFields');
        return;
      }
      if (newPw !== confirmPw) {
        if (msg) msg.textContent = 'Passwords do not match.';
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        if (msg) msg.textContent = t('messages.authFailed');
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        if (msg) msg.textContent = 'Recovery session missing. Open the latest reset link from your email and try again.';
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPw });

      if (error) {
        if (msg) msg.textContent = error.message || t('messages.authFailed');
        return;
      }
      if (msg) msg.textContent = 'Password updated successfully.';
      setTimeout(() => window.location.assign('index.html#login-form'), 1500);
    });
  }
}

function wireLanguageSelectors() {
  document.querySelectorAll('select.lang-select, #home-language-select').forEach((sel) => {
    sel.addEventListener('change', async (e) => {
      const code = e.target.value;
      if (!SUPPORTED_LANGS.includes(code)) return;
      localStorage.setItem(LANG_STORAGE, code);
      syncLanguageSelects(code);
      await loadDictionary(code);
      applyDocumentLanguage(code);
      applyDataI18n();
      renderAppNav();
      renderSidebarLangPicker();
      renderPageContent();
      updateHomeForSession();
    });
  });
}

function renderPageContent() {
  const route = window.Router.getRoute();
  const page = currentPageFile();

  // Public Profile View (#profile/username)
  const profileRoot = document.getElementById('profile-root');
  if (profileRoot && route.page === 'profile' && route.id) {
    renderPublicProfile(profileRoot, route.id);
    return;
  }

  // "Near Me" - Nearby Modules Logic
  if (route.page === 'near-me') {
    renderNearbyModules();
    return;
  }
  // Dictionary page
  const dictRoot = document.getElementById('dictionary-root');
  if (dictRoot && page === 'dictionary.html') {
    const termKeys = Object.keys(dictionary.terms || {});
    const cards = termKeys.map((key) => {
      const term = dictionary.terms[key];
      return (
        '<div class="card dictionary-entry" data-term="' + escapeHtml(key) + '">' +
          '<h3>' + escapeHtml(term.label || key) + '</h3>' +
          '<p><strong>' + escapeHtml(t('dictionary.simpleMeaning')) + '</strong> ' + escapeHtml(term.simple || '') + '</p>' +
          '<p><strong>' + escapeHtml(t('dictionary.expandedMeaning')) + '</strong> ' + escapeHtml(term.expanded || '') + '</p>' +
          '<p class="dictionary-example"><em>' + escapeHtml(t('dictionary.exampleUse')) + ':</em> ' + escapeHtml(term.example || '') + '</p>' +
        '</div>'
      );
    }).join('');

    dictRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('dictionary.kicker')) + '</p>' +
          '<h1>' + escapeHtml(t('dictionary.title')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('dictionary.subtitle')) + '</p>' +
        '</div></div>' +
        '<div class="filters">' +
          '<input id="dict-search" type="text" placeholder="' + escapeHtml(t('dictionary.searchPlaceholder')) + '" />' +
        '</div>' +
        '<div class="record-list" id="dict-list">' + cards + '</div>' +
      '</div>';

    const searchInput = document.getElementById('dict-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        document.querySelectorAll('.dictionary-entry').forEach((el) => {
          const text = el.textContent.toLowerCase();
          el.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }
  }

  // Dashboard pages (seeker, curator, arbiter)
  const dashRoot = document.getElementById('dashboard-root');
  if (dashRoot && dashRoot.innerHTML.trim() === '') {
    const supabase = getSupabaseClient();
    const roleName = getCurrentRole();
    if (roleName === 'curator') {
      renderCuratorDashboard(dashRoot);
      hydrateSignedInMeta(supabase);
    } else if (roleName === 'arbiter') {
      renderArbiterDashboard(dashRoot);
      hydrateSignedInMeta(supabase);
    } else {
      renderSeekerDashboard(dashRoot);
      hydrateSeekerDashboard(supabase);
    }

    focusDashboardPanelFromQuery();
  }

  // Operator dashboard
  const opRoot = document.getElementById('operator-root');
  if (opRoot && opRoot.innerHTML.trim() === '') {
    opRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">Operator</p>' +
          '<h1>Operator Console</h1>' +
          '<p class="lede">Platform administration and oversight tools.</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>Operator tools connect to the Supabase admin layer. This console will populate with data once the backend schema is active.</p>' +
        '</div>' +
      '</div>';
  }

  // Help page
  const helpRoot = document.getElementById('help-root');
  if (helpRoot && helpRoot.innerHTML.trim() === '') {
    helpRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('nav.help')) + '</p>' +
          '<h1>' + escapeHtml(t('onboarding.title')) + '</h1>' +
        '</div></div>' +
        '<div class="card"><h2>' + escapeHtml(t('onboarding.step1Title')) + '</h2><p>' + escapeHtml(t('onboarding.step1Note')) + '</p>' +
          '<ul style="margin:12px 0 0 18px;color:var(--text-secondary);display:grid;gap:8px;">' +
            '<li>' + escapeHtml(t('onboarding.step1Card1')) + '</li>' +
            '<li>' + escapeHtml(t('onboarding.step1Card2')) + '</li>' +
            '<li>' + escapeHtml(t('onboarding.step1Card3')) + '</li>' +
          '</ul></div>' +
        '<div class="card"><h2>' + escapeHtml(t('onboarding.step2Title')) + '</h2><p>' + escapeHtml(t('onboarding.step2Note')) + '</p>' +
          '<ul style="margin:12px 0 0 18px;color:var(--text-secondary);display:grid;gap:8px;">' +
            '<li><strong>' + escapeHtml(t('onboarding.learn')) + '</strong> — ' + escapeHtml(t('onboarding.step2Card1')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.notes')) + '</strong> — ' + escapeHtml(t('onboarding.step2Card2')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.projects')) + '</strong> — ' + escapeHtml(t('onboarding.step2Card3')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.progress')) + '</strong> — ' + escapeHtml(t('onboarding.step2Card4')) + '</li>' +
          '</ul></div>' +
        '<div class="card"><h2>' + escapeHtml(t('onboarding.step3Title')) + '</h2><p>' + escapeHtml(t('onboarding.step3Note')) + '</p>' +
          '<ul style="margin:12px 0 0 18px;color:var(--text-secondary);display:grid;gap:8px;">' +
            '<li><strong>' + escapeHtml(t('onboarding.subjects')) + '</strong> — ' + escapeHtml(t('onboarding.step3Card1')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.groups')) + '</strong> — ' + escapeHtml(t('onboarding.step3Card2')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.dictionary')) + '</strong> — ' + escapeHtml(t('onboarding.step3Card3')) + '</li>' +
            '<li><strong>' + escapeHtml(t('onboarding.help')) + '</strong> — ' + escapeHtml(t('onboarding.step3Card4')) + '</li>' +
          '</ul></div>' +
        '<div class="inline-actions">' +
          '<a class="btn btn-primary" href="subjects.html">' + escapeHtml(t('nav.learn')) + '</a>' +
          '<a class="btn" href="dictionary.html">' + escapeHtml(t('nav.dictionary')) + '</a>' +
          '<a class="btn" href="vision.html">' + escapeHtml(t('nav.vision')) + '</a>' +
        '</div>' +
      '</div>';
  }

  // Subjects page
  const subjectsRoot = document.getElementById('subjects-root');
  if (subjectsRoot && subjectsRoot.innerHTML.trim() === '') {
    const domainCards = Object.keys(DOMAIN_STRUCTURE).map((key) => {
      const d = DOMAIN_STRUCTURE[key];
      return `
        <div class="record-card domain-detail-card">
          <div class="dashboard-card-topline">
             <h3 style="margin:0;">${escapeHtml(d.title)}</h3>
             <a href="domain.html?domain=${encodeURIComponent(key)}" class="btn-ghost" style="font-size:1.2rem; color:var(--gold);" title="Explore Curriculum">→</a>
          </div>
          <p class="domain-definition"><strong>${escapeHtml(d.definition)}</strong></p>
          
          <div class="domain-info-section">
            <span class="section-label-tiny">INCLUDES:</span>
            <p class="domain-includes">${d.includes.map(i => `<span>${escapeHtml(i)}</span>`).join(', ')}</p>
          </div>

          <div class="domain-info-section" style="margin-top:12px;">
            <span class="section-label-tiny">CORE FUNCTION:</span>
            <p class="domain-core">${escapeHtml(d.coreFunction)}</p>
          </div>

          <div class="domain-examples-container">
             <button class="btn-ghost-small" onclick="this.nextElementSibling.classList.toggle('visible')">
               [ View Example Modules ]
             </button>
             <div class="domain-examples-popup">
                <h4>Example Modules</h4>
                <ul>
                  ${d.examples.map(ex => `<li>${escapeHtml(ex)}</li>`).join('')}
                </ul>
                <button class="btn-ghost-small" style="margin-top:12px; display:block; width:100%; text-align:center;" onclick="this.parentElement.classList.remove('visible')">
                  Close
                </button>
             </div>
          </div>
        </div>
      `;
    }).join('');

    subjectsRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <div>
            <p class="section-label">iNHET Integrated Network</p>
            <h1>Knowledge Domains</h1>
            <p class="lede" style="max-width:800px; margin-bottom:24px;">
              Below are the 10 Domains of <strong>iNHET</strong> (Integrated Network for Holistic Education & Training) with precise definitions aligned to the Neofolk Atlas epistemic structure.
            </p>
            <p style="color:var(--muted-text); font-size:0.9rem; max-width:800px;">
              These domains represent fundamental lenses of knowledge, not school subjects. Every module, guild, pathway, and portfolio artifact maps to one or more domains.
            </p>
          </div>
        </div>
        <div class="record-list" style="margin-top:40px;">
          ${domainCards}
        </div>
      </div>
    `;
  }

  // Pathways page
  const pathwaysRoot = document.getElementById('pathways-root');
  if (pathwaysRoot && pathwaysRoot.innerHTML.trim() === '') {
    pathwaysRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Pathways</p>
          <h1>Learning Pathways</h1>
        </div>
        <div class="empty-state">
          <p>No pathways yet.</p>
        </div>
      </div>
    `;
  }

  // Domain page
  const domainRoot = document.getElementById('domain-root');
  if (domainRoot && domainRoot.innerHTML.trim() === '') {
    const selectedDomain = getDomainFilterFromUrl();
    const selectedDomainName = DOMAIN_NAMES[selectedDomain] || 'Modules';
    const filteredModules = selectedDomain ? modules.filter((module) => module.domain === selectedDomain) : modules;
    const showCreate = getCurrentRole() === 'curator';
    domainRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Domain</p>
          <h1>${selectedDomainName}</h1>
          ${showCreate ? `
            <button id="create-module" class="btn btn-primary">
              + Module
            </button>
          ` : ""}
        </div>
        ${filteredModules.length ? `
          <div class="record-list">
            ${filteredModules.map((module) => `
              <div class="record-card">
                <div class="dashboard-card-topline">
                  <span class="pill">${escapeHtml(DOMAIN_NAMES[module.domain] || module.domain)}</span>
                  <span class="muted">${module.syllabus?.length || 0} syllabus items</span>
                </div>
                <h3>${escapeHtml(module.title)}</h3>
                <p>${escapeHtml(module.description || 'No module description yet.')}</p>
                <div class="inline-actions">
                  <a class="btn" href="module.html?id=${module.id}">Open Module</a>
                  <a class="btn subtle-button" href="teaching-log.html">Teaching Log</a>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <p>No modules yet${selectedDomain ? ` in ${selectedDomainName}` : ''}.</p>
          </div>
        `}
      </div>
    `;
    document.getElementById('create-module')?.addEventListener('click', () => {
      const query = selectedDomain ? `?domain=${encodeURIComponent(selectedDomain)}` : '';
      location.href = `module-editor.html${query}`;
    });
  }

  // Guild page
  const guildRoot = document.getElementById('guild-root');
  if (guildRoot && guildRoot.innerHTML.trim() === '') {
    const userGuilds = getUserGuilds(currentUser?.id || 'guest');
    const invites = getPendingInvites(currentUser?.id || 'guest');
    
    guildRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <div>
            <p class="section-label">Groups</p>
            <h1>Guilds & Craft</h1>
            <p class="lede">Collaborative production units for high-level intellectual output.</p>
          </div>
          <button onclick="window.showInstantCraft()" class="btn btn-primary">
            [ + INSTANT CRAFT ]
          </button>
        </div>

        ${invites.length > 0 ? `
          <div class="card" style="margin-bottom:24px; border-color:var(--gold);">
            <h3>Pending Invites</h3>
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
              ${invites.map(inv => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:12px; border-radius:4px;">
                  <div>
                    <strong>${inv.guildName}</strong>
                    <div style="font-size:0.75rem; color:var(--muted-text);">Invited ${new Date(inv.invitedAt).toLocaleDateString()}</div>
                  </div>
                  <div style="display:flex; gap:8px;">
                    <button onclick="acceptGuildInvite('${currentUser?.id || 'guest'}', '${inv.guildId}'); location.reload();" class="btn" style="padding:4px 12px; font-size:0.8rem;">Accept</button>
                    <button onclick="declineGuildInvite('${currentUser?.id || 'guest'}', '${inv.guildId}'); location.reload();" class="btn btn-secondary" style="padding:4px 12px; font-size:0.8rem;">Decline</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="record-list">
          ${userGuilds.map(g => `
            <div class="record-card">
              <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span class="pill" style="margin:0;">GUILD</span>
                <div class="member-cluster">
                  ${g.members.slice(0, 3).map(() => `<div class="member-bubble">?</div>`).join('')}
                  ${g.members.length > 3 ? `<div class="member-bubble">+${g.members.length - 3}</div>` : ''}
                </div>
              </div>
              <h3>${g.name}</h3>
              <p style="font-size:0.85rem; color:var(--muted-text);">${g.description}</p>
              <div style="margin-top:auto; padding-top:12px; display:flex; gap:8px;">
                <button class="btn" style="flex:1; font-size:0.8rem;">Library</button>
                <button class="btn btn-secondary" style="font-size:0.8rem;">Invite</button>
              </div>
            </div>
          `).join('')}
          
          ${userGuilds.length === 0 ? `
            <div class="empty-state" style="grid-column: 1/-1;">
              <p>You haven't joined any guilds yet. Start an 'Instant Craft' or wait for an invitation.</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Discovery page
  const discoveryRoot = document.getElementById('discovery-root');
  if (discoveryRoot && discoveryRoot.innerHTML.trim() === '') {
    discoveryRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('nav.explore')) + '</p>' +
          '<h1>' + escapeHtml(t('terms.discovery.label')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('terms.discovery.expanded')) + '</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>' + escapeHtml(t('dashboard.discoveryAdvancedBody')) + '</p>' +
        '</div>' +
      '</div>';
  }

  // Research page
  const researchRoot = document.getElementById('research-root');
  if (researchRoot && researchRoot.innerHTML.trim() === '') {
    researchRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('search.research')) + '</p>' +
          '<h1>' + escapeHtml(t('search.research')) + '</h1>' +
          '<p class="lede">Research projects and academic documentation from across the network.</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>Research posts will appear here as curators and seekers publish their work.</p>' +
        '</div>' +
      '</div>';
  }

  // Profile page
  const userProfileRoot = document.getElementById('profile-root');
  if (userProfileRoot && userProfileRoot.innerHTML.trim() === '') {
    const supabase = getSupabaseClient();
    const userId = currentUser?.id || 'guest';
    const savedProfile = JSON.parse(localStorage.getItem(`neofolk.profile.${userId}`) || '{}');
    const hasProfile = savedProfile.name || savedProfile.bio;
    
    // Calculate profile completeness
    const fields = ['photo', 'name', 'bio', 'domain', 'skills'];
    const filledFields = fields.filter(f => savedProfile[f] && savedProfile[f].trim && savedProfile[f].trim()).length;
    const completeness = Math.round((filledFields / fields.length) * 100);
    
    // Profile display card (shown if profile exists)
    const profileDisplayHTML = hasProfile ? `
      <div class="card profile-card-premium" style="margin-bottom:var(--space-4);">
        <div class="profile-header-premium" style="display:flex; gap:var(--space-4); align-items:center; flex-wrap:wrap; padding-bottom:var(--space-4); border-bottom:1px solid var(--border);">
          <div class="profile-avatar-wrap">
            ${savedProfile.photo ? `<img src="${escapeHtml(savedProfile.photo)}" class="profile-avatar-lg">` : '<div class="profile-avatar-placeholder">?</div>'}
          </div>
          <div class="profile-title-area">
            <p class="section-label" style="margin-bottom:4px;">Research Profile</p>
            <h2 class="profile-name-lg">${escapeHtml(savedProfile.name || 'Unnamed Researcher')}</h2>
            ${savedProfile.domain ? `<div class="domain-badge-premium">${escapeHtml(savedProfile.domain)}</div>` : ''}
          </div>
        </div>
        
        <div class="profile-details-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:var(--space-4); margin-top:var(--space-4);">
          <div class="profile-detail-block">
            <p class="section-label">Researcher Bio</p>
            <p class="profile-bio-text">${escapeHtml(savedProfile.bio || 'No bio documented.')}</p>
          </div>
          <div class="profile-detail-block">
            <p class="section-label">Specializations</p>
            <div class="tag-stack">
              ${savedProfile.skills ? savedProfile.skills.split(',').map(s => `<span class="pill">${escapeHtml(s.trim())}</span>`).join('') : '<span class="muted">No skills documented.</span>'}
            </div>
          </div>
        </div>

        <div class="profile-footer-premium" style="margin-top:var(--space-4); padding-top:var(--space-3); display:flex; justify-content:space-between; align-items:center; opacity:0.8;">
          <div class="completeness-bar-wrap" style="flex:1; max-width:300px;">
            <div class="dashboard-progress-block">
              <div class="dashboard-progress-track"><span class="dashboard-progress-fill" style="width:${completeness}%"></span></div>
              <span class="dashboard-progress-value">${completeness}%</span>
            </div>
          </div>
          <button id="edit-profile-btn" class="btn subtle-button" style="font-size:0.85rem;">Edit Profile</button>
        </div>
      </div>
    ` : '';
    
    // Edit form (hidden if profile exists, shown otherwise)
    const editFormHTML = `
      <div class="card profile-form" id="profile-edit-form" style="${hasProfile ? 'display:none;' : ''}">
        <h3 style="margin-top:0; margin-bottom:20px; color:var(--text-primary);">${hasProfile ? 'Edit Profile' : 'Create Your Profile'}</h3>
        <div class="profile-section">
          <label>Profile Photo</label>
          <input type="file" id="profile-photo-input" accept="image/*">
          <img id="profile-photo-preview" src="${escapeHtml(savedProfile.photo || '')}" style="display:${savedProfile.photo ? 'block' : 'none'};width:80px;height:80px;object-fit:cover;border-radius:50%;margin-top:8px;">
        </div>
        <div class="profile-section">
          <label>Display Name *</label>
          <input id="profile-name" class="neo-input" value="${escapeHtml(savedProfile.name || '')}" placeholder="Your name" required>
        </div>
        <div class="profile-section">
          <label>Bio</label>
          <textarea id="profile-bio" class="neo-input" placeholder="Tell us about yourself" rows="3">${escapeHtml(savedProfile.bio || '')}</textarea>
        </div>
        <div class="profile-section">
          <label>Primary Domain</label>
          <select id="profile-domain" class="neo-input">
            <option value="">Select domain...</option>
            <option value="Lingosophy"${savedProfile.domain === 'Lingosophy' ? ' selected' : ''}>Lingosophy</option>
            <option value="Arthmetics"${savedProfile.domain === 'Arthmetics' ? ' selected' : ''}>Arthmetics</option>
            <option value="Cosmology"${savedProfile.domain === 'Cosmology' ? ' selected' : ''}>Cosmology</option>
            <option value="Biosphere"${savedProfile.domain === 'Biosphere' ? ' selected' : ''}>Biosphere</option>
            <option value="Chronicles"${savedProfile.domain === 'Chronicles' ? ' selected' : ''}>Chronicles</option>
            <option value="Civitas"${savedProfile.domain === 'Civitas' ? ' selected' : ''}>Civitas</option>
            <option value="Tokenomics"${savedProfile.domain === 'Tokenomics' ? ' selected' : ''}>Tokenomics</option>
            <option value="Artifex"${savedProfile.domain === 'Artifex' ? ' selected' : ''}>Artifex</option>
            <option value="Praxis"${savedProfile.domain === 'Praxis' ? ' selected' : ''}>Praxis</option>
            <option value="Bioepisteme"${savedProfile.domain === 'Bioepisteme' ? ' selected' : ''}>Bioepisteme</option>
          </select>
        </div>
        <div class="profile-section">
          <label>Skills (comma separated)</label>
          <input id="profile-skills" class="neo-input" value="${escapeHtml(savedProfile.skills || '')}" placeholder="e.g. Research, Writing, Analysis">
        </div>
        <div style="display:flex; gap:12px; margin-top:20px;">
          <button id="save-profile-btn" class="btn btn-primary">${hasProfile ? 'Save Changes' : 'Create Profile'}</button>
          ${hasProfile ? '<button id="cancel-edit-btn" class="btn btn-secondary" style="font-size:0.8rem;">Cancel</button>' : ''}
        </div>
        <p id="profile-save-error" style="color:var(--error); font-size:0.8rem; margin-top:12px; display:none;">Please enter a display name.</p>
      </div>
    `;
    
    profileRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <div>
            <p class="section-label">Account</p>
            <h1>Your Profile</h1>
            <p id="profile-email" class="dashboard-meta"></p>
          </div>
        </div>
        ${hasProfile ? profileDisplayHTML : '<div class="card" style="margin-bottom:24px; text-align:center; padding:40px;"><p style="color:var(--text-muted);">No profile yet. Create one below.</p></div>'}
        ${editFormHTML}
      </div>
    `;

    // Photo preview handler
    const photoInput = document.getElementById('profile-photo-input');
    const photoPreview = document.getElementById('profile-photo-preview');
    if (photoInput && photoPreview) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            photoPreview.src = ev.target.result;
            photoPreview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // Edit button handler (shows form)
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        const form = document.getElementById('profile-edit-form');
        if (form) form.style.display = 'block';
        editBtn.style.display = 'none';
      });
    }
    
    // Cancel button handler
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        const form = document.getElementById('profile-edit-form');
        if (form) form.style.display = 'none';
        if (editBtn) editBtn.style.display = 'inline-block';
      });
    }
    
    // Save profile handler - FIXED
    const saveBtn = document.getElementById('save-profile-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('profile-name');
        const name = nameInput ? nameInput.value.trim() : '';
        
        // Validate name is required
        if (!name) {
          const errorMsg = document.getElementById('profile-save-error');
          if (errorMsg) errorMsg.style.display = 'block';
          nameInput?.focus();
          return;
        }
        
        const bioInput = document.getElementById('profile-bio');
        const domainInput = document.getElementById('profile-domain');
        const skillsInput = document.getElementById('profile-skills');
        const photoPreviewEl = document.getElementById('profile-photo-preview');
        
        const profile = {
          photo: photoPreviewEl?.src || '',
          name: name,
          bio: bioInput ? bioInput.value.trim() : '',
          domain: domainInput ? domainInput.value : '',
          skills: skillsInput ? skillsInput.value.trim() : ''
        };
        
        // Save to localStorage
        localStorage.setItem(`neofolk.profile.${userId}`, JSON.stringify(profile));
        
        // Show success
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        saveBtn.style.background = 'var(--success)';
        
        // Reload page after brief delay to show updated profile
        setTimeout(() => {
          location.reload();
        }, 800);
      });
    }

    // Load user email
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        const el = document.getElementById('profile-email');
        if (el && data?.user?.email) {
          el.textContent = data.user.email;
        }
      }).catch(() => {});
    }
  }

  // Module page
  const moduleRoot = document.getElementById('module-root');
  if (moduleRoot && moduleRoot.innerHTML.trim() === '') {
    const urlParams = new URLSearchParams(window.location.search);
    const modId = urlParams.get('id');
    const module = modId ? getModule(modId) : null;

    if (module) {
      moduleRoot.innerHTML = `
        <div class="dashboard-shell">
          <div class="dashboard-header">
            <div>
              <p class="section-label">${escapeHtml(DOMAIN_NAMES[module.domain] || module.domain)}</p>
              <h1>${escapeHtml(module.title)}</h1>
              <p class="lede">${escapeHtml(module.description || 'No description.')}</p>
            </div>
            ${getCurrentRole() === 'curator' && module.curatorCardID === getMyCuratorCard()?.id ? `
              <a class="btn" href="module-editor.html?id=${module.id}">Edit Module</a>
            ` : ''}
          </div>
          
          <div class="card-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
            <div class="card">
              <h3>Module Details</h3>
              <div style="display:grid; gap:12px; margin-top:16px;">
                <div style="display:flex; justify-content:space-between;">
                  <span class="muted">Curator</span>
                  <strong>${escapeHtml(module.curatorName)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span class="muted">Duration</span>
                  <strong>${module.durationWeeks || 4} Weeks</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span class="muted">Capacity</span>
                  <strong>${module.maxCapacity || 20} Learners</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span class="muted">Location</span>
                  <strong>${escapeHtml(module.locationName || 'Remote')}</strong>
                </div>
              </div>
            </div>

            <div class="card">
              <h3>Syllabus & Outcomes</h3>
              <div class="record-list" style="margin-top:16px;">
                ${(module.syllabus || []).length ? module.syllabus.map((item, idx) => `
                  <div class="record-card" style="padding:16px; background:rgba(0,0,0,0.15);">
                    <div class="section-label">Session ${idx + 1}</div>
                    <strong style="display:block; margin:4px 0;">${escapeHtml(item.title)}</strong>
                    <p style="font-size:0.85rem; margin:0;">${escapeHtml(item.details)}</p>
                  </div>
                `).join('') : '<p class="muted">No syllabus items defined yet.</p>'}
              </div>
            </div>
          </div>

          <div class="inline-actions" style="margin-top:32px;">
            <a class="btn btn-primary" href="subjects.html">Browse More</a>
            <a class="btn" href="discovery.html">Explore Discovery</a>
          </div>
        </div>
      `;
    } else {
      moduleRoot.innerHTML =
        '<div class="dashboard-shell">' +
          '<div class="dashboard-header"><div>' +
            '<p class="section-label">' + escapeHtml(t('terms.module.label')) + '</p>' +
            '<h1>' + escapeHtml(t('terms.module.label')) + '</h1>' +
            '<p class="lede">' + escapeHtml(t('terms.module.expanded')) + '</p>' +
          '</div></div>' +
          '<div class="empty-state">' +
            '<p>Select a module from the Subjects page to view its content here.</p>' +
            '<a class="btn" href="subjects.html" style="margin-top:12px;">' + escapeHtml(t('dashboard.browseTopics')) + '</a>' +
          '</div>' +
        '</div>';
    }
  }

  // Guide page
  const guideRoot = document.getElementById('guide-root');
  if (guideRoot && guideRoot.innerHTML.trim() === '') {
    guideRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">NHBE System Guide</p>
          <h1>How Neofolk Learning Works</h1>
          <p class="lede">
            Neofolk Atlas organizes learning through interconnected structures that reflect how knowledge exists in reality: interdisciplinary, applied, and evolving.
          </p>
        </div>

        <!-- SECTION 1 — DOMAINS -->
        <div class="card">
          <h2>Domains</h2>
          <p>
            Domains represent fundamental perspectives through which humans understand reality. Unlike traditional subjects, Domains describe modes of thinking rather than narrow academic categories.
          </p>
          <p>
            Each learning activity contributes to one or more Domains, creating a multidimensional learning profile rather than a single grade.
          </p>
          <ul>
            <li><strong>Lingosophy</strong> — language, interpretation, rhetoric, meaning systems</li>
            <li><strong>Arthmetics</strong> — mathematics, logic, quantitative structure</li>
            <li><strong>Cosmology</strong> — physics, astronomy, systems structure</li>
            <li><strong>Biosphere</strong> — ecology, biology, environmental relationships</li>
            <li><strong>Chronicles</strong> — history, civilization memory, cultural continuity</li>
            <li><strong>Civitas</strong> — ethics, governance, social responsibility</li>
            <li><strong>Tokenomics</strong> — economic behavior, incentives, value exchange</li>
            <li><strong>Artifex</strong> — design, art, craft, material intelligence</li>
            <li><strong>Praxis</strong> — physical discipline, embodied learning, applied action</li>
            <li><strong>Bioepisteme</strong> — life knowledge, practical intelligence, survival skills</li>
          </ul>
          <p>
            Domains create balance between analytical, creative, social, and practical abilities.
          </p>
        </div>

        <!-- SECTION 2 — PATHWAYS -->
        <div class="card">
          <h2>Pathways</h2>
          <p>
            Pathways are short structured learning experiences connecting real-world skill development to Domains.
          </p>
          <p>
            Pathways typically last between one week and three months and allow learners to experiment with multiple fields before specializing.
          </p>
          <p>
            Each Pathway produces portfolio evidence and contributes to domain development.
          </p>
          <h3>Examples of Pathways</h3>
          <ul>
            <li>Urban Gardening Practice</li>
            <li>Introduction to Phonetics</li>
            <li>Storytelling Practice</li>
            <li>Basic Carpentry</li>
            <li>Yoga Foundations</li>
            <li>Folk Music Study</li>
            <li>Ecology Observation</li>
            <li>Digital Illustration Basics</li>
          </ul>
          <p>
            Pathways allow learning without long-term commitment pressure while still producing measurable progress.
          </p>
        </div>

        <!-- SECTION 3 — GUILDS -->
        <div class="card">
          <h2>Guilds</h2>
          <p>
            Guilds are collaborative research communities formed by learners exploring shared interests.
          </p>
          <p>
            Guilds allow open-ended inquiry beyond structured courses and replicate historical knowledge guild traditions.
          </p>
          <p>
            Guilds develop:
          </p>
          <ul>
            <li>initiative</li>
            <li>research ability</li>
            <li>collaboration skills</li>
            <li>intellectual curiosity</li>
          </ul>
          <h3>Examples of Guilds</h3>
          <ul>
            <li>Solar Architecture Guild</li>
            <li>Food Culture Guild</li>
            <li>Folk Music Preservation Guild</li>
            <li>Gender Language Guild</li>
            <li>Local History Guild</li>
            <li>Traditional Craft Research Guild</li>
          </ul>
          <p>
            Guild participation contributes to domain depth and specialization.
          </p>
        </div>

        <!-- SECTION 4 — PORTFOLIO -->
        <div class="card">
          <h2>Portfolio</h2>
          <p>
            Portfolio is the primary method of demonstrating learning.
          </p>
          <p>
            Instead of relying only on exams, Neofolk Atlas evaluates documented evidence of skill development.
          </p>
          <p>
            Portfolio entries may include:
          </p>
          <ul>
            <li>written analysis</li>
            <li>design work</li>
            <li>project documentation</li>
            <li>audio recordings</li>
            <li>performance recordings</li>
            <li>photographs of practical work</li>
            <li>research notes</li>
            <li>reflection journals</li>
          </ul>
          <h3>Portfolio Examples</h3>
          <ul>
            <li>Soil health analysis report</li>
            <li>Folk song performance recording</li>
            <li>Architectural drawing</li>
            <li>Research interview transcript</li>
            <li>Mathematical pattern study</li>
            <li>Craft prototype photographs</li>
          </ul>
          <p>
            Portfolio grows continuously and reflects real capability development over time.
          </p>
        </div>

        <!-- SECTION 5 — NODES -->
        <div class="card">
          <h2>Nodes</h2>
          <p>
            Nodes are physical or digital environments where learning occurs.
          </p>
          <p>
            Nodes distribute education across society rather than restricting learning to classrooms.
          </p>
          <p>
            Nodes allow professionals, practitioners, and researchers to contribute to education directly.
          </p>
          <h3>Types of Nodes</h3>
          <ul>
            <li><strong>Practice Nodes</strong> — real-world skill environments</li>
            <li><strong>Studios</strong> — design and creative production spaces</li>
            <li><strong>Atheneums</strong> — research libraries and archives</li>
            <li><strong>Coliseums</strong> — movement and physical training spaces</li>
            <li><strong>Learning Commons</strong> — collaborative study environments</li>
          </ul>
          <p>
            Nodes connect knowledge to real-world practice.
          </p>
        </div>

        <!-- SECTION 6 — HOW EVERYTHING CONNECTS -->
        <div class="card">
          <h2>System Structure</h2>
          <p>
            Learning flows through interconnected layers:
          </p>
          <ul>
            <li>Pathways create structured learning experiences</li>
            <li>Guilds allow deeper collaborative research</li>
            <li>Portfolio documents evidence of capability</li>
            <li>Nodes provide real environments for learning</li>
            <li>Domains track intellectual development across disciplines</li>
          </ul>
          <p>
            Together these structures create a learning ecosystem that reflects real-world complexity.
          </p>
        </div>

        <!-- SECTION 7 — NEOSCORE -->
        <div class="card">
          <h2>Neoscore</h2>
          <p>
            Neoscore measures development across multiple Domains rather than a single exam result.
          </p>
          <p>
            Each learning activity contributes to one or more Domains.
          </p>
          <p>
            Neoscore reflects both breadth of exploration and depth of specialization.
          </p>
          <p>
            Neoscore calculation system will evolve after the alpha phase to better reflect professional capability and interdisciplinary intelligence.
          </p>
        </div>
      </div>
    `;
  }

  // Portfolio page
  const portfolioRoot = document.getElementById('portfolio-root');
  if (portfolioRoot && portfolioRoot.innerHTML.trim() === '') {
    if (getCurrentRole() === 'curator') {
      const { myCard, myModules, myBatches, totalStudents, activeLicenses } = getCuratorDashboardData();
      portfolioRoot.innerHTML = `
        <div class="dashboard-shell role-dashboard role-dashboard--curator">
          <div class="dashboard-header">
            <div>
              <p class="section-label">Dossier</p>
              <h1>Curator Dossier</h1>
              <p class="lede">A public-facing record of your authority, authored modules, and teaching footprint.</p>
            </div>
          </div>
          <div class="card">
            <div class="mini-stat-grid">
              <div class="mini-stat"><strong>${myModules.length}</strong><span>Modules</span></div>
              <div class="mini-stat"><strong>${myBatches.length}</strong><span>Batches</span></div>
              <div class="mini-stat"><strong>${totalStudents}</strong><span>Learners</span></div>
              <div class="mini-stat"><strong>${activeLicenses}</strong><span>Licenses</span></div>
            </div>
          </div>
          <div class="dashboard-sections two-column">
            <div class="card">
              <p class="section-label">Profile</p>
              <h2>${escapeHtml(myCard?.fullName || getDisplayNameForUser(currentUser?.id || 'guest', 'Curator Profile'))}</h2>
              <p>${escapeHtml((myCard?.activeLicenses || []).join(', ') || 'No domain licenses attached yet.')}</p>
              <div class="inline-actions flow-top-32">
                <a class="btn btn-primary" href="profile.html">Edit Profile</a>
                <a class="btn" href="curator-dashboard.html?panel=curator-add-module">Add Module</a>
              </div>
            </div>
            <div class="card">
              <p class="section-label">Teaching Surface</p>
              <h2>Current authored modules</h2>
              <div class="plain-list">
                ${myModules.length ? myModules.map((module) => `
                  <div class="oversight-row">
                    <div>
                      <strong>${escapeHtml(module.title)}</strong>
                      <p>${escapeHtml(DOMAIN_NAMES[module.domain] || module.domain)}</p>
                    </div>
                    <span class="pill">${module.batches.length} batches</span>
                  </div>
                `).join('') : '<p>No modules authored yet.</p>'}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      portfolioRoot.innerHTML = `
        <div class="dashboard-shell">
          <div class="dashboard-header">
            <p class="section-label">Portfolio</p>
            <h1>Learning Portfolio</h1>
          </div>
          <div class="empty-state">
            <p>Your documented learning evidence will appear here.</p>
          </div>
        </div>
      `;
    }
  }

  // Teaching Log page
  const teachingRoot = document.getElementById('teaching-log-root');
  if (teachingRoot && teachingRoot.innerHTML.trim() === '') {
    const batches = JSON.parse(localStorage.getItem('neofolk.batches') || '[]');
    const { myCard, myModules } = getCuratorDashboardData();
    
    teachingRoot.innerHTML = `
      <div class="dashboard-shell role-dashboard role-dashboard--curator">
        <div class="dashboard-header">
          <div>
            <p class="section-label">Curation</p>
            <h1>Teaching Log</h1>
            <p class="lede">Manage modules, open new batches, and track curriculum operations.</p>
          </div>
          <div class="inline-actions">
            <a class="btn btn-primary" href="module-editor.html">Add Module</a>
            <a class="btn" href="curator-dashboard.html?panel=curator-modules">Open Dashboard</a>
          </div>
        </div>

        <div class="card">
          <div class="dashboard-card-topline">
            <div>
              <p class="section-label">Module Floor</p>
              <h2>Modules ready for batching</h2>
            </div>
          </div>
          ${myCard && myModules.length > 0 ? `
            <div class="record-list">
              ${myModules.map((module) => `
                <div class="record-card">
                  <div class="dashboard-card-topline">
                    <span class="pill">${escapeHtml(DOMAIN_NAMES[module.domain] || module.domain)}</span>
                    <span class="muted">${module.syllabus?.length || 0} syllabus items</span>
                  </div>
                  <h3>${escapeHtml(module.title)}</h3>
                  <p>${escapeHtml(module.description || 'No description yet.')}</p>
                  <div class="inline-actions">
                    <button onclick="window.createBatchFromModule('${module.id}')" class="btn btn-primary">Create Batch</button>
                    <a class="btn" href="module-editor.html?id=${module.id}">Edit Module</a>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <p>No modules available yet. Create your first module before opening a batch.</p>
            </div>
          `}
        </div>

        <div class="card">
          <h3 style="margin-bottom:20px;">Active Batches</h3>
          ${batches.length > 0 ? `
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
              ${batches.filter(b => myModules.some(m => m.id === b.moduleId)).map(b => `
                <div style="background:rgba(0,0,0,0.2); border:1px solid var(--border-color); padding:20px; border-radius:4px;">
                  <span style="font-size:0.65rem; color:var(--gold); border:1px solid var(--gold); padding:2px 6px; border-radius:10px; margin-bottom:12px; display:inline-block;">${b.moduleTitle}</span>
                  <h4 style="margin:0 0 8px 0; font-family:var(--serif);">${b.name}</h4>
                  <div style="font-size:0.8rem; color:var(--muted-text); margin-bottom:16px;">${b.studentIds.length} Students Enrolled</div>
                  <button onclick="location.href='attendance.html?batchId=${b.id}'" class="btn" style="width:100%; font-size:0.8rem;">Open Attendance</button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <p>No batches found. Create a batch from a Module study page.</p>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // Attendance page
  const attendanceRoot = document.getElementById('attendance-root');
  if (attendanceRoot && attendanceRoot.innerHTML.trim() === '') {
    const urlParams = new URLSearchParams(window.location.search);
    const batchId = urlParams.get('batchId');
    const batches = JSON.parse(localStorage.getItem('neofolk.batches') || '[]');
    const batch = batches.find(b => b.id === batchId);
    
    if (batch) {
      const studentProfiles = [
        ...(batch.studentRoster?.length ? batch.studentRoster : [
          { id: 's1', name: 'Aarav Sharma' },
          { id: 's2', name: 'Isha Patel' },
          { id: 's3', name: 'Kabir Das' },
          { id: 's4', name: 'Ananya Rao' }
        ])
      ];
      
      const today = new Date().toISOString().split('T')[0];
      const log = batch.attendanceLogs.find(l => l.date === today) || { records: {} };
      
      attendanceRoot.innerHTML = `
        <div class="dashboard-shell">
          <div class="dashboard-header">
            <div>
              <p class="section-label">Attendance</p>
              <h1>${batch.name}</h1>
              <p class="lede">${batch.moduleTitle} | daily log for ${today}</p>
            </div>
            <button onclick="window.broadcastAttendance()" class="btn btn-primary">
              BROADCAST LOG
            </button>
          </div>
          
          <div class="card" style="padding:0; overflow:hidden;">
            <table class="attendance-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th style="width:100px;">Present</th>
                </tr>
              </thead>
              <tbody>
                ${studentProfiles.map(s => `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:32px; height:32px; border-radius:50%; background:rgba(232, 220, 200, 0.1); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; font-size:10px;">${s.name[0]}</div>
                        <strong>${s.name}</strong>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" class="attendance-toggle" 
                             ${log.records[s.id] === 'present' ? 'checked' : ''}
                             onchange="toggleAttendance('${batch.id}', '${today}', '${s.id}')">
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div id="saved-toast" class="saved-toast">Attendance Broadcast Sent!</div>
        </div>
      `;
    } else {
      attendanceRoot.innerHTML = `
        <div class="dashboard-shell">
          <div class="empty-state">
            <p>Batch not found or session closed.</p>
            <a href="teaching-log.html" class="btn">Return to Log</a>
          </div>
        </div>
      `;
    }
  }

  window.broadcastAttendance = function() {
    const toast = document.getElementById('saved-toast');
    if (toast) {
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 3000);
    }
  };

  // Module Editor page
  const editorRoot = document.getElementById('module-editor-root');
  if (editorRoot && (editorRoot.innerHTML.trim() === '' || route.page === 'module-editor')) {
    const urlParams = new URLSearchParams(window.location.search);
    const existingId = urlParams.get('id');
    const existingModule = existingId ? getModule(existingId) : null;
    const preselectedDomain = urlParams.get('domain') || existingModule?.domain || '';

    editorRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">${escapeHtml(t('nav.modules'))}</p>
          <h1>${existingModule ? 'Edit Module' : escapeHtml(t('modules.createTitle'))}</h1>
          <p class="lede">Define your module's academic structure, syllabus, and physical location.</p>
        </div>
        <div class="card curator-form-stack" style="display:grid; gap:20px;">
          <input type="hidden" id="mod-edit-id" value="${existingId || ''}">
          <div>
            <label class="field-label">${escapeHtml(t('modules.moduleTitle'))}</label>
            <input id="mod-title" class="neo-input" placeholder="e.g. Introduction to Spivakian Linguistics" value="${escapeHtml(existingModule?.title || '')}">
          </div>
          
          <div>
            <label class="field-label">${escapeHtml(t('modules.moduleDescription'))}</label>
            <textarea id="mod-desc" class="neo-input" rows="4">${escapeHtml(existingModule?.description || '')}</textarea>
          </div>

          <div>
            <label class="field-label">Domain</label>
            <select id="mod-domain" class="neo-input">
              ${Object.keys(DOMAIN_NAMES).map(k => `<option value="${k}"${preselectedDomain === k ? ' selected' : ''}>${DOMAIN_NAMES[k]}</option>`).join('')}
            </select>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="field-label">${escapeHtml(t('modules.durationWeeks'))}</label>
              <input id="mod-weeks" type="number" min="1" class="neo-input" value="${existingModule?.durationWeeks || 4}">
            </div>
            <div>
              <label class="field-label">${escapeHtml(t('modules.maxCapacity'))}</label>
              <input id="mod-capacity" type="number" min="1" class="neo-input" value="${existingModule?.maxCapacity || 20}">
            </div>
          </div>

          <div>
            <label class="field-label">${escapeHtml(t('modules.locationName'))}</label>
            <input id="mod-loc-name" class="neo-input" placeholder="e.g. Bangalore Community Library" value="${escapeHtml(existingModule?.locationName || '')}">
          </div>

          <div>
            <label class="field-label">${escapeHtml(t('modules.syllabus'))}</label>
            <div id="syllabus-items" style="display:grid; gap:8px; margin-bottom:12px;"></div>
            <button class="btn btn-secondary" onclick="window.addSyllabusItem()" style="font-size:0.8rem;">
              + ${escapeHtml(t('modules.addSyllabusItem'))}
            </button>
          </div>

          <div style="padding-top:20px; border-top:1px solid var(--border);">
            <button onclick="window.saveModuleAdvanced()" class="btn btn-primary" style="width:100%;">
              ${existingModule ? 'Save Changes' : escapeHtml(t('modules.createModule'))}
            </button>
          </div>
        </div>
      </div>
    `;

    // Initialize syllabus items
    if (existingModule?.syllabus?.length) {
      existingModule.syllabus.forEach(item => window.addSyllabusItem(item.title, item.details));
    } else {
      if (window.addSyllabusItem) window.addSyllabusItem();
    }
  }

  // Studios page
  const studiosRoot = document.getElementById('studios-root');
  if (studiosRoot && studiosRoot.innerHTML.trim() === '') {
    studiosRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('search.studios')) + '</p>' +
          '<h1>' + escapeHtml(t('search.studios')) + '</h1>' +
          '<p class="lede">Capability environments unlocked through demonstrated contribution and serious intellectual production.</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>Studios become available as your learning record deepens.</p>' +
        '</div>' +
      '</div>';
  }

  const neoscoreRoot = document.getElementById("neoscore-root");
  if (neoscoreRoot && neoscoreRoot.innerHTML.trim() === "") {
    const userId = currentUser?.id || 'guest';
    const storedDomains = JSON.parse(localStorage.getItem(`neofolk.domains.${userId}`) || 'null');
    const storedSpec = JSON.parse(localStorage.getItem(`neofolk.spec.${userId}`) || 'null');
    
    // Create 'band' object as requested
    const band = {
      neoDomains: storedDomains || defaultNeoDomains,
      neoSpecialization: storedSpec || defaultNeoSpecialization
    };
    
    const score = calculateNeoscore(band.neoDomains);
    const specscore = calculateSpecscore(band.neoSpecialization);
    
    const domainBars = Object.entries(band.neoDomains).map(([name, val]) => `
      <div class="domain-row">
        <span style="font-size:10px; text-transform:uppercase; color: #888;">${name}</span>
        <div class="domain-bar"><div style="width:${val * 10}%"></div></div>
      </div>
    `).join("");

    const widgetHTML = `
      <div class="neoscore-widget" style="margin: 20px 0; border: 1px solid #333;">
        <button class="neoscore-toggle" onclick="(${toggleNeoscore.toString()})()" 
            style="width:100%; padding:14px; background:#000; color:#fff; border:none; cursor:pointer; font-family:monospace; text-align:left; display:flex; justify-content:space-between; align-items:center;">
            <span>[+] NEOSCORE: ${score} | SPECSCORE: ${specscore}</span>
            <span style="font-size:10px; opacity:0.5;">TOPOLOGY</span>
        </button>
        <div id="neoscore-analysis" class="hidden" style="padding:20px; background:#111; border-top:1px solid #333;">
            <h4 style="margin:0 0 16px 0; font-size:11px; text-transform:uppercase; color:#fff; letter-spacing:0.05em;">DOMAIN DISTRIBUTION</h4>
            ${domainBars}
            <p style="font-size:10px; color:#555; margin-top:20px; font-style:italic;">
                Neoscore = coordinate | Specscore = direction vector.
            </p>
        </div>
      </div>
    `;

    const lineageCards = LINEAGE_DETAILS.map((t, idx) => `
      <div class="lineage-card" style="padding:16px !important; background:#f5f5dc !important; border-radius:2px !important; box-shadow:2px 2px 8px rgba(0,0,0,0.15), 0 0 2px rgba(0,0,0,0.1) !important; transform:rotate(${idx % 2 === 0 ? '-1' : '1'}deg) !important; transition:transform 0.2s ease !important;">
        <div style="display:flex !important; justify-content:space-between !important; align-items:flex-start !important; margin-bottom:8px !important;">
           <span style="font-size:10px !important; color:#8b4513 !important; background:#e8e0c5 !important; padding:2px 6px !important; border-radius:3px !important; text-transform:uppercase !important; font-weight:600 !important;">${t.tokenName}</span>
           <span style="font-size:9px !important; color:#8b7355 !important;">${t.domain}: ${t.subdomain}</span>
        </div>
        <h4 style="margin:0 0 8px 0 !important; color:#3d2914 !important; font-family:'Cormorant Garamond', serif !important; font-size:1.2rem !important;">${t.fullName}</h4>
        <p style="font-size:11px !important; color:#5c4033 !important; line-height:1.5 !important; margin:0 0 12px 0 !important; font-family:serif !important;">${t.description}</p>
        <div style="font-size:9px !important; color:#8b7355 !important; border-top:1px dashed #d4c4a8 !important; padding-top:8px !important; font-style:italic !important;">Pillar: ${t.resonancePillar}</div>
      </div>
    `).join("");

    neoscoreRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Neoscore</p>
          <h1>Knowledge Topology</h1>
          <p class="lede">Breadth, depth, and the shape of your learning record across the ten domains.</p>
        </div>
        ${widgetHTML}
        
        <div class="card" style="background:transparent; border:none; padding:0;">
          <h3 style="margin-bottom:20px; font-family:'Cormorant Garamond', serif; font-size:1.5rem; color:#fff;">Resonance Framework</h3>
          <div class="lineage-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
            ${lineageCards}
          </div>
        </div>

        <div class="card" style="margin-bottom:24px;">
          <h3 style="margin-top:0; margin-bottom:20px;">Curator License</h3>
          <div id="curator-card-container">
            ${getMyCuratorCard() ? `
              <div class="curator-card-id">
                <div class="chip"></div>
                <div class="card-header">
                  <div>
                    <div class="card-meta">Curator ID</div>
                    <div class="card-name">${getMyCuratorCard().fullName}</div>
                  </div>
                  <div style="text-align:right;">
                    <div class="card-meta">Status</div>
                    <div style="color:#4ade80; font-size:11px; font-weight:bold;">ACTIVE</div>
                  </div>
                </div>
                <div style="margin-top:10px;">
                  <div class="card-meta">Registered Age</div>
                  <div style="font-size:1.1rem; font-weight:600;">${getMyCuratorCard().age}</div>
                </div>
                <div class="token-badges">
                  ${getMyCuratorCard().activeLicenses.map(lic => {
                    const domain = lic.replace('Level 3 ', '').replace('Level 2 ', '').replace('Level 1 ', '');
                    const color = getTokenColor(DOMAIN_TO_TOKEN[domain] || domain);
                    return `<span class="badge" style="border-color:${color}; color:${color}; box-shadow: 0 0 10px ${color}44;">${lic}</span>`;
                  }).join('')}
                </div>
              </div>
            ` : `
              <div class="empty-state">
                <p>No curator license found. Apply for curator status to unlock this feature.</p>
                <button onclick="window.applyForCurator()" class="btn btn-primary" style="margin-top:12px;">Apply Now</button>
              </div>
            `}
          </div>
        </div>

        <div class="card" style="margin-top:40px;">
          <h3>Alpha Overview</h3>
          <p>This topology model evaluates breadth (Neoscore) and depth (Specscore) using your current module participation and note records. These metrics will scale into professional capability labels during the next phase.</p>
        </div>
      </div>
    `;
  }

  // Account Settings Page
  const accountRoot = document.getElementById('account-settings-root');
  if (accountRoot && accountRoot.innerHTML.trim() === '') {
    const storedLang = localStorage.getItem(LANG_STORAGE) || 'en';
    const currentRole = getCurrentRole();
    const storedModuleCount = modules.length;
    const storedGuildCount = guilds.length;
    const storedBatchCount = getAllBatches().length;
    const profile = getStoredProfile(currentUser?.id || 'guest') || {};
    
    accountRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Account</p>
          <h1>Settings</h1>
          <p class="lede">Manage your account preferences and application settings.</p>
        </div>

        <div class="card" style="margin-bottom:20px;">
          <h3 style="margin-top:0; margin-bottom:16px;">Identity Summary</h3>
          <div class="mini-stat-grid">
            <div class="mini-stat"><strong>${escapeHtml(currentRole)}</strong><span>Current Role</span></div>
            <div class="mini-stat"><strong>${storedModuleCount}</strong><span>Modules</span></div>
            <div class="mini-stat"><strong>${storedBatchCount}</strong><span>Batches</span></div>
            <div class="mini-stat"><strong>${storedGuildCount}</strong><span>Guilds</span></div>
          </div>
        </div>

        <div class="card" style="margin-bottom:20px;">
          <h3 style="margin-top:0; margin-bottom:16px;">Profile Depth</h3>
          <div style="display:grid; gap:14px;">
            <label>Display Name
              <input id="settings-display-name" class="neo-input" value="${escapeHtml(profile.name || '')}" placeholder="How you appear across the atlas">
            </label>
            <label>Public Bio
              <textarea id="settings-bio" class="neo-input" rows="4" placeholder="How arbiters, curators, and peers should understand your work.">${escapeHtml(profile.bio || '')}</textarea>
            </label>
            <label>Primary Domain
              <select id="settings-domain" class="neo-input">
                <option value="">Select domain...</option>
                ${Object.keys(DOMAIN_NAMES).map((key) => `<option value="${DOMAIN_NAMES[key]}"${profile.domain === DOMAIN_NAMES[key] ? ' selected' : ''}>${DOMAIN_NAMES[key]}</option>`).join('')}
              </select>
            </label>
            <label>Keywords and Competencies
              <input id="settings-skills" class="neo-input" value="${escapeHtml(profile.skills || '')}" placeholder="Research, moderation, fieldwork, historiography">
            </label>
            <button id="save-settings-profile-btn" class="btn btn-primary" style="max-width:260px;">Save Profile Settings</button>
          </div>
        </div>
        
        <div class="card" style="margin-bottom:20px;">
          <h3 style="margin-top:0; margin-bottom:16px;">Language</h3>
          <p style="color:var(--text-secondary); margin-bottom:12px; font-size:0.9rem;">Select your preferred interface language.</p>
          <select id="settings-language" class="neo-input" style="max-width:300px;">
            <option value="en"${storedLang === 'en' ? ' selected' : ''}>English</option>
            <option value="hi"${storedLang === 'hi' ? ' selected' : ''}>हिन्दी (Hindi)</option>
          </select>
        </div>
        
        <div class="card" style="margin-bottom:20px;">
          <h3 style="margin-top:0; margin-bottom:16px;">Data Management</h3>
          <p style="color:var(--text-secondary); margin-bottom:16px; font-size:0.9rem;">Clear locally stored data. This will not affect your account.</p>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button id="clear-profile-btn" class="btn btn-secondary" style="font-size:0.8rem;">Clear Profile Data</button>
            <button id="clear-all-btn" class="btn btn-secondary" style="font-size:0.8rem;">Clear All Local Data</button>
          </div>
          <p id="clear-msg" style="color:var(--success); font-size:0.8rem; margin-top:12px; display:none;">Data cleared successfully. Reloading...</p>
        </div>
        
        <div class="card" style="margin-bottom:20px;">
          <h3 style="margin-top:0; margin-bottom:16px;">Session</h3>
          <p style="color:var(--text-secondary); margin-bottom:16px; font-size:0.9rem;">Sign out of your account.</p>
          <button id="settings-logout-btn" class="btn btn-primary" style="background:var(--error);">Log Out</button>
        </div>
        
        <div class="card" style="margin-bottom:20px; background:var(--bg-card); border:1px solid var(--border);">
          <h3 style="margin-top:0; margin-bottom:8px; font-size:1rem; color:var(--text-muted);">About</h3>
          <p style="color:var(--text-faint); font-size:0.8rem; margin:0;">Neofolk Atlas v1.0</p>
          <p style="color:var(--text-faint); font-size:0.75rem; margin-top:4px;">A project of the Neo-Hindu Black Emigration</p>
        </div>
      </div>
    `;
    
    // Language selector handler
    const langSelect = document.getElementById('settings-language');
    if (langSelect) {
      langSelect.addEventListener('change', async (e) => {
        const lang = e.target.value;
        localStorage.setItem(LANG_STORAGE, lang);
        await loadDictionary(lang);
        applyDocumentLanguage(lang);
        applyDataI18n();
        // Show feedback
        const originalText = langSelect.nextElementSibling?.textContent;
        if (langSelect.nextElementSibling) {
          langSelect.nextElementSibling.textContent = 'Language updated!';
          setTimeout(() => {
            if (originalText) langSelect.nextElementSibling.textContent = originalText;
          }, 1500);
        }
      });
    }
    
    // Clear profile data
    const clearProfileBtn = document.getElementById('clear-profile-btn');
    if (clearProfileBtn) {
      clearProfileBtn.addEventListener('click', () => {
        const userId = currentUser?.id || 'guest';
        localStorage.removeItem(`neofolk.profile.${userId}`);
        document.getElementById('clear-msg').style.display = 'block';
        setTimeout(() => location.reload(), 1500);
      });
    }
    
    // Clear all data
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        if (confirm('This will clear all your local data including profile, domains, and settings. Continue?')) {
          localStorage.clear();
          document.getElementById('clear-msg').style.display = 'block';
          setTimeout(() => location.reload(), 1500);
        }
      });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('settings-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.auth.signOut();
        }
        currentUser = null;
        window.location.href = 'index.html';
      });
    }

    const saveSettingsProfileBtn = document.getElementById('save-settings-profile-btn');
    if (saveSettingsProfileBtn) {
      saveSettingsProfileBtn.addEventListener('click', () => {
        const userId = currentUser?.id || 'guest';
        const nextProfile = {
          ...profile,
          name: document.getElementById('settings-display-name')?.value.trim() || '',
          bio: document.getElementById('settings-bio')?.value.trim() || '',
          domain: document.getElementById('settings-domain')?.value || '',
          skills: document.getElementById('settings-skills')?.value.trim() || ''
        };
        localStorage.setItem(`neofolk.profile.${userId}`, JSON.stringify(nextProfile));
        saveSettingsProfileBtn.textContent = 'Saved';
        setTimeout(() => { saveSettingsProfileBtn.textContent = 'Save Profile Settings'; }, 1200);
      });
    }
  }

  // Hide old role switcher if present
  const roleSelect = document.getElementById('role-context-switcher');
  if (roleSelect) {
    roleSelect.style.display = 'none';
  }
  // NODES PAGE
  const nodesRoot = document.getElementById("nodes-root");
  if (nodesRoot && nodesRoot.innerHTML.trim() === "") {
    nodesRoot.innerHTML = `
      <div class="dashboard-shell">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px;">
            <div>
              <p class="section-label">Nodes</p>
              <h1>Learning Nodes</h1>
              <p class="lede">Physical locations where learning happens.</p>
            </div>
            <button onclick="window.toggleDemandMode()" class="btn btn-secondary" style="font-size:11px; padding:8px 16px;">
              [ SIGNAL LOCAL NEED ]
            </button>
          </div>
        </div>
        <div style="position:relative;">
          <div class="map-search-overlay">
            <input type="text" placeholder="Locality Search (e.g. Bangalore, Delhi)..." onkeydown="if(event.key==='Enter') window.handleMapSearch(this.value)">
          </div>
          <div id="map" style="height:500px; width:100%; border-radius:4px; border:1px solid var(--border-color); background:var(--ink);"></div>
        </div>
      </div>
    `;
    setTimeout(() => {
      if (!window.L) {
        console.error("Leaflet not loaded");
        return;
      }
      const map = L.map("map").setView(
        [20.5937, 78.9629],
        5
      );
      window.mapInstance = map;
      
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors"
        }
      ).addTo(map);

      // Handle Map Clicks for Signal Drops
      map.on('click', (e) => {
        if (!demandModeActive) return;
        showRadialMenu(e.latlng.lat, e.latlng.lng);
      });

      // Initial render for node needs
      renderNodeNeedsOnMap();
    }, 50);
  }
}


async function initApp() {
  // Inject Chart.js if missing
  if (!window.Chart) {
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    chartScript.async = true;
    const chartLoadPromise = new Promise(resolve => {
      chartScript.onload = resolve;
    });
    document.head.appendChild(chartScript);
    await chartLoadPromise;
  }

  // Check session before rendering nav so logout/dashboard are correct
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      currentUser = data?.user || null;
    } catch (_) {
      currentUser = null;
    }
  }

  const stored = localStorage.getItem(LANG_STORAGE);
  const lang = SUPPORTED_LANGS.includes(stored) ? stored : 'en';
  await loadDictionary(lang);
  applyDocumentLanguage(lang);
  applyDataI18n();

  // Load all data systems
  loadGlobalNodeNeeds();
  loadCuratorCards();
  loadModules();
  loadGuilds();
  if (currentUser) {
    persistRoleHint(resolveUserRole(currentUser, getRoleFromPage() || 'seeker'), currentUser);
  }

  // Wire up hash routing
  window.addEventListener('hashchange', () => {
    renderPageContent();
    scrollTo(0,0);
  });

  // Apply debounce to searches
  const dictSearch = document.getElementById('dict-search');
  if (dictSearch) {
    dictSearch.addEventListener('input', debounce(() => {
      renderPageContent(); // Re-renders with current search value
    }, 500));
  }

  renderAppNav();
  wireMobileNav();
  renderSidebarLangPicker();
  syncLanguageSelects(lang);
  wireAuthForms();
  wireLanguageSelectors();
  renderPageContent();
  updateHomeForSession();
}

// Force topology navigation - Global function wrapper already defined at the top of the file

window.manageSpecializations = function() {
    const el = document.getElementById('spec-modal');
    if (el) el.classList.remove('hidden');
};

// Curator Dashboard Functions
window.showModuleCreator = function() {
    const target = document.getElementById('curator-add-module');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.location.assign('curator-dashboard.html?panel=curator-add-module');
    }
};

window.quickCreateModule = function() {
    const title = document.getElementById('quick-mod-title')?.value;
    const domain = document.getElementById('quick-mod-domain')?.value;
    const description = document.getElementById('quick-mod-desc')?.value;
    const weeks = document.getElementById('quick-mod-weeks')?.value;
    const capacity = document.getElementById('quick-mod-capacity')?.value;
    const locationName = document.getElementById('quick-mod-loc')?.value;
    
    if (!title || !domain || !description) {
        alert('Please fill in required fields (Title, Domain, Description)');
        return;
    }
    
    const myCard = getMyCuratorCard();
    if (!myCard) {
        alert('You need a curator license to create modules');
        return;
    }
    
    const module = createModule(title, description, domain, myCard.id);
    if (module) {
        // Add additional quick fields
        module.durationWeeks = parseInt(weeks || '4');
        module.maxCapacity = parseInt(capacity || '20');
        module.locationName = locationName || 'Remote';
        module.syllabus = [{ title: 'Overview', details: 'Initial module introduction.' }];
        
        saveModules();

        // Clear form
        if (document.getElementById('quick-mod-title')) document.getElementById('quick-mod-title').value = '';
        if (document.getElementById('quick-mod-desc')) document.getElementById('quick-mod-desc').value = '';
        if (document.getElementById('quick-mod-loc')) document.getElementById('quick-mod-loc').value = '';
        
        // Refresh dashboard
        location.reload();
    } else {
        alert('Failed to create module');
    }
};

window.createBatchFromModule = function(moduleId) {
    const module = getModule(moduleId);
    if (!module) {
        alert('Module not found');
        return;
    }

    const batchName = window.prompt('Batch name', `${module.title} Cohort`);
    if (!batchName || !batchName.trim()) return;

    const studentNames = window.prompt('Add student names separated by commas (optional)', '') || '';
    const roster = studentNames
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name, index) => ({
            id: `student_${Date.now()}_${index}`,
            name
        }));

    const batch = createBatch(moduleId, batchName.trim(), roster.map((student) => student.id));
    if (!batch) {
        alert('Failed to create batch');
        return;
    }

    const batches = getAllBatches();
    const storedBatch = batches.find((entry) => entry.id === batch.id);
    if (storedBatch) {
        storedBatch.studentRoster = roster;
        localStorage.setItem('neofolk.batches', JSON.stringify(batches));
    }

    location.reload();
};

window.applyForCurator = function() {
    alert('Curator application feature coming soon. For now, use the developer console to create a curator card:\n\nwindow.createCuratorCard("Your Name", 25, ["Level 3 Lingosophy"])');
};

window.saveSpecializations = async function() {
    const checkboxes = document.querySelectorAll('input[name="spec-item"]:checked');
    const newSpecs = {};
    checkboxes.forEach(cb => {
        newSpecs[cb.value] = 85; // Base depth value for specialization
    });

    if (currentUser) {
        const supabase = getSupabaseClient();
        if (supabase) {
            // Update neo_scores breakdown
            const { data: current } = await supabase.from('neo_scores').select('breakdown').eq('user_id', currentUser.id).eq('role', 'seeker').single();
            const breakdown = current?.breakdown || {};
            breakdown.specializations = newSpecs;

            await supabase.from('neo_scores').upsert({
                user_id: currentUser.id,
                role: 'seeker',
                breakdown,
                score: 100, // Placeholder total score
                updated_at: new Date()
            });
        }
    } else {
        localStorage.setItem(`neofolk.spec.guest`, JSON.stringify(newSpecs));
    }

    // Refresh view
    document.getElementById('spec-modal').classList.add('hidden');
    window.forceNavigateToTopology();
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initApp().catch(console.error));
} else {
  initApp().catch(console.error);
}
