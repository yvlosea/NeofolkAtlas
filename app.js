const domains = [
  { name: "Lingosophy", color: "#8c4b2f", description: "Language, meaning, identity, and expressive interpretation.", pathways: ["Etymology Focus", "Comparative Literature", "Rhetoric"] },
  { name: "Arthmetics", color: "#c6a96b", description: "Mathematics, logic, structure, and quantitative thought.", pathways: ["Abstract Algebra", "Systems Modeling", "Statistical Logic"] },
  { name: "Cosmology", color: "#4a5d23", description: "Celestial inquiry, scale, physics, and the architecture of reality.", pathways: ["Stellar Evolution", "Quantum Mechanics", "Observational Astronomy"] },
  { name: "Biosphere", color: "#8a9a5b", description: "Life systems, ecology, health, and interdependence.", pathways: ["Mycology Networks", "Botany", "Conservation Biology"] },
  { name: "Chronicles", color: "#704214", description: "History, archives, memory, and narrative continuity.", pathways: ["Oral Histories", "Archival Methods", "Ancient Civilizations"] },
  { name: "Civitas", color: "#1b1410", description: "Society, ethics, institutions, and civic design.", pathways: ["Political Philosophy", "Urban Planning", "Ethics"] },
  { name: "Tokenomics", color: "#cd7f32", description: "Value systems, exchange, financial learning, and trust.", pathways: ["Distributed Ledgers", "Macroeconomics", "Game Theory"] },
  { name: "Artifex", color: "#dcae96", description: "Creative production, fabrication, design, and craft.", pathways: ["Industrial Design", "Studio Art", "Digital Fabrication"] },
  { name: "Praxis", color: "#b66a50", description: "Embodied discipline, practice, movement, and lived method.", pathways: ["Kinesiology", "Meditation Practices", "Martial Arts"] },
  { name: "Bioestipeme", color: "#8f9779", description: "Knowledge systems, life philosophy, and interdisciplinary reasoning.", pathways: ["Epistemology", "Cognitive Science", "Systems Theory"] }
];

const quotes = [
  "Education is the manifestation of perfection already within. — Swami Vivekananda",
  "Where the mind is without fear and the head is held high. — Rabindranath Tagore",
  "Cultivation of mind should be the ultimate aim of human existence. — B. R. Ambedkar",
  "Somewhere, something incredible is waiting to be known. — Carl Sagan",
  "Look deep into nature, then you will understand everything better. — Albert Einstein"
];

function initHome() {
  const quoteEl = document.getElementById("hero-quote");
  if (quoteEl) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = randomQuote;
    setTimeout(() => {
      quoteEl.style.opacity = "1";
    }, 100);
  }

  const wheelContainer = document.getElementById("domain-wheel");
  if (wheelContainer) {
    drawWheel(wheelContainer);
  }
}

function drawWheel(container) {
  const size = 400;
  const radius = size / 2;
  const cx = radius;
  const cy = radius;
  const strokeWidth = 2;
  
  let html = `<svg class="chart-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  const angleStep = (Math.PI * 2) / domains.length;
  let currentAngle = -Math.PI / 2; // Start from top

  domains.forEach(domain => {
    const nextAngle = currentAngle + angleStep;
    
    // arc coordinates
    const x1 = cx + radius * Math.cos(currentAngle);
    const y1 = cy + radius * Math.sin(currentAngle);
    const x2 = cx + radius * Math.cos(nextAngle);
    const y2 = cy + radius * Math.sin(nextAngle);
    
    // path string
    // M cx cy L x1 y1 A radius radius 0 0 1 x2 y2 Z
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    
    html += `<path class="chart-segment" d="${path}" fill="${domain.color}" stroke="rgba(232, 220, 200, 0.5)" stroke-width="${strokeWidth}">
      <title>${domain.name}</title>
    </path>`;
    
    currentAngle = nextAngle;
  });

  // center circle "cover"
  const innerRadius = radius * 0.45;
  html += `<circle cx="${cx}" cy="${cy}" r="${innerRadius}" fill="#1b1410" stroke="#e8dcc8" stroke-width="1" />`;
  html += `<text x="${cx}" y="${cy}" fill="#c6a96b" font-family="'Cormorant', serif" font-size="24" text-anchor="middle" dominant-baseline="middle" letter-spacing="0.05em">Domains</text>`;
  
  html += `</svg>`;
  
  // legend
  let legendHtml = `<div class="chart-legend">`;
  domains.forEach(domain => {
    legendHtml += `
      <div class="legend-item">
        <div class="legend-color" style="background-color: ${domain.color};"></div>
        <span>${domain.name}</span>
      </div>
    `;
  });
  legendHtml += `</div>`;

  container.innerHTML = `<h3>Core Academic Distribution</h3>` + html + legendHtml;
}

function initSubjects() {
  const grid = document.getElementById("subjects-grid");
  if (!grid) return;

  grid.innerHTML = domains.map(domain => `
    <article class="card">
      <h2>${domain.name}</h2>
      <p>${domain.description}</p>
      <span class="domain-tag" style="background-color: ${domain.color};">${domain.name}</span>
      <ul class="pathways-list">
        ${domain.pathways.map(pw => `<li>${pw}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "home") {
    initHome();
  } else if (page === "subjects") {
    initSubjects();
  }
});
