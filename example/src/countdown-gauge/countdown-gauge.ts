import { cubicBezier, Gauge } from '../../../src';
import './countdown-gauge.scss';

const linear = cubicBezier(0, 0, 1, 1);
const easeIn = cubicBezier(0, 0, 0.2, 1);

function updateTimerNode(value: number) {
  const timer = document.querySelector('.timer') as HTMLElement;
  timer.innerHTML = value.toString();
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', async () => {
  let timer = 5;
  updateTimerNode(timer);
  const container = document.querySelector('.countdown-gauge') as HTMLElement;
  const sharedConfig = {
    container,
    gaugeRadius: 45,
    lineWidth: 1,
    fromAngle: 0,
    toAngle: 360,
    animationDuration: 5000,
    easing: linear
  };
  const maxValue = sharedConfig.toAngle - sharedConfig.fromAngle;
  const gaugeBackground = new Gauge({
    ...sharedConfig,
    color: '#ebebeb',
    animationDuration: 0
  });

  gaugeBackground.setValue(maxValue);

  const mainGauge = new Gauge({
    ...sharedConfig,
    color: '#fd9eaa'
  });

  await mainGauge.setValue(maxValue, { animationDuration: 0 });
  await wait(2000);
  const interval = setInterval(() => {
    timer--;
    updateTimerNode(timer);
  }, 1000);

  await mainGauge.setValue(0, { easing: linear });
  clearInterval(interval);
  timer = 0;
  updateTimerNode(timer);

  await mainGauge.setValue(maxValue, {
    easing: easeIn,
    animationDelay: 600,
    animationDuration: 600
  });

  await wait(500);
  timer = 5;
  updateTimerNode(timer);
});

