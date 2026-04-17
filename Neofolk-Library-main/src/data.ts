export type Language = 'en' | 'hi' | 'ur';

export interface LibraryTopic {
  id: string;
  title: Record<Language, string>;
  coreIdea: Record<Language, string>;
  whyThisMatters: Record<Language, string>;
  keyConcepts: Record<Language, string[]>;
  practicalSkills: Record<Language, string[]>;
  commonMisunderstandings: Record<Language, string[]>;
  booksToRead: {
    title: string;
    author: string;
    quote?: Record<Language, string>;
  }[];
  mediaReferences: string[];
  realWorldApplications: Record<Language, string>;
  furtherLearningResources: string[];
  wikipediaLinks?: string[];
  youtubeLinks?: { title: string; url: string }[];
  supplementarySections?: {
    title: Record<Language, string>;
    items: Record<Language, string[]>;
  }[];
}

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    brand: "The Library",
    motto: "Public Knowledge Infrastructure • Open-Access / Non-Certified",
    status: "CATALOG VERSION: 4.5.0-STABLE",
    access: "ACCESS: UNRESTRICTED PUBLIC",
    navHeader: "Knowledge Pillars",
    lookup: "Lookup...",
    intro: "Infrastructure Overview",
    mission: "System Identity",
    provision: "Provision",
    constraints: "Constraints",
    proverb: "Collective Proverb",
    ready: "Ready for learning?",
    enter: "Enter Modules",
    prev: "PREV",
    next: "NEXT",
    copyright: "THE LIBRARY IS A HUMAN RIGHT. COPIES MAY BE DISTRIBUTED FREELY.",
    section: "SECTION",
    backToIntro: "Back to Infrastructure Overview",
    topics: "TOPICS",
    whyTitle: "Why This Matters",
    conceptsTitle: "Key Concepts",
    skillsTitle: "Practical Skills",
    misunderstandingsTitle: "Common Misunderstandings",
    booksTitle: "Required Reading / References",
    mediaTitle: "Media References",
    appsTitle: "Real-World Applications",
    resourcesTitle: "Further Learning",
    wikiTitle: "Wikipedia Records",
    ytTitle: "Verified Media streams",
    introDesc: "The Library is a structured collection of open knowledge designed to help individuals develop intellectual independence, civic awareness, technological literacy, and survival competence in the modern world.",
    autonomy: "Personal Autonomy Foundations",
    techLit: "Technological Literacy",
    resilience: "Resilience Protocols",
    civicStab: "Civic Stabilization",
    noCert: "No Certification",
    noGate: "No Gatekeeping",
    noIdeology: "No Ideological Preaching",
    introQuote: "Knowledge is the first line of defense for a free citizen."
  },
  hi: {
    brand: "द लाइब्रेरी",
    motto: "सार्वजनिक ज्ञान अवसंरचना • खुली पहुँच / गैर-प्रमाणित",
    status: "कैटलॉग संस्करण: 4.5.0-स्थिर",
    access: "पहुँच: अप्रतिबंधित सार्वजनिक",
    navHeader: "ज्ञान के स्तंभ",
    lookup: "खोजें...",
    intro: "बुनियादी ढांचा अवलोकन",
    mission: "सिस्टम पहचान",
    provision: "प्रावधान",
    constraints: "प्रतिबंध",
    proverb: "सामूहिक कहावत",
    ready: "सीखने के लिए तैयार?",
    enter: "मॉड्यूल दर्ज करें",
    prev: "पिछला",
    next: "अगला",
    copyright: "पुस्तकालय एक मानव अधिकार है। प्रतियां स्वतंत्र रूप से वितरित की जा सकती हैं।",
    section: "अनुभाग",
    backToIntro: "बुनियादी ढांचा अवलोकन पर वापस जाएं",
    topics: "विषय",
    whyTitle: "यह क्यों मायने रखता है",
    conceptsTitle: "मुख्य अवधारणाएं",
    skillsTitle: "व्यावहारिक कौशल",
    misunderstandingsTitle: "आम गलतफहमियां",
    booksTitle: "आवश्यक पठन / संदर्भ",
    mediaTitle: "मीडिया संदर्भ",
    appsTitle: "वास्तविक दुनिया के अनुप्रयोग",
    resourcesTitle: "आगे सीखना",
    wikiTitle: "विकिपीडिया रिकॉर्ड",
    ytTitle: "सत्यापित मीडिया स्ट्रीम"
  },
  ur: {
    brand: "دی لائبریری",
    motto: "عوامی علمی انفراسٹرکچر • اوپن ایکسیس / غیر تصدیق شدہ",
    status: "کیٹلاگ ورژن: 4.5.0-مستحکم",
    access: "رسائی: غیر محدود عوامی",
    navHeader: "علم کے ستون",
    lookup: "تلاش کریں...",
    intro: "بنیادی ڈھانچے کا جائزہ",
    mission: "نظام کی شناخت",
    provision: "فراہمی",
    constraints: "پابندیاں",
    proverb: "اجتماعی مقولہ",
    ready: "سیکھنے کے لیے تیار؟",
    enter: "ماڈیولز میں داخل ہوں",
    prev: "پچھلا",
    next: "اگلا",
    copyright: "لائبریری انسانی حق ہے۔ کاپیاں آزادانہ طور پر تقسیم کی جا سکتی ہیں۔",
    section: "سیکشن",
    backToIntro: "بنیادی ڈھانچے کے جائزے پر واپس",
    topics: "موضوعات",
    whyTitle: "یہ کیوں ضروری ہے",
    conceptsTitle: "بنیادی تصورات",
    skillsTitle: "عملی مہارتیں",
    misunderstandingsTitle: "عام غلط فہمیاں",
    booksTitle: "ضروری مطالعہ / حوالہ جات",
    mediaTitle: "میڈیا کے حوالے",
    appsTitle: "حقیقی دنیا میں اطلاق",
    resourcesTitle: "مزید سیکھنا",
    wikiTitle: "ویکیپیڈیا ریکارڈ",
    ytTitle: "تصدیق شدہ میڈیا اسٹریمز"
  }
};

