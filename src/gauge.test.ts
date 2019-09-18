import { Gauge } from './gauge';

const initialHtml = `<div class="gauge"></div>`;
document.body.innerHTML = initialHtml;

describe('Gauge', () => {
  const container = document.querySelector('.gauge') as HTMLElement;

  it('should throw when required arguments are missing', () => {
    expect(() => {
      const gauge = new Gauge({} as any);
    }).toThrow();

    expect(() => {
      const gauge = new Gauge({ container });
    }).toThrow();
  });

  it('should render gauge', cb => {
    const gauge = new Gauge({
      container,
      color: '#f00'
    });
    gauge.setValue(50).then(() => {
      expect(document.body.innerHTML).not.toBe(initialHtml);
      cb();
    });
  });

  it('should allow to get element metadata', cb => {
    const gauge = new Gauge({
      container,
      color: '#f00'
    });
    gauge.setValue(50).then(() => {
      const point1 = gauge.getElementAtValue(1);
      const point2 = gauge.getElementAtValue(40);
      expect(point1.metadata.angle).toBeLessThan(point2.metadata.angle);
      cb();
    });
  });

  it('should be disposable', cb => {
    const gauge = new Gauge({
      container,
      color: '#f00'
    });
    let htmlAfterSetValue: string;
    gauge
      .setValue(50)
      .then(() => {
        htmlAfterSetValue = document.body.innerHTML;
        gauge.dispose();
        return gauge.setValue(10);
      })
      .then(() => {
        expect(htmlAfterSetValue).toBe(document.body.innerHTML);
        cb();
      });
  });
});
