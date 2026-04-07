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

// ============================================================
// NODENEED SYSTEM - Dynamic Node Needs Data Structure
// ============================================================

// NodeNeed collection - stores all node needs
const nodeNeeds = [];

// Valid token types for NodeNeeds (from Indian Lineage Tokens)
const VALID_TOKEN_TYPES = [
  'Spivaks', 'Shakuntis', 'Bhattas', 'Janakis', 'Thapars', 
  'Savi', 'Bhanus', 'Sarabhs', 'Arunas', 'Gagas'
];

// Valid statuses for NodeNeeds
const VALID_STATUSES = ['pending', 'provisioning', 'fulfilled'];

// Current map view filter
let nodeNeedFilter = 'all'; // 'all', 'active', 'needs'
let demandModeActive = false;

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
    // Show indicator
    let indicator = document.querySelector('.demand-mode-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'demand-mode-indicator';
      indicator.textContent = 'DEMAND MODE ACTIVE: CLICK MAP TO SIGNAL NEED';
      document.body.appendChild(indicator);
    }
    indicator.style.display = 'block';
  } else {
    const indicator = document.querySelector('.demand-mode-indicator');
    if (indicator) indicator.style.display = 'none';
  }
};

/**
 * Create a new NodeNeed entry
 * @param {number} lat - Latitude coordinate
 * @param {number} lng - Longitude coordinate  
 * @param {string} tokenType - Token type from VALID_TOKEN_TYPES
 * @returns {object} The created NodeNeed object
 */
function createNodeNeed(lat, lng, tokenType) {
  if (!VALID_TOKEN_TYPES.includes(tokenType)) {
    console.error(`Invalid token type: ${tokenType}. Must be one of: ${VALID_TOKEN_TYPES.join(', ')}`);
    return null;
  }
  
  const need = {
    id: `need_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    coordinates: [lat, lng],
    tokenType: tokenType,
    urgencyCount: 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  nodeNeeds.push(need);
  saveNodeNeeds();
  return need;
}

/**
 * Drop a new need signal on the map
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} tokenType - Token type
 */
function dropNeedSignal(lat, lng, tokenType) {
  const need = createNodeNeed(lat, lng, tokenType);
  if (need) {
    renderNodeNeedMarker(need);
    console.log(`NodeNeed dropped: ${tokenType} at [${lat}, ${lng}]`);
  }
  return need;
}

/**
 * Support an existing NodeNeed - increments urgencyCount
 * @param {string} needId - ID of the NodeNeed to support
 */
function supportNodeNeed(needId) {
  const need = nodeNeeds.find(n => n.id === needId);
  if (!need) {
    console.error(`NodeNeed not found: ${needId}`);
    return null;
  }
  
  need.urgencyCount += 1;
  need.updatedAt = new Date().toISOString();
  saveNodeNeeds();
  
  // Update marker display
  updateNodeNeedMarker(need);
  console.log(`NodeNeed ${needId} supported. Urgency: ${need.urgencyCount}`);
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
  saveNodeNeeds();
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
 * Save NodeNeeds to localStorage
 */
function saveNodeNeeds() {
  localStorage.setItem('neofolk.nodeNeeds', JSON.stringify(nodeNeeds));
}

/**
 * Load NodeNeeds from localStorage
 */
function loadNodeNeeds() {
  const stored = localStorage.getItem('neofolk.nodeNeeds');
  if (stored) {
    const loaded = JSON.parse(stored);
    nodeNeeds.length = 0;
    nodeNeeds.push(...loaded);
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
  
  // Custom Icon with Pulsing Effect
  // Speed and Size scale with urgencyCount
  const pulseSpeed = Math.max(0.4, 1.2 - (need.urgencyCount * 0.1)) + "s";
  const scaleSize = Math.min(2.5, 1 + (need.urgencyCount * 0.15));
  
  const markerIcon = L.divIcon({
    className: 'node-need-marker',
    html: `
      <div class="node-pulse" style="--node-color: ${color}; --pulse-speed: ${pulseSpeed}; transform: scale(${scaleSize});">
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const marker = L.marker(need.coordinates, {
    icon: markerIcon,
    riseOnHover: true
  }).addTo(window.mapInstance);
  
  // Click handler to boost demand
  marker.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    supportNodeNeed(need.id);
  });
  
  // Tooltip with details
  marker.bindTooltip(`
    <div style="font-family:monospace; padding:4px;">
      <strong style="color:${color}">${need.tokenType}</strong><br>
      Urgency: ${need.urgencyCount}<br>
      <span style="font-size:9px; opacity:0.8;">Click to boost demand</span>
    </div>
  `);
  
  window.nodeNeedMarkers[need.id] = marker;
}

