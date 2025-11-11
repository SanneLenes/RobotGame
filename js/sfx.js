(function () {
  let audioCtx = null;
  let muted = false;

  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function tone(freq = 440, dur = 0.12, type = "sine", gainVal = 0.03) {
    if (muted) return;
    ensureAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = gainVal;
    o.connect(g).connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    o.start(now); o.stop(now + dur);
  }

  const sfx = {
    click:   () => tone(660, 0.05, "square", 0.025),
    move:    () => tone(520, 0.07, "sine", 0.02),
    collide: () => tone(220, 0.14, "sawtooth", 0.03),
    win:     () => { tone(740, 0.12, "triangle", 0.03); setTimeout(() => tone(880, 0.2, "triangle", 0.03), 110); },
    enable:  () => { muted = false; ensureAudio(); },
    mute:    () => { muted = true; },
    toggle:  () => { muted ? sfx.enable() : sfx.mute(); },
    isMuted: () => muted,
  };

  window.SFX = sfx;
})();
