import { cubicBezier, Gauge } from '../../src';

const linear = cubicBezier(0, 0, 1, 1);
const easeIn = cubicBezier(0, 0, 0.2, 1);

function updateTimerNode(value: number) {
  const timer = document.querySelector('.timer') as HTMLElement;
  timer.innerHTML = value.toString();
}

document.addEventListener('DOMContentLoaded', () => {
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
    value: maxValue,
    color: '#ebebeb',
    animationDuration: 0
  });

  gaugeBackground.draw();

  const mainGauge = new Gauge({
    ...sharedConfig,
    value: maxValue,
    color: '#fd9eaa'
  });

  mainGauge.draw({ animationDuration: 0 }).then(() => {
    setTimeout(() => {
      const interval = setInterval(() => {
        timer--;
        updateTimerNode(timer);
      }, 1000);
      mainGauge
        .setValue(0, { easing: linear, })
        .then(() => {
          clearInterval(interval);
          timer = 0;
          updateTimerNode(timer);
          return mainGauge.setValue(maxValue, {
            easing: easeIn,
            animationDelay: 600,
            animationDuration: 600
          });
        })
        .then(() => {
          setTimeout(() => {
            timer = 5;
            updateTimerNode(timer);
          }, 500);
        });
    }, 2000);
  });
});
