import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ExternalLink, 
  Search,
  Menu,
  X,
  Languages,
  Youtube,
  Globe
} from 'lucide-react';
import { LIBRARY_DATA, UI_TRANSLATIONS, type LibraryTopic, type Language } from './data';
import { ChatBot } from './components/ChatBot';

export default function App() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const t = UI_TRANSLATIONS[lang];
  const isRtl = lang === 'ur';

  // Apply RTL direction to the main content or body if needed
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [isRtl, lang]);

  const selectedTopic = useMemo(() => 
    LIBRARY_DATA.find(topic => topic.id === selectedTopicId),
    [selectedTopicId]
  );

  const filteredTopics = useMemo(() => 
    LIBRARY_DATA.filter(topic => 
      topic.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.coreIdea[lang].toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery, lang]
  );

  const LanguageSwitcher = () => (
    <div className="flex gap-2 p-1 border border-library-line bg-white/50">
      {(['en', 'hi', 'ur'] as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 text-[10px] uppercase font-bold transition-all ${
            lang === l ? 'bg-library-ink text-library-bg' : 'hover:bg-library-line'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex flex-col min-h-screen border border-library-ink m-0 md:m-4 md:h-[calc(100vh-2rem)] overflow-hidden bg-library-bg ${isRtl ? 'font-serif' : ''}`}>
      {/* Header */}
      <header className={`flex flex-col md:flex-row items-center justify-between p-6 md:px-8 md:py-6 border-b-2 border-library-ink bg-library-bg ${isRtl ? 'md:flex-row-reverse' : ''}`}>
        <div className={`flex flex-col mb-4 md:mb-0 ${isRtl ? 'text-right' : 'text-left'}`}>
          <h1 className="font-serif text-2xl md:text-[32px] font-normal uppercase tracking-[4px] leading-none text-library-ink">
            {t.brand}
          </h1>
          <p className="text-[9px] md:text-[11px] uppercase tracking-[2px] opacity-60 mt-1">
            {t.motto}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <div className={`text-right font-mono text-[9px] md:text-[10px] hidden md:block leading-tight ${isRtl ? 'text-left' : 'text-right'}`}>
            {t.status}<br />
            {t.access}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-library-line transition-colors border border-library-ink"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className={`flex flex-1 overflow-hidden ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-0 md:relative md:flex md:w-[320px] flex-col border-library-ink bg-library-bg z-40
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}
          ${isRtl ? 'border-l' : 'border-r'}
        `}>
          <div className={`p-4 md:px-5 md:py-4 border-b border-library-line text-[10px] font-bold uppercase tracking-widest bg-black/5 flex justify-between items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <span>{t.navHeader}</span>
            <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}><X className="w-4 h-4" /></button>
          </div>

          <div className="p-4 border-b border-library-line">
            <div className="relative">
              <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 opacity-40`} />
              <input 
                type="text"
                placeholder={t.lookup}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRtl ? 'pr-9 pl-4 text-right font-serif' : 'pl-9 pr-4 text-left font-mono'} py-2 bg-transparent border border-library-line focus:outline-none focus:border-library-ink text-[10px] uppercase`}
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <button 
              onClick={() => {
                setSelectedTopicId(null);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 border-b border-library-line transition-all text-left
                ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}
                ${selectedTopicId === null ? 'bg-library-ink text-library-bg' : 'hover:bg-black/5'}
              `}
            >
              <span className="font-mono text-[11px] opacity-40">00</span>
              <span className="text-[13px] font-medium">{t.intro}</span>
            </button>

            {filteredTopics.map((topic, i) => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-5 py-4 border-b border-library-line transition-all
                  ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}
                  ${selectedTopicId === topic.id ? 'bg-library-ink text-library-bg' : 'hover:bg-black/5'}
                `}
              >
                <span className="font-mono text-[11px] opacity-40 mt-0.5">{(i + 1).toString().padStart(2, '0')}</span>
                <span className={`text-[13px] font-medium leading-snug flex-1 ${isRtl ? 'font-serif' : 'font-sans'}`}>
                  {topic.title[lang]}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto bg-library-bg custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {!selectedTopicId ? (
              <motion.div 
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-8 md:p-12 max-w-5xl mx-auto ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <div className="border-b border-library-ink mb-12 pb-2">
                  <h2 className="font-serif text-[28px] italic font-normal">{t.intro}.</h2>
                </div>
                
                <div className={`grid md:grid-cols-[1.5fr_1fr] gap-12 ${isRtl ? 'md:grid-cols-[1fr_1.5fr]' : ''}`}>
                  <div className={`space-y-12 ${isRtl ? 'md:order-2' : ''}`}>
                    <section>
                      <div className="library-label">{t.mission}</div>
                      <p className={`text-xl md:text-[22px] font-serif leading-relaxed text-library-ink ${isRtl ? 'leading-[1.8]' : ''}`}>
                        {t.introDesc}
                      </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <section>
                        <div className="library-label">{t.provision}</div>
                        <ul className="space-y-2">
                          <li className="library-list-item">{t.autonomy}</li>
                          <li className="library-list-item">{t.techLit}</li>
                          <li className="library-list-item">{t.resilience}</li>
                          <li className="library-list-item">{t.civicStab}</li>
                        </ul>
                      </section>
                      <section>
                        <div className="library-label">{t.constraints}</div>
                        <ul className="space-y-2 text-red-900/70">
                          <li className="library-list-item">{t.noCert}</li>
                          <li className="library-list-item">{t.noGate}</li>
                          <li className="library-list-item">{t.noIdeology}</li>
                        </ul>
                      </section>
                    </div>

                    <div className={`bg-white border-l-4 border-library-accent p-8 self-end mt-12 ${isRtl ? 'border-l-0 border-r-4' : ''}`}>
                      <p className={`font-serif text-xl leading-relaxed italic mb-3 ${isRtl ? 'leading-[1.8]' : ''}`}>
                        "{t.introQuote}"
                      </p>
                      <p className="font-sans text-[12px] font-bold uppercase tracking-wider">— {t.proverb}</p>
                    </div>
                  </div>

                  <div className={`space-y-8 ${isRtl ? 'md:order-1' : ''}`}>
                    <div className="bg-library-ink text-library-bg p-8 flex flex-col items-center text-center justify-center space-y-4">
                      <BookOpen className="w-12 h-12" />
                      <h3 className="font-serif text-lg italic">{t.ready}</h3>
                      <button 
                        onClick={() => setSelectedTopicId(LIBRARY_DATA[0].id)}
                        className="w-full py-3 border border-library-bg hover:bg-library-bg hover:text-library-ink transition-all font-mono text-[10px] uppercase tracking-widest"
                      >
                        {t.enter}
                      </button>
                    </div>
                    
                    <div className="p-8 border border-library-line bg-white/30 space-y-4">
                      <h4 className="font-bold text-[10px] uppercase tracking-widest">{t.topics}</h4>
                      <div className="space-y-2">
                        {LIBRARY_DATA.slice(0, 5).map(topic => (
                          <div key={topic.id} className={`flex items-center gap-2 text-[11px] ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="w-1.5 h-1.5 bg-library-ink rounded-full" />
                            <span>{topic.title[lang]}</span>
                          </div>
                        ))}
                        <div className="text-[11px] opacity-40">... and more</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : selectedTopic && (
              <motion.div 
                key={selectedTopic.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-8 md:p-12 max-w-6xl mx-auto ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <div className="border-b border-library-ink mb-12 pb-2">
                  <h2 className="font-serif text-[28px] italic font-normal">
                    {LIBRARY_DATA.findIndex(t => t.id === selectedTopicId) + 1}. {selectedTopic.title[lang]}
                  </h2>
                </div>

                <div className={`grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 ${isRtl ? 'lg:grid-cols-[1fr_1.5fr]' : ''}`}>
                  {/* Left Column */}
                  <div className={`space-y-12 ${isRtl ? 'lg:order-2' : ''}`}>
                    <section className="space-y-4">
                      <div className="library-label">{lang === 'hi' ? 'मुख्य विचार' : lang === 'ur' ? 'بنیادی تصور' : 'Core Idea'}</div>
                      <p className={`text-xl md:text-[20px] leading-relaxed text-[#111] font-serif ${isRtl ? 'leading-[1.8]' : ''}`}>
                        {selectedTopic.coreIdea[lang]}
                      </p>
                    </section>

                    <section className="space-y-4">
                      <div className="library-label">{t.whyTitle}</div>
                      <p className={`text-[15px] leading-relaxed text-[#444] ${isRtl ? 'font-serif leading-[1.8]' : 'font-sans'}`}>
                        {selectedTopic.whyThisMatters[lang]}
                      </p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                      <section>
                        <div className="library-label">{t.conceptsTitle}</div>
                        <ul className="space-y-3">
                          {selectedTopic.keyConcepts[lang].map((concept, i) => (
                            <li key={i} className={`library-list-item text-[13px] ${isRtl ? 'pr-4' : 'pl-4'}`}>{concept}</li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <div className="library-label">{t.skillsTitle}</div>
                        <ul className="space-y-3">
                          {selectedTopic.practicalSkills[lang].map((skill, i) => (
                            <li key={i} className={`library-list-item text-[13px] ${isRtl ? 'pr-4' : 'pl-4'}`}>{skill}</li>
                          ))}
                        </ul>
                      </section>
                    </div>

                    <section>
                      <div className="library-label">{t.booksTitle}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTopic.booksToRead.map((book, i) => (
                          <div key={i} className="bg-black/5 p-4 border border-library-line flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-[13px] leading-tight mb-1">{book.title}</h4>
                              <p className="font-serif italic text-[12px] opacity-70">{book.author}</p>
                            </div>
                            {book.quote && (
                               <div className={`mt-4 pt-4 border-t border-library-line/30 italic text-[11px] leading-relaxed opacity-80 ${isRtl ? 'font-serif' : ''}`}>
                                  "{book.quote[lang]}"
                               </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <div className="library-label">{t.misunderstandingsTitle}</div>
                      <ul className="grid md:grid-cols-1 gap-4">
                         {selectedTopic.commonMisunderstandings[lang].map((m, i) => (
                            <li key={i} className="flex gap-4 items-start bg-red-900/5 p-4 border border-red-900/10">
                               <X className="w-4 h-4 text-red-900 mt-1 flex-shrink-0" />
                               <span className="text-[13px] text-red-950 font-medium">{m}</span>
                            </li>
                         ))}
                      </ul>
                    </section>

                    {selectedTopic.supplementarySections && selectedTopic.supplementarySections.map((section, idx) => (
                      <section key={idx} className="space-y-4">
                        <div className="library-label">{section.title[lang]}</div>
                        <div className="bg-white/50 border border-library-line p-6 space-y-4">
                          <ul className="space-y-3">
                            {section.items[lang].map((item, i) => (
                              <li key={i} className="library-list-item text-[13px] text-library-ink">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>
                    ))}
                  </div>

                  {/* Right Column */}
                  <div className={`space-y-12 ${isRtl ? 'lg:order-1' : ''}`}>
                    <section>
                      <div className="library-label">{t.mediaTitle}</div>
                      <ul className="space-y-2">
                        {selectedTopic.mediaReferences.map((media, i) => (
                          <li key={i} className="library-list-item text-xs italic">{media}</li>
                        ))}
                      </ul>
                    </section>

                    {selectedTopic.wikipediaLinks && selectedTopic.wikipediaLinks.length > 0 && (
                      <section>
                        <div className="library-label">{t.wikiTitle}</div>
                        <div className="space-y-2">
                          {selectedTopic.wikipediaLinks.map((link, i) => (
                            <a 
                              key={i} 
                              href={link} 
                              target="_blank" 
                              rel="noreferrer"
                              className={`flex items-center gap-3 p-3 border border-library-line bg-white hover:bg-library-ink hover:text-library-bg transition-all group ${isRtl ? 'flex-row-reverse' : ''}`}
                            >
                              <Globe className="w-4 h-4 opacity-50" />
                              <span className="text-[11px] font-mono truncate">{link.split('/').pop()?.replace(/_/g, ' ')}</span>
                            </a>
                          ))}
                        </div>
                      </section>
                    )}

                    {selectedTopic.youtubeLinks && selectedTopic.youtubeLinks.length > 0 && (
                      <section>
                        <div className="library-label">{t.ytTitle}</div>
                        <div className="space-y-2">
                          {selectedTopic.youtubeLinks.map((yt, i) => (
                            <a 
                              key={i} 
                              href={yt.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className={`flex items-center gap-3 p-3 border border-library-line bg-white hover:bg-red-600 hover:text-white transition-all group ${isRtl ? 'flex-row-reverse' : ''}`}
                            >
                              <Youtube className="w-4 h-4 text-red-600 group-hover:text-white" />
                              <span className="text-[11px] font-bold uppercase tracking-wider">{yt.title}</span>
                            </a>
                          ))}
                        </div>
                      </section>
                    )}

                    <section>
                      <div className="library-label">{t.appsTitle}</div>
                      <p className={`text-[14px] leading-relaxed text-library-ink/80 bg-white/40 p-5 border-l-2 border-library-line ${isRtl ? 'border-l-0 border-r-2' : ''}`}>
                        {selectedTopic.realWorldApplications[lang]}
                      </p>
                    </section>

                    <section className="pt-8">
                      <div className="flex flex-col gap-2">
                         <div className="library-label">Module Navigation</div>
                         <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <button 
                              disabled={LIBRARY_DATA.findIndex(t => t.id === selectedTopicId) === 0}
                              onClick={() => {
                                const idx = LIBRARY_DATA.findIndex(t => t.id === selectedTopicId);
                                setSelectedTopicId(LIBRARY_DATA[idx - 1].id);
                                window.scrollTo(0, 0);
                              }}
                              className="flex-1 py-4 border border-library-ink hover:bg-library-ink hover:text-library-bg transition-all text-center font-mono text-[10px] uppercase disabled:opacity-20"
                            >
                              {t.prev}
                            </button>
                            <button 
                              disabled={LIBRARY_DATA.findIndex(t => t.id === selectedTopicId) === LIBRARY_DATA.length - 1}
                              onClick={() => {
                                const idx = LIBRARY_DATA.findIndex(t => t.id === selectedTopicId);
                                setSelectedTopicId(LIBRARY_DATA[idx + 1].id);
                                window.scrollTo(0, 0);
                              }}
                              className="flex-1 py-4 border border-library-ink hover:bg-library-ink hover:text-library-bg transition-all text-center font-mono text-[10px] uppercase disabled:opacity-20"
                            >
                              {t.next}
                            </button>
                         </div>
                      </div>
                    </section>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ChatBot 
        lang={lang} 
        selectedTopicTitle={selectedTopic?.title[lang]}
        selectedTopicCoreIdea={selectedTopic?.coreIdea[lang]}
      />

      {/* Footer */}
      <footer className="px-8 py-3 bg-library-ink text-library-bg text-[10px] flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="uppercase tracking-[1px] text-center md:text-left">
          {t.copyright}
        </div>
        <div className="font-mono text-[9px] opacity-60">
          [ {t.section}: {selectedTopicId ? `0${LIBRARY_DATA.findIndex(topic => topic.id === selectedTopicId) + 1}-A-${selectedTopicId.slice(0, 3).toUpperCase()}` : '00-INFRA'} ]
        </div>
      </footer>
    </div>
  );
}
