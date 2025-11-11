// Je kunt titels, hints, en verhaaltjes hier aanpassen.
window.LEVELS = [
  {
    gridSize: 3,
    start: { r: 2, c: 0 },
    goal:  { r: 0, c: 2 },
    obstacles: [{ r: 1, c: 1 }],
    maxSteps: 4,
    story: { title: "Level 1: Opstarten", text: "Ik ben Lina, developer. Jij bedenkt het plan, mijn robot voert het uit." },
  },
  {
    gridSize: 3,
    start: { r: 2, c: 0 },
    goal:  { r: 0, c: 2 },
    obstacles: [{ r: 1, c: 0 }, { r: 1, c: 1 }],
    maxSteps: 5,
    story: { title: "Level 2: Debuggen", text: "Obstakels horen erbij. We passen het plan aan en testen opnieuw." },
  },
  {
    gridSize: 4,
    start: { r: 3, c: 0 },
    goal:  { r: 0, c: 3 },
    obstacles: [{ r: 2, c: 1 }, { r: 1, c: 2 }, { r: 2, c: 2 }],
    maxSteps: 6,
    story: { title: "Level 3: Flow", text: "Je denkt nu écht in stappen. Dit is programmeren zonder code." },
  },
];

// Intro-zinnen van Lina (wisselen automatisch)
window.INTRO_LINES = [
  "Hé, jij daar. Jij lijkt me slim genoeg om dit te fixen! Mijn robot werkt… bijna. Maar mijn code zit vast.",

];
