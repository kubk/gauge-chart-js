## gauge-chart-js [![NPM version](https://badge.fury.io/js/simple-slider.svg)](https://npmjs.org/package/gauge-chart-js) [![Build Status](https://travis-ci.org/kubk/gauge-chart-js.svg?branch=master)](https://travis-ci.org/kubk/gauge-chart-js) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A tiny (<2kb gzipped) library for rendering gauge charts. Supports conical/polar gradients, animation timing functions, custom labels/tooltips. No external dependencies required.

### Examples:
| [Conical / Polar gradient](./examples/conical-gradient) | [Multiple gauges](./examples/multiple-gauge) | [Countdown circle](./examples/countdown-gauge) |
| ------------- | -------------| -------------|
| <img src="/assets/conical-polar.gif" width="249.2" height="256.2">       | <img src="/assets/multiple-gauges.gif" width="261" height="256.2"> | <img src="/assets/countdown-circle.gif" width="249.2" height="256.2"> |

### Installation
`npm install gauge-chart-js`

### Basic usage
```typescript
import { cubicBezier, Gauge } from 'gauge-chart-js';

const gauge = new Gauge({
  container: document.querySelector('.root'),
  value: 50,
  color: '#0f0'
});

gauge.draw();

```

### Customise easing
```typescript
import { cubicBezier, Gauge } from 'gauge-chart-js';

const easeIn = cubicBezier(0, 0, 0.2, 1);
const gauge = new Gauge({
  ...
  easing: easeIn
})
```

Easing functions cheat sheet: https://matthewlein.com/tools/ceaser

### Options
| Name           | Description                                                      | Required  | Default value     | Type   |
| ---            | ---                                                                                                       | ---       | ---               | ---               |
| `value`      | Gauge value                                                        | Yes       | -       | `number`          |
| `container`      | The HTML element that act as a container for the gauge         | Yes       | -       | `HTMLElement`          |
| `fromAngle`      | Gauge start angle in degrees                                   | No       | 220       | `number`          |
| `toAngle`      | Gauge end angle in degrees                                       | No       | 500       | `number`          |
| `animationDuration`      | Animation duration in milliseconds                     | No       | 600       | `number`          |
| `animationDelay`| Animation delay in milliseconds. Pass 0 for no animation.       | No       | 0       | `number`          |
| `lineWidth`| Thickness of the gauge                                               | No       | 3.5       | `number`          |
| `easing`|  The easing function that will be used when animating                   | No       | linear       | `(timeFraction: number) => number`          |
| `gaugeRadius`|  Gauge radius                                                      | No       | 35       | `number`          |
| `color`|  Gauge color supported by SVG's [fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes) attribute                         | No       | -       | `string`          |
| `colors`|  Gauge colors supported by SVG's [fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes) attribute                       | No       | -       | `string[]`          |

### How to integrate it with framework X?
The library is framework-agnostic and do not require any framework-specific integration. If you are using Angular make sure chart is rendered outside zone.js:
```typescript
class ExampleComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  
  ngOnInit() {
    const gauge = new Gauge({ ... });
    this.ngZone.runOutsideAngular(() => {
      gauge.draw();
    });
  }
}
```
