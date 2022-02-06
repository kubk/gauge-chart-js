import './multiple-gauge.scss';
import { calcCoordinatesFromAngle, Gauge } from '../../../src';

function renderLabel(gauge: Gauge, label: string, color: string) {
  const { metadata } = gauge.getElementAtValue(0);
  const labelWidth = 170;
  const left = `${metadata.relativeLeft - labelWidth}px`;
  const top = `${metadata.relativeTop + 1}px`;
  const html = `<span class="label" style="color: ${color}; left: ${left}; top: ${top}">${label}</span>`;
  gauge.insertAdjacentToRoot('beforeend', html);
}

function renderPercents(gauge: Gauge, maxValue: number) {
  for (let i = 0; i <= 100; i += 10) {
    const { metadata } = gauge.getElementAtValue(
      i < 100 ? Math.floor((i / 100) * maxValue) : maxValue - 1
    );
    const { x, y } = calcCoordinatesFromAngle(50, metadata.angle);
    const left = `${metadata.relativeLeft + x}px`;
    const top = `${metadata.relativeTop + y * 0.9}px`;
    const html = `<span style="position: absolute; left: ${left}; top: ${top};">${i}%</span>`;
    gauge.insertAdjacentToRoot('beforeend', html);
  }
}

function randomBetween(from: number, to: number, except?: number): number {
  const random = Math.floor(Math.random() * (to - from + 1)) + from;
  if (except !== undefined && random === except) {
    return randomBetween(from, to, except);
  }
  return random;
}

document.addEventListener('DOMContentLoaded', () => {
  const fromAngle = 0;
  const toAngle = 270;
  const maxValue = toAngle - fromAngle;
  const container = document.querySelector('.multiple-gauge') as HTMLElement;
  const sharedConfig = {
    fromAngle,
    toAngle,
    container
  };
  const backgroundConfig = {
    ...sharedConfig,
    color: '#ebebeb'
  };

  const gaugeHumanBackground = new Gauge({
    ...backgroundConfig,
    gaugeRadius: 45
  });
  gaugeHumanBackground.setValue(maxValue).then(() => {
    renderLabel(gaugeHumanBackground, 'Human Resources', '#8067dc');
    renderPercents(gaugeHumanBackground, maxValue);
  });
  const gaugeHumanMain = new Gauge({
    ...sharedConfig,
    color: '#8067dc',
    gaugeRadius: 45
  });
  gaugeHumanMain.setValue(10);

  const gaugeDistributionBackground = new Gauge({
    ...backgroundConfig,
    gaugeRadius: 36
  });
  gaugeDistributionBackground.setValue(maxValue).then(() => {
    renderLabel(gaugeDistributionBackground, 'Distribution', '#6870db');
  });
  const gaugeDistributionMain = new Gauge({
    ...sharedConfig,
    color: '#6870db',
    gaugeRadius: 36
  });
  gaugeDistributionMain.setValue(maxValue * 0.9);

  const gaugeMarketingBackground = new Gauge({
    ...backgroundConfig,
    gaugeRadius: 27
  });
  gaugeMarketingBackground.setValue(maxValue).then(() => {
    renderLabel(gaugeMarketingBackground, 'Marketing', '#6894dd');
  });
  const gaugeMarketingMain = new Gauge({
    ...sharedConfig,
    color: '#6894dd',
    gaugeRadius: 27
  });
  gaugeMarketingMain.setValue(maxValue * 0.33);

  const gaugeResearchBackground = new Gauge({
    ...backgroundConfig,
    gaugeRadius: 18
  });
  gaugeResearchBackground.setValue(maxValue).then(() => {
    renderLabel(gaugeResearchBackground, 'Research', '#67b7dc');
  });
  const gaugeResearchMain = new Gauge({
    ...sharedConfig,
    color: '#67b7dc',
    gaugeRadius: 18
  });
  gaugeResearchMain.setValue(maxValue * 0.72);

  const gauges = [
    gaugeHumanMain,
    gaugeResearchMain,
    gaugeMarketingMain,
    gaugeDistributionMain
  ];
  const animationOptions = { animationDuration: 900 };
  setInterval(() => {
    const i = randomBetween(0, 3);
    const j = randomBetween(0, 3, i);
    gauges[i].setValue(maxValue * Math.random(), animationOptions);
    gauges[j].setValue(maxValue * Math.random(), animationOptions);
  }, 2000);
});
