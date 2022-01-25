export type Easing = (timeFraction: number) => number;

// https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): Easing {
  return (timeFraction: number) => {
    return (
      Math.pow(1 - timeFraction, 3) * x1 +
      3 * Math.pow(1 - timeFraction, 2) * timeFraction * y1 +
      3 * (1 - timeFraction) * Math.pow(timeFraction, 2) * x2 +
      Math.pow(timeFraction, 3) * y2
    );
  };
}

export type Point = {
  x: number;
  y: number;
};

export function calcCoordinatesFromAngle(radius: number, angle: number): Point {
  const theta = Math.PI - (angle * Math.PI) / 180;
  return {
    x: radius * Math.sin(theta),
    y: radius * Math.cos(theta)
  };
}
