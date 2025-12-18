import { beforeEach, describe, expect, it } from 'vitest';
import { Gauge } from './gauge';

const initialHtml = `<div class="gauge"></div>`;

function getContainer() {
  return document.querySelector('.gauge') as HTMLElement;
}

describe('Gauge', () => {
  beforeEach(() => {
    document.body.innerHTML = initialHtml;
  });

  it('should throw when required arguments are missing', () => {
    expect(() => {
      new Gauge({} as any);
    }).toThrow();

    expect(() => {
      new Gauge({ container: getContainer() });
    }).toThrow();
  });

  it('should render gauge', async () => {
    const gauge = new Gauge({
      container: getContainer(),
      color: '#f00',
      animationDuration: 0
    });
    await gauge.setValue(50);
    expect(document.body.innerHTML).not.toBe(initialHtml);
  });

  it('should allow to get element metadata', async () => {
    const gauge = new Gauge({
      container: getContainer(),
      color: '#f00',
      animationDuration: 0
    });
    await gauge.setValue(50);
    const point1 = gauge.getElementAtValue(1);
    const point2 = gauge.getElementAtValue(40);
    expect(point1.metadata.angle).toBeLessThan(point2.metadata.angle);
  });

  it('should be disposable', async () => {
    const gauge = new Gauge({
      container: getContainer(),
      color: '#f00',
      animationDuration: 0
    });
    await gauge.setValue(50);
    const htmlAfterSetValue = document.body.innerHTML;
    gauge.dispose();
    await gauge.setValue(10);
    expect(htmlAfterSetValue).toBe(document.body.innerHTML);
  });
});
