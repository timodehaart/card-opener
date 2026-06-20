export type Connector = "triangle" | "square" | "wave" | "fracture";
export type Domain = "Philosophy" | "Science" | "Art";

export type ChallengeCardData = {
  id: string;
  name: string;
  domain: Domain;
  meaning: string;
  hiddenClue: string;
  symbol: string;
  connector: Connector;
  connectorMeaning: string;
  tags: string[];
  gradient: string;
};

export const cards: ChallengeCardData[] = [
  {
    id: "kant",
    name: "Kant",
    domain: "Philosophy",
    meaning: "Reason & Ethics",
    hiddenClue: "Believes reason can guide moral truth.",
    symbol: "△",
    connector: "triangle",
    connectorMeaning: "Reason",
    tags: ["Reason", "Truth", "Ethics"],
    gradient: "from-amber-300 via-orange-400 to-yellow-600",
  },
  {
    id: "descartes",
    name: "Descartes",
    domain: "Philosophy",
    meaning: "Doubt & Knowledge",
    hiddenClue: "Questions everything to find certainty.",
    symbol: "◇",
    connector: "triangle",
    connectorMeaning: "Reason",
    tags: ["Reason", "Truth", "Knowledge"],
    gradient: "from-blue-300 via-indigo-500 to-purple-700",
  },
  {
    id: "einstein",
    name: "Einstein",
    domain: "Science",
    meaning: "Reality & Relativity",
    hiddenClue: "Changes how we understand space and time.",
    symbol: "□",
    connector: "square",
    connectorMeaning: "System",
    tags: ["Reality", "Time", "Science"],
    gradient: "from-cyan-300 via-blue-500 to-indigo-700",
  },
  {
    id: "curie",
    name: "Curie",
    domain: "Science",
    meaning: "Matter & Discovery",
    hiddenClue: "Reveals hidden forces inside matter.",
    symbol: "✦",
    connector: "square",
    connectorMeaning: "System",
    tags: ["Discovery", "Matter", "Science"],
    gradient: "from-emerald-300 via-teal-500 to-cyan-700",
  },
  {
    id: "vangogh",
    name: "Van Gogh",
    domain: "Art",
    meaning: "Emotion & Perception",
    hiddenClue: "Turns emotion into visual experience.",
    symbol: "◌",
    connector: "wave",
    connectorMeaning: "Creativity",
    tags: ["Emotion", "Perception", "Art"],
    gradient: "from-pink-300 via-orange-400 to-rose-600",
  },
  {
    id: "davinci",
    name: "Da Vinci",
    domain: "Art",
    meaning: "Creation & Observation",
    hiddenClue: "Combines art science and invention.",
    symbol: "✎",
    connector: "wave",
    connectorMeaning: "Creativity",
    tags: ["Creation", "Observation", "Art"],
    gradient: "from-lime-300 via-emerald-400 to-teal-700",
  },
  {
    id: "nietzsche",
    name: "Nietzsche",
    domain: "Philosophy",
    meaning: "Conflict & Perspective",
    hiddenClue: "Challenges traditional morality and truth.",
    symbol: "⚡",
    connector: "fracture",
    connectorMeaning: "Conflict",
    tags: ["Conflict", "Morality", "Perspective"],
    gradient: "from-red-400 via-rose-600 to-red-900",
  },
  {
    id: "aristotle",
    name: "Aristotle",
    domain: "Philosophy",
    meaning: "Logic & Classification",
    hiddenClue: "Structures knowledge through categories.",
    symbol: "⬡",
    connector: "triangle",
    connectorMeaning: "Reason",
    tags: ["Logic", "Knowledge", "Reason"],
    gradient: "from-violet-300 via-purple-500 to-indigo-800",
  },
];

export const dailyChallenge = {
  title: "Daily Thought Lock",
  mission: "Find the Reason + Truth connection",
  mystery:
    "Find two thinkers who both connect to Reason and Truth. Their shapes give you an extra clue.",
  shapeGoal: "triangle",
  targetTags: ["Reason", "Truth"],
  correctPair: ["kant", "descartes"],
  maxAttempts: 3,
  baseReward: 100,
  hintCost: 15,
  streak: 12,
  points: 320,
  weeklyProgress: 3,
  weeklyGoal: 5,
};