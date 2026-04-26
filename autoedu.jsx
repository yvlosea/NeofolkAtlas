import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// STATIC DATA — no AI at runtime, ever
// This is what lives in your database/CMS
// Contributors submit → you approve → it appears here
// ─────────────────────────────────────────────

const DOMAINS = [
  { id: "lingosophy",  label: "Lingosophy",  token: "Spivaks",   color: "#5b21b6", bg: "#ede9fe", sub: "Linguistics & Philosophy" },
  { id: "arithmetics", label: "Arithmetics", token: "Shakuntis", color: "#92400e", bg: "#fef3c7", sub: "Mathematics" },
  { id: "cosmology",   label: "Cosmology",   token: "Bhattas",   color: "#075985", bg: "#e0f2fe", sub: "Astronomy & Physics" },
  { id: "biosphere",   label: "Biosphere",   token: "Janakis",   color: "#166534", bg: "#dcfce7", sub: "Biology & Botany" },
  { id: "civitas_chronicles", label: "Civics & Chronicles", token: "Savi-Thapars", color: "#7c2d12", bg: "#fff7ed", sub: "History & Political Theory" },
  { id: "tokenomics",  label: "Tokenomics",  token: "Bhanus",    color: "#1e3a5f", bg: "#dbeafe", sub: "Economics & Commons" },
  { id: "artifex",     label: "Artifex",     token: "Sarabhs",   color: "#134e4a", bg: "#f0fdf4", sub: "Design & Craft" },
  { id: "praxis",      label: "Praxis",      token: "Arunas",    color: "#4c1d95", bg: "#f5f3ff", sub: "Action & Reform" },
  { id: "bioepisteme", label: "Bioepisteme", token: "Gagas",     color: "#155e75", bg: "#ecfeff", sub: "Life Sciences" },
  { id: "cyberonics",  label: "Cyberonics",  token: "Nyayas",    color: "#0f766e", bg: "#ccfbf1", sub: "Systems & Cybernetics" },
  { id: "jurisprudence", label: "Jurisprudence", token: "Vidhans", color: "#b45309", bg: "#fef3c7", sub: "Law & Ethics" },
  { id: "technologia", label: "Technologia", token: "Vishwas",   color: "#4338ca", bg: "#e0e7ff", sub: "Applied Technology" },
  { id: "medicina",    label: "Medicina",    token: "Charakas",  color: "#be123c", bg: "#ffe4e6", sub: "Medicine & Healing" },
];

