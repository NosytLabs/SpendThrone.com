type IntervalGate = {
  stop: () => void;
};

export function startIntervalWhenVisible(fn: () => void, ms: number): IntervalGate {
  let interval: ReturnType<typeof setInterval> | null = null;
  const run = () => fn();

  const start = () => {
    if (!interval && document.visibilityState === 'visible') {
      interval = setInterval(run, ms);
    }
  };

  const stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const onVisibility = () => {
    if (document.visibilityState === 'visible') start(); else stop();
  };

  // initial run + start if visible
  run();
  start();
  document.addEventListener('visibilitychange', onVisibility);

  return {
    stop: () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    }
  };
}