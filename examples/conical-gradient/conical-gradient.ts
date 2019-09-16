import { cubicBezier, Gauge } from '../../src';
// @ts-ignore
const gradstop = require('gradstop');

function clamp(from: number, to: number, value: number) {
  if (value < from) {
    return from;
  }
  if (value > to) {
    return to;
  }
  return value;
}

function updatePercentNode(value: number) {
  const element = document.querySelector('.label') as HTMLElement;
  element.innerHTML = parseInt(value.toString()) + '%';
}

function setControlDisabled(disabled: boolean) {
  Array.from(document.querySelectorAll('.control')).forEach(node => {
    if (disabled) {
      node.setAttribute('disabled', '');
    } else {
      node.removeAttribute('disabled');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const step = 70;
  const fromAngle = 220;
  const toAngle = 500;
  const maxValue = toAngle - fromAngle;
  let value = maxValue * 0.2;
  updatePercentNode((value / maxValue) * 100);
  const container = document.querySelector('.conical-gauge') as HTMLElement;
  const sharedConfig = {
    lineWidth: 4,
    container,
    fromAngle,
    toAngle,
    easing: cubicBezier(0.165, 0.84, 0.44, 1)
  };

  const gaugeBackground = new Gauge({
    ...sharedConfig,
    color: '#f5f5f5',
    value: maxValue
  });
  gaugeBackground.draw();

  const gaugeMain = new Gauge({
    ...sharedConfig,
    colors: gradstop({
      stops: maxValue,
      colorArray: ['#D16BA5', '#86A8E7', '#5FFBF1']
    }),
    value
  });
  gaugeMain.draw();

  const controls = document.querySelector('.controls') as HTMLElement;
  controls.addEventListener('click', event => {
    setControlDisabled(true);
    const target = event.target as HTMLElement;
    if (target.classList.contains('increase')) {
      value = clamp(0, maxValue, value + step);
    }
    if (target.classList.contains('decrease')) {
      value = clamp(0, maxValue, value - step);
    }
    gaugeMain.setValue(value).then(() => {
      setControlDisabled(false);
    });
    updatePercentNode((value / maxValue) * 100);
  });
});
