import { requestTimeout } from './request-timeout';
import { calcCoordinatesFromAngle, cubicBezier, Easing } from './math';

export type Config = {
  // The HTML element that act as a container for the gauge
  container: HTMLElement;
  // Gauge start angle in degrees
  fromAngle?: number;
  // Gauge end angle in degrees
  toAngle?: number;
  // Animation duration in milliseconds
  animationDuration?: number;
  // Animation delay in milliseconds. Pass 0 for no animation.
  animationDelay?: number;
  // Thickness of the gauge
  lineWidth?: number;
  // The easing function that will be used when animating
  easing?: Easing;
  // Gauge radius
  gaugeRadius?: number;
  // Gauge color supported by SVG's fill attribute
  color?: string;
  // Gauge colors supported by SVG's fill attribute
  colors?: string[];
}

export type GaugeItem = {
  element: SVGCircleElement;
  metadata: {
    // Difference between gauge left coordinate and parent's left coordinate
    relativeLeft: number;
    // Difference between gauge top coordinate and parent's top coordinate
    relativeTop: number;
    // Rotation angle of the element
    angle: number;
  };
}

export type AnimationOptions = Pick<
  Config,
  'animationDuration' | 'animationDelay' | 'easing'
>;

export class Gauge {
  private readonly config: Required<Omit<Config, 'color'>>;
  private readonly root: SVGElement;
  private readonly leftTopOffset = 50;
  private readonly maxEasing = 1;
  private isAnimating = false;
  private isDisposed = false;

  constructor(config: Config) {
    if (!config.container) {
      throw new Error(
        'Container element not found. Make sure container is initialized before creating Gauge'
      );
    }
    if (!config.colors && !config.color) {
      throw new Error(
        'Color is not specified. Use `color` or `colors` property to specify the color'
      );
    }

    const root = this.createRootSvgElement();
    config.container.appendChild(root);
    this.root = root;

    const fromAngle = config.fromAngle === undefined ? 220 : config.fromAngle;
    const toAngle = config.toAngle === undefined ? 500 : config.toAngle;
    const animationDuration = config.animationDuration;

    this.config = {
      ...config,
      fromAngle,
      toAngle,
      easing: config.easing || cubicBezier(0, 0, 0.2, 1),
      lineWidth: config.lineWidth || 3.5,
      gaugeRadius: config.gaugeRadius || 35,
      animationDelay: config.animationDelay || 0,
      animationDuration: animationDuration === undefined ? 600 : animationDuration,
      colors: config.colors || Array(toAngle - fromAngle).fill(config.color)
    };
  }

  private createRootSvgElement(): SVGElement {
    const root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    root.setAttribute('viewBox', '0 0 100 100');
    root.style.position = 'absolute';
    return root;
  }

  private getAnimation(options: AnimationOptions) {
    return {
      easing: options.easing || this.config.easing,
      animationDelay:
        options.animationDelay === undefined
          ? this.config.animationDelay
          : options.animationDelay,
      animationDuration:
        options.animationDuration === undefined
          ? this.config.animationDuration
          : options.animationDuration
    };
  }

  setValue(value: number, options: AnimationOptions = {}): Promise<void> {
    if (this.isDisposed || this.isAnimating) {
      return Promise.resolve();
    }
    const { fromAngle, toAngle } = this.config;
    const { easing, animationDuration, animationDelay } = this.getAnimation(options);
    const maximumAllowedValue = toAngle - fromAngle;
    if (value > maximumAllowedValue) {
      value = maximumAllowedValue;
    }
    const animate = animationDuration > 0;
    const diff = value - this.root.childNodes.length;
    // Skip rendering because nothing changed
    if (diff === 0) {
      return Promise.resolve();
    }

    this.isAnimating = true;
    if (diff < 0) {
      return new Promise(resolve => {
        const reversed = Array.from(this.root.childNodes)
          .slice(diff)
          .reverse();
        reversed.forEach((child, i) => {
          if (this.isDisposed) {
            resolve();
            return;
          }
          const timeFraction = (i * this.maxEasing) / reversed.length;
          const timeout = animate ? easing(timeFraction) * animationDuration : 0;
          requestTimeout(() => {
            this.root.removeChild(child);
            if (i === Math.floor(Math.abs(diff)) - 1) {
              this.isAnimating = false;
              resolve();
            }
          }, animationDelay + timeout);
        });
      });
    }

    const childCount = this.root.childNodes.length;
    let animationStep = 0;
    let colorStep = childCount;
    const lastAngle = fromAngle + childCount + diff;
    const easingStep = this.maxEasing / (lastAngle - (fromAngle + childCount));

    return new Promise(resolve => {
      for (let angle = fromAngle + childCount; angle < lastAngle; angle++) {
        if (this.isDisposed) {
          resolve();
          break;
        }
        const delay = animate
          ? easing(easingStep * animationStep) * animationDuration
          : 0;
        requestTimeout(() => {
          this.renderCircle(angle, colorStep++);
          if (angle === Math.floor(lastAngle) - 1) {
            this.isAnimating = false;
            resolve();
          }
        }, delay + animationDelay);
        animationStep++;
      }
    });
  }

  insertAdjacentToRoot(where: InsertPosition, html: string): void {
    this.config.container.insertAdjacentHTML(where, html);
  }

  getElementAtValue(value: number): GaugeItem {
    const circle = this.root.childNodes[value] as SVGCircleElement | undefined;
    if (!circle) {
      throw new Error(`Element with value ${value} not found`);
    }
    const angle = circle.dataset.angle;
    if (angle === undefined) {
      throw new Error('Data attribute angle not found');
    }
    const circleRect = circle.getBoundingClientRect();
    const parentRect = this.root.getBoundingClientRect();

    return {
      element: circle,
      metadata: {
        relativeLeft: circleRect.left - parentRect.left,
        relativeTop: circleRect.top - parentRect.top,
        angle: parseFloat(angle)
      }
    };
  }

  private renderCircle(angle: number, colorStep: number): void {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const color = this.config.colors[colorStep];
    const { x, y } = calcCoordinatesFromAngle(this.config.gaugeRadius, angle);
    circle.setAttribute('cx', (this.leftTopOffset + x).toString());
    circle.setAttribute('cy', (this.leftTopOffset + y).toString());
    circle.setAttribute('r', this.config.lineWidth.toString());
    circle.setAttribute('data-angle', angle.toString());
    circle.setAttribute('fill', color);
    this.root.appendChild(circle);
  }

  dispose(): void {
    this.isDisposed = true;
    this.isAnimating = false;
  }
}