const COURSES = [
  {
    id: "c1",
    domain: "civitas",
    title: "Savitribai Phule & the First School",
    subtitle: "How one woman's defiance in 1848 rewrote what a republic could mean.",
    contributor: "Meera Nair",
    level: "Foundational",
    readTime: "12 min",
    rabbitHoles: ["c2", "c4"],
    sections: [
      {
        heading: "The walk to school",
        body: "On January 3, 1848, Savitribai Phule walked to the first school for girls in Pune — founded by her husband Jyotirao and herself — while passersby pelted her with dung and stones. She carried a spare sari in her bag and changed when she arrived. This act was not symbolic; it was infrastructural. She was building a delivery mechanism for something her society had declared contraband: the education of Dalit and lower-caste women. The school at Bhide Wada was not an institution in the modern sense. It had no government sanction, no endowment, and no guarantee of survival. What it had was Savitribai — a woman who had taught herself to read using Jyotirao's lessons, then turned around and taught others. Within a year, they had expanded to five schools. The missionary Thomas Candy, who observed the effort, wrote to his superiors that what the Phules were doing was more radical than any reform movement he had witnessed.",
        keyIdea: "Education was not a gift Savitribai offered — it was a weapon she distributed.",
        connections: ["Jyotirao Phule's Satyashodhak Samaj", "Fatima Sheikh — the first Muslim woman teacher in India", "The colonial education policy that excluded women"],
      },
      {
        heading: "The poems she wrote while teaching",
        body: "Savitribai was also a poet. Her collection Kavya Phule (1854) and Bavan Kashi Subodh Ratnakar (1892) are among the earliest published works by a Marathi woman. Her poems are not decorative — they are pedagogical instruments. She wrote in simple Marathi so that her students could read them. She wrote about the necessity of education with the same directness she brought to running schools: 'Get up, get educated, and emancipate yourself.' This phrase, often attributed to Ambedkar, is older. It runs through Savitribai's letters and poems decades before Ambedkar codified it. The literary establishment of her time largely ignored her. She was neither Brahmin nor male. Her work circulated in communities, not in journals. It is only in recent decades — primarily through Dalit feminist scholarship — that her literary output has been recovered as a body of work rather than a footnote.",
        keyIdea: "Her poems were curriculum before curriculum had a name.",
        connections: ["Dalit feminist literary tradition", "Tarabai Shinde's Stri Purush Tulana (1882)", "Oral traditions of resistance in Maharashtra"],
      },
      {
        heading: "Plague, care, and her death",
        body: "In 1897, the bubonic plague reached Pune. Savitribai, now in her sixties, opened a care home for plague victims in a mango grove outside the city — a deliberate choice, since the victims were predominantly lower-caste and untouchable people being turned away from formal hospitals. She personally carried a plague-stricken child to the care home. She contracted the plague herself and died on March 10, 1897. Her death was as direct a consequence of her life's work as her walk to school had been. She died in contact with the people she had spent fifty years trying to bring into the republic. The Maharashtra government declared her birthday a holiday. Her face appeared on a stamp. These honors arrived more than a century late and remain inadequate to what she actually built.",
        keyIdea: "She died the way she lived — in proximity to those the state had abandoned.",
        connections: ["1897 Pune plague & colonial relief failures", "Pandita Ramabai's parallel work in Maharashtra", "History of epidemic response and caste discrimination"],
      },
    ],
    questions: [
      { id: "q1", type: "mcq", q: "What was the name of Savitribai Phule's first poetry collection?", options: ["A) Bavan Kashi", "B) Kavya Phule", "C) Stri Shakti", "D) Phule Gatha"], correct: "B", explanation: "Kavya Phule (1854) was her first published collection." },
      { id: "q2", type: "mcq", q: "Why did Savitribai carry a spare sari to school?", options: ["A) School uniform requirement", "B) She taught sewing alongside literacy", "C) Villagers threw dung at her on the way", "D) It was a Phule family tradition"], correct: "C", explanation: "She faced physical harassment daily and changed clothes upon arrival." },
      { id: "q3", type: "mcq", q: "Where did Savitribai open her plague care home?", options: ["A) Inside Pune city centre", "B) A government hospital wing", "C) A mango grove outside Pune", "D) The Bhide Wada school building"], correct: "C", explanation: "She chose a location outside the city to serve those turned away from official care." },
      { id: "q4", type: "mcq", q: "Which phrase is documented in Savitribai's work before being associated with Ambedkar?", options: ["A) Justice for all castes", "B) Get up, get educated, and emancipate yourself", "C) The land belongs to those who till it", "D) No religion is above humanity"], correct: "B", explanation: "This phrase appears in her poems and letters decades before Ambedkar's speeches." },
      { id: "q5", type: "mcq", q: "Fatima Sheikh is significant in this context because she was:", options: ["A) The first woman to vote in Maharashtra", "B) A co-founder of the Satyashodhak Samaj", "C) The first Muslim woman teacher in India, working alongside Savitribai", "D) The author of Stri Purush Tulana"], correct: "C", explanation: "Fatima Sheikh taught at Savitribai's school, making her a foundational figure in Indian education history." },
      { id: "q6", type: "essay", q: "Savitribai Phule operated without state sanction, institutional support, or social approval. In 200–300 words, argue why her model of education was more radical than the colonial education system being built simultaneously — and what it would mean to apply her model today." },
    ],
  },
  {
    id: "c2",
    domain: "chronicles",
    title: "The Chipko Movement: Bodies as Blockades",
    subtitle: "When Himalayan women wrapped their arms around trees and stopped a state.",
    contributor: "Arjun Vaidyanathan",
    level: "Intermediate",
    readTime: "10 min",
    rabbitHoles: ["c3", "c1"],
    sections: [
      {
        heading: "Reni, 1974",
        body: "In March 1974, contractors arrived in the Reni forest in Uttarakhand to fell trees for a sporting goods company. The men of the village had been lured away by officials under the pretence of receiving land compensation payments in Chamoli town. What the officials did not account for was Gaura Devi. The 50-year-old head of the Mahila Mangal Dal — a women's collective — saw the contractors arrive and gathered twenty-seven women. They went to the forest and physically embraced the trees. The contractors threatened them. The women held. They stayed through the night. The contractors eventually left. This act — chipko, meaning 'to cling' — gave the movement its name. But the movement had roots going back to 1730, when Amrita Devi of the Bishnoi community in Rajasthan died defending a Khejri tree with the same logic: the forest is not a resource, it is a relationship.",
        keyIdea: "Gaura Devi's night in the forest was not a protest — it was a property claim made with the body.",
        connections: ["Sundarlal Bahuguna's hunger strikes", "The 1980 Forest Conservation Act", "Bishnoi environmental tradition"],
      },
      {
        heading: "Why it was women, specifically",
        body: "The Chipko movement's leadership was overwhelmingly female, and this was not accidental. In the hill economy of Uttarakhand, women were the primary collectors of fodder, fuel, and water from the forest. Deforestation did not abstract cost for them — it added hours to their daily labour and removed the microecology their families depended on. Men, by contrast, were more integrated into the cash economy and more likely to see timber contracts as income. The movement therefore split along gender lines that also mapped onto ecological dependence. Vandana Shiva, who studied the movement extensively, argued in Staying Alive (1988) that women's relationship to nature in subsistence economies is not sentimental but structural — they are the primary ecological managers, and their knowledge is systematically devalued by both the state and male-dominated environmental organisations. This argument remains contested but foundational in ecofeminist thought.",
        keyIdea: "The women who hugged trees were the people who had always managed them — the hug was a continuation of work, not a departure from it.",
        connections: ["Vandana Shiva's ecofeminism", "Subsistence vs. market economies", "Gender and land rights in India"],
      },
    ],
    questions: [
      { id: "q1", type: "mcq", q: "What does 'chipko' mean?", options: ["A) To resist", "B) To cling", "C) To march", "D) To plant"], correct: "B", explanation: "'Chipko' means to cling or embrace — referring to the act of hugging trees." },
      { id: "q2", type: "mcq", q: "Who led the women of Reni village in the 1974 confrontation?", options: ["A) Vandana Shiva", "B) Sundarlal Bahuguna", "C) Gaura Devi", "D) Amrita Devi"], correct: "C", explanation: "Gaura Devi, head of the Mahila Mangal Dal, organized and led the women that night." },
      { id: "q3", type: "mcq", q: "Vandana Shiva's Staying Alive argued that women's relationship to nature in subsistence economies is:", options: ["A) Sentimental and cultural", "B) Structural — rooted in ecological dependence and labour", "C) Primarily spiritual", "D) A result of colonial land policy"], correct: "B", explanation: "Shiva argued the relationship is structural, not sentimental — women are primary ecological managers." },
      { id: "q4", type: "essay", q: "The Chipko movement is sometimes described as an environmental movement and sometimes as a feminist one. In 200–300 words, make the case that this distinction is a false one — and explain what is lost when we separate the two framings." },
    ],
  },
  {
    id: "c3",
    domain: "tokenomics",
    title: "Bina Agarwal & the Economics of Land",
    subtitle: "Why the question of who owns the soil determines everything else.",
    contributor: "Priya Subramanian",
    level: "Intermediate",
    readTime: "9 min",
    rabbitHoles: ["c2"],
    sections: [
      {
        heading: "A Field of One's Own",
        body: "Bina Agarwal's 1994 book A Field of One's Own is one of the most consequential works in development economics. Its central argument is deceptively simple: women's lack of land rights is the single most structurally significant driver of gender inequality in South Asia — more significant than education gaps, wage gaps, or legal discrimination, because land is the asset from which all other bargaining power derives. Agarwal's method was empirical. She mapped land ownership patterns across Bangladesh, India, Nepal, and Sri Lanka, then traced the downstream effects: women without land had less leverage in marriage negotiations, less ability to leave abusive relationships, less access to credit, and less political voice at the village level. The book was a direct challenge to the dominant development framework of the 1980s, which focused on income and education as primary levers. Agarwal showed that without property, income and education produced limited structural change for women.",
        keyIdea: "Land is not one resource among many — it is the meta-resource that determines access to all others.",
        connections: ["Chipko movement & forest rights", "Hernando de Soto's property rights theory", "Self-Employed Women's Association (SEWA)"],
      },
    ],
    questions: [
      { id: "q1", type: "mcq", q: "What is the central argument of Bina Agarwal's A Field of One's Own?", options: ["A) Education is the primary lever for gender equality", "B) Women's lack of land rights is the most structurally significant driver of gender inequality", "C) Income gaps are more important than property gaps", "D) Legal discrimination is the root cause of inequality"], correct: "B", explanation: "Agarwal argued land ownership is the meta-resource from which all other bargaining power derives." },
      { id: "q2", type: "mcq", q: "Which countries did Agarwal's empirical research cover?", options: ["A) India and Pakistan only", "B) Bangladesh, India, Nepal, Sri Lanka", "C) All of South and Southeast Asia", "D) India, Sri Lanka, Myanmar, Thailand"], correct: "B", explanation: "She mapped land ownership patterns across four South Asian countries." },
      { id: "q3", type: "essay", q: "Agarwal argues that without property, income and education produce limited structural change for women. In 200–300 words, either defend or challenge this claim using examples from Indian economic or social history." },
    ],
  },
  {
    id: "c4",
    domain: "biosphere",
    title: "Janaki Ammal: The Botanist Who Refused to Be Minor",
    subtitle: "She hybridized sugarcane, saved Silent Valley, and is still barely in the textbooks.",
    contributor: "Meera Nair",
    level: "Foundational",
    readTime: "8 min",
    rabbitHoles: ["c2"],
    sections: [
      {
        heading: "The sugarcane work",
        body: "Janaki Ammal was born in 1897 in Thalassery, Kerala, into the Ezhava community — a caste that faced severe social discrimination. She won a scholarship to the University of Michigan and completed her doctorate in 1931, becoming one of the first Indian women to earn a PhD in botany from an American university. Her early research focused on cytogenetics — the study of chromosomes. At the John Innes Centre in London and later at the Sugarcane Breeding Institute in Coimbatore, she developed hybrid varieties of sugarcane that significantly increased the sucrose content in Indian cultivars. This was not abstract science. The British had maintained control over high-yield sugarcane varieties as a form of agricultural colonialism. Janaki's hybridization work was one thread in the longer project of Indian agricultural self-sufficiency. She later collaborated with C.D. Darlington on The Chromosome Atlas of Cultivated Plants (1945), a foundational reference work in plant genetics that documented the chromosome counts of thousands of species.",
        keyIdea: "Her science was always entangled with the question of who controls the food supply.",
        connections: ["Green Revolution & plant genetics", "Colonial botany and Kew Gardens", "History of the Sugarcane Breeding Institute"],
      },
      {
        heading: "Silent Valley",
        body: "In 1980, the Kerala government proposed a hydroelectric dam that would flood Silent Valley — one of the last undisturbed tropical rainforests in India, home to the lion-tailed macaque and thousands of endemic plant species. Janaki Ammal, then in her eighties, became one of the most prominent scientific voices opposing the dam. She wrote letters, testified, and lent her authority to the movement at a moment when scientific credibility was essential to the opposition's case. The dam was cancelled in 1983 after a national campaign. The Silent Valley National Park was established in 1984. Janaki died in 1984, the same year the park was created. Her role in the campaign is often omitted from mainstream accounts, which tend to credit male political figures. The botanist who studied flowers her whole life died having helped preserve a forest full of them.",
        keyIdea: "Conservation is not separate from science — it is science applied to survival.",
        connections: ["Silent Valley National Park", "M.S. Swaminathan and Indian ecology", "Chipko and the politics of Indian forests"],
      },
    ],
    questions: [
      { id: "q1", type: "mcq", q: "What was Janaki Ammal's primary area of scientific research?", options: ["A) Marine biology", "B) Cytogenetics and plant hybridization", "C) Atmospheric chemistry", "D) Animal behaviour"], correct: "B", explanation: "She specialized in cytogenetics — the study of chromosomes — and applied it to plant hybridization." },
      { id: "q2", type: "mcq", q: "The Chromosome Atlas of Cultivated Plants was co-authored with:", options: ["A) M.S. Swaminathan", "B) C.D. Darlington", "C) Norman Borlaug", "D) J.B.S. Haldane"], correct: "B", explanation: "She collaborated with C.D. Darlington on this foundational 1945 reference work." },
      { id: "q3", type: "mcq", q: "The Silent Valley dam was ultimately cancelled in:", options: ["A) 1975", "B) 1980", "C) 1983", "D) 1990"], correct: "C", explanation: "After sustained campaigning, the dam was cancelled in 1983 and the park established in 1984." },
      { id: "q4", type: "essay", q: "Janaki Ammal's work spans laboratory science, colonial agricultural politics, and conservation activism. In 200–300 words, argue that these were not separate phases of her career but expressions of a single coherent intellectual project." },
    ],
  },
];

