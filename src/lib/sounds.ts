let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15
) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available — fail silently
  }
}

export function playDiceRoll() {
  const ctx = getAudioContext();
  // Short rattling clicks
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 200 + Math.random() * 400;
      gain.gain.value = 0.06;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    }, i * 60);
  }
}

export function playTokenMove() {
  playTone(600, 0.08, "sine", 0.1);
}

export function playCorrectAnswer() {
  // Rising two-note chime
  playTone(523, 0.15, "sine", 0.12);
  setTimeout(() => playTone(784, 0.25, "sine", 0.12), 120);
}

export function playWrongAnswer() {
  // Low buzzer
  playTone(150, 0.3, "sawtooth", 0.1);
}

export function playSnakeSlide() {
  // Descending whoop
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 800;
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.8);
    gain.gain.value = 0.12;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch {
    // fail silently
  }
}

export function playLadderClimb() {
  // Ascending arpeggio
  const notes = [392, 494, 587, 784];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.12, "sine", 0.1), i * 80);
  });
}

export function playGameStart() {
  const notes = [523, 659, 784];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, "sine", 0.1), i * 150);
  });
}

export function playGameWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, "sine", 0.15), i * 180);
  });
}

export function playGameLose() {
  const notes = [392, 349, 311, 262];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.35, "sawtooth", 0.08), i * 200);
  });
}

export function playTimerWarning() {
  playTone(880, 0.1, "square", 0.08);
}
