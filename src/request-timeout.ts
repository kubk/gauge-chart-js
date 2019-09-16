// Animate using requestAnimationFrame instead of setInterval for better performance
export function requestTimeout(fn: () => void, delay: number) {
  const start = performance.now();
  const handle: { value?: number } = {};

  function loop() {
    const current = performance.now();
    const delta = current - start;
    if (delta >= delay) {
      fn();
    } else {
      handle.value = requestAnimationFrame(loop);
    }
  }

  handle.value = requestAnimationFrame(loop);
  return handle;
}
