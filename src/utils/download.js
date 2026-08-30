import confetti from 'canvas-confetti';

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Trigger celebratory confetti
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.8 }
  });
}
