export type PhilosopherId = "kant" | "nietzsche" | "descartes" | "aristotle";

export type Philosopher = {
  id: PhilosopherId;
  name: string;
  title: string;
  icon: string;
  theme: string;
  hp: number;
  stats: {
    logic: number;
    influence: number;
    creativity: number;
    rebellion: number;
  };
  moves: string[];
};

export type BattleRound = {
  enemyAttack: string;
  attackText: string;
  correctMove: string;
  playerMoves: string[];
  successText: string;
  failText: string;
};

export const philosophers: Record<PhilosopherId, Philosopher> = {
  kant: {
    id: "kant",
    name: "Immanuel Kant",
    title: "Master of Reason",
    icon: "⚖️",
    theme: "from-emerald-400 via-green-500 to-lime-500",
    hp: 35,
    stats: { logic: 10, influence: 8, creativity: 4, rebellion: 2 },
    moves: ["Universal Law", "Pure Reason", "Moral Shield"],
  },
  nietzsche: {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    title: "The Rebel Thinker",
    icon: "⚡",
    theme: "from-emerald-500 via-green-600 to-lime-600",
    hp: 35,
    stats: { logic: 7, influence: 10, creativity: 9, rebellion: 10 },
    moves: ["Will to Power", "Break Morality", "Chaos Strike"],
  },
  descartes: {
    id: "descartes",
    name: "René Descartes",
    title: "The Doubter",
    icon: "💭",
    theme: "from-teal-400 via-emerald-500 to-green-600",
    hp: 35,
    stats: { logic: 9, influence: 8, creativity: 6, rebellion: 5 },
    moves: ["Radical Doubt", "Cogito Shield", "Certainty Strike"],
  },
  aristotle: {
    id: "aristotle",
    name: "Aristotle",
    title: "The Classifier",
    icon: "🏛️",
    theme: "from-lime-300 via-green-500 to-emerald-600",
    hp: 35,
    stats: { logic: 10, influence: 9, creativity: 6, rebellion: 2 },
    moves: ["Golden Mean", "Logic Chain", "Category Lock"],
  },
};

export const battleRounds: BattleRound[] = [
  {
    enemyAttack: "Nietzsche uses Break Morality",
    attackText:
      "Universal rules are weak. True power comes from creating your own values.",
    correctMove: "Universal Law",
    playerMoves: ["Universal Law", "Radical Doubt", "Golden Mean"],
    successText:
      "Universal Law blocks the attack by defending morality through reason.",
    failText:
      "Nietzsche breaks through your defence and strikes with Will to Power.",
  },
  {
    enemyAttack: "Nietzsche uses Chaos Strike",
    attackText:
      "Truth is only a perspective. There is no single stable certainty.",
    correctMove: "Radical Doubt",
    playerMoves: ["Pure Reason", "Radical Doubt", "Moral Shield"],
    successText:
      "Radical Doubt counters the attack by questioning everything first.",
    failText:
      "The chaos overwhelms your argument and damages your mind shield.",
  },
  {
    enemyAttack: "Nietzsche uses Will to Power",
    attackText:
      "Balance is weakness. The strongest mind should dominate the debate.",
    correctMove: "Golden Mean",
    playerMoves: ["Golden Mean", "Universal Law", "Certainty Strike"],
    successText:
      "Golden Mean counters domination by restoring balance and control.",
    failText:
      "Nietzsche overpowers your argument with raw rebellion.",
  },
];