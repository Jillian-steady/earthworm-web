import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

// --- Confetti Effects ---

function redFireworksEffect(
  customConfetti: ReturnType<typeof confetti.create>,
) {
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const chineseReds = ["#ed5a65", "#c04851", "#c02c38", "#7c1823"];

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    customConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: chineseReds,
    });
    customConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: chineseReds,
    });
  }, 250);
}

function schoolPrideEffect(
  customConfetti: ReturnType<typeof confetti.create>,
) {
  const end = Date.now() + 15 * 1000;
  const colors = ["#bb0000", "#ffffff"];

  (function frame() {
    customConfetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    customConfetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function normalEffect(customConfetti: ReturnType<typeof confetti.create>) {
  customConfetti({
    particleCount: 300,
    spread: 180,
    origin: { y: -0.1 },
    startVelocity: -35,
  });
}

// --- Hook ---

export function useConfetti() {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const myConfettiRef = useRef<ReturnType<typeof confetti.create>>(undefined);

  useEffect(() => {
    if (confettiCanvasRef.current) {
      myConfettiRef.current = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      });
    }
  }, []);

  const playConfetti = useCallback(() => {
    if (!myConfettiRef.current) return;

    // Simplified: use normalEffect by default
    // Lunar year checks can be added via a utility if needed
    normalEffect(myConfettiRef.current);
  }, []);

  return {
    confettiCanvasRef,
    playConfetti,
  };
}
