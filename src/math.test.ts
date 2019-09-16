import { calcCoordinatesFromAngle } from './math';

describe('calCoordinatesFromAngle', () => {
  it('can calculate coordinates from an angle', () => {
    const point = calcCoordinatesFromAngle(5, 90);
    expect(point.x).toBe(5);
    expect(point.y).toBeLessThan(1);
    expect(point.y).toBeGreaterThanOrEqual(0);

    const point2 = calcCoordinatesFromAngle(10, 180);
    expect(point2.y).toBe(10);
    expect(point2.x).toBeLessThan(1);
    expect(point2.x).toBeGreaterThanOrEqual(0);
  });
});