// ─────────────────────────────────────────────
// VIEWS
// ─────────────────────────────────────────────
const V = { HOME: "home", LIBRARY: "library", COURSE: "course", RABBITHOLE: "rabbithole", ASSESS: "assess", RESULT: "result", CONTRIBUTE: "contribute" };

function getDomain(id) { return DOMAINS.find(d => d.id === id); }

// ── Token Chip ──────────────────────────────
function Chip({ domain, earned, small }) {
  const d = getDomain(domain);
  if (!d) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: earned ? d.color : d.bg,
      color: earned ? "#fff" : d.color,
      border: `1px solid ${d.color}44`,
      borderRadius: 3, padding: small ? "2px 8px" : "4px 12px",
      fontFamily: "monospace", fontSize: small ? 9 : 10,
      letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
      transition: "all .2s",
    }}>
      {earned && "✦ "}{d.token}
    </span>
  );
}

// ── Progress bar ────────────────────────────
function Bar({ pct, color }) {
  return (
    <div style={{ height: 3, background: "#ffffff12", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width .6s ease" }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────
function Home({ onNav, tokens }) {
  const earned = Object.keys(tokens).length;
  const total = DOMAINS.length;

  return (
    <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#ede8dc", fontFamily: "'Georgia', serif" }}>
      {/* nav */}
      <nav className="main-nav" style={{ borderBottom: "1px solid #ffffff0c" }}>
        <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff44" }}>NeofolkAtlas</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => onNav(V.LIBRARY)} style={navBtn}>Course Library</button>
          <button onClick={() => onNav(V.CONTRIBUTE)} style={{ ...navBtn, color: "#c8a84b", borderColor: "#c8a84b44" }}>+ Contribute</button>
        </div>
      </nav>

      <div className="hero-container">
        {/* hero */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#ffffff33", marginBottom: 20 }}>
            AutoEdu — Free forever
          </div>
          <h1 style={{ fontSize: "clamp(32px, 8vw, 76px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", margin: "0 0 24px", fontStyle: "italic" }}>
            Knowledge built<br />by the community,<br /><span style={{ color: "#c8a84b", fontStyle: "normal" }}>free for everyone.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#ffffff55", lineHeight: 1.75, maxWidth: 500, margin: "0 0 40px" }}>
            Read courses written by contributors. Explore rabbit holes. Pass assessments. Earn Lineage Tokens in your domain. No AI. No paywalls. No gatekeepers.
          </p>
          <button onClick={() => onNav(V.LIBRARY)}
            style={{ padding: "14px 36px", background: "#c8a84b", color: "#0c0b09", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
            Browse Courses →
          </button>
        </div>

        {/* token board */}
        <div style={{ borderTop: "1px solid #ffffff0c", paddingTop: 48, marginBottom: 64 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff33" }}>Your Lineage Tokens</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: "#ffffff44" }}>{earned} / {total}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {DOMAINS.map(d => {
              const has = tokens[d.id];
              return (
                <div key={d.id} style={{
                  padding: "14px 16px", borderRadius: 6,
                  background: has ? d.color + "18" : "#ffffff04",
                  border: `1px solid ${has ? d.color + "44" : "#ffffff0a"}`,
                  transition: "all .2s",
                }}>
                  <Chip domain={d.id} earned={has} small />
                  <div style={{ marginTop: 8, fontSize: 12, color: has ? "#ede8dc" : "#ffffff33", fontFamily: "monospace" }}>{d.label}</div>
                  {has && <div style={{ marginTop: 6 }}><Bar pct={100} color={d.color} /></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* how it works */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, background: "#ffffff08", border: "1px solid #ffffff08", borderRadius: 8, overflow: "hidden" }}>
          {[
            ["01", "Read", "Community-written courses. Dense, honest, no fluff."],
            ["02", "Explore", "Follow rabbit holes from any course into connected topics."],
            ["03", "Assess", "Quiz or essay. Human-written questions. You pass, or you don't."],
            ["04", "Earn", "Pass the assessment → earn the domain's Lineage Token."],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ padding: "28px 24px", background: "#0c0b09" }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#c8a84b66", letterSpacing: "0.15em", marginBottom: 10 }}>{n}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#ede8dc" }}>{title}</div>
              <div style={{ fontSize: 13, color: "#ffffff44", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIBRARY
// ─────────────────────────────────────────────
function Library({ onSelect, onBack, tokens }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? COURSES : COURSES.filter(c => c.domain === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#ede8dc", fontFamily: "'Georgia', serif" }}>
      <TopBar onBack={onBack} label="Course Library" right={<span style={{ fontFamily: "monospace", fontSize: 11, color: "#ffffff33" }}>{COURSES.length} courses</span>} />

      <div className="lib-container">
        {/* domain filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 40 }}>
          <button onClick={() => setFilter("all")} style={filter === "all" ? activeFilter : inactiveFilter}>All</button>
          {DOMAINS.map(d => (
            <button key={d.id} onClick={() => setFilter(d.id)}
              style={filter === d.id ? { ...activeFilter, background: d.color, borderColor: d.color } : inactiveFilter}>
              {d.label}
            </button>
          ))}
        </div>

        {/* course grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map((c, i) => {
            const d = getDomain(c.domain);
            const done = tokens[c.domain];
            return (
              <div key={c.id} onClick={() => onSelect(c)}
                style={{
                  padding: "24px", borderRadius: 8, cursor: "pointer",
                  background: "#ffffff04", border: `1px solid ${done ? d.color + "44" : "#ffffff0a"}`,
                  transition: "all .2s", animation: `fadeUp .3s ${i * 0.04}s ease both`,
                  position: "relative", overflow: "hidden",
                }}
                onMouseOver={e => { e.currentTarget.style.background = d.color + "0e"; e.currentTarget.style.borderColor = d.color + "66"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#ffffff04"; e.currentTarget.style.borderColor = done ? d.color + "44" : "#ffffff0a"; }}
              >
                {done && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 14, color: d.color }}>✦</div>}
                <Chip domain={c.domain} small />
                <h3 style={{ fontSize: 17, fontWeight: 400, fontStyle: "italic", lineHeight: 1.35, margin: "14px 0 8px", color: "#ede8dc" }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: "#ffffff44", lineHeight: 1.55, marginBottom: 16 }}>{c.subtitle}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#ffffff33" }}>{c.level} · {c.readTime}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#ffffff22" }}>by {c.contributor}</div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#ffffff33", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.1em" }}>
            No courses yet in this domain. <button onClick={() => {}} style={{ background: "none", border: "none", color: "#c8a84b", cursor: "pointer", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.1em" }}>Contribute one →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COURSE READER
// ─────────────────────────────────────────────
function CourseReader({ course, onBack, onAssess, onRabbitHole }) {
  const [section, setSection] = useState(0);
  const d = getDomain(course.domain);
  const sec = course.sections[section];
  const linked = COURSES.filter(c => course.rabbitHoles?.includes(c.id));

  return (
    <div style={{ minHeight: "100vh", background: "#0d0c0a", color: "#ede8dc", fontFamily: "'Georgia', serif" }}>
      <TopBar onBack={onBack} label={course.title} right={<Chip domain={course.domain} small />} />

      <div className="course-grid">

        {/* sidebar */}
        <div className="course-sidebar">
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff22", marginBottom: 16 }}>Sections</div>
          {course.sections.map((s, i) => (
            <button key={i} onClick={() => setSection(i)}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "10px 12px",
                background: i === section ? d.color + "22" : "transparent",
                border: `1px solid ${i === section ? d.color + "55" : "transparent"}`,
                borderRadius: 5, cursor: "pointer", marginBottom: 6,
                color: i === section ? "#ede8dc" : "#ffffff44",
                fontSize: 12, lineHeight: 1.4, fontFamily: "'Georgia', serif",
                transition: "all .15s",
              }}>
              <span style={{ fontFamily: "monospace", fontSize: 9, color: i === section ? d.bg : "#ffffff22", display: "block", marginBottom: 4 }}>0{i + 1}</span>
              {s.heading}
            </button>
          ))}

          {/* rabbit holes */}
          {linked.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff22", marginBottom: 12 }}>Rabbit holes</div>
              {linked.map(l => {
                const ld = getDomain(l.domain);
                return (
                  <button key={l.id} onClick={() => onRabbitHole(l)}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "transparent", border: `1px solid #ffffff0a`, borderRadius: 5, cursor: "pointer", marginBottom: 6, transition: "all .15s" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = ld.color + "55"; e.currentTarget.style.background = ld.color + "0e"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "#ffffff0a"; e.currentTarget.style.background = "transparent"; }}>
                    <Chip domain={l.domain} small />
                    <div style={{ marginTop: 6, fontSize: 11, color: "#ffffff44", lineHeight: 1.4, fontFamily: "'Georgia', serif" }}>{l.title}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* main content */}
        <div className="course-main">
          <div key={section} style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: d.bg, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.7, marginBottom: 16 }}>
              Section {section + 1} of {course.sections.length}
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 400, fontStyle: "italic", lineHeight: 1.25, marginBottom: 28, color: "#ede8dc" }}>{sec.heading}</h2>
            <div style={{ fontSize: 16, lineHeight: 1.9, color: "#c8c4b0", marginBottom: 32 }}>{sec.body}</div>

            {/* key idea */}
            <div style={{ borderLeft: `3px solid ${d.color}`, paddingLeft: 20, marginBottom: 32 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: d.bg, opacity: 0.6, marginBottom: 8 }}>Core insight</div>
              <p style={{ fontSize: 15, fontStyle: "italic", color: "#ede8dc", lineHeight: 1.65 }}>{sec.keyIdea}</p>
            </div>

            {/* connections */}
            {sec.connections?.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff22", marginBottom: 12 }}>Connected threads</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {sec.connections.map((c, i) => (
                    <span key={i} style={{ padding: "5px 12px", background: "#ffffff06", border: "1px solid #ffffff0f", borderRadius: 4, fontFamily: "'Georgia', serif", fontSize: 12, color: "#ffffff55", fontStyle: "italic" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* nav */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 24, borderTop: "1px solid #ffffff08" }}>
              {section > 0 && (
                <button onClick={() => setSection(s => s - 1)} style={ghostBtn}>← Previous</button>
              )}
              {section < course.sections.length - 1 ? (
                <button onClick={() => setSection(s => s + 1)}
                  style={{ padding: "11px 24px", background: d.color, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Next section →
                </button>
              ) : (
                <button onClick={() => onAssess(course)}
                  style={{ padding: "11px 28px", background: "#c8a84b", color: "#0c0b09", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
                  ✦ Take Assessment →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ASSESSMENT
// ─────────────────────────────────────────────
function Assessment({ course, onBack, onResult }) {
  const [mode, setMode] = useState(null);
  const [answers, setAnswers] = useState({});
  const [essayText, setEssayText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const d = getDomain(course.domain);

  const mcqs = course.questions.filter(q => q.type === "mcq");
  const essays = course.questions.filter(q => q.type === "essay");

  const submitQuiz = () => {
    const correct = mcqs.filter(q => answers[q.id] === q.correct).length;
    const pct = Math.round((correct / mcqs.length) * 100);
    onResult({ passed: pct >= 60, score: pct, mode: "quiz", domain: course.domain, details: mcqs.map(q => ({ ...q, yours: answers[q.id] })) });
  };

  const submitEssay = () => {
    const words = essayText.trim().split(/\s+/).length;
    if (words < 80) return;
    // Static essay scoring: always passes if >= 80 words. In production, curator reviews.
    onResult({ passed: true, score: null, mode: "essay", domain: course.domain, pending: true });
  };

  if (!mode) return (
    <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#ede8dc", fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 520, padding: "0 20px", width: "100%", textAlign: "center" }}>
        <Chip domain={course.domain} />
        <h2 style={{ fontSize: 36, fontWeight: 400, fontStyle: "italic", margin: "20px 0 12px" }}>Prove you were there.</h2>
        <p style={{ color: "#ffffff44", fontSize: 14, lineHeight: 1.7, marginBottom: 40 }}>Pass to earn your <strong style={{ color: d.bg }}>{d.token}</strong> token. Choose your mode.</p>
        <div className="assess-grid">
          {[
            { key: "quiz", title: "Quiz", meta: `${mcqs.length} questions · 60% to pass`, desc: "Multiple choice. Precise and immediate." },
            { key: "essay", meta: "200–300 words · curator reviewed", title: "Essay", desc: "Open response. Depth over speed." },
          ].map(opt => (
            <button key={opt.key} onClick={() => setMode(opt.key)}
              style={{ padding: "22px 18px", background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all .2s" }}
              onMouseOver={e => { e.currentTarget.style.background = d.color + "22"; e.currentTarget.style.borderColor = d.color + "55"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#ffffff06"; e.currentTarget.style.borderColor = "#ffffff10"; }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: d.bg, marginBottom: 8 }}>{opt.key}</div>
              <div style={{ fontSize: 15, color: "#ede8dc", fontWeight: 600, marginBottom: 6 }}>{opt.title}</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#ffffff33", marginBottom: 8 }}>{opt.meta}</div>
              <div style={{ fontSize: 12, color: "#ffffff44", lineHeight: 1.5 }}>{opt.desc}</div>
            </button>
          ))}
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#ffffff33", cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>← Back to course</button>
      </div>
    </div>
  );

  if (mode === "quiz") return (
    <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#ede8dc", fontFamily: "'Georgia', serif" }}>
      <TopBar onBack={() => setMode(null)} label={`Quiz — ${course.title}`} right={<span style={{ fontFamily: "monospace", fontSize: 11, color: "#ffffff33" }}>{Object.keys(answers).length}/{mcqs.length}</span>} />
      <div className="assess-container">
        {mcqs.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 36, animation: `fadeUp .3s ${i * 0.05}s ease both` }}>
            <div style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 14, color: "#ede8dc" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: d.bg, marginRight: 10 }}>Q{i + 1}</span>{q.q}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map(opt => {
                const letter = opt.charAt(0);
                const sel = answers[q.id] === letter;
                return (
                  <button key={letter} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: letter }))}
                    style={{
                      padding: "11px 16px", borderRadius: 5, textAlign: "left", cursor: "pointer",
                      background: sel ? d.color + "33" : "#ffffff05",
                      border: `1px solid ${sel ? d.color + "77" : "#ffffff0c"}`,
                      color: sel ? "#ede8dc" : "#c8c4b0", fontSize: 14,
                      fontFamily: "'Georgia', serif", transition: "all .12s",
                    }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <button onClick={submitQuiz}
          disabled={Object.keys(answers).length < mcqs.length}
          style={{
            padding: "13px 32px",
            background: Object.keys(answers).length >= mcqs.length ? "#c8a84b" : "#ffffff0a",
            color: Object.keys(answers).length >= mcqs.length ? "#0c0b09" : "#ffffff22",
            border: "none", borderRadius: 5, cursor: Object.keys(answers).length >= mcqs.length ? "pointer" : "not-allowed",
            fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700,
          }}>
          Submit →
        </button>
      </div>
    </div>
  );

  if (mode === "essay") {
    const ep = essays[0];
    const words = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
    return (
      <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#ede8dc", fontFamily: "'Georgia', serif" }}>
        <TopBar onBack={() => setMode(null)} label="Essay Assessment" right={<span style={{ fontFamily: "monospace", fontSize: 11, color: words >= 80 ? "#c8a84b" : "#ffffff33" }}>{words} words</span>} />
        <div className="assess-container">
          <div style={{ background: "#ffffff06", border: "1px solid #ffffff0a", borderRadius: 8, padding: "24px", marginBottom: 28 }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff22", marginBottom: 12 }}>Essay Prompt</div>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#ede8dc" }}>{ep?.q}</p>
            <div style={{ marginTop: 14, fontFamily: "monospace", fontSize: 10, color: "#ffffff33" }}>Target: 200–300 words · Reviewed by a curator before token is awarded</div>
          </div>
          <textarea value={essayText} onChange={e => setEssayText(e.target.value)}
            placeholder="Write your response here..."
            style={{ width: "100%", minHeight: 260, background: "#ffffff07", border: "1px solid #ffffff10", borderRadius: 8, padding: "18px", color: "#ede8dc", fontFamily: "'Georgia', serif", fontSize: 15, lineHeight: 1.8, resize: "vertical", outline: "none" }} />
          <button onClick={submitEssay} disabled={words < 80}
            style={{ marginTop: 20, padding: "13px 32px", background: words >= 80 ? "#c8a84b" : "#ffffff0a", color: words >= 80 ? "#0c0b09" : "#ffffff22", border: "none", borderRadius: 5, cursor: words >= 80 ? "pointer" : "not-allowed", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
            Submit for review →
          </button>
        </div>
      </div>
    );
  }
}

// ─────────────────────────────────────────────
// RESULT
// ─────────────────────────────────────────────
function Result({ result, onHome, onRetry }) {
  const d = getDomain(result.domain);
  const { passed, score, mode, details, pending } = result;

  return (
    <div style={{ minHeight: "100vh", background: passed ? "#060a06" : "#0a0606", color: "#ede8dc", fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 620, padding: "40px 20px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16, animation: "fadeUp .4s ease" }}>{pending ? "⏳" : passed ? "✦" : "◌"}</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.02em", marginBottom: 12, animation: "fadeUp .4s .05s ease both" }}>
            {pending ? "Essay submitted." : passed ? "Token earned." : "Not yet."}
          </h2>
          {score !== null && (
            <div style={{ fontSize: 36, fontFamily: "monospace", color: passed ? "#4ade80" : "#f87171", fontWeight: 700, marginBottom: 16, animation: "fadeUp .4s .1s ease both" }}>
              {score}%
            </div>
          )}
          {pending && <p style={{ fontSize: 14, color: "#ffffff55", lineHeight: 1.7, marginBottom: 16 }}>A curator will review your essay. Your token will be awarded once approved.</p>}
          {passed && !pending && <div style={{ animation: "fadeUp .4s .15s ease both" }}><Chip domain={result.domain} earned /></div>}
        </div>

        {/* quiz breakdown */}
        {mode === "quiz" && details && (
          <div style={{ marginBottom: 40 }}>
            {details.map((q, i) => {
              const correct = q.yours === q.correct;
              return (
                <div key={i} style={{ marginBottom: 12, padding: "14px 16px", borderRadius: 7, background: correct ? "#ffffff05" : "#ff000008", border: `1px solid ${correct ? "#ffffff0a" : "#ff000020"}`, animation: `fadeUp .3s ${i * 0.05}s ease both` }}>
                  <div style={{ fontSize: 13, color: "#ffffff66", marginBottom: 6, lineHeight: 1.4 }}>{q.q}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: correct ? "#4ade80" : "#f87171" }}>
                    {correct ? "✓ Correct" : `✗ You: ${q.yours || "—"} · Answer: ${q.correct}`}
                  </div>
                  {!correct && q.explanation && <div style={{ fontSize: 12, color: "#ffffff33", marginTop: 6, lineHeight: 1.5, fontStyle: "italic" }}>{q.explanation}</div>}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={onHome}
            style={{ padding: "12px 28px", background: passed || pending ? "#c8a84b" : "#ffffff0a", color: passed || pending ? "#0c0b09" : "#ede8dc", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: passed || pending ? 700 : 400 }}>
            {passed ? "Keep learning →" : "Back to library"}
          </button>
          {!passed && !pending && (
            <button onClick={onRetry} style={ghostBtn}>Try again</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONTRIBUTE
// ─────────────────────────────────────────────
function Contribute({ onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ domain: "", title: "", subtitle: "", contributor: "", sections: [{ heading: "", body: "", keyIdea: "" }], questions: [{ type: "mcq", q: "", options: ["", "", "", ""], correct: "A" }] });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (submitted) return (
    <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#ede8dc", fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 480, padding: "0 20px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✦</div>
        <h2 style={{ fontSize: 32, fontWeight: 400, fontStyle: "italic", marginBottom: 16 }}>Submission received.</h2>
        <p style={{ fontSize: 14, color: "#ffffff55", lineHeight: 1.75, marginBottom: 32 }}>Your course will be reviewed and published once approved. The community thanks you.</p>
        <button onClick={onBack} style={{ padding: "12px 28px", background: "#c8a84b", color: "#0c0b09", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
          Back to library
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0c0b09", color: "#ede8dc", fontFamily: "'Georgia', serif" }}>
      <TopBar onBack={onBack} label="Contribute a Course" right={<span style={{ fontFamily: "monospace", fontSize: 11, color: "#ffffff33" }}>Step {step} / 3</span>} />
      <div className="contribute-container">

        {/* step indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 48 }}>
          {["Course basics", "Sections", "Questions"].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: "8px 0", borderBottom: `2px solid ${step === i + 1 ? "#c8a84b" : "#ffffff15"}`, cursor: "pointer" }} onClick={() => setStep(i + 1)}>
              <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: step === i + 1 ? "#c8a84b" : "#ffffff33", marginBottom: 4 }}>0{i + 1}</div>
              <div style={{ fontSize: 12, color: step === i + 1 ? "#ede8dc" : "#ffffff44" }}>{s}</div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <Field label="Domain" required>
              <select value={form.domain} onChange={e => set("domain", e.target.value)} style={inputStyle}>
                <option value="">Select a domain...</option>
                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.label} — {d.sub}</option>)}
              </select>
            </Field>
            <Field label="Course title" required>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Bina Agarwal & the Economics of Land" style={inputStyle} />
            </Field>
            <Field label="Subtitle" required>
              <input value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="One sentence that makes someone want to read this." style={inputStyle} />
            </Field>
            <Field label="Your name / handle">
              <input value={form.contributor} onChange={e => set("contributor", e.target.value)} placeholder="e.g. Meera Nair (anonymous OK)" style={inputStyle} />
            </Field>
            <button onClick={() => setStep(2)} disabled={!form.domain || !form.title || !form.subtitle}
              style={{ ...submitBtn, opacity: form.domain && form.title && form.subtitle ? 1 : 0.4 }}>
              Next: Write sections →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            {form.sections.map((sec, i) => (
              <div key={i} style={{ marginBottom: 36, padding: "24px", background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 8 }}>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: "#c8a84b66", letterSpacing: "0.15em", marginBottom: 16 }}>Section {i + 1}</div>
                <Field label="Heading">
                  <input value={sec.heading} onChange={e => { const s = [...form.sections]; s[i].heading = e.target.value; set("sections", s); }} placeholder="Section heading" style={inputStyle} />
                </Field>
                <Field label="Body (aim for 200–300 words)">
                  <textarea value={sec.body} onChange={e => { const s = [...form.sections]; s[i].body = e.target.value; set("sections", s); }} placeholder="Dense, honest, real names and dates. No fluff." style={{ ...inputStyle, minHeight: 160, resize: "vertical" }} />
                </Field>
                <Field label="Core insight (one sentence)">
                  <input value={sec.keyIdea} onChange={e => { const s = [...form.sections]; s[i].keyIdea = e.target.value; set("sections", s); }} placeholder="The single sharpest thing this section teaches." style={inputStyle} />
                </Field>
              </div>
            ))}
            <button onClick={() => set("sections", [...form.sections, { heading: "", body: "", keyIdea: "" }])}
              style={ghostBtn}>+ Add section</button>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(1)} style={ghostBtn}>← Back</button>
              <button onClick={() => setStep(3)} style={submitBtn}>Next: Add questions →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <p style={{ fontSize: 13, color: "#ffffff44", lineHeight: 1.65, marginBottom: 28 }}>
              Add at least 3 multiple choice questions and optionally 1 essay prompt. MCQ answers must be verifiable from your course content.
            </p>
            {form.questions.map((q, i) => (
              <div key={i} style={{ marginBottom: 28, padding: "24px", background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 8 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#c8a84b66", letterSpacing: "0.15em" }}>Question {i + 1}</div>
                  <select value={q.type} onChange={e => { const qs = [...form.questions]; qs[i].type = e.target.value; set("questions", qs); }}
                    style={{ ...inputStyle, padding: "4px 10px", fontSize: 11, width: "auto" }}>
                    <option value="mcq">Multiple choice</option>
                    <option value="essay">Essay</option>
                  </select>
                </div>
                <Field label="Question">
                  <input value={q.q} onChange={e => { const qs = [...form.questions]; qs[i].q = e.target.value; set("questions", qs); }} placeholder="Question text..." style={inputStyle} />
                </Field>
                {q.type === "mcq" && (
                  <>
                    {["A", "B", "C", "D"].map((letter, j) => (
                      <Field key={letter} label={`Option ${letter}`}>
                        <input value={q.options[j]} onChange={e => { const qs = [...form.questions]; qs[i].options[j] = e.target.value; set("questions", qs); }} placeholder={`Option ${letter}...`} style={inputStyle} />
                      </Field>
                    ))}
                    <Field label="Correct answer">
                      <select value={q.correct} onChange={e => { const qs = [...form.questions]; qs[i].correct = e.target.value; set("questions", qs); }} style={{ ...inputStyle, width: "auto" }}>
                        {["A", "B", "C", "D"].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </Field>
                  </>
                )}
              </div>
            ))}
            <button onClick={() => set("questions", [...form.questions, { type: "mcq", q: "", options: ["", "", "", ""], correct: "A" }])} style={ghostBtn}>
              + Add question
            </button>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={() => setStep(2)} style={ghostBtn}>← Back</button>
              <button onClick={() => setSubmitted(true)}
                style={{ ...submitBtn, background: "#c8a84b", color: "#0c0b09" }}>
                ✦ Submit course for review →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED UI ATOMS
// ─────────────────────────────────────────────
function TopBar({ onBack, label, right }) {
  return (
    <div className="top-bar" style={{ borderBottom: "1px solid #ffffff08", position: "sticky", top: 0, background: "#0c0b09", zIndex: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#ffffff44", cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>← Back</button>
      <div style={{ fontFamily: "monospace", fontSize: 11, color: "#ffffff44", maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
      <div>{right}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff33", marginBottom: 8 }}>
        {label}{required && <span style={{ color: "#c8a84b" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = { width: "100%", background: "#ffffff07", border: "1px solid #ffffff12", borderRadius: 5, padding: "10px 14px", color: "#ede8dc", fontFamily: "'Georgia', serif", fontSize: 14, outline: "none" };
const ghostBtn = { padding: "10px 22px", background: "transparent", border: "1px solid #ffffff18", borderRadius: 5, cursor: "pointer", color: "#ffffff66", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" };
const submitBtn = { padding: "13px 28px", background: "#ffffff12", color: "#ede8dc", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 };
const navBtn = { background: "none", border: "1px solid #ffffff18", borderRadius: 4, padding: "6px 16px", color: "#ffffff66", cursor: "pointer", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" };
const activeFilter = { padding: "6px 14px", borderRadius: 3, border: "1px solid #c8a84b", background: "#c8a84b", color: "#0c0b09", cursor: "pointer", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 };
const inactiveFilter = { padding: "6px 14px", borderRadius: 3, border: "1px solid #ffffff14", background: "transparent", color: "#ffffff44", cursor: "pointer", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" };

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
export default function AutoEdu() {
  const [view, setView] = useState(V.HOME);
  const [activeCourse, setActiveCourse] = useState(null);
  const [result, setResult] = useState(null);
  const [tokens, setTokens] = useState({});
  const [stack, setStack] = useState([]);

  const push = (v, course = null) => {
    setStack(s => [...s, { view, activeCourse }]);
    setView(v);
    if (course) setActiveCourse(course);
  };

  const pop = () => {
    const prev = stack[stack.length - 1];
    if (!prev) { setView(V.HOME); return; }
    setStack(s => s.slice(0, -1));
    setView(prev.view);
    setActiveCourse(prev.activeCourse);
  };

  const earnToken = (domain) => setTokens(t => ({ ...t, [domain]: true }));

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        select option { background: #1a1a16; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ffffff18; border-radius: 3px; }
        textarea, input, select { box-sizing: border-box; }

        .main-nav { padding: 16px 40px; display: flex; justify-content: space-between; align-items: center; }
        .hero-container { max-width: 900px; margin: 0 auto; padding: 80px 40px 60px; }
        .top-bar { padding: 14px 32px; display: flex; justify-content: space-between; align-items: center; }
        .lib-container { max-width: 960px; margin: 0 auto; padding: 40px 40px 60px; }
        .course-grid { display: grid; grid-template-columns: 220px 1fr; max-width: 1060px; margin: 0 auto; gap: 0; min-height: calc(100vh - 53px); }
        .course-sidebar { border-right: 1px solid #ffffff08; padding: 32px 24px; position: sticky; top: 53px; height: calc(100vh - 53px); overflow-y: auto; }
        .course-main { padding: 48px 56px; max-width: 700px; }
        .assess-container { max-width: 680px; margin: 0 auto; padding: 48px 40px; }
        .assess-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
        .contribute-container { max-width: 680px; margin: 0 auto; padding: 48px 40px 80px; }
        
        @media (max-width: 768px) {
          .main-nav { padding: 16px 20px; flex-direction: column; gap: 16px; align-items: flex-start; }
          .hero-container { padding: 40px 20px; }
          .top-bar { padding: 14px 20px; flex-wrap: wrap; gap: 12px; }
          .lib-container { padding: 24px 20px; }
          .course-grid { grid-template-columns: 1fr; }
          .course-sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid #ffffff08; padding: 24px 20px; }
          .course-main { padding: 32px 20px; }
          .assess-container { padding: 32px 20px; }
          .assess-grid { grid-template-columns: 1fr; }
          .contribute-container { padding: 32px 20px 60px; }
        }
      `}</style>

      {view === V.HOME && <Home onNav={v => { setStack([]); setView(v); }} tokens={tokens} />}
      {view === V.LIBRARY && <Library onSelect={c => push(V.COURSE, c)} onBack={pop} tokens={tokens} />}
      {view === V.COURSE && activeCourse && (
        <CourseReader course={activeCourse} onBack={pop}
          onAssess={c => push(V.ASSESS, c)}
          onRabbitHole={c => push(V.COURSE, c)} />
      )}
      {view === V.ASSESS && activeCourse && (
        <Assessment course={activeCourse} onBack={pop}
          onResult={r => {
            setResult(r);
            if (r.passed) earnToken(r.domain);
            push(V.RESULT);
          }} />
      )}
      {view === V.RESULT && result && (
        <Result result={result} onHome={() => { setStack([]); setView(V.LIBRARY); }} onRetry={() => { setView(V.ASSESS); }} />
      )}
      {view === V.CONTRIBUTE && <Contribute onBack={pop} />}
    </>
  );
}
