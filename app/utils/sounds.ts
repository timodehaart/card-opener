// app/utils/sounds.ts

// Simple sound effect utilities using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playSound = (type: 'select' | 'open' | 'reveal' | 'success') => {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  
  switch (type) {
    case 'select':
      // Beep sound for pack selection
      playTone(400, 0.1, 0.05);
      break;
    case 'open':
      // Swoosh sound for pack opening
      playSwoosh();
      break;
    case 'reveal':
      // Sparkle sound for card reveal
      playSparkle();
      break;
    case 'success':
      // Success chime
      playChime();
      break;
  }
};

const playTone = (frequency: number, duration: number, volume: number) => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playSparkle = () => {
  if (!audioContext) return;
  
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.value = 800 + i * 200;
      gain.gain.setValueAtTime(0.1, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.1);
    }, i * 50);
  }
};

const playSwoosh = () => {
  if (!audioContext) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.frequency.setValueAtTime(200, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.15, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.3);
};

const playChime = () => {
  if (!audioContext) return;
  
  const frequencies = [523, 659, 784]; // C, E, G
  
  frequencies.forEach((freq, index) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.2);
    
    osc.start(audioContext.currentTime + index * 0.1);
    osc.stop(audioContext.currentTime + index * 0.1 + 0.2);
  });
};