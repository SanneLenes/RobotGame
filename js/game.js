(function () {
  const DIRS = [
    { icon: "↑", label: "Omhoog", vec: { r: -1, c: 0 } },
    { icon: "→", label: "Rechts", vec: { r: 0, c: 1 } },
    { icon: "↓", label: "Omlaag", vec: { r: 1, c: 0 } },
    { icon: "←", label: "Links", vec: { r: 0, c: -1 } },
  ];

  // DOM refs
  const levelLabel = document.getElementById("levelLabel");
  const messageEl = document.getElementById("message");
  const stepsLabel = document.getElementById("stepsLabel");
  const board = document.getElementById("board");
  const controls = document.getElementById("controls");
  const plan = document.getElementById("plan");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const nextBtn = document.getElementById("nextBtn");
  const storyTitle = document.getElementById("storyTitle");
  const storyText = document.getElementById("storyText");
  //const hint = document.getElementById("hint");
  const confetti = document.getElementById("confetti");
  const intro = document.getElementById("intro");
  const outro = document.getElementById("outro");
  const closeOutroBtn = document.getElementById("closeOutroBtn");
  const muteBtn = document.getElementById("muteBtn");
  const introLine = document.getElementById("introLine");

  // State
  let levelIndex = 0;
  let robot = { r: window.LEVELS[0].start.r, c: window.LEVELS[0].start.c };
  let queue = [];
  let isRunning = false;
  let won = false;
  let collide = false;

  // Helpers
  const inside = (r, c, size) => r >= 0 && c >= 0 && r < size && c < size;
  const isObstacle = (r, c, obstacles) => obstacles.some((o) => o.r === r && o.c === c);
  const setMessage = (t) => (messageEl.textContent = t);
  const setStepsLabel = () => (stepsLabel.textContent = `Stappen: ${queue.length}/${window.LEVELS[levelIndex].maxSteps}`);

  function setPlan() {
    const icons = queue.map((d) => d.icon).join(" ");
    const chips = icons
      ? icons.split(" ").map((ic) => `<span class="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">${ic}</span>`).join("")
      : '<em class="text-slate-400">(voeg stappen toe)</em>';
    plan.innerHTML = `Jouw plan: <span class="ml-2 inline-flex gap-1">${chips}</span>`;
  }

  function renderBoard() {
    const lvl = window.LEVELS[levelIndex];
    board.style.gridTemplateColumns = `repeat(${lvl.gridSize}, minmax(0, 1fr))`;
    board.style.gridTemplateRows = `repeat(${lvl.gridSize}, minmax(0, 1fr))`;
    board.innerHTML = "";
    for (let r = 0; r < lvl.gridSize; r++) {
      for (let c = 0; c < lvl.gridSize; c++) {
        const cell = document.createElement("div");
        cell.className = "relative rounded-lg bg-white border border-slate-200 overflow-hidden";
        const deco = document.createElement("div");
        deco.className = "absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[length:8px_8px]";
        cell.appendChild(deco);

        if (lvl.goal.r === r && lvl.goal.c === c) {
          const star = document.createElement("span");
          star.className = "absolute inset-0 grid place-items-center text-amber-500 text-2xl";
          star.textContent = "★";
          cell.appendChild(star);
        }
        if (isObstacle(r, c, lvl.obstacles)) {
          const block = document.createElement("span");
          block.className = "absolute inset-0 grid place-items-center text-rose-400 text-xl";
          block.textContent = "⛔";
          cell.appendChild(block);
        }
        if (robot.r === r && robot.c === c) {
          const rb = document.createElement("span");
          rb.className = `absolute inset-0 grid place-items-center text-cyan-700 text-2xl ${collide ? "shake" : "animate-pop"}`;
          rb.textContent = "🤖";
          cell.appendChild(rb);
        }
        board.appendChild(cell);
      }
    }
  }

  function renderUI() {
    const lvl = window.LEVELS[levelIndex];
    levelLabel.textContent = `level ${levelIndex + 1} van ${window.LEVELS.length}`;
    storyTitle.textContent = lvl.story.title;
    storyText.textContent = lvl.story.text;
    //hint.textContent = lvl.hint;
    setStepsLabel();
    setPlan();
    renderBoard();
    nextBtn.textContent = levelIndex === window.LEVELS.length - 1 ? "Afronden" : "Volgende level";
    nextBtn.classList.toggle("hidden", !won);
  }

  function burstConfetti() {
    confetti.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const dot = document.createElement("span");
      dot.className = "absolute w-2 h-2 rounded-full bg-amber-400";
      dot.style.top = `${50 + (Math.random() * 40 - 20)}%`;
      dot.style.left = `${50 + (Math.random() * 40 - 20)}%`;
      dot.style.animation = `float 900ms ease-in-out ${(i % 15) * 40}ms both`;
      confetti.appendChild(dot);
    }
    setTimeout(() => (confetti.innerHTML = ""), 1200);
  }

  function resetLevelState() {
    const lvl = window.LEVELS[levelIndex];
    robot = { r: lvl.start.r, c: lvl.start.c };
    queue = [];
    isRunning = false;
    won = false;
    collide = false;
    setMessage("Stuur de robot naar de ster ✨");
    renderUI();
  }

  // Controls
  function dirBtn(icon, label, vec) {
    const b = document.createElement("button");
    b.className = "px-4 py-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 font-semibold shadow-sm hover:bg-cyan-100 disabled:opacity-50";
    b.title = label; b.setAttribute("aria-label", label); b.textContent = icon;
    b.addEventListener("click", () => {
      window.SFX.click();
      if (isRunning || won) return;
      if (queue.length >= window.LEVELS[levelIndex].maxSteps) return;
      queue.push({ icon, vec });
      setStepsLabel(); setPlan();
    });
    return b;
  }

  function setupControls() {
    controls.innerHTML = "";
    controls.append(
      dirBtn("↑", "Omhoog", { r: -1, c: 0 }),
      dirBtn("→", "Rechts", { r: 0, c: 1 }),
      dirBtn("↓", "Omlaag", { r: 1, c: 0 }),
      dirBtn("←", "Links", { r: 0, c: -1 }),
    );

    resetBtn.onclick = () => { window.SFX.click(); resetLevelState(); };
    startBtn.onclick = runQueue;
    nextBtn.onclick = () => {
      window.SFX.click();
      if (levelIndex < window.LEVELS.length - 1) { levelIndex++; resetLevelState(); }
      else { outro.classList.remove("hidden"); }
    };
  }

  async function runQueue() {
    if (isRunning || won || queue.length === 0) return;
    window.SFX.click();
    isRunning = true;
    setMessage("Uitvoeren…");
    const lvl = window.LEVELS[levelIndex];
    let pos = { ...robot };

    for (let i = 0; i < queue.length; i++) {
      const step = queue[i];
      await new Promise((r) => setTimeout(r, 420));
      const nr = pos.r + step.vec.r;
      const nc = pos.c + step.vec.c;
      if (!inside(nr, nc, lvl.gridSize) || isObstacle(nr, nc, lvl.obstacles)) {
        collide = true; renderBoard(); window.SFX.collide();
        setTimeout(() => { collide = false; renderBoard(); }, 300);
        continue;
      }
      pos = { r: nr, c: nc }; robot = pos; renderBoard(); window.SFX.move();
    }

    await new Promise((r) => setTimeout(r, 160));
    const reached = pos.r === lvl.goal.r && pos.c === lvl.goal.c;
    if (reached) {
      won = true;
      setMessage("Missie geslaagd – jij dacht als een coder! 🎉");
      window.SFX.win();
      burstConfetti();
      nextBtn.classList.remove("hidden");
    } else {
      setMessage("Bijna! Pas je stappen aan en probeer opnieuw.");
    }
    isRunning = false;
  }

  // Intro lines loop
  (function rotateIntro() {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % window.INTRO_LINES.length;
      introLine.textContent = window.INTRO_LINES[i];
    }, 2500);
  })();

  // start intro
  document.getElementById("startIntroBtn").onclick = () => {
    window.SFX.click();
    intro.classList.add("hidden");
    window.SFX.enable(); // activeer audio na 1e klik
  };

  // outro close
  document.getElementById("closeOutroBtn").onclick = () => {
    window.SFX.click();
    outro.classList.add("hidden");
  };

  // mute toggle
  muteBtn.onclick = () => {
    window.SFX.toggle();
    muteBtn.textContent = window.SFX.isMuted() ? "🔇" : "🔊";
    if (!window.SFX.isMuted()) window.SFX.click();
  };

  // init
  setupControls();
  resetLevelState();
})();