/**
 * Show a radial menu to select a token type at coordinates
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
      ${VALID_TOKEN_TYPES.map((type, i) => {
        const angle = (i / VALID_TOKEN_TYPES.length) * (2 * Math.PI) - (Math.PI / 2);
        const radius = 110;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const color = getTokenColor(type);
        return `
          <div class="radial-item" 
               style="transform: translate(${x}px, ${y}px); --token-color: ${color};"
               onclick="window.dropNeedSignal(${lat}, ${lng}, '${type}'); document.getElementById('radial-menu-overlay').remove();">
            <span>${type}</span>
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

// Expose functions globally for HTML onclick handlers
window.dropNeedSignal = dropNeedSignal;
window.supportNodeNeed = supportNodeNeed;
window.updateNodeNeedStatus = updateNodeNeedStatus;
window.setNodeNeedFilter = setNodeNeedFilter;

// Load NodeNeeds on startup
loadNodeNeeds();


// Live calculation engine for topology metrics
function getLiveTopology(userData) {
    const domains = userData.domains || { ...defaultNeoDomains };
    const specs = userData.specializations || { ...defaultNeoSpecialization };
    
    const domainValues = Object.values(domains);
    const neoscore = domainValues.length > 0 ? (domainValues.reduce((a, b) => a + b, 0) / 10) * 10 : 0;
    
    // Depth (Specscore) - based on highest specialization value
    // In live mode, depth might be a more complex formula, but for now we follow the user request logic
    const specscore = Object.values(specs).length > 0 ? Math.max(...Object.values(specs)) : 0;
    
    return { neoscore, specscore, domains, specs };
}

function calculateNeoscore(domains) {
  const values = Object.values(domains);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(avg * 10);
}

function calculateSpecscore(spec) {
  return Math.max(...Object.values(spec));
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
                    <div class="topology-chart-container" style="height:350px;"><canvas id="donutChart"></canvas></div>
                </div>
            </div>

            <!-- SPECIALIZATION SELECTION MODAL -->
            <div id="spec-modal" class="hidden" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10001; display:flex; align-items:center; justify-content:center; padding:20px;">
                <div style="background:#1a1614; border:1px solid #2a2420; padding:30px; width:450px; max-width:100%; position:relative;">
                    <h2 style="font-family:'Cormorant Garamond', serif; color:#fff; margin-bottom:20px;">Subjects of Specialization</h2>
                    <p style="color:#8b8276; font-size:11px; margin-bottom:20px;">Select up to 5 subjects you want to specialize in (increases depth score).</p>
                    <div id="spec-list" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:30px;">
                        ${domainKeys.map(k => `
                            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12px; color:#d4a373;">
                                <input type="checkbox" name="spec-item" value="${k}" ${specs[k] ? 'checked' : ''} style="accent-color:#d4a373;">
                                ${LINEAGE_TOKENS[k]}
                            </label>
                        `).join('')}
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button onclick="window.saveSpecializations()" style="flex:1; background:#d4a373; border:none; color:#000; padding:12px; cursor:pointer; font-weight:bold;">SAVE CHANGES</button>
                        <button onclick="document.getElementById('spec-modal').classList.add('hidden')" style="flex:1; background:none; border:1px solid #2a2420; color:#8b8276; padding:12px; cursor:pointer;">CLOSE</button>
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
                labels: Object.keys(domains).map(k => LINEAGE_TOKENS[k]),
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
        const names = Object.keys(domains).map(k => LINEAGE_TOKENS[k]);
        
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

function renderAppNav() {
  const nav = document.getElementById('app-nav');
  if (!nav) return;

  const here = currentPageFile();
  const dashHref = currentUser ? getDashboardPath(currentUser) : 'seeker-dashboard.html';
  const isDashboardPage = here.endsWith('-dashboard.html');

  const role =
    currentUser?.user_metadata?.role ||
    currentUser?.app_metadata?.role ||
    'seeker';

  const sections = [
    {
      title: 'CORE',
      links: [
        { href: dashHref, label: 'Dashboard', isDash: true },
        { href: 'subjects.html', label: 'Domains' },
        { href: 'pathways.html', label: 'Pathways' },
        { href: 'guild.html', label: 'Guilds' },
        { href: 'portfolio.html', label: 'Portfolio' },
        { href: 'nodes.html', label: 'Nodes' }
      ]
    },
    {
      title: 'KNOWLEDGE',
      links: [
        { href: 'guide.html', label: 'Guide' },
        { href: 'vision.html', label: 'Vision' }
      ]
    },
    {
      title: 'ACCOUNT',
      links: [
        { href: 'profile.html', label: 'Profile' },
        { href: 'account-settings.html', label: 'Settings' }
      ]
    }
  ];

  // curator tools
  if (role === 'curator') {
    sections.push({
      title: 'CURATION',
      links: [
        { href: 'teaching-log.html', label: 'Teaching Log' },
        { href: 'attendance.html', label: 'Attendance' }
      ]
    });
  }

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
  if (!chip) {
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
        window.location.assign(getDashboardPath(data.user));
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

      if (data.session && data.user) {
        window.location.assign(getDashboardPath(data.user));
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
  const page = currentPageFile();

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
    const roleName = page.replace('-dashboard.html', '');
    const roleLabel = roleName.charAt(0).toUpperCase() + roleName.slice(1);

    dashRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('dashboard.kicker')) + '</p>' +
          '<h1>' + escapeHtml(t('dashboard.title')) + '</h1>' +
          '<p id="dash-signed-in" class="dashboard-meta"></p>' +
          '<p class="lede">' + escapeHtml(t('dashboard.subtitle')) + '</p>' +
        '</div></div>' +
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
        '<div class="card">' +
          '<p class="section-label">' + escapeHtml(t('dashboard.nextStepKicker')) + '</p>' +
          '<h2>' + escapeHtml(t('dashboard.pickCourseTitle')) + '</h2>' +
          '<p>' + escapeHtml(t('dashboard.pickCourseBody')) + '</p>' +
          '<div class="inline-actions flow-top-32">' +
            '<a class="btn btn-primary" href="subjects.html">' + escapeHtml(t('dashboard.browseTopics')) + '</a>' +
            '<a class="btn" href="discovery.html">' + escapeHtml(t('nav.explore')) + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Show signed-in email if we have a session
    if (supabase) {
      supabase.auth.getUser().then(async ({ data }) => {
        const el = document.getElementById('dash-signed-in');
        if (!data?.user) return;
        
        if (el) el.textContent = t('dashboard.signedIn').replace('{email}', data.user.email);

        // 1. Fetch Completed Modules (50 pts each)
        const { count: modCount } = await supabase.from('enrolled_modules').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id).eq('status', 'completed');
        
        // 2. Fetch Notes Written (10 pts each)
        const { count: noteCount } = await supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id);
        
        // 3. Calculate Score
        const neoScore = (modCount || 0) * 50 + (noteCount || 0) * 10;

        // Update UI
        if (document.getElementById('stat-modules')) document.getElementById('stat-modules').textContent = modCount || 0;
        if (document.getElementById('stat-notes')) document.getElementById('stat-notes').textContent = noteCount || 0;
        if (document.getElementById('stat-score')) document.getElementById('stat-score').textContent = neoScore;

        // Persist to neo_scores table for ranking/history
        await supabase.from('neo_scores').upsert({ 
          user_id: data.user.id, 
          score: neoScore,
          updated_at: new Date().toISOString()
        });

        // Render charts
        renderDashboardCharts(modCount || 0, noteCount || 0, 2, neoScore);
      });
    }
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
    const guilds = ['Lingosophy','Arthmetics','Cosmology','Biosphere','Chronicles','Civitas','Tokenomics','Artifex','Praxis','Bioepisteme'];
    const guildCards = guilds.map((name) =>
      '<a href="domain.html" class="record-card" style="text-decoration:none;">' +
        '<h3>' + escapeHtml(name) + '</h3>' +
        '<p style="color:var(--text-secondary);font-size:0.9rem;">' + escapeHtml(t('home.termCoursesBody')) + '</p>' +
      '</a>'
    ).join('');

    subjectsRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('nav.learn')) + '</p>' +
          '<h1>' + escapeHtml(t('home.stepsTitle')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('home.step1Body')) + '</p>' +
        '</div></div>' +
        '<div class="record-list" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));">' + guildCards + '</div>' +
      '</div>';
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
    const showCreate = currentUser?.user_metadata?.role === "curator";
    domainRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Domain</p>
          <h1>Modules</h1>
          ${showCreate ? `
            <button id="create-module" class="btn btn-primary">
              + Module
            </button>
          ` : ""}
        </div>
        <div class="empty-state">
          <p>No modules yet.</p>
        </div>
      </div>
    `;
    document.getElementById('create-module')?.addEventListener('click', () => {
      location.href = "module-editor.html";
    });
  }

  // Guild page
  const guildRoot = document.getElementById('guild-root');
  if (guildRoot && guildRoot.innerHTML.trim() === '') {
    guildRoot.innerHTML =
      '<div class="dashboard-shell">' +
        '<div class="dashboard-header"><div>' +
          '<p class="section-label">' + escapeHtml(t('nav.groups')) + '</p>' +
          '<h1>' + escapeHtml(t('home.termGroups')) + '</h1>' +
          '<p class="lede">' + escapeHtml(t('home.termGroupsBody')) + '</p>' +
        '</div></div>' +
        '<div class="empty-state">' +
          '<p>' + escapeHtml(t('dashboard.groupsAdvancedEmpty')) + '</p>' +
        '</div>' +
      '</div>';
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
  const profileRoot = document.getElementById('profile-root');
  if (profileRoot && profileRoot.innerHTML.trim() === '') {
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
      <div class="card profile-display" style="margin-bottom:24px;">
        <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
          ${savedProfile.photo ? `<img src="${escapeHtml(savedProfile.photo)}" style="width:100px;height:100px;object-fit:cover;border-radius:50%;border:2px solid var(--gold);">` : '<div style="width:100px;height:100px;border-radius:50%;background:var(--bg-card);display:flex;align-items:center;justify-content:center;color:var(--text-muted);">No Photo</div>'}
          <div style="flex:1; min-width:200px;">
            <h2 style="margin:0 0 8px 0; color:var(--gold); font-family:var(--serif); font-size:1.8rem;">${escapeHtml(savedProfile.name || 'Unnamed')}</h2>
            ${savedProfile.domain ? `<span style="display:inline-block; background:var(--gold-soft); color:var(--gold); padding:4px 12px; border-radius:20px; font-size:0.75rem; margin-bottom:12px;">${escapeHtml(savedProfile.domain)}</span>` : ''}
            ${savedProfile.bio ? `<p style="margin:0 0 12px 0; color:var(--text-secondary); line-height:1.6;">${escapeHtml(savedProfile.bio)}</p>` : ''}
            ${savedProfile.skills ? `<div style="margin-top:12px;"><span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Skills:</span> <span style="color:var(--text-primary);">${escapeHtml(savedProfile.skills)}</span></div>` : ''}
          </div>
        </div>
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.8rem; color:var(--text-muted);">Profile completeness: <strong style="color:var(--gold);">${completeness}%</strong></span>
          <button id="edit-profile-btn" class="btn btn-secondary" style="font-size:0.8rem;">Edit Profile</button>
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

  // Guide page
  const guideRoot = document.getElementById('guide-root');
  if (guideRoot && guideRoot.innerHTML.trim() === '') {
    guideRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Guide</p>
          <h1>NHBE Learning Guide</h1>
          <p class="lede">
          The Guide explains how Domains, Pathways, Guilds, Portfolio, and Nodes work together.
          </p>
        </div>
        <div class="card">
          <h3>Domains</h3>
          <p>Fundamental perspectives of knowledge such as Lingosophy, Arthmetics, Cosmology, Biosphere.</p>
          <h3>Pathways</h3>
          <p>Short learning experiences connecting real-world skills to Domains.</p>
          <h3>Guilds</h3>
          <p>Collaborative research groups formed by learners.</p>
          <h3>Portfolio</h3>
          <p>Documented record of learning evidence.</p>
          <h3>Nodes</h3>
          <p>Physical locations where learning occurs.</p>
        </div>
      </div>
    `;
  }

  // Portfolio page
  const portfolioRoot = document.getElementById('portfolio-root');
  if (portfolioRoot && portfolioRoot.innerHTML.trim() === '') {
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

  // Teaching Log page
  const teachingRoot = document.getElementById('teaching-log-root');
  if (teachingRoot && teachingRoot.innerHTML.trim() === '') {
    teachingRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Curation</p>
          <h1>Teaching Log</h1>
        </div>
        <div class="empty-state">
          <p>Teaching records will appear here.</p>
        </div>
      </div>
    `;
  }

  // Attendance page
  const attendanceRoot = document.getElementById('attendance-root');
  if (attendanceRoot && attendanceRoot.innerHTML.trim() === '') {
    attendanceRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Curation</p>
          <h1>Attendance</h1>
        </div>
        <div class="empty-state">
          <p>Attendance tracking will appear here.</p>
        </div>
      </div>
    `;
  }

  // Module Editor page
  const editorRoot = document.getElementById('module-editor-root');
  if (editorRoot && editorRoot.innerHTML.trim() === '') {
    editorRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Curation</p>
          <h1>Create Module</h1>
        </div>
        <div class="card">
          <input
            class="neo-input"
            placeholder="Module title"
          >
          <textarea
            placeholder="Description"
          ></textarea>
          <button class="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    `;
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
           <span style="font-size:9px !important; color:#8b7355 !important;">${t.domain}</span>
        </div>
        <h4 style="margin:0 0 8px 0 !important; color:#3d2914 !important; font-family:'Cormorant Garamond', serif !important; font-size:1.2rem !important;">${t.fullName}</h4>
        <p style="font-size:11px !important; color:#5c4033 !important; line-height:1.5 !important; margin:0 0 12px 0 !important; font-family:serif !important;">${t.description}</p>
        <div style="font-size:9px !important; color:#8b7355 !important; border-top:1px dashed #d4c4a8 !important; padding-top:8px !important; font-style:italic !important;">${t.resonancePillar}</div>
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
    const storedRole = localStorage.getItem('neofolk.activeRole') || 'seeker';
    
    accountRoot.innerHTML = `
      <div class="dashboard-shell">
        <div class="dashboard-header">
          <p class="section-label">Account</p>
          <h1>Settings</h1>
          <p class="lede">Manage your account preferences and application settings.</p>
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
          <h3 style="margin-top:0; margin-bottom:16px;">Role Context</h3>
          <p style="color:var(--text-secondary); margin-bottom:12px; font-size:0.9rem;">Switch between learner and curator modes.</p>
          <select id="settings-role" class="neo-input" style="max-width:300px;">
            <option value="seeker"${storedRole === 'seeker' ? ' selected' : ''}>Seeker (Learner)</option>
            <option value="curator"${storedRole === 'curator' ? ' selected' : ''}>Curator (Teacher)</option>
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
    
    // Role switcher handler
    const roleSelect = document.getElementById('settings-role');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        localStorage.setItem('neofolk.activeRole', e.target.value);
        location.reload();
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
  }

  
  // Role Switcher Logic (Usually in Settings or Header)
  const roleSelect = document.getElementById('role-context-switcher');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      localStorage.setItem('neofolk.activeRole', e.target.value);
      location.reload();
    });
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
        <div id="map" style="height:500px; width:100%; border-radius:4px; border:1px solid var(--border-color); background:var(--ink);"></div>
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