export const LIBRARY_DATA: LibraryTopic[] = [
  {
    id: "propaganda",
    title: {
      en: "Understanding Propaganda and Political Manipulation",
      hi: "प्रोपेगैंडा और राजनीतिक हेरफेर को समझना",
      ur: "پروپیگنڈہ اور سیاسی ہیرا پھیری کو سمجھنا"
    },
    coreIdea: {
      en: "Propaganda is the systematic dissemination of information—true, false, or distorted—to influence public opinion and control social behavior through emotional triggers and selective narrative framing.",
      hi: "प्रोपेगैंडा सूचना का व्यवस्थित प्रसार है—सच्चा, झूठा या विकृत—ताकि भावनात्मक उत्प्रेरकों और चुनिंदा कथाओं के माध्यम से जनमत को प्रभावित किया जा सके और सामाजिक व्यवहार को नियंत्रित किया जा सके।",
      ur: "پروپیگنڈہ معلومات کی منظم تشہیر ہے—سچی، جھوٹی یا مسخ شدہ—تاکہ جذباتی محرکات اور منتخب بیانیے کے ذریعے رائے عامہ پر اثر انداز ہو کر سماجی رویوں کو کنٹرول کیا جا سکے۔"
    },
    whyThisMatters: {
      en: "Individual autonomy is impossible if perception is managed by external interests. Failing to recognize manipulation leads to mass mobilization for causes that often contradict a person's actual well-being.",
      hi: "यदि धारणा बाहरी हितों द्वारा प्रबंधित की जाती है तो व्यक्तिगत स्वायत्तता असंभव है। हेरफेर को पहचानने में विफलता उन कारणों के लिए सामूहिक लामबंदी की ओर ले जाती है जो अक्सर व्यक्ति के वास्तविक कल्याण के विपरीत होते हैं।",
      ur: "انفرادی خودمختاری ناممکن ہے اگر ادراک کا انتظام بیرونی مفادات کے ذریعے کیا جائے۔ ہیرا پھیری کو پہچاننے میں ناکامی ان وجوہات کے لیے اجتماعی تحریک کا باعث بنتی ہے جو اکثر انسان کی حقیقی فلاح کے متصادم ہوتی ہیں۔"
    },
    keyConcepts: {
      en: [
        "Narrative Control: Dictating the story through which people interpret reality.",
        "Emotional Priming: Using fear, anger, or tribal loyalty to bypass rational analysis.",
        "Repetition (The Illusion of Truth): The tendency to believe information after multiple exposures."
      ],
      hi: [
        "कथा नियंत्रण: उस कहानी को निर्देशित करना जिसके माध्यम से लोग वास्तविकता की व्याख्या करते हैं।",
        "भावनात्मक प्राइमिंग: तर्कसंगत विश्लेषण को दरकिनार करने के लिए डर, क्रोध या जनजातीय वफादारी का उपयोग करना।",
        "दोहराव (सत्य का भ्रम): सूचना पर बार-बार विश्वास करने की प्रवृत्ति।"
      ],
      ur: [
        "بیانیہ کنٹرول: اس کہانی کا حکم دینا جس کے ذریعے لوگ حقیقت کی تشریح کرتے ہیں۔",
        "جذباتی پرائمنگ: منطقی تجزیے کو نظرانداز کرنے کے لیے خوف ، غصے یا قبائلی وفاداری کا استعمال۔",
        "تکرار (سچ کا وہم): بار بار سامنے آنے والی معلومات پر یقین کرنے کا رجحان۔"
      ]
    },
    practicalSkills: {
      en: [
        "Deconstruct news headlines for 'loaded' language.",
        "Identify logical fallacies like ad hominem or straw man.",
        "Triangulate information via opposing perspectives."
      ],
      hi: [
        "समाचारों की सुर्खियों में 'लोडेड' भाषा का विघटन करना।",
        "तर्कसंगत दोषों जैसे एड होमिनेम की पहचान करना।",
        "विपरीत दृष्टिकोणों के माध्यम से सूचना का त्रिकोणीयकरण करना।"
      ],
      ur: [
        "نیوز سرخیوں میں 'لوڈڈ' زبان کا تجزیہ کرنا۔",
        "منطقی مغالطوں جیسے اد ہومینم کی شناخت کرنا۔",
        "مخالف نقطہ نظر کے ذریعے معلومات کی تصدیق کرنا۔"
      ]
    },
    commonMisunderstandings: {
      en: [
        "Propaganda is only used by 'bad guys'.",
        "Propaganda is always based on lies (it often uses selected facts).",
        "Intelligence protects you from manipulation."
      ],
      hi: [
        "प्रोपेगैंडा केवल 'बुरे लोग' ही करते हैं।",
        "प्रोपेगैंडा हमेशा झूठ पर आधारित होता है (यह अक्सर चुनिंदा तथ्यों का उपयोग करता है)।",
        "बुद्धिमत्ता आपको हेरफेर से बचाती है।"
      ],
      ur: [
        "پروپیگنڈہ صرف 'برے لوگ' استعمال کرتے ہیں۔",
        "پروپیگنڈہ ہمیشہ جھوٹ پر مبنی ہوتا ہے (یہ اکثر منتخب حقائق استعمال کرتا ہے)۔",
        "ذہانت آپ کو ہیرا پھیری سے بچاتی ہے۔"
      ]
    },
    booksToRead: [
      {
        title: "1984",
        author: "George Orwell",
        quote: {
          en: "The party told you to reject the evidence of your eyes and ears. It was their final, most essential command.",
          hi: "पार्टी ने आपसे अपनी आंखों और कानों के सबूतों को खारिज करने के लिए कहा। यह उनका अंतिम, सबसे आवश्यक आदेश था।",
          ur: "پارٹی نے آپ کو اپنی آنکھوں اور کانوں کے ثبوتوں کو رد کرنے کا حکم دیا۔ یہ ان کا آخری اور سب سے اہم حکم تھا۔"
        }
      },
      { title: "Propaganda", author: "Edward Bernays" },
      { title: "Manufacturing Consent", author: "Noam Chomsky" }
    ],
    mediaReferences: ["Wag the Dog", "The Century of the Self", "The Great Hack"],
    realWorldApplications: {
      en: "Used in election campaigning, corporate branding, and social engineering to ensure public compliance.",
      hi: "सार्वजनिक अनुपालन सुनिश्चित करने के लिए चुनावी प्रचार, कॉर्पोरेट ब्रांडिंग और सोशल इंजीनियरिंग में उपयोग किया जाता है।",
      ur: "عوامی تعمیل کو یقینی بنانے کے لیے انتخابی مہم، کارپوریٹ برانڈنگ اور سوشل انجینئرنگ میں استعمال کیا جاتا ہے۔"
    },
    furtherLearningResources: ["Propaganda Analysis Tools", "Cognitive Bias Documentation"],
    wikipediaLinks: ["https://en.wikipedia.org/wiki/Propaganda", "https://en.wikipedia.org/wiki/Psychological_manipulation"],
    youtubeLinks: [
      { title: "The Art of Misinformation", url: "https://www.youtube.com/results?search_query=how+propaganda+works" },
      { title: "History of Bernays", url: "https://www.youtube.com/results?search_query=edward+bernays+propaganda" }
    ]
  },
  {
    id: "communalism",
    title: {
      en: "Understanding Indian Communalism and Unity",
      hi: "भारतीय सांप्रदायिकता और एकता को समझना",
      ur: "ہندوستانی فرقہ واریت اور اتحاد کو سمجھنا"
    },
    coreIdea: {
      en: "Communalism is the use of religious identity to construct political antagonism, often leading to social fragmentation. Unity is the strategic decision to prioritize shared civic interests over identity-based divides.",
      hi: "सांप्रदायिकता राजनीतिक शत्रुता के निर्माण के लिए धार्मिक पहचान का उपयोग है। एकता साझा नागरिक हितों को प्राथमिकता देने का रणनीतिक निर्णय है।",
      ur: "فرقہ واریت سیاسی دشمنی پیدا کرنے کے لیے مذہبی شناخت کا استعمال ہے، جو اکثر سماجی ٹوٹ پھوٹ کا باعث بنتی ہے۔ اتحاد سے مراد مشترکہ شہری مفادات کو ترجیح دینا ہے۔"
    },
    whyThisMatters: {
      en: "A divided society is easily manipulated by politicians and external interests. Unified civic action is the only way to hold power accountable effectively.",
      hi: "एक विभाजित समाज राजनेताओं और बाहरी हितों द्वारा आसानी से हेरफेर किया जा सकता है। सत्ता को प्रभावी ढंग से जवाबदेह ठहराने का एकमात्र तरीका एकीकृत नागरिक कार्रवाई है।",
      ur: "ایک تقسیم شدہ معاشرے کو سیاستدانوں اور بیرونی مفادات کے ذریعے آسانی سے ورغلا لیا جاتا ہے۔ متحد عوامی عمل ہی طاقت کو جوابدہ بنانے کا واحد طریقہ ہے۔"
    },
    keyConcepts: {
      en: [
        "Divide and Rule: Distracting the public with identity conflicts while systemic issues are ignored.",
        "Social Cohesion: The bonds that keep a diverse society together.",
        "Shared Narrative: Focusing on what we all want (Clean water, dignity, fair wages)."
      ],
      hi: [
        "फूट डालो और राज करो: पहचान संघर्षों के साथ जनता का ध्यान भटकाना जबकि प्रणालीगत मुद्दों को नजरअंदाज किया जाता है।",
        "सामाजिक सामंजस्य: वे बंधन जो एक विविध समाज को एक साथ रखते हैं।",
        "साझा कथा: उस पर ध्यान केंद्रित करना जो हम सभी चाहते हैं (साफ पानी, गरिमा, उचित मजदूरी)।"
      ],
      ur: [
        "تقسیم کرو اور حکومت کرو: عوامی توجہ کو شناخت کے تنازعات کی طرف موڑنا تاکہ بنیادی مسائل کو نظرانداز کیا جا سکے۔",
        "سماجی ہم آہنگی: وہ بندھن جو ایک متنوع معاشرے کو جوڑے رکھتے ہیں۔",
        "مشترکہ بیانیہ: اس بات پر توجہ مرکوز کرنا کہ ہم سب کیا چاہتے ہیں (صاف پانی ، وقار ، منصفانہ اجرت)۔"
      ]
    },
    practicalSkills: {
      en: [
        "Recognize 'Dog-Whistle' politics.",
        "Engage in inter-community dialogue based on material facts.",
        "Form broad-based coalitions for public utility demands."
      ],
      hi: [
        "सांप्रदायिक राजनीति की शब्दावली को पहचानना।",
        "भौतिक तथ्यों के आधार पर अंतर-सामुदायिक संवाद करना।",
        "सार्वजनिक उपयोगिता मांगों के लिए व्यापक गठबंधन बनाना।"
      ],
      ur: [
        "فرقہ واریت پر مبنی سیاست کے اشاروں کو پہچاننا۔",
        "حقائق کی بنیاد پر بین المذاہب مکالمہ کرنا۔",
        "عوامی سہولیات کے مطالبات کے لیے مشترکہ اتحاد بنانا۔"
      ]
    },
    commonMisunderstandings: {
      en: [
        "Communalism is a natural result of faith (it is a modern political construct).",
        "Unity means 'ignoring differences' (it means coordinating despite differences).",
        "Only one community is responsible for friction."
      ],
      hi: [
        "सांप्रदायिकता आस्था का एक स्वाभाविक परिणाम है (यह एक आधुनिक राजनीतिक निर्माण है)।",
        "एकता का अर्थ 'मतभेदों को अनदेखा करना' है (इसका अर्थ मतभेदों के बावजूद समन्वय करना है)।",
        "घर्षण के लिए केवल एक समुदाय जिम्मेदार है।"
      ],
      ur: [
        "فرقہ واریت عقیدے کا قدرتی نتیجہ ہے (یہ ایک جدید سیاسی عمل ہے)۔",
        "اتحاد کا مطلب 'اختلافات کو نظر انداز کرنا' ہے (اس کا مطلب اختلافات کے باوجود تعاون ہے)۔",
        "رگڑ کے لیے صرف ایک طبقہ ذمہ دار ہے۔"
      ]
    },
    booksToRead: [
      {
        title: "The Discovery of India",
        author: "Jawaharlal Nehru",
        quote: {
          en: "Unity is not uniformity; it is the coordination of diverse elements.",
          hi: "एकता एकरूपता नहीं है; यह विविध तत्वों का समन्वय है।",
          ur: "اتحاد یکسانیت نہیں ہے؛ یہ متنوع عناصر کا ہم آہنگ امتزاج ہے۔"
        }
      },
      { title: "Communalism: A Primer", author: "Bipan Chandra" },
      { title: "India After Gandhi", author: "Ramachandra Guha" }
    ],
    mediaReferences: ["Tamas (Book/Mini-series)", "Garam Hawa (Film)", "Bharat Ek Khoj"],
    realWorldApplications: {
      en: "Protecting neighbors during riots; voting for development instead of identity; creating multi-faith volunteer groups.",
      hi: " दंगों के दौरान पड़ोसियों की रक्षा करना; पहचान के बजाय विकास के लिए मतदान करना; बहु-विश्वास स्वयंसेवक समूहों का निर्माण करना।",
      ur: "فسادات کے دوران پڑوسیوں کی حفاظت کرنا؛ شناخت کے بجائے ترقی کے لیے ووٹ دینا؛ بین المذاہب رضاکار گروپ بنانا۔"
    },
    furtherLearningResources: ["History of Indian Secularism", "Analysis of Riot Mechanics"],
    wikipediaLinks: ["https://en.wikipedia.org/wiki/Communalism_(South_Asia)", "https://en.wikipedia.org/wiki/Secularism_in_India"],
    youtubeLinks: [
      { title: "History of Communalism in India", url: "https://www.youtube.com/results?search_query=history+of+communalism+in+india" },
      { title: "Why Unity is Practical", url: "https://www.youtube.com/results?search_query=importance+of+social+unity+india" }
    ]
  },
  {
    id: "health-nutrition",
    title: {
      en: "Health, Nutrition, and Medicinal Plants",
      hi: "स्वास्थ्य, पोषण और औषधीय पौधे",
      ur: "صحت، غذائیت اور ادویاتی پودے"
    },
    coreIdea: {
      en: "Physical sovereignty begins with nutrition. Biological survival depends on a balanced intake of macro-nutrients (Proteins, Carbs, Fats) and micro-nutrients (Minerals, Vitamins), alongside local plant-based medicine.",
      hi: "शारीरिक संप्रभुता पोषण से शुरू होती है। जैविक जीवन मुख्य पोषक तत्वों (प्रोटीन, कार्ब्स, वसा) और सूक्ष्म पोषक तत्वों (खनिज, विटामिन) के संतुलित सेवन पर निर्भर करता है।",
      ur: "جسمانی خودمختاری غذائیت سے شروع ہوتی ہے۔ حیاتیاتی بقا کا انحصار پروٹین ، کاربوہائیڈریٹس اور چکنائی کے متوازن استعمال کے ساتھ معدنیات اور وٹامنز پر ہے۔"
    },
    whyThisMatters: {
      en: "A poorly nourished population is tired, docile, and easily controlled. Understanding nutrition prevents chronic diseases that drain financial resources and physical autonomy.",
      hi: "एक कुपोषित आबादी थकी हुई, विनम्र और आसानी से नियंत्रित होने वाली होती है। पोषण को समझना उन पुरानी बीमारियों से बचाता है जो वित्तीय संसाधनों और शारीरिक स्वायत्तता को खत्म कर देती हैं।",
      ur: "کمزور غذائیت والی آبادی تھکی ہوئی اور آسانی سے قابو میں آ جاتی ہے۔ غذائیت کو سمجھنا ان دائمی بیماریوں سے بچاتا ہے جو مالی وسائل اور جسمانی صحت کو ختم کر دیتی ہیں۔"
    },
    keyConcepts: {
      en: [
        "Protein: Building blocks for muscle and repair (Dal, Paneer, Meat, Soy).",
        "Carbohydrates: Energy fuel (Rice, Wheat, Millets).",
        "Fats: Brain health and hormone regulation (Ghee, Oils, Nuts).",
        "Medicinal Flora: Indigenous plants with chemical properties (Tulsi, Neem, Turmeric)."
      ],
      hi: [
        "प्रोटीन: मांसपेशियों और मरम्मत के लिए बिल्डिंग ब्लॉक्स (दाल, पनीर, मांस, सोया)।",
        "कार्बोहाइड्रेट: ऊर्जा ईंधन (चावल, गेहूं, मोटे अनाज)।",
        "वसा: मस्तिष्क स्वास्थ्य और हार्मोन विनियमन (घी, तेल, नट्स)।",
        "औषधीय वनस्पति: रासायनिक गुणों वाले स्वदेशी पौधे (तुलसी, नीम, हल्दी)।"
      ],
      ur: [
        "پروٹین: پٹھوں کی نمو اور مرمت (دال ، پنیر ، گوشت ، سویا بین)۔",
        "کاربوہائیڈریٹس: توانائی کا ایندھن (چاول ، گندم ، باجرہ)۔",
        "چکنائی: دماغی صحت اور ہارمونز کا توازن (گھی ، تیل ، میوے)۔",
        "ادویاتی پودے: مقامی پودوں کے طبی فوائد (تلسی ، نیم ، ہلدی)۔"
      ]
    },
    practicalSkills: {
      en: [
        "Design a 'Full Meal' (A plate with 25% protein, 25% complex carbs, 50% vegetables).",
        "Identify and preserve medicinal plants like Aloe Vera or Moringa.",
        "Read food labels for hidden sugars and harmful additives."
      ],
      hi: [
        "एक 'पूर्ण भोजन' डिजाइन करना (25% प्रोटीन, 25% कार्बोहाइड्रेट, 50% सब्जियां)।",
        "एलोवेरा या सहजन जैसे औषधीय पौधों की पहचान और संरक्षण करना।",
        "छिपी हुई चीनी के लिए खाद्य लेबल पढ़ना।"
      ],
      ur: [
        "مکمل کھانے کا ڈیزائن (25 فیصد پروٹین ، 25 فیصد کاربوہائیڈریٹس ، 50 فیصد سبزیاں)۔",
        "ایلو ویرا یا سہنجنا جیسے طبی پودوں کی شناخت کرنا۔",
        "کھانے کے لیبلز پر چینی اور نقصان دہ اشیاء کو چیک کرنا۔"
      ]
    },
    commonMisunderstandings: {
      en: [
        "Rice/Wheat alone is a full meal (Missing essential proteins/micronutrients).",
        "Fat is the enemy (Essential for the brain).",
        "Home remedies replace surgery (They are preventative/maintenance, not a bypass for acute medicine)."
      ],
      hi: [
        "केवल चावल/गेहूं ही पूर्ण भोजन है (आवश्यक प्रोटीन की कमी)।",
        "वसा दुश्मन है (मस्तिष्क के लिए आवश्यक)।",
        "घरेलू उपचार सर्जरी की जगह लेते हैं (वे निवारक हैं, वैकल्पिक नहीं)।"
      ],
      ur: [
        "صرف چاول یا گندم مکمل کھانا ہے (اس میں پروٹین کی کمی ہوتی ہے)۔",
        "چکنائی دشمن ہے (دماغ کے لیے اہم ہے)۔",
        "گھریلو ٹوٹکے سرجری کا نعم البدل ہیں (یہ حفاظتی تدابیر ہیں ، متبادل نہیں)۔"
      ]
    },
    booksToRead: [
      {
        title: "The Jungle and the Aroma of Meats",
        author: "Francis Zimmermann",
        quote: {
          en: "Food is the essence of all things.",
          hi: "भोजन ही सब कुछ का सार है।",
          ur: "غذا ہی تمام چیزوں کا جوہر ہے۔"
        }
      },
      { title: "Medicinal Plants of India", author: "C.P. Khare" },
      { title: "How Not to Die", author: "Michael Greger" }
    ],
    mediaReferences: ["Swasth Bharat (Information series)", "Documentaries on Soil Health", "Traditional Indian Medicine Archives"],
    realWorldApplications: {
      en: "Preventing diabetes through fiber; reducing inflammation with Turmeric; ensuring childhood development via protein.",
      hi: "फाइबर के माध्यम से मधुमेह को रोकना; हल्दी के साथ सूजन को कम करना; प्रोटीन के माध्यम से बचपन के विकास को सुनिश्चित करना।",
      ur: "فائبر کے ذریعے ذیابیطس سے بچاؤ؛ ہلدی سے سوزش کا علاج؛ پروٹین سے بچوں کی نشوونما۔"
    },
    furtherLearningResources: ["Human Anatomy Basics", "Ayurvedic Chemistry vs Modern Pharmacology"],
    wikipediaLinks: ["https://en.wikipedia.org/wiki/Nutrition", "https://en.wikipedia.org/wiki/Ethnobotany"],
    youtubeLinks: [
      { title: "Basics of Nutrition", url: "https://www.youtube.com/results?search_query=nutrition+basics+explained" },
      { title: "Medicinal Plants of India", url: "https://www.youtube.com/results?search_query=indian+medicinal+plants+identification" }
    ],
    supplementarySections: [
      {
        title: {
          en: "Vital Micronutrients & Deficiency Guide",
          hi: "महत्वपूर्ण सूक्ष्म पोषक तत्व और कमी गाइड",
          ur: "اہم مائیکرو نیوٹرینٹس اور کمی کی رہنمائی"
        },
        items: {
          en: [
            "Vitamin A: For Vision/Immunity. Deficiency: Night Blindness. RDI: 700-900mcg. Source: Papaya, Carrot, Liver.",
            "Vitamin B12: Nerve function/RBCs. Deficiency: Fatigue, Nerve damage. RDI: 2.4mcg. Source: Dairy, Meat, B12 fortified foods.",
            "Vitamin C: Tissue repair/Immunity. Deficiency: Scurvy, Slow healing. RDI: 75-90mg. Source: Amla, Guava, Citrus.",
            "Vitamin D: Bone health. Deficiency: Rickets, Osteoporosis. RDI: 600 IU. Source: Sunlight, Egg yolk, Mushrooms.",
            "Iron: Oxygen transport. Deficiency: Anemia (Common in India). RDI: 18-27mg. Source: Spinach, Jaggery, Beans.",
            "Iodine: Thyroid function. Deficiency: Goiter. RDI: 150mcg. Source: Iodized salt, Seafood."
          ],
          hi: [
            "विटामिन ए: दृष्टि/प्रतिरक्षा के लिए। कमी: रतौंधी। स्रोत: पपीता, गाजर।",
            "विटामिन बी12: तंत्रिका कार्य/आरबीसी। कमी: थकान, तंत्रिका क्षति। स्रोत: डेयरी, मांस।",
            "विटामिन सी: ऊतक मरम्मत/प्रतिरक्षा। कमी: स्कर्वी। स्रोत: आंवला, अमरूद।",
            "विटामिन डी: हड्डी का स्वास्थ्य। कमी: रिकेट्स। स्रोत: सूर्य का प्रकाश, अंडे की जर्दी।",
            "आयरन: ऑक्सीजन परिवहन। कमी: एनीमिया (भारत में आम)। स्रोत: पालक, गुड़।",
            "आयोडीन: थायराइड कार्य। कमी: घेंगा। स्रोत: आयोडीन युक्त नमक।"
          ],
          ur: [
            "وٹامن اے: بصارت اور قوت مدافعت کے لیے۔ کمی: رات کا اندھا پن۔ ذریعہ: پپیتا، گاجر۔",
            "وٹامن بی 12: اعصابی کام۔ کمی: تھکاوٹ، اعصابی نقصان۔ ذریعہ: دودھ کی مصنوعات، گوشت۔",
            "وٹامن سی: بافتوں کی مرمت۔ کمی: مسوڑھوں کی بیماری۔ ذریعہ: آملہ، امرود۔",
            "وٹامن ڈی: ہڈیوں کی صحت۔ کمی: ہڈیوں کی کمزوری۔ ذریعہ: سورج کی روشنی، انڈے کی زردی۔",
            "آئرن: آکسیجن کی ترسیل۔ کمی: اینیمیا (خون کی کمی)۔ ذریعہ: پالک، گڑ۔",
            "آیوڈین: تھائیرائڈ کا کام۔ کمی: گائٹر (گلھڑ)۔ ذریعہ: آیوڈین والا نمک۔"
          ]
        }
      },
      {
        title: {
          en: "Common Indian Food Allergens & Management",
          hi: "सामान्य भारतीय खाद्य एलर्जी और प्रबंधन",
          ur: "ہندوستانی کھانوں میں عام الرجی اور انتظام"
        },
        items: {
          en: [
            "Wheat/Gluten: Celiac disease or sensitivity. Symptom: Bloating, Skin rashes. Management: Switch to Millets (Jowar, Bajra, Ragi).",
            "Dairy (Lactose): Common in adulthood. Symptom: Gastric distress. Management: Use Coconut milk or fermented curd (Dahi is often tolerated better).",
            "Peanuts/Nuts: Severe respiratory issues. Management: Use Roasted grams (Chana) as alternative.",
            "Soy: Often found in processed 'Veg Meat'. Management: Stick to whole pulses/dals."
          ],
          hi: [
            "गेहूं/ग्लूटेन: सीलिएक रोग या संवेदनशीलता। प्रबंधन: मोटे अनाज (ज्वार, बाजरा, रागी) पर स्विच करें।",
            "डेयरी (लैक्टोज): गैस्ट्रिक संकट। प्रबंधन: नारियल के दूध या किण्वित दही का उपयोग करें।",
            "मूंगफली/नट्स: गंभीर श्वसन संबंधी समस्याएं। प्रबंधन: विकल्प के रूप में भुने हुए चने का उपयोग करें।",
            "सोया: अक्सर प्रोसेस्ड फूड में पाया जाता है। प्रबंधन: साबुत दालों का सेवन करें।"
          ],
          ur: [
            "گندم/گلوٹین: پیٹ پھولنا، جلد کی الرجی۔ انتظام: باجرہ، جوار، راگی کا استعمال کریں۔",
            "دودھ (لیکٹوز): معدے کی خرابی۔ انتظام: ناریل کا دودھ یا دہی کا استعمال کریں۔",
            "مونگ پھلی: سانس کے مسائل۔ انتظام: بھنے ہوئے چنے متبادل کے طور پر استعمال کریں۔",
            "سویا: پروسیسڈ فوڈ میں موجود۔ انتظام: دالوں کا استعمال کریں۔"
          ]
        }
      }
    ]
  },
  {
    id: "national-realities",
    title: {
      en: "Systemic Realities: National Indices",
      hi: "प्रणालीगत वास्तविकताएं: राष्ट्रीय सूचकांक",
      ur: "نظامی حقائق: قومی اشاریے"
    },
    coreIdea: {
      en: "A nation is understood through its numbers, not its rhetoric. Objective indicators of nutrition, wealth distribution, and public utility reveal the structural health of the society.",
      hi: "एक राष्ट्र को उसकी संख्या के माध्यम से समझा जाता है, उसके भाषणों के माध्यम से नहीं। पोषण, धन वितरण और सार्वजनिक उपयोगिता के उद्देश्यपूर्ण संकेतक समाज के संरचनात्मक स्वास्थ्य को प्रकट करते हैं।",
      ur: "کسی بھی قوم کو اس کے اعداد و شمار سے سمجھا جاتا ہے، تقاریر سے نہیں۔ غذائیت، دولت کی تقسیم اور عوامی سہولیات کے اشاریے معاشرے کی اصل حالت بتاتے ہیں۔"
    },
    whyThisMatters: {
      en: "Public discourse is often clouded by emotion. Statistical literacy allow citizens to identify where systemic failure is occurring and prioritize demands based on factual urgency.",
      hi: "सार्वजनिक विमर्श अक्सर भावनाओं से घिरा रहता है। सांख्यिकीय साक्षरता नागरिकों को यह पहचानने की अनुमति देती है कि प्रणालीगत विफलता कहाँ हो रही है।",
      ur: "عوامی گفتگو اکثر جذبات سے مغلوب ہوتی ہے۔ اعداد و شمار کی سمجھ شہریوں کو یہ جاننے میں مدد دیتی ہے کہ نظام کہاں ناکام ہو رہا ہے۔"
    },
    keyConcepts: {
      en: [
        "Hunger Index vs Production: Why stunting exists despite surplus grain.",
        "Wealth Gap (Gini Coefficient): The distance between the highest and lowest earners.",
        "Public Health Expenditure: GDP percentage dedicated to survival vs prestige projects.",
        "Out-of-Pocket Spending: The amount of money individuals pay for essential health despite tax contributions."
      ],
      hi: [
        "हंगर इंडेक्स बनाम उत्पादन: अधिशेष अनाज के बावजूद स्टंटिंग क्यों मौजूद है।",
        "धन की खाई (गिनी गुणांक): उच्चतम और निम्नतम अर्जक के बीच की दूरी।",
        "सार्वजनिक स्वास्थ्य व्यय: उत्तरजीविता बनाम प्रतिष्ठा परियोजनाओं के लिए समर्पित जीडीपी प्रतिशत।",
        "आउट-ऑफ-पॉकेट खर्च: कर योगदान के बावजूद आवश्यक स्वास्थ्य के लिए व्यक्ति द्वारा भुगतान की गई राशि।"
      ],
      ur: [
        "ہنگر انڈیکس بمقابلہ پیداوار: اناج کی وافر مقدار کے باوجود غذائیت کی کمی کیوں ہے؟",
        "دولت کا فرق (Gini Coefficient): امیر اور غریب کے درمیان بڑھتا ہوا فاصلہ۔",
        "صحت پر عوامی اخراجات: غیر ضروری منصوبوں بمقابلہ عوامی صحت پر جی ڈی پی کا خرچ۔",
        "ذاتی جیب سے خرچ: ٹیکس دینے کے باوجود بنیادی صحت کے لیے شہریوں کا اپنا خرچ۔"
      ]
    },
    practicalSkills: {
      en: [
        "Interpret Census and NFHS (National Family Health Survey) data.",
        "Compare regional development indices (Life expectancy, Literacy).",
        "Audit local public service availability (Doctors per 1000, teacher ratios)."
      ],
      hi: [
        "जनगणना और NFHS (राष्ट्रीय परिवार स्वास्थ्य सर्वेक्षण) डेटा की व्याख्या करना।",
        "क्षेत्रीय विकास सूचकांकों (जीवन प्रत्याशा, साक्षरता) की तुलना करना।",
        "स्थानीय सार्वजनिक सेवा उपलब्धता का ऑडिट करना।"
      ],
      ur: [
        "مردم شماری اور NFHS ڈیٹا کا تجزیہ کرنا۔",
        "علاقائی ترقی کے اشاریوں (خواندگی، عمر) کا موازنہ کرنا۔",
        "مقامی سرکاری سہولیات کا جائزہ لینا۔"
      ]
    },
    commonMisunderstandings: {
      en: [
        "GDP growth means everyone is richer (Averages hide extremes).",
        "Poverty is only due to 'laziness' (Systemic barriers often override individual effort).",
        "More infrastructure always equals better life (Quality of maintenance is often ignored)."
      ],
      hi: [
        "जीडीपी वृद्धि का मतलब है कि हर कोई अमीर है (औसत चरम सीमाओं को छुपाता है)।",
        "गरीबी केवल 'आलस्य' के कारण है (प्रणालीगत बाधाएं अक्सर व्यक्तिगत प्रयास को खत्म कर देती हैं)।",
        "अधिक बुनियादी ढांचे का मतलब हमेशा बेहतर जीवन होता है।"
      ],
      ur: [
        "جی ڈی پی میں اضافہ سب کی خوشحالی کا ضامن ہے (اوسط اعداد و شمار حقیقت چھپاتے ہیں)۔",
        "غربت صرف 'سستی' کی وجہ سے ہے (نظامی رکاوٹیں اکثر انفرادی کوششوں پر بھاری پڑتی ہیں)۔",
        "زیادہ انفراسٹرکچر کا مطلب ہمیشہ بہتر زندگی ہے (معیار کو اکثر نظر انداز کیا جاتا ہے)۔"
      ]
    },
    booksToRead: [
      {
        title: "An Uncertain Glory: India and its Contradictions",
        author: "Jean Drèze and Amartya Sen",
        quote: {
          en: "The success of a small section of the population cannot compensate for the neglect of the majority.",
          hi: "आबादी के एक छोटे से हिस्से की सफलता बहुसंख्यक आबादी की उपेक्षा की भरपाई नहीं कर सकती।",
          ur: "آبادی کے ایک چھوٹے سے حصے کی کامیابی اکثریت کی پسماندگی کا مداویٰ نہیں کر سکتی۔"
        }
      },
      { title: "Everybody Loves a Good Drought", author: "P. Sainath" },
      { title: "The Price of Inequality", author: "Joseph Stiglitz" }
    ],
    mediaReferences: ["Rural Reporting Archives", "National Sample Survey Reports", "Comparative Poverty Visualizations"],
    realWorldApplications: {
      en: "Using data to demand local clinic improvements; auditing school fund usage; making informed career choices based on labor trends.",
      hi: "स्थानीय क्लिनिक सुधारों की मांग करने के लिए डेटा का उपयोग करना; स्कूल निधि उपयोग का ऑडिट करना।",
      ur: "ڈیٹا کا استعمال کرتے ہوئے کلینک کی بہتری کا مطالبہ کرنا؛ اسکول کے فنڈز کا آڈٹ کرنا۔"
    },
    furtherLearningResources: ["Global Multidimensional Poverty Index", "Human Development Report Archives"],
    wikipediaLinks: ["https://en.wikipedia.org/wiki/List_of_states_and_union_territories_of_India_by_human_development_index", "https://en.wikipedia.org/wiki/Economic_inequality_in_India"],
    youtubeLinks: [
      { title: "India's Health Infrastructure", url: "https://www.youtube.com/results?search_query=india+public+health+infrastructure+analysis" },
      { title: "Understanding the Gini Coefficient", url: "https://www.youtube.com/results?search_query=gini+coefficient+explained+simply" }
    ]
  },
  {
    id: "ethics-education",
    title: {
      en: "Ethical Foundations: Equality and Education",
      hi: "नैतिक आधार: समानता और शिक्षा",
      ur: "اخلاقی بنیادیں: مساوات اور تعلیم"
    },
    coreIdea: {
      en: "Major religious and philosophical traditions emphasize that education is a sacred duty and equality is the inherent state of the soul. These texts provide a framework for resisting hierarchy and ignorance.",
      hi: "प्रमुख धार्मिक और दार्शनिक परंपराएं इस बात पर जोर देती हैं कि शिक्षा एक पवित्र कर्तव्य है और समानता आत्मा की अंतर्निहित स्थिति है।",
      ur: "بڑے مذہبی اور فلسفیانہ روایات اس بات پر زور دیتے ہیں کہ تعلیم ایک مقدس فریضہ ہے اور مساوات روح کی فطری حالت ہے۔"
    },
    whyThisMatters: {
      en: "Moral clarity provides the strength to resist unjust systems. When education is framed as a spiritual mandate, it becomes impossible for any authority to deny it to a population.",
      hi: "नैतिक स्पष्टता अन्यायपूर्ण प्रणालियों का विरोध करने की शक्ति प्रदान करती है। जब शिक्षा को धार्मिक आदेश माना जाता है, तो किसी भी सत्ता के लिए इसे मना करना असंभव हो जाता है।",
      ur: "اخلاقی وضاحت غیر منصفانہ نظاموں کے خلاف مزاحمت کی طاقت دیتی ہے۔ جب تعلیم کو مذہبی فریضہ سمجھا جائے تو کوئی طاقت اسے چھین نہیں سکتی۔"
    },
    keyConcepts: {
      en: [
        "Bhagavad Gita: The concept of Same-Sightedness (Samadarsinah)—seeing the same soul in all beings.",
        "Quran: The first word revealed was 'Iqra' (Read)—making knowledge an obligation for every believer.",
        "Bible: The truth as a liberating force (The truth shall set you free).",
        "Sikhism: The concept of 'Sangat' and 'Pangat'—erasing social hierarchy through shared space and food."
      ],
      hi: [
        "भगवद गीता: समदर्शिता (समदर्शिनः) की अवधारणा—सभी प्राणियों में एक ही आत्मा को देखना।",
        "कुरान: पहली वही 'इकरा' (पढ़ो) थी—ज्ञान को हर विश्वासी के लिए अनिवार्य बनाना।",
        "बाइबल: सत्य एक मुक्त करने वाली शक्ति के रूप में।",
        "सिख धर्म: 'संगत' और 'पंगत' की अवधारणा—साझा स्थान और भोजन के माध्यम से सामाजिक पदानुक्रम को मिटाना।"
      ],
      ur: [
        "بھگوت گیتا: 'سمدرشنا' کا تصور—تمام جانداروں میں ایک ہی روح کو دیکھنا۔",
        "قرآن: سب سے پہلا لفظ 'اقرا' (پڑھو) نازل ہوا—علم کو ہر مومن پر فرض قرار دینا۔",
        "بائبل: سچائی ایک آزاد کرنے والی قوت کے طور پر۔",
        "سکھ ازم: 'سنگت' اور 'پنگت' کا تصور—سانجھے دسترخوان سے معاشرتی فرق کو ختم کرنا۔"
      ]
    },
    practicalSkills: {
      en: [
        "Synthesize universal values across different traditions.",
        "Use ethical frameworks to evaluate government policy.",
        "Practice non-discriminatory social engagement."
      ],
      hi: [
        "विभिन्न परंपराओं में सार्वभौमिक मूल्यों का संश्लेषण करना।",
        "सरकारी नीति का मूल्यांकन करने के लिए नैतिक ढांचे का उपयोग करना।",
        "गैर-भेदभावपूर्ण सामाजिक जुड़ाव का अभ्यास करना।"
      ],
      ur: [
        "مختلف روایات کے عالمگیر اقدار کا نچوڑ نکالنا۔",
        "حکومتی پالیسیوں کو اخلاقی پیمانے پر پرکھنا۔",
        "غیر امتیازی سماجی رویوں کو اپنانا۔"
      ]
    },
    commonMisunderstandings: {
      en: [
        "Religion is only about rituals (It is primarily about conduct/ethics).",
        "Tradition is anti-rational (Many traditions established the first universities/scientific methods).",
        "Equality is a 'Western' concept (It is found in the core of most Eastern spiritualities)."
      ],
      hi: [
        "धर्म केवल कर्मकांडों के बारे में है (यह मुख्य रूप से आचरण/नैतिकता के बारे में है)।",
        "परंपरा तर्क-विरोधी है (कई परंपराओं ने पहले विश्वविद्यालय स्थापित किए)।",
        "समानता एक 'पश्चिमी' अवधारणा है।"
      ],
      ur: [
        "مذہب صرف رسومات کا نام ہے (یہ بنیادی طور پر اخلاق کے بارے میں ہے)۔",
        "روایات عقل کے خلاف ہیں (کئی روایات نے پہلی یونیورسٹیاں اور سائنسی طریقے ایجاد کیے)۔",
        "مساوات ایک 'مغربی' تصور ہے (یہ زیادہ تر مشرقی روحانیت کے مرکز میں موجود ہے)۔"
      ]
    },
    booksToRead: [
      {
        title: "The Bhagavad Gita",
        author: "Anonymous",
        quote: {
          en: "The humble sages, by virtue of true knowledge, see with equal vision a learned and gentle brahmana, a cow, an elephant, a dog and a dog-eater.",
          hi: "विनम्र ऋषि, सच्चे ज्ञान के गुण से, एक विद्वान ब्राह्मण, गाय, हाथी, कुत्ते और अछूत में समान दृष्टि से देखते हैं।",
          ur: "عاجز دانشور، سچے علم کی بدولت، ایک عالم، گائے، ہاتھی اور کتے کو یکساں نظر سے دیکھتے ہیں۔"
        }
      },
      { title: "Spirit of Islam", author: "Syed Ameer Ali" },
      { title: "Annihilation of Caste", author: "B.R. Ambedkar" }
    ],
    mediaReferences: ["Comparative Religion Lectures", "Sufi & Bhakti Poetry", "History of Education in Ancient India"],
    realWorldApplications: {
      en: "Defending the right to education; building schools; fighting discrimination in housing or employment.",
      hi: "शिक्षा के अधिकार की रक्षा करना; स्कूल बनाना; आवास या रोजगार में भेदभाव के खिलाफ लड़ना।",
      ur: "تعلیمی حقوق کا تحفظ؛ اسکول بنانا؛ روزگار اور رہائش میں امتیازی سلوک کے خلاف لڑنا۔"
    },
    furtherLearningResources: ["Universal Declaration of Human Rights vs Spiritual Claims", "History of the Bhakti Movement"],
    wikipediaLinks: ["https://en.wikipedia.org/wiki/Equal_opportunity", "https://en.wikipedia.org/wiki/Right_to_Education_Act"],
    youtubeLinks: [
      { title: "Ethics in World Religions", url: "https://www.youtube.com/results?search_query=common+ethics+in+world+religions" },
      { title: "Ambedkar on Equality", url: "https://www.youtube.com/results?search_query=ambedkar+on+equality+and+religion" }
    ]
  },
  {
    id: "civic-responsibility",
    title: {
      en: "Civic Sense and Government Accountability",
      hi: "नागरिक बोध और सरकार की जवाबदेही",
      ur: "شہری شعور اور حکومتی جوابدہی"
    },
    coreIdea: {
      en: "Citizenship is an active office, not a passive status. Civic sense involves the daily practice of public responsibility, while accountability ensures the state serves the constituent, not the reverse.",
      hi: "नागरिकता एक सक्रिय कार्यालय है, निष्क्रिय स्थिति नहीं। नागरिक बोध में सार्वजनिक जिम्मेदारी का अभ्यास शामिल है।",
      ur: "شہریت ایک فعال عہدہ ہے، محض ایک حیثیت نہیں۔ شہری شعور میں عوامی ذمہ داری کا روزانہ استعمال شامل ہے۔"
    },
    whyThisMatters: {
      en: "Without active citizens, democracy becomes a hollow theater for elites. Holding government accountable prevents corruption and ensures public resources (Tax money) are used for public good.",
      hi: "सक्रिय नागरिकों के बिना, लोकतंत्र विशिष्ट वर्ग के लिए एक खोखला थिएटर बन जाता है। सरकार को जवाबदेह ठहराना भ्रष्टाचार को रोकता है।",
      ur: "فعال شہریوں کے بغیر جمہوریت ایلیٹ طبقے کا تماشہ بن جاتی ہے۔ حکومت کو جوابدہ بنانے سے بدعنوانی رکتی ہے۔"
    },
    keyConcepts: {
      en: [
        "Public Space Etiquette: Cleanliness, noise control, and respect for shared infrastructure.",
        "Right to Information (RTI): The legal power to ask the government where the money went.",
        "Separation of Powers: Ensuring no single branch of government becomes absolute.",
        "Constitutional Literacy: Understanding the 'Rules of the Game' for the nation."
      ],
      hi: [
        "सार्वजनिक स्थान शिष्टाचार: स्वच्छता, शोर नियंत्रण और साझा बुनियादी ढांचे का सम्मान।",
        "सूचना का अधिकार (RTI): सरकार से पूछने की कानूनी शक्ति कि पैसा कहाँ गया।",
        "शक्तियों का पृथक्करण: यह सुनिश्चित करना कि सरकार की कोई भी शाखा पूर्ण न हो जाए।",
        "संवैधानिक साक्षरता: राष्ट्र के लिए 'खेल के नियमों' को समझना।"
      ],
      ur: [
        "عوامی مقامات کے آداب: صفائی، شور پر قابو اور مشترکہ املاک کا احترام۔",
        "حق معلومات (RTI): حکومت سے پوچھنے کی قانونی طاقت کہ پیسہ کہاں گیا۔",
        "اختیارات کی تقسیم: یہ یقینی بنانا کہ حکومت کا کوئی ایک شعبہ مطلق العنان نہ بن جائے۔",
        "آئینی خواندگی: قوم کے 'اصولوں' کو سمجھنا۔"
      ]
    },
    practicalSkills: {
      en: [
        "File an RTI request.",
        "Organize local community boards for sanitation or road repair.",
        "Deconstruct a government budget report."
      ],
      hi: [
        "एक आरटीआई (RTI) अनुरोध दायर करना।",
        "स्वच्छता या सड़क मरम्मत के लिए स्थानीय सामुदायिक बोर्डों को व्यवस्थित करना।",
        "सरकारी बजट रिपोर्ट का विश्लेषण करना।"
      ],
      ur: [
        "آر ٹی آئی (RTI) کی درخواست دائر کرنا۔",
        "مقامی سطح پر صفائی یا سڑکوں کی مرمت کے لیے کمیٹیاں بنانا۔",
        "حکومتی بجٹ کا تجزیہ کرنا۔"
      ]
    },
    commonMisunderstandings: {
      en: [
        "Complaining is the same as civic action (Action requires organized demand).",
        "Government is the 'master' (The citizen is the employer via taxes).",
        "Civic sense is just about littering (It is about the entire stewardship of society)."
      ],
      hi: [
        "शिकायत करना नागरिक कार्रवाई के समान है (कार्रवाई के लिए संगठित मांग की आवश्यकता होती है)।",
        "सरकार 'मालिक' है (नागरिक करों के माध्यम से नियोक्ता है)।",
        "नागरिक बोध केवल कूड़ा फैलाने के बारे में है।"
      ],
      ur: [
        "شکایت کرنا عوامی عمل کے برابر ہے (عمل کے لیے منظم مطالبہ ضروری ہے)۔",
        "حکومت 'مالک' ہے (شہری ٹیکس کے ذریعے اصل مالک ہے)۔",
        "شہری شعور صرف گندگی نہ پھیلانے تک محدود ہے (یہ معاشرے کی مکمل ذمہ داری کا نام ہے)۔"
      ]
    },
    booksToRead: [
      {
        title: "The Constitution of India",
        author: "Preamble Committee",
        quote: {
          en: "WE, THE PEOPLE OF INDIA... do hereby adopt, enact and give to ourselves this constitution.",
          hi: "हम, भारत के लोग... इसके द्वारा इस संविधान को अपनाते हैं, अधिनियमित करते हैं और स्वयं को समर्पित करते हैं।",
          ur: "ہم، بھارت کے لوگ... اس دستور کو اختیار کرتے ہیں، وضع کرتے ہیں اور اپنے آپ پر نافذ کرتے ہیں۔"
        }
      },
      { title: "Poor Economics", author: "Abhijit Banerjee & Esther Duflo" },
      { title: "Against the Grain", author: "James C. Scott" }
    ],
    mediaReferences: ["Satyamev Jayate (TV Series)", "Civic duty documentaries", "Local Govt awareness workshops"],
    realWorldApplications: {
      en: "Reducing local corruption; improving street lighting; auditing public works projects.",
      hi: "स्थानीय भ्रष्टाचार को कम करना; स्ट्रीट लाइटिंग में सुधार; सार्वजनिक निर्माण परियोजनाओं का ऑडिट करना।",
      ur: "مقامی بدعنوانی کا خاتمہ؛ اسٹریٹ لائٹس کی بہتری؛ سرکاری منصوبوں کا آڈٹ کرنا۔"
    },
    furtherLearningResources: ["How to file an RTI in India", "Basics of Municipal Law"],
    wikipediaLinks: ["https://en.wikipedia.org/wiki/Constitution_of_India", "https://en.wikipedia.org/wiki/Right_to_Information_Act,_2005"],
    youtubeLinks: [
      { title: "How Indian Government Works", url: "https://www.youtube.com/results?search_query=how+indian+government+works+simply+explained" },
      { title: "RTI guide for beginners", url: "https://www.youtube.com/results?search_query=how+to+file+rti+in+india+step+by+step" }
    ]
  }
];
