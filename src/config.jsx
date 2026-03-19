// ─── THEMES (uncomment one) ────────────────────────────────────────────────
export const THEME_ORIGINAL  = { bg: '#F5F0EB', text: '#1A1A1A', panelBg: '#EDE8E3', panelText: '#1A1A1A' };
export const THEME_SWAPPED   = { bg: '#1A1A1A', text: '#F5F0EB', panelBg: '#F5F0EB', panelText: '#1A1A1A' };
export const THEME_DARK_SAND = { bg: '#F5F0EB', text: '#1A1A1A', panelBg: '#D5CFC8', panelText: '#1A1A1A' };

// ─── CONFIG ──────────────────────────────────────────────────────────────────
export const CONFIG = {
  name: 'Jae Kim',
  role: 'AIML',
  bio: 'I develop software & systems with human thought.',
  projects: [
    { title: 'About Me', tags: [], content: <>Hi 👋 I'm Jae. {"\n"}Born in <strong>Seoul, South Korea</strong> 🇰🇷{"\n"}Raised in the US 🇺🇸, China 🇨🇳, and UK 🇬🇧 {"\n\n"}<strong>University of California, San Diego</strong> 🔱 {"\n"}<strong>B.S. Cognitive Science, specializing in Machine Learning and Neural Computation</strong> {"\n\n"}Growing up as a TCK has enabled me to think and communicate across perspectives. {"\n"}I studied Cognitive Science because I wanted to bridge the gap between how humans think {"\n"} and how machines learn, bringing a human touch to the way AI is built and applied. {"\n\n"} Also a proud alum of...{"\n"} Seoul Foreign School {"\n"}Shanghai American School {"\n"}International School of Beijing</> },
    { title: 'Experience', tags: [], timeline: [
      { role: 'Data Science Intern', org: 'GenON', date: '2023/07 ~ 2023/09', description: 'Contributed to developing two on-premise LLM solutions: \n Financial document summarization system for Woori Bank w/RAG \n Personalized recommendation assistant for GoodChoice \n\nA key challenge I tackled was reducing hallucinations in LLM outputs through systematic testing and iteration.' },
      { role: 'Management Intern', org: 'Hotel Shilla', date: '2021/07 ~ 2021/08', description: 'Contributed to the launch preparation of Shilla Monogram Da Nang, coordinating translation of operational documentation across languages and teams.' },
      { role: 'Military Service', org: 'Ministry of Employment and Labor', date: '2020/09 ~ 2022/04', description: 'Underwent military service at the Ministry of Employment and Labor. Studied independently, turning a mandatory chapter into a period of real self-directed growth.' },
      { role: 'Intern', org: 'Code:Wings', date: '2020/07 ~ 2020/08', description: 'Optimized instructional content at Code:Wings, Korea\'s first online software education platform.' },
      { role: 'UX Intern', org: 'Learnsesh', date: '2019/11 ~ 2020/04', description: 'Supported UX and market research at Learnsesh, an XR-based education startup in San Diego.' },
    ]},
    { title: 'Fun little facts', tags: [], cards: [
      { suit: '♠', fact: 'I used to swim competitively, my fastest 50m breaststroke is 29.95 seconds' },
      { suit: '♦', fact: 'I have a toy poodle that had too much baby formula which made his bones and joints very strong even at 15 years of age :)' },
      { suit: '♣', fact: 'My favorite novel series are the Jim Butcher series' },
      { suit: '♥', fact: 'I visited 16 countries before turning 18' },
      { suit: '♠', fact: 'I successfully predicted that DRX would win Worlds 22 from the start and was top 100 on the pickem leaderboards :P' },
    ]},
  ],
  contact: [
    { label: 'GitHub', url: 'https://github.com/hazyy00?tab=repositories' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jae-kim-763a9b157/' },
    { label: 'Email', email: 'minjaekim1109@gmail.com' },
  ],
  theme: THEME_SWAPPED, // ← change to THEME_ORIGINAL, THEME_SWAPPED, or THEME_DARK_SAND
};
